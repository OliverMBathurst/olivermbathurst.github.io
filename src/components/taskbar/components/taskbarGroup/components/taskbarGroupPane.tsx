import { useMemo } from "react"
import { TASKBAR_ITEM_PINNED_DETERMINER } from "../../../../../constants"
import { IPinnedTaskbarItem, ITaskbarItem } from "../../../../../interfaces/taskbar"
import { TaskbarItem } from "./components"
import "./taskbarGroupPane.scss"

interface ITaskbarGroupPaneProps {
	groupRef: React.RefObject<HTMLDivElement | null>
	itemContext: IPinnedTaskbarItem | ITaskbarItem[]
	onItemClicked: (windowId: string) => void
	onCloseButtonClicked: (windowId: string) => void
	onMouseOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onMouseOut: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ITEM_WIDTH_IN_PX = 130
const ITEM_PADDING_WIDTH_IN_PX = 8

const TaskbarGroupPane = (props: ITaskbarGroupPaneProps) => {
	const {
		groupRef,
		itemContext,
		onItemClicked,
		onCloseButtonClicked,
		onMouseOut,
		onMouseOver
	} = props

	const isPinned = TASKBAR_ITEM_PINNED_DETERMINER in itemContext

	const Styles: React.CSSProperties = useMemo(() => {
		if (isPinned) {
			return {}
		}

		const widthRequired = ITEM_WIDTH_IN_PX * itemContext.length + (ITEM_PADDING_WIDTH_IN_PX * itemContext.length - 1)

		const styles: React.CSSProperties = {
			left: 0,
			width: `${widthRequired}px`
		}

		if (groupRef.current) {
			const rect = groupRef.current.getBoundingClientRect()
			const middleOfRect = rect.left + rect.width / 2
			const middle = middleOfRect - widthRequired / 2
			styles.left = middle < 0 ? 0 : middle

			if (
				styles.left !== 0 &&
				styles.left + widthRequired > window.innerWidth
			) {
				const newLeft = window.innerWidth - widthRequired
				styles.left = newLeft < 0 ? 0 : newLeft
			}

			if (styles.left + widthRequired > window.innerWidth) {
				styles.width = "100%"
			}
		}

		return styles
	}, [isPinned, groupRef, ITEM_WIDTH_IN_PX, itemContext])

	if (isPinned) {
		return null
	}

	return (
		<div
			className="taskbar-group-pane"
			style={{ ...Styles }}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
		>
			{itemContext.map((i) => {
				return (
					<TaskbarItem
						key={i.id}
						item={i}
						onItemClicked={onItemClicked}
						onCloseButtonClicked={onCloseButtonClicked}
					/>
				)
			})}
		</div>
	)
}

export default TaskbarGroupPane
