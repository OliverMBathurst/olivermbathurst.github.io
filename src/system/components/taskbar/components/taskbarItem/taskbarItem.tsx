import React, { memo } from 'react'
import DirectoryIcon from '../../../../../assets/icons/directoryIcon'
import FileIcon from '../../../../../assets/icons/fileIcon'
import SettingsIcon from '../../../../../assets/icons/settingsIcon'
import { WindowType } from '../../../../../global/enums'
import { IWindow } from '../../../../../global/interfaces'
import './styles.scss'

interface ITaskbarItemProps {
    window: IWindow
    onTaskbarItemClicked: (id: string) => void
    onTaskbarItemDoubleClicked: (id: string) => void
}

const TaskbarItem: React.FC<ITaskbarItemProps> = (props: ITaskbarItemProps) => {
    const { window, onTaskbarItemClicked, onTaskbarItemDoubleClicked } = props

    const TaskbarIcon = () => {
        switch (window.type) {
            case WindowType.Directory:
                return <DirectoryIcon width={20} height={20} />
            case WindowType.Settings:
                return <SettingsIcon width={20} height={20} />
            case WindowType.File:
            default:
                return <FileIcon width={20} height={20} />
        }
    }

    return (
        <div className="taskbar-item" onClick={() => onTaskbarItemClicked(window.id)} onDoubleClick={() => onTaskbarItemDoubleClicked(window.id)}>
            <TaskbarIcon />
            <span className="file-name">{window.name}</span>
            <div className="selected-bottom" />
        </div>)
}

export default memo(TaskbarItem)