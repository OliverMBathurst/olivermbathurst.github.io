import React, { memo, useEffect } from 'react'
import { WindowHandlerType, OSItemType } from '../../../../../../../global/enums'
import { IClickHandler, ICoordinates, IDragCompletedEvent, IDragHandler, IHandlerManager, IIdDefinedReferenceModel } from '../../../../../../../global/interfaces'
import ClickHandler from '../../../../../../../global/utils/handlers/clickHandler/clickHandler'
import DragHandler from '../../../../../../../global/utils/handlers/dragHandler/dragHandler'
import { getDisplayIcon, getDisplayName } from '../../../../../../../global/utils/helpers/displayHelper'
import '../styles.scss'

interface IDesktopItemProps {
    id: string
    driveId?: string
    handlerManager: IHandlerManager
    position?: ICoordinates
    type: OSItemType,
    reference?: React.RefObject<HTMLDivElement>
    icon?: JSX.Element
    name: string
    extension?: string
    selected: IIdDefinedReferenceModel[]
    onDesktopItemClicked: (id: string, ctrl: boolean) => void
    onDesktopItemDoubleClicked: (id: string, type: OSItemType, driveId: string | undefined) => void
    onDesktopItemPositionsChanged: (events: IDragCompletedEvent[]) => void
}

const DesktopItem = (props: IDesktopItemProps) => {
    const {
        id,
        type,
        selected,
        driveId,
        handlerManager,
        reference,
        icon,
        name,
        extension,
        position = { x: 0, y: 0 },
        onDesktopItemClicked,
        onDesktopItemDoubleClicked,
        onDesktopItemPositionsChanged
    } = props

    useEffect(() => {
        return () => {
            if (handlerManager.handlerExists(id, WindowHandlerType.Click)) {
                handlerManager.removeHandler(id, WindowHandlerType.Click)
            }

            if (handlerManager.handlerExists(id, WindowHandlerType.Drag)) {
                handlerManager.removeHandler(id, WindowHandlerType.Drag)
            }
        }
    }, [id, handlerManager])

    useEffect(() => {
        if (!handlerManager.handlerExists(id, WindowHandlerType.Click)) {
            var clickHandler: IClickHandler = new ClickHandler({
                id: id,
                reference: reference,
                onClickOccurred: (event: MouseEvent) => onDesktopItemClicked(id, event.ctrlKey),
                onDoubleClickOccurred: () => onDesktopItemDoubleClicked(id, type, driveId)
            })

            handlerManager.addClickHandler(id, clickHandler)
        }

        if (!handlerManager.handlerExists(id, WindowHandlerType.Drag)) {
            var dragHandler: IDragHandler = new DragHandler({
                id: id,
                reference: reference,
                selectedItemsGroup: selected,
                position: position,
                onDragComplete: onDesktopItemPositionsChanged
            })

            handlerManager.addDragHandler(id, dragHandler)
        } else {
            handlerManager.setDragHandlerSelected(id, selected)
        }
    }, [id,
        type,
        driveId,
        reference,
        position,
        selected,
        handlerManager,
        onDesktopItemClicked,
        onDesktopItemPositionsChanged,
        onDesktopItemDoubleClicked
    ])

    useEffect(() => {
        if (reference && reference.current && position) {
            const { x, y } = position
            reference.current.style.top = `${y}px`
            reference.current.style.left = `${x}px`
        }
    }, [reference, position])

    return (
        <div ref={reference} className={`desktop-item${selected.filter(x => x.id === id).length > 0 ? '-selected' : ''}`}>
            <div className="desktop-item-container">
                {icon ? icon : getDisplayIcon(type)}
                <span className="desktop-item-name">{getDisplayName(type, name, extension)}</span>
            </div>
        </div>)
}

export default memo(DesktopItem)