import { createContext, useState } from "react"
import { SpecialBranch } from "../enums"
import { CV, GitHub, LinkedIn, ThisProject } from "../files"
import { Branch, BranchingContext, Root, Shortcut } from "../types/fs"

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
desktopBranch.setShortcuts([new Shortcut(root, "Root")])

interface IFileSystemContext {
	root: BranchingContext
}

export const FileSystemContext = createContext<IFileSystemContext>({
	root: root
})

interface IFileSystemContextProviderProps {
	children: React.ReactNode
}

const FileSystemContextProvider = (props: IFileSystemContextProviderProps) => {
	const { children } = props

	const [_root] = useState<BranchingContext>(root)

	return (
		<FileSystemContext.Provider value={{ root: _root }}>
			{children}
		</FileSystemContext.Provider>
	)
}

export default FileSystemContextProvider
