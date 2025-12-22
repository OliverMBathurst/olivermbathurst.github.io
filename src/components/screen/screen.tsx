import { useContext, useEffect, useRef } from 'react'
import { WindowsContext } from '../../contexts'
import { useVisibility } from '../../hooks'
import { Desktop } from '../desktop'
import { Taskbar } from '../taskbar'
import { Window } from '../window'
import './screen.scss'

const screensaverPaths: string[] = [
    'bg.png',
    'bg1.png',
    'bg2.png',
    'bg3.png'
]

const Screen = () => {
    const screensaverOneRef = useRef<HTMLImageElement | null>(null)
    const screensaverTwoRef = useRef<HTMLImageElement | null>(null)
    const screensaverIndex = useRef<number>(0)
    const screensaverOneOpacity = useRef<number>(1.0)
    const screensaverOneFading = useRef<boolean>(false)

    const { windowProperties } = useContext(WindowsContext)
    const visible = useVisibility(true)

    useEffect(() => {
        if (screensaverOneRef.current && screensaverTwoRef.current) {
            screensaverOneRef.current.src = screensaverPaths[screensaverIndex.current]
            screensaverTwoRef.current.src = screensaverPaths[screensaverIndex.current + 1]

            screensaverIndex.current = screensaverIndex.current + 1
        }
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timer
        let innerInterval: NodeJS.Timer

        if (!visible) {
            return
        }

        let timeout: NodeJS.Timeout = setTimeout(() => {
                const onOpacityChange = () => {
                    clearInterval(interval)
                    clearInterval(innerInterval)

                    innerInterval = setInterval(() => {
                        interval = setInterval(() => {
                            if (screensaverOneRef.current && screensaverTwoRef.current) {
                                if (screensaverOneFading.current) {
                                    if (screensaverOneOpacity.current <= 0.0) {
                                        screensaverOneOpacity.current = 0.0

                                        let nextIdx = screensaverIndex.current + 2 < screensaverPaths.length
                                            ? screensaverIndex.current + 2
                                            : ((screensaverIndex.current + 2) - screensaverPaths.length)

                                        screensaverIndex.current = nextIdx
                                        screensaverOneRef.current.src = screensaverPaths[nextIdx]
                                        screensaverOneFading.current = false
                                        onOpacityChange()
                                    } else {
                                        screensaverOneOpacity.current = screensaverOneOpacity.current - 0.2
                                        screensaverOneRef.current.style.opacity = `${screensaverOneOpacity.current}`
                                    }
                                } else {
                                    if (screensaverOneOpacity.current >= 1.0) {
                                        screensaverOneOpacity.current = 1.0

                                        let nextIdx = screensaverIndex.current + 3 < screensaverPaths.length
                                            ? screensaverIndex.current + 3
                                            : ((screensaverIndex.current + 3) - screensaverPaths.length)

                                        screensaverTwoRef.current.src = screensaverPaths[nextIdx]
                                        screensaverOneFading.current = true
                                        onOpacityChange()
                                    } else {
                                        screensaverOneOpacity.current = screensaverOneOpacity.current + 0.2
                                        screensaverOneRef.current.style.opacity = `${screensaverOneOpacity.current}`
                                    }
                                }
                            }
                        }, 100)
                    }, 3000)
            }

            onOpacityChange()
        }, 1000)

        return () => {
            clearInterval(interval)
            clearInterval(innerInterval)
            clearTimeout(timeout)
        }
    }, [visible])

    return (
        <div className="screen">
            <div className="screen__render-area">
                <div className="screen__saver__two">
                    <img className="screen__saver__two__img" alt="Screen-saver" ref={screensaverTwoRef} />
                </div>
                <div className="screen__saver__one">
                    <img className="screen__saver__one__img" alt="Screen-saver" ref={screensaverOneRef} />
                </div>
                <Desktop />
                {windowProperties.map(p => <Window key={p.id} properties={p} />)}
            </div>
            <Taskbar />
        </div>)
}

export default Screen