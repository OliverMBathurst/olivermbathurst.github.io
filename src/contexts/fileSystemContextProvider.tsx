import { createContext, useState } from "react"
import { SpecialBranch } from "../enums"
import { CV, GitHub, LinkedIn } from "../files"
import { Branch, BranchingNode, Root, Shortcut } from "../types/fs"

const desktopBranch = new Branch(
    "Desktop",
    SpecialBranch.Desktop
)

const root = new Root(
    "Root"
)

desktopBranch.setLeaves([
    new CV(desktopBranch),
    new LinkedIn(desktopBranch),
    new GitHub(desktopBranch)
])

const contentsBranch = new Branch(
    "Contents",
    SpecialBranch.None
)

root.setBranches([contentsBranch])
contentsBranch.setBranches([desktopBranch])

contentsBranch.setParent(root)
desktopBranch.setParent(contentsBranch)
desktopBranch.setShortcuts([new Shortcut(root, "Root")])

interface IFileSystemContext {
    root: BranchingNode
}

export const FileSystemContext = createContext<IFileSystemContext>({
    root: root
})

interface IFileSystemContextProviderProps {
    children: React.ReactNode
}

const FileSystemContextProvider = (props: IFileSystemContextProviderProps) => {
    const { children } = props

    const [_root] = useState<BranchingNode>(root)

    return (
        <FileSystemContext.Provider value={{ root: _root }}>
            {children}
        </FileSystemContext.Provider>
    )
}

export default FileSystemContextProvider