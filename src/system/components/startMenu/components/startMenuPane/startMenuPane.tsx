import React, { memo } from 'react'
import FileIcon from '../../../../../assets/icons/fileIcon'
import { OSItemType } from '../../../../../global/enums'
import { IFile, IOSItemClickedEvent } from '../../../../../global/interfaces'
import './styles.scss'

interface IStartMenuPaneProps {
    getAllFiles: () => IFile[]
    onStartMenuItemClicked: (event: IOSItemClickedEvent) => void
}

const StartMenuPane = (props: IStartMenuPaneProps) => {
    const { getAllFiles, onStartMenuItemClicked } = props

    const files = getAllFiles()

    return (
        <div className="all-files-pane">
            <span className="all-files-pane-panel-descriptor">Files</span>
            <div className="file-container">
                {files.map(x => {
                    return (
                        <div key={`start-menu-file-${x.id}`} className="start-menu-file-item" onClick={() => onStartMenuItemClicked({ id: x.id, type: OSItemType.File, driveId: x.driveId })}>
                            <div className="start-menu-file-item-container">
                                <FileIcon width={20} height={20} />
                                <span className="start-menu-file-item-name">{`${x.name}${x.extension}`}</span>
                            </div>
                        </div>)
                })}
            </div>
        </div>)

}

export default memo(StartMenuPane)