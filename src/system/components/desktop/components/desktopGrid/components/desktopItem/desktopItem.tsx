import React, { memo, useEffect } from 'react'
import { OSItemType } from '../../../../../../../global/enums'
import { ICoordinates, IDragCompletedEvent, IDragHandler, IDragHandlerOptions, IIdDefinedReferenceModel } from '../../../../../../../global/interfaces'
import DragHandler from '../../../../../../../global/utils/handlers/dragHandler/dragHandler'
import { getDisplayIcon, getDisplayName } from '../../../../../../../global/utils/helpers/displayHelper'
import '../styles.scss'

interface IDesktopItemProps {
    id: string
    position?: ICoordinates
    type: OSItemType
    reference?: React.RefObject<HTMLDivElement>
    icon?: JSX.Element
    name: string
    extension?: string
    selectedItemsGroup: IIdDefinedReferenceModel[]
    onDesktopItemClicked: (path: string, shift: boolean) => void
    onDesktopItemDoubleClicked: (id: string) => void
    onDesktopItemPositionsChanged: (events: IDragCompletedEvent[]) => void
}

const DesktopItem = (props: IDesktopItemProps) => {
    const {
        id,
        type,
        reference,
        icon,
        name,
        extension,
        selectedItemsGroup,
        onDesktopItemClicked,
        onDesktopItemDoubleClicked,
        onDesktopItemPositionsChanged,
        position = {
            x: 0,
            y: 0
        }
    } = props

    useEffect(() => {
        var options: IDragHandlerOptions = {
            id: id,
            movingRef: reference,
            position: position,
            selectedItemsGroup: selectedItemsGroup,
            onDragComplete: onDesktopItemPositionsChanged,
            onClickOccurred: (event) => onDesktopItemClicked(id, event.shiftKey),
            onDoubleClickOccurred: () => onDesktopItemDoubleClicked(id)
        }

        if (reference && reference.current && position) {
            const { x, y } = position
            reference.current.style.top = `${y}px`
            reference.current.style.left = `${x}px`
        }        

        var fileHandler: IDragHandler = new DragHandler(options)

        return () => fileHandler.removeListeners()
    })

    const displayName = getDisplayName(type, name, extension)

    const isSelected = selectedItemsGroup.filter(x => x.id === id).length > 0

    return (
        <div ref={reference} className={`desktop-item${isSelected ? '-selected' : ''}`}>
            <div className="desktop-item-container">
                {icon ? icon : getDisplayIcon(type)}
                <span className="desktop-item-name">{displayName}</span>
            </div>
        </div>)
}

export default memo(DesktopItem)