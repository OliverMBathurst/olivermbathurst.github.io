import { useContext, useMemo } from 'react'
import { WindowsContext } from '../../contexts'
import { DateDisplay, MinimizeAllButton, TaskbarItem } from './components'
import './taskbar.scss'

const Taskbar = () => {
    const { windowProperties, onMinimizeAllButtonClicked } = useContext(WindowsContext)

    const TaskbarItems = useMemo(() => {
        return windowProperties.map(wp => {
            return (
                <TaskbarItem
                    windowProperties={wp}
                />
            )
        })
    }, [windowProperties])

    return (
        <div className="taskbar">
            {TaskbarItems}
            <DateDisplay />
            <MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
        </div>)
}

export default Taskbar