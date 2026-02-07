import { useMemo } from "react"
import { IWindowProperties } from "../../../../../interfaces/windows"
import { TaskbarItem } from "./components"
import "./taskbarGroupPane.scss"

interface ITaskbarGroupPaneProps {
    groupRef: React.RefObject<HTMLDivElement | null>
    items: IWindowProperties[]
    onItemClicked: (windowId: string) => void
    onCloseButtonClicked: (windowId: string) => void
    onMouseOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onMouseOut: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ITEM_WIDTH_IN_PX = 130

const TaskbarGroupPane = (props: ITaskbarGroupPaneProps) => {
    const {
        groupRef,
        items,
        onItemClicked,
        onCloseButtonClicked,
        onMouseOut,
        onMouseOver
    } = props

    const Styles: React.CSSProperties = useMemo(() => {
        const widthRequired = (ITEM_WIDTH_IN_PX * items.length)

        const styles: React.CSSProperties = {
            left: 0,
            width: `${widthRequired}px`
        }

        if (groupRef.current) {
            const rect = groupRef.current.getBoundingClientRect()
            const middleOfRect = rect.left + (rect.width / 2)
            const middle = middleOfRect - widthRequired / 2
            styles.left = middle < 0 ? 0 : middle

            if (styles.left !== 0 && (styles.left + widthRequired > window.innerWidth)) {
                const newLeft = window.innerWidth - widthRequired
                styles.left = newLeft < 0 ? 0 : newLeft
            }

            if (styles.left + widthRequired > window.innerWidth) {
                styles.width = "100%"
            }
        }

        return styles
    }, [groupRef, ITEM_WIDTH_IN_PX, items])

    return (
        <div
            className="taskbar-group-pane"
            style={{...Styles}}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            {items.map(i => {
                return (
                    <TaskbarItem
                        key={i.id}
                        windowProperties={i}
                        onItemClicked={onItemClicked}
                        onCloseButtonClicked={onCloseButtonClicked}
                    />
                )
            })}
        </div>)
}

export default TaskbarGroupPane