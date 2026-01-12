import { createContext, useState } from "react"
import { SpecialBranch } from "../enums"
import { CV, GitHub, LinkedIn, ThisProject } from "../files"
import { Branch, BranchingContext, Root, Shortcut } from "../types/fs"
import { getFullPath } from "../helpers/paths"

const desktopBranch = new Branch("Desktop", SpecialBranch.Desktop)

const root = new Root("Root")

desktopBranch.setLeaves([
	new CV(desktopBranch),
	new LinkedIn(desktopBranch),
	new GitHub(desktopBranch),
	new ThisProject(desktopBranch)
])

const contentsBranch = new Branch("Contents", SpecialBranch.None)

root.setBranches([contentsBranch])
contentsBranch.setBranches([desktopBranch])

contentsBranch.setParent(root)
desktopBranch.setParent(contentsBranch)
desktopBranch.setShortcuts([new Shortcut(desktopBranch, root, "Root")])

interface IFileSystemContext {
	root: BranchingContext
	runIndexer: () => void
	allContextPaths: string[]
}

export const FileSystemContext = createContext<IFileSystemContext>({
	root: root,
	runIndexer: () => Function.prototype,
	allContextPaths: []
})

interface IFileSystemContextProviderProps {
	children: React.ReactNode
}

const FileSystemContextProvider = (props: IFileSystemContextProviderProps) => {
	const { children } = props

	const [_root] = useState<BranchingContext>(root)
	const [allContextPaths, setAllContextPaths] = useState<string[]>([])

	const getItemsOfBranchRecursively = (branch: BranchingContext) => {
		let allItems = [...branch.leaves, ...branch.shortcuts, ...branch.branches]

		for (let i = 0; i < branch.branches.length; i++) {
			allItems = allItems.concat(
				getItemsOfBranchRecursively(branch.branches[i])
			)
		}

		return allItems
	}

	const runIndexer = () => {
		const items = getItemsOfBranchRecursively(_root).map((r) => getFullPath(r))

		setAllContextPaths(items)
	}

	return (
		<FileSystemContext.Provider
			value={{
				root: _root,
				runIndexer: runIndexer,
				allContextPaths: allContextPaths
			}}
		>
			{children}
		</FileSystemContext.Provider>
	)
}

export default FileSystemContextProvider
