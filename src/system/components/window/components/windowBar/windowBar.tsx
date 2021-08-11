import React, { memo } from 'react'
import { WindowState } from '../../../../../global/enums'
import { IWindow } from '../../../../../global/interfaces'
import { getWindowDisplayIcon } from '../../../../../global/utils/helpers/displayHelper'
import WindowControls from './components/windowControls'
import './styles.scss'

interface IWindowBarProps {
    window: IWindow
    reference: React.RefObject<HTMLDivElement>
    onWindowStateChanged: (state: WindowState) => void
    onWindowClicked: () => void
}

const WindowBar = (props: IWindowBarProps) => {
    const {
        window,
        reference,
        onWindowStateChanged,
        onWindowClicked
    } = props

    return (
        <>
            <div className="window-bar" onClick={() => onWindowClicked()} ref={reference}>
                <div>
                    <div className="icon-container">
                        {window.icon ? window.icon : getWindowDisplayIcon(window.type)}
                    </div>
                    <span className="text">{window.name}</span>
                </div>
                <WindowControls onWindowStateChanged={onWindowStateChanged} />
            </div>
        </>)

}

export default memo(WindowBar)