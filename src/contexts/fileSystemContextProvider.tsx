import { createContext, useState } from "react"
import { initialiseFileSystem } from "../helpers"
import { BranchingNode } from "../types/fs"

const fs = initialiseFileSystem()

interface IFileSystemContext {
    root: BranchingNode
}

export const FileSystemContext = createContext<IFileSystemContext>({
    root: fs
})

interface IFileSystemContextProviderProps {
    children: React.ReactNode
}

const FileSystemContextProvider = (props: IFileSystemContextProviderProps) => {
    const { children } = props

    const [node] = useState<BranchingNode>(fs)

    return (
        <FileSystemContext.Provider value={{ root: node }}>
            {children}
        </FileSystemContext.Provider>
    )
}

export default FileSystemContextProvider