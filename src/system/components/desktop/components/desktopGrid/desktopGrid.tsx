import React, { createRef, memo, useCallback, useEffect, useRef, useState } from 'react'
import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_WIDTH } from '../../../../../global/constants'
import { OSItemType } from '../../../../../global/enums'
import { ICoordinates, IDesktopDisplayItem, IDragCompletedEvent, IHandlerManager, IHydratedDirectory, IIdDefinedReferenceModel, ILineCoordinates, IOSItemClickedEvent } from '../../../../../global/interfaces'
import { getAvailableGridPositions } from '../../../../../global/utils/helpers/gridHelper'
import { isValidPosition } from '../../../../../global/utils/helpers/positionHelper'
import { getFormattedLine, overlap } from '../../../../../global/utils/helpers/rectHelper'
import DesktopItem from './components/desktopItem/desktopItem'
import './styles.scss'

var initialPosition: ICoordinates | undefined
var multiSelect: boolean | undefined

interface IDesktopGridProps {
    handlerManager: IHandlerManager
    getHydratedDirectory: (id: string, driveId: string) => IHydratedDirectory | undefined
    onDesktopItemsDoubleClicked: (events: IOSItemClickedEvent[]) => void
}

const DesktopGrid = (props: IDesktopGridProps) => {
    const {
        handlerManager,
        getHydratedDirectory,
        onDesktopItemsDoubleClicked
    } = props

    const [line, setLine] = useState<ILineCoordinates>()
    const [selected, setSelected] = useState<IIdDefinedReferenceModel[]>([])
    const [items, setItems] = useState<IDesktopDisplayItem[]>([])

    const desktopGridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!globalThis.desktopDirectory || !globalThis.desktopDirectory.id || !globalThis.desktopDirectory.driveId) {
            throw new Error('Desktop directory not defined')
        }

        const directory = getHydratedDirectory(globalThis.desktopDirectory.id, globalThis.desktopDirectory.driveId)
        
        if (!directory) {
            throw new Error('Desktop directory not defined')
        }

        var directories = directory.directories.filter(x => x) as IDesktopDisplayItem[]
        var files = directory.files.filter(x => x) as IDesktopDisplayItem[]
        var shortcuts = directory.shortcuts.filter(x => x) as IDesktopDisplayItem[]

        var gridPositions = getAvailableGridPositions()

        const getCorrectedPosition = (position: ICoordinates | undefined) => {
            if (isValidPosition(position, 0, 0)) {
                return position
            }

            var newPos = gridPositions.shift()
            return newPos ? newPos : { x: 0, y: 0 }
        }

        var newItems = directories
            .concat(files)
            .concat(shortcuts)
            .map(i => {
                var pos = getCorrectedPosition(i.position)
                return {
                    ...i,
                    reference: createRef<HTMLDivElement>(),
                    initialPosition: pos,
                    position: pos
                }
            })

        setItems(newItems)
    }, [getHydratedDirectory])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (selected.length > 0 && items.length > 0) {
                    var selectedItems: IOSItemClickedEvent[] = []
                    for (const selectedItem of selected) {
                        var hightlightedItem = items.find(x => x.id === selectedItem.id)
                        if (hightlightedItem) {
                            selectedItems.push({ id: selectedItem.id, type: hightlightedItem.type, driveId: hightlightedItem.driveId })
                        }
                    }

                    onDesktopItemsDoubleClicked(selectedItems)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selected, items, onDesktopItemsDoubleClicked])

    useEffect(() => {
        const handleResize = () => {
            if (items.length === 0) return

            var itemsCopy = [...items]

            const usedPositions = itemsCopy.map(item => item.position).filter(p => p)

            const predicate = (available: ICoordinates) => usedPositions.findIndex(p => p!.x === available.x && p!.y === available.y)

            var gridPositions = getAvailableGridPositions()
                .filter(available => predicate(available) === -1)

            const splice = (coord: ICoordinates) => {
                var spliceIdx = gridPositions.indexOf(coord)
                if (spliceIdx !== -1) {
                    gridPositions.splice(spliceIdx, 1)
                }
            }

            for (var i = 0; i < itemsCopy.length; i++) {
                let item = itemsCopy[i]

                if (isValidPosition(item.initialPosition, 0, 0)) {
                    item.position = item.initialPosition
                    continue
                }

                if (isValidPosition(item.position, 0, 0)) {
                    continue
                }

                if (gridPositions.length === 0) {
                    item.position = isValidPosition(item.initialPosition, 0, 0)
                        ? item.initialPosition
                        : { x: -100000, y: -100000 }
                }
                
                if (!item.position) {
                    var pos = gridPositions[0]
                    item.position = pos
                    splice(pos)
                    continue
                }

                const { x, y } = item.position

                var closest = [...gridPositions]
                    .sort(coord => Math.abs(x - coord.x))
                    .sort(coord => Math.abs(y - coord.y))[0]
                    
                splice(closest)
                item.position = closest

                itemsCopy[i] = item
            }

            setItems(itemsCopy)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [items])

    const getItem = useCallback((id: string) => {
        var foundItem = items.find(i => i.id === id)
        if (!foundItem) {
            return null
        }

        var reference = foundItem.reference
        if (!reference) {
            return null
        }

        return { id: id, reference: reference }
    }, [items])

    const onDesktopItemPositionsChanged = useCallback((events: IDragCompletedEvent[]) => {
        if (events.length === 0) return

        var itemsCopy = [...items]
        var changes = false
        for (const event of events) {
            var itemIdx = itemsCopy.findIndex(x => x.id === event.id)
            if (itemIdx !== -1) {
                itemsCopy[itemIdx].position = event.position
                changes = true
            }
        }

        if (changes) {
            setItems(itemsCopy)
        }
    }, [items])

    const onDesktopItemClicked = useCallback((id: string, ctrl: boolean) => {
        var clickedItem = getItem(id)
        if (!clickedItem) return

        if (selected.length === 0 || (!multiSelect && !ctrl)) {
            setSelected([clickedItem])
            return
        }

        var selectedCopy = [...selected]
        if (selectedCopy.findIndex(x => x.id === clickedItem!.id) === -1) {
            setSelected(selectedCopy.concat({ id: clickedItem.id, reference: clickedItem.reference }))
        }
    }, [selected, getItem, setSelected])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (multiSelect && initialPosition) {
                var localLine = {
                    xy: { x: initialPosition.x, y: initialPosition.y },
                    x1y1: { x: event.clientX, y: event.clientY }
                }

                if (items) {
                    var itemsCopy = [...items]
                    for (var potentialSelected of itemsCopy) {
                        if (!potentialSelected.position) continue
                        const { x, y } = potentialSelected.position

                        var targetLine = {
                            xy: { x, y: y + DESKTOP_ICON_HEIGHT },
                            x1y1: { x: x + DESKTOP_ICON_WIDTH, y: y }
                        }

                        if (overlap(localLine, targetLine)) {
                            onDesktopItemClicked(potentialSelected.id, false)
                        }
                    }
                }

                setLine(localLine)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [selected, items, onDesktopItemClicked])

    useEffect(() => {
        var copy = desktopGridRef.current

        const handleMouseDown = (event: MouseEvent) => {
            setSelected([])
            initialPosition = { x: event.clientX, y: event.clientY }
            multiSelect = true
        }

        const handleMouseUp = (event: MouseEvent) => {
            multiSelect = false
            setLine(undefined)
        }

        window.addEventListener('mouseup', handleMouseUp)

        if (copy) {
            copy.addEventListener('mousedown', handleMouseDown)
        }
        return () => {
            window.removeEventListener('mouseup', handleMouseUp)
            if (copy) {
                copy.removeEventListener('mousedown', handleMouseDown)
            }
        }
    }, [selected])

    const SelectionRectangle = () => {
        if (!line || !multiSelect) {
            return null
        }

        var formatted = getFormattedLine(line)

        var height = Math.abs(formatted.xy.y - formatted.x1y1.y)
        var width = Math.abs(formatted.xy.x - formatted.x1y1.x)
        
        return (
            <div className="selection-rectangle" style={{
                left: formatted.xy.x,
                top: formatted.xy.y,
                height: height,
                width: width
            }} />)
    }

    return (
        <>
            <SelectionRectangle />
            {items.map(m =>
                <DesktopItem
                    key={m.id}
                    {...m}
                    selected={selected}
                    handlerManager={handlerManager}
                    onDesktopItemClicked={onDesktopItemClicked}
                    onDesktopItemDoubleClicked={(id: string, type: OSItemType, driveId: string | undefined) => onDesktopItemsDoubleClicked([{ id, type, driveId }])}
                    onDesktopItemPositionsChanged={onDesktopItemPositionsChanged}
                />
            )}
            <div id="desktop-grid" className="desktop-grid" ref={desktopGridRef} />
        </>)
}

export default memo(DesktopGrid)