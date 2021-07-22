import React from 'react'
import DateDisplay from './components/dateDisplay/dateDisplay'
import MinimizeAllButton from './components/minimizeAllButton/minimizeAllButton'
import StartButton from './components/startButton/startButton'
import './styles.scss'

export interface ITaskbarProps {
    startButtonRef: React.RefObject<HTMLDivElement>
    children: React.ReactNode
    onMinimizeAllClicked: () => void
    onStartButtonClicked: () => void
}

const Taskbar = (props: ITaskbarProps) => {
    const {
        startButtonRef,
        children,
        onMinimizeAllClicked,
        onStartButtonClicked
    } = props

    return (
        <div className="taskbar">
            <StartButton
                onStartButtonClicked={onStartButtonClicked}
                startButtonRef={startButtonRef}
            />
            <MinimizeAllButton onMinimizeAllClicked={onMinimizeAllClicked} />
            <DateDisplay />
            <div className="taskbar-items-container">
                {children}
            </div>
        </div>)
}

export default Taskbar