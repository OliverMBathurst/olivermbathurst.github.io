import React, { useEffect, useState } from 'react'
import { IHydratedDirectory, IWindow } from '../../../global/interfaces'
import DirectoryContainer from './components/directoryContainer/directoryContainer'
import './styles.scss'

interface IFileBrowserProps {
    window?: IWindow
    dir: IHydratedDirectory
    getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined
    onFileDoubleClicked: (id: string, driveId: string | undefined) => void
    onWindowNameChanged: (id: string, name: string) => void
}

const FileBrowser = (props: IFileBrowserProps) => {
    const {
        window,
        dir,
        getHydratedDirectory,
        onFileDoubleClicked,
        onWindowNameChanged
    } = props

    const [currentPath, setCurrentPath] = useState('')
    const [currentDirectory, setCurrentDirectory] = useState<IHydratedDirectory | undefined>(dir)

    const setCurrentDirectoryInternal = (directory: IHydratedDirectory | undefined) => {
        if (directory && directory.name && window) {
            onWindowNameChanged(window?.id, directory.name)
        }
        
        setCurrentDirectory(directory)
    }

    useEffect(() => {
        var absPath: string = ''

        if (currentDirectory) {
            absPath = currentDirectory.name
            if (currentDirectory.location) {
                var parentId: string | undefined = currentDirectory.location.parentId
                while (parentId) {
                    var parentDir = getHydratedDirectory(parentId, currentDirectory.driveId)
                    if (parentDir) {
                        absPath = `${parentDir.name}\\${absPath}`
                        parentId = parentDir.location?.parentId
                    } else {
                        parentId = undefined
                    }
                }
            }
        }

        setCurrentPath(absPath)
    }, [currentDirectory, getHydratedDirectory])

    return (
        <div className="file-browser">
            <input readOnly className="path-input" value={currentPath} />
            <DirectoryContainer
                dir={currentDirectory}
                getHydratedDirectory={getHydratedDirectory}
                setCurrentDirectory={setCurrentDirectoryInternal}
                onFileDoubleClicked={onFileDoubleClicked} />
        </div>)
}

export default FileBrowser