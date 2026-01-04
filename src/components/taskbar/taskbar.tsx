import { useContext, useMemo } from 'react'
import { WindowsContext } from '../../contexts'
import { DateDisplay, MinimizeAllButton, StartButton, TaskbarItem } from './components'
import './taskbar.scss'

const Taskbar = () => {
    const { windowProperties, onMinimizeAllButtonClicked } = useContext(WindowsContext)

    const TaskbarItems = useMemo(() => {
        return windowProperties.map(wp => {
            return (
                <TaskbarItem
                    key={wp.id}
                    windowProperties={wp}
                />
            )
        })
    }, [windowProperties])

    return (
        <div className="taskbar">
            <StartButton onStartButtonClicked={() => { }} />
            <div className="taskbar__items-container">
                {TaskbarItems}
            </div>
            <DateDisplay />
            <MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
        </div>)
}

export default Taskbar