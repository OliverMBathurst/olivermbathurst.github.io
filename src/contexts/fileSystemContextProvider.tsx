import { createContext, useState } from "react"
import { DirectoryType } from "../enums"
import { CV, GitHub, LinkedIn } from "../files"
import { IDirectory } from "../interfaces/fileSystem"

const desktopDirectory: IDirectory = {
    name: "Desktop",
    type: DirectoryType.Desktop,
    files: [
        new CV(),
        new LinkedIn(),
        new GitHub(),
    ],
    directories: []
}

const contentsDirectory: IDirectory = {
    name: "Contents",
    type: DirectoryType.None,
    files: [],
    directories: [desktopDirectory]
}

const rootDirectory: IDirectory = {
    name: "Root",
    type: DirectoryType.Root,
    files: [],
    directories: [contentsDirectory]
}

desktopDirectory.parentDirectory = contentsDirectory
contentsDirectory.parentDirectory = rootDirectory

interface IFileSystemContext {
    rootDirectory: IDirectory
}

export const FileSystemContext = createContext<IFileSystemContext>({
    rootDirectory: rootDirectory
})

interface IFileSystemContextProviderProps {
    children: React.ReactNode
}

const FileSystemContextProvider = (props: IFileSystemContextProviderProps) => {
    const { children } = props

    const [directory] = useState<IDirectory>(rootDirectory)

    return (
        <FileSystemContext.Provider value={{ rootDirectory: directory }}>
            {children}
        </FileSystemContext.Provider>
    )
}

export default FileSystemContextProvider