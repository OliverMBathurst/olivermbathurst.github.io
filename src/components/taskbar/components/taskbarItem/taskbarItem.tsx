import { useContext } from 'react'
import { WindowsContext } from '../../../../contexts'
import { useDisplayName, useIcon } from '../../../../hooks'
import { IWindowProperties } from '../../../../interfaces/windows'
import './taskbarItem.scss'

interface ITaskbarItemProps {
    windowProperties: IWindowProperties
}

const TaskbarItem = (props: ITaskbarItemProps) => {
    const { windowProperties } = props
    const {
        context,
        id: windowId,
        selected
    } = windowProperties

    const Icon = useIcon(context)
    const DisplayName = useDisplayName(context)

    const { onTaskbarItemClicked } = useContext(WindowsContext)

    return (
        <div
            className={`taskbar-item${selected ? " taskbar-item--selected" : ""} no-select`}
            onClick={() => onTaskbarItemClicked(windowId)}
        >
            {Icon}
            <span className="taskbar-item__name">
                {DisplayName}
            </span>
        </div>)
}

export default TaskbarItem