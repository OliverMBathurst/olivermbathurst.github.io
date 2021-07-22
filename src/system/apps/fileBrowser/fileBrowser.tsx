import React, { useEffect, useState } from 'react'
import { IHydratedDirectory } from '../../../global/interfaces'
import DirectoryContainer from './components/directoryContainer/directoryContainer'
import './styles.scss'

interface IFileBrowserProps {
    dir: IHydratedDirectory
    getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined
    onFileDoubleClicked: (id: string, driveId: string | undefined) => void
}

const FileBrowser = (props: IFileBrowserProps) => {
    const {
        dir,
        getHydratedDirectory,
        onFileDoubleClicked
    } = props

    const [currentPath, setCurrentPath] = useState('')
    const [currentDirectory, setCurrentDirectory] = useState<IHydratedDirectory | undefined>(dir)

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
                setCurrentDirectory={setCurrentDirectory}
                onFileDoubleClicked={onFileDoubleClicked} />
        </div>)
}

export default FileBrowser