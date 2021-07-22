import React, { memo } from 'react'
import StartButtonIcon from '../../../../../../../assets/icons/startButtonIcon'
import './styles.scss'

export interface IStartButtonProps {
    startButtonRef: React.RefObject<HTMLDivElement>
    onStartButtonClicked: () => void
}

const StartButton = (props: IStartButtonProps) => {
    const {
        startButtonRef,
        onStartButtonClicked
    } = props

    return (
        <div className="start-menu-button" onClick={onStartButtonClicked} ref={startButtonRef}>
            <StartButtonIcon />
        </div>)
}

export default memo(StartButton)