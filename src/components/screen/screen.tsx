import { useContext } from 'react'
import { WindowsContext } from '../../contexts'
import { Desktop } from '../desktop'
import { ScreenSaver } from '../screenSaver'
import { Taskbar } from '../taskbar'
import { Window } from '../window'
import './screen.scss'

const Screen = () => {
    const { windowProperties } = useContext(WindowsContext)

    return (
        <div className="screen">
            <div className="screen__render-area">
                <ScreenSaver />
                <Desktop />
                {windowProperties.map(p => <Window key={p.id} properties={p} />)}
            </div>
            <Taskbar />
        </div>)
}

export default Screen