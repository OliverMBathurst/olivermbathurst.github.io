import React, { memo } from 'react'
import CloseIcon from '../../../../../../assets/icons/closeIcon'
import MaximizeIcon from '../../../../../../assets/icons/maximizeIcon'
import MinimizeIcon from '../../../../../../assets/icons/minimizeIcon'
import { WindowState } from '../../../../../../global/enums'
import './styles.scss'

export interface IWindowControlsProps {
    onWindowStateChanged: (state: WindowState) => void
}

const WindowControls = (props: IWindowControlsProps) => {
    const { onWindowStateChanged } = props

    return (
        <div className="window-controls">
            <div className="window-controls-button" onClick={() => onWindowStateChanged(WindowState.Minimized)}>
                <MinimizeIcon />
            </div>
            <div className="window-controls-button" onClick={() => onWindowStateChanged(WindowState.Maximized)}>
                <MaximizeIcon />
            </div>
            <div className="window-controls-button-negative" onClick={() => onWindowStateChanged(WindowState.Closed)}>
                <CloseIcon />
            </div>
        </div>)

}

export default memo(WindowControls)