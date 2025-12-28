import { useContext, useState } from "react"
import { FileSystemContext } from "../contexts"
import { IDirectory } from "../interfaces/fileSystem"
import { DirectoryType } from "../enums"

const useFileSystem = (directory?: IDirectory) => {
    const { rootDirectory } = useContext(FileSystemContext)
    const [currentDirectory, setCurrentDirectory] = useState<IDirectory>(directory ?? rootDirectory)

    const upOneLevel = () => {
        if (currentDirectory.parentDirectory) {
            setCurrentDirectory(currentDirectory.parentDirectory)
        }
    }

    const enterDirectory = (directoryName: string) => {
        const foundDirectory = currentDirectory.directories.find(x => x.name === directoryName)
        if (foundDirectory) {
            setCurrentDirectory(foundDirectory)
        }
    }

    const searchByDirectoryType = (directory: IDirectory, directoryType: DirectoryType): IDirectory | null => {
        if (directory.type === directoryType) {
            return directory
        }

        for (let i = 0; i < directory.directories.length; i++) {
            const foundFolder = searchByDirectoryType(directory.directories[i], directoryType)
            if (foundFolder) {
                return foundFolder
            }
        }

        return null
    }

    return {
        upOneLevel,
        enterDirectory,
        currentDirectory,
        searchByDirectoryType
    }
}

export default useFileSystem