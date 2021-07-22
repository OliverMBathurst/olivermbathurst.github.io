import React, { useEffect, useRef } from 'react'
import PowerIcon from '../../../assets/icons/powerIcon'
import { IFile, IOSItemClickedEvent } from '../../../global/interfaces'
import StartMenuPane from './components/startMenuPane/startMenuPane'
import BottomBar from './components/bottomBar/bottomBar'
import './styles.scss'

interface IStartMenuProps {
    onNavigateAway: () => void
    startButtonRef: React.RefObject<HTMLDivElement>
    getAllFiles: () => IFile[]
    onStartMenuItemClicked: (event: IOSItemClickedEvent) => void
    onPowerButtonClicked: () => void
}

const StartMenu = (props: IStartMenuProps) => {
    const {
        onNavigateAway,
        startButtonRef,
        getAllFiles,
        onStartMenuItemClicked,
        onPowerButtonClicked
    } = props

    const menuRef = useRef<HTMLDivElement>(null)

    const bottomBarItems = [
        {
            name: 'Power',
            onClick: () => onPowerButtonClickedInternal(),
            icon: <PowerIcon />
        }
    ]

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            var target = event.target as HTMLDivElement
            if (menuRef && menuRef.current && !menuRef.current.contains(target)
                && startButtonRef && startButtonRef.current && !startButtonRef.current.contains(target)) {
                onNavigateAway()
            }
        }

        window.addEventListener("mousedown", handleMouseDown)

        return () => window.removeEventListener("mousedown", handleMouseDown)
    }, [startButtonRef, onNavigateAway])

    const onStartMenuItemClickedInternal = (event: IOSItemClickedEvent) => {
        onStartMenuItemClicked(event)
        onNavigateAway()
    }

    const onPowerButtonClickedInternal = () => {
        onPowerButtonClicked()
        onNavigateAway()
    }

    return (
        <div className="start-menu" ref={menuRef}>
            <StartMenuPane getAllFiles={getAllFiles} onStartMenuItemClicked={onStartMenuItemClickedInternal}/>
            <BottomBar items={bottomBarItems}/>
        </div>)
}

export default StartMenu