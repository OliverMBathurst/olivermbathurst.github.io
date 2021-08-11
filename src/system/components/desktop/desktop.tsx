import React from 'react'
import { IHandlerManager, IHydratedDirectory, IOSItemClickedEvent } from '../../../global/interfaces'
import DesktopGrid from './components/desktopGrid/desktopGrid'
import Wallpaper from './components/wallpaper/wallpaper'
import './styles.scss'

interface IDesktopProps {
    handlerManager: IHandlerManager
    onDesktopItemsDoubleClicked: (events: IOSItemClickedEvent[]) => void
    getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined
}

const Desktop = (props: IDesktopProps) => {
    const {
        handlerManager,
        onDesktopItemsDoubleClicked,
        getHydratedDirectory
    } = props

    return (
        <div className="desktop">
            <Wallpaper />
            <DesktopGrid
                handlerManager={handlerManager}
                getHydratedDirectory={getHydratedDirectory}
                onDesktopItemsDoubleClicked={onDesktopItemsDoubleClicked}
            />
        </div>)
}

export default Desktop