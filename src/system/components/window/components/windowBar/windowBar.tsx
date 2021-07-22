import React, { memo } from 'react'
import { WindowState } from '../../../../../global/enums'
import { IWindow } from '../../../../../global/interfaces'
import WindowControls from './components/windowControls'
import './styles.scss'

interface IWindowBarProps {
    window: IWindow
    reference: React.RefObject<HTMLDivElement>
    onWindowStateChanged: (id: string, state: WindowState) => void
    onWindowClicked: (id: string) => void
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
            <div className="window-bar" onClick={() => onWindowClicked(window.id)} ref={reference}>
                <div>
                    {window.icon &&
                        <div className="icon-container">
                            {window.icon}
                        </div>
                    }
                    <span className="text">{window.name}</span>
                </div>
                <WindowControls id={window.id} onWindowStateChanged={onWindowStateChanged} />
            </div>
        </>)

}

export default memo(WindowBar)