import React from 'react'
import { OSItemType } from '../../../../../global/enums'
import { IHydratedDirectory } from '../../../../../global/interfaces'
import DirectoryContainerRow from './directoryContainerRow/directoryContainerRow'
import './styles.scss'

interface IDirectoryContainerProps {
    dir: IHydratedDirectory | undefined
    getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined
    setCurrentDirectory: (dir: IHydratedDirectory | undefined) => void
    onFileDoubleClicked: (id: string, driveId: string | undefined) => void
}

const DirectoryContainer = (props: IDirectoryContainerProps) => {
    const {
        dir,
        getHydratedDirectory,
        setCurrentDirectory,
        onFileDoubleClicked
    } = props

    return (dir ?
        <div className="directory-container">
            {dir.location?.parentId && <DirectoryContainerRow key="up-level-row" displayName="..." {...dir} onDoubleClick={() => setCurrentDirectory(getHydratedDirectory(dir.location!.parentId!, dir.driveId))} />}
            {dir.directories.filter(d => d).map(d => <DirectoryContainerRow key={d!.id} {...d!} onDoubleClick={() => setCurrentDirectory(getHydratedDirectory(d!.id, dir.driveId))} />)}
            {dir.files.filter(f => f).map(f => <DirectoryContainerRow key={f!.id} {...f!} onDoubleClick={() => onFileDoubleClicked(f!.id, f!.driveId)} />)}
            {dir.shortcuts.filter(s => s).map(s =>
                (<DirectoryContainerRow
                        {...s!}
                        key={s!.id}
                        onDoubleClick={() => {
                            s!.type === OSItemType.DirectoryShortcut
                                ? setCurrentDirectory(getHydratedDirectory(s!.link, dir.driveId))
                                : onFileDoubleClicked(s!.link, s!.driveId)
                        }}
                />))
            }
        </div> : null)
}

export default DirectoryContainer