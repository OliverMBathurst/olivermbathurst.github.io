import { useContext } from 'react'
import { WindowsContext } from '../../../../contexts'
import { useIcon } from '../../../../hooks'
import { IWindowProperties } from '../../../../interfaces/windows'
import './taskbarItem.scss'

interface ITaskbarItemProps {
    windowProperties: IWindowProperties
}

const TaskbarItem = (props: ITaskbarItemProps) => {
    const { windowProperties } = props
    const {
        fileInfo: {
            name,
            extension
        },
        id: windowId,
        selected
    } = windowProperties

    const Icon = useIcon(extension)

    const { onTaskbarItemClicked } = useContext(WindowsContext)

    return (
        <div
            className={`taskbar-item${selected ? "--selected" : ""}`}
            onClick={() => onTaskbarItemClicked(windowId)}
        >
            {Icon}
            <span className="taskbar-item__name">
                {name}{extension}
            </span>
        </div>)
}

export default TaskbarItem