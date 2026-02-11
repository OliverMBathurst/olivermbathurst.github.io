import { createContext, useState } from "react"
import { SpecialBranch } from "../enums"
import {
    CV,
    Credits,
    FileBrowser,
    GitHub,
    LinkedIn,
    PdfViewer,
    TextFileViewer,
    ThisProject
} from "../files"
import GamePlayer from "../files/gamePlayer"
import { getFullPath } from "../helpers/paths"
import { IForwardContextInformation, INonRootContextInformation } from "../interfaces/fs"
import { ILikenessResult } from "../interfaces/search"
import { Branch, BranchingContext, Context, Root, Shortcut } from "../types/fs"

const desktopBranch = new Branch("Desktop", SpecialBranch.Desktop)
const root = new Root("Root")
const applicationsBranch = new Branch("Applications", SpecialBranch.None)
const contentsBranch = new Branch("Contents", SpecialBranch.None)
const gamesBranch = new Branch("Games", SpecialBranch.None)

gamesBranch.setLeaves([
	//new Conways(gamesBranch)
])

desktopBranch.setLeaves([
	new CV(desktopBranch),
	new LinkedIn(desktopBranch),
	new GitHub(desktopBranch),
	new ThisProject(desktopBranch),
	new Credits(desktopBranch)
])

applicationsBranch.setLeaves([
	new FileBrowser(applicationsBranch),
	new PdfViewer(applicationsBranch),
	new TextFileViewer(applicationsBranch),
	new GamePlayer(applicationsBranch)
])

root.setBranches([contentsBranch])
contentsBranch.setBranches([
	desktopBranch,
	applicationsBranch,
	gamesBranch
])

applicationsBranch.setParent(contentsBranch)
contentsBranch.setParent(root)
desktopBranch.setParent(contentsBranch)
desktopBranch.setShortcuts([new Shortcut(desktopBranch, root, "Root")])

interface IFileSystemContext {
	root: BranchingContext
	runIndexer: () => void
	nonRootContextInformation: INonRootContextInformation[]
	getForwardContexts: (context: Context) => IForwardContextInformation[]
	searchForItems: (term: string, context: Context) => ILikenessResult[]
}

export const FileSystemContext = createContext<IFileSystemContext>({
	root: root,
	runIndexer: () => Function.prototype,
	nonRootContextInformation: [],
	getForwardContexts: (_: Context) => [],
	searchForItems: (_: string, __: Context) => []
})

interface IFileSystemContextProviderProps {
	children: React.ReactNode
}

const FileSystemContextProvider = (props: IFileSystemContextProviderProps) => {
	const { children } = props

	const [_root] = useState<BranchingContext>(root)
	const [nonRootContextInformation, setNonRootContextInformation] = useState<
		INonRootContextInformation[]
	>([])

	const getItemsOfBranchRecursively = (
		branch: BranchingContext
	): INonRootContextInformation[] => {
		const branchPrefix = branch.name

		let allItems = [
			...branch.leaves,
			...branch.shortcuts,
			...branch.branches
		].map((c) => {
			return {
				context: c,
				fullPath: `${branchPrefix}\\${c.fullName}`
			}
		})

		for (let i = 0; i < branch.branches.length; i++) {
			allItems = allItems.concat(
				getItemsOfBranchRecursively(branch.branches[i]).map((ci) => {
					return {
						context: ci.context,
						fullPath: `${branchPrefix}\\${ci.fullPath}`
					}
				})
			)
		}

		return allItems
	}

	const getForwardContexts = (context: Context) => {
		const fullPathOfCurrentContext = getFullPath(context)
		return [...nonRootContextInformation]
			.filter((ci) => ci.fullPath.startsWith(fullPathOfCurrentContext))
			.map((ci) => {
				let forwardPath = ci.fullPath.replace(fullPathOfCurrentContext, "")

				if (forwardPath.startsWith("\\")) {
					forwardPath = forwardPath.replace("\\", "")
				}

				return {
					forwardPath: forwardPath,
					fullPath: ci.fullPath,
					context: ci.context
				}
			})
	}

	const searchForItems = (term: string, context: Context): ILikenessResult[] => {
		const items = getForwardContexts(context)
		const results: ILikenessResult[] = []

		for (let i = 0; i < items.length; i++) {
			const { context, fullPath } = items[i]

			results.push({
				context: context,
				path: fullPath,
				score:
					context.fullName.toLowerCase().indexOf(term.toLowerCase()) === -1
						? 0
						: (term.length / context.fullName.length) * 100
			})
		}

		return results.filter((x) => x.score > 0)
	}

	const runIndexer = () => {
		const items = getItemsOfBranchRecursively(_root)
		setNonRootContextInformation(items)
	}

	return (
		<FileSystemContext.Provider
			value={{
				root: _root,
				runIndexer: runIndexer,
				nonRootContextInformation: nonRootContextInformation,
				getForwardContexts,
				searchForItems,
			}}
		>
			{children}
		</FileSystemContext.Provider>
	)
}

export default FileSystemContextProvider
