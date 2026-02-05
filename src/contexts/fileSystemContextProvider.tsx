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
import { INonRootContextInformation } from "../interfaces/fs"
import { Branch, BranchingContext, Root, Shortcut } from "../types/fs"

const desktopBranch = new Branch("Desktop", SpecialBranch.Desktop)
const root = new Root("Root")
const applicationsBranch = new Branch("Applications", SpecialBranch.None)
const contentsBranch = new Branch("Contents", SpecialBranch.None)

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
])

root.setBranches([contentsBranch])
contentsBranch.setBranches([desktopBranch, applicationsBranch])

applicationsBranch.setParent(contentsBranch)
contentsBranch.setParent(root)
desktopBranch.setParent(contentsBranch)
desktopBranch.setShortcuts([new Shortcut(desktopBranch, root, "Root")])

interface IFileSystemContext {
	root: BranchingContext
	runIndexer: () => void
	nonRootContextInformation: INonRootContextInformation[]
}

export const FileSystemContext = createContext<IFileSystemContext>({
	root: root,
	runIndexer: () => Function.prototype,
	nonRootContextInformation: []
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

	const runIndexer = () => {
		const items = getItemsOfBranchRecursively(_root)
		setNonRootContextInformation(items)
	}

	return (
		<FileSystemContext.Provider
			value={{
				root: _root,
				runIndexer: runIndexer,
				nonRootContextInformation: nonRootContextInformation
			}}
		>
			{children}
		</FileSystemContext.Provider>
	)
}

export default FileSystemContextProvider
