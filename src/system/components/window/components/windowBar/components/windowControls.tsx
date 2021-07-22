import React, { memo } from 'react'
import CloseIcon from '../../../../../../assets/icons/closeIcon'
import MaximizeIcon from '../../../../../../assets/icons/maximizeIcon'
import MinimizeIcon from '../../../../../../assets/icons/minimizeIcon'
import { WindowState } from '../../../../../../global/enums'
import './styles.scss'

export interface IWindowControlsProps {
    id: string
    onWindowStateChanged: (id: string, state: WindowState) => void
}

const WindowControls = (props: IWindowControlsProps) => {
    const { id, onWindowStateChanged } = props

    return (
        <div className="window-controls">
            <div className="window-controls-button" onClick={() => onWindowStateChanged(id, WindowState.Minimized)}>
                <MinimizeIcon />
            </div>
            <div className="window-controls-button" onClick={() => onWindowStateChanged(id, WindowState.Maximized)}>
                <MaximizeIcon />
            </div>
            <div className="window-controls-button-negative" onClick={() => onWindowStateChanged(id, WindowState.Closed)}>
                <CloseIcon />
            </div>
        </div>)

}

export default memo(WindowControls)