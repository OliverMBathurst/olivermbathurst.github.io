import { useContext, useMemo, useRef, useState } from "react"
import {
    RegistryContext,
    TaskbarContext,
    WindowsContext
} from "../../contexts"
import { IPinnedTaskbarItem, ITaskbarItem } from "../../interfaces/taskbar"
import { IWindowProperties } from "../../interfaces/windows"
import { WindowPropertiesService } from "../../services"
import { SearchBar } from "../searchBar"
import { DateDisplay, MinimizeAllButton, Search, StartButton } from "./components"
import { TaskbarGroup } from "./components/taskbarGroup"
import "./taskbar.scss"
import { TASKBAR_ITEM_PINNED_DETERMINER } from "../../constants"

interface ITaskbarProps {
	onStartButtonClicked: () => void
	onDateClicked: () => void
	taskbarSearchBarCallback: (elem: HTMLInputElement) => void
}

const windowPropertiesService = new WindowPropertiesService()

const Taskbar = (props: ITaskbarProps) => {
	const { onStartButtonClicked, onDateClicked, taskbarSearchBarCallback } =
		props
	const { windowProperties, onMinimizeAllButtonClicked } = useContext(WindowsContext)
	const registry = useContext(RegistryContext)
	const { pinnedTaskbarItems } = useContext(TaskbarContext)
	const searchBarRef = useRef<HTMLDivElement | null>(null)

	const [showSearch, setShowSearch] = useState<boolean>(false)
	const [searchBarText, setSearchBarText] = useState<string>("")

	const onSearchBarFocused = () => {
		setShowSearch(true)
	}

	const onSearchInputChanged = (text: string) => {
		setSearchBarText(text)
	}

	const onSearchCancelClicked = () => {
		setSearchBarText("")
	}

	const onSearchClickedOutside = () => {
		setSearchBarText("")
		setShowSearch(false)
	}

	const PinnedTaskbarItems = useMemo(() => {
		const items: IPinnedTaskbarItem[] = []
		for (let i = 0; i < pinnedTaskbarItems.length; i++) {
			const pinnedTaskbarItem = pinnedTaskbarItems[i]
			const addWindowProperties = windowPropertiesService.getProperties(pinnedTaskbarItem, registry)
			if (addWindowProperties) {
				const { context, handlerId } = addWindowProperties

				items.push({
					fullName: pinnedTaskbarItem.fullName,
					index: i,
					handlerId,
					context
				})
			}
		}

		return items
	}, [pinnedTaskbarItems, windowPropertiesService, registry])

	const TaskbarGroups = useMemo(() => {
		const groupedByHandler: Record<string, IWindowProperties[]> = {}
		for (const wp of windowProperties) {
			if (groupedByHandler[wp.handlerId]) {
				groupedByHandler[wp.handlerId] = [...groupedByHandler[wp.handlerId], wp]
			} else {
				groupedByHandler[wp.handlerId] = [wp]
			}
		}

		const sortedPinnedTaskbarItems = PinnedTaskbarItems.sort((a, b) => {
			if (a.handlerId > b.handlerId) {
				return 1
			} else if (a.handlerId === b.handlerId) {
				return 0
			}

			return -1
		})

		const windowTaskbarItemsWithIndices = Object.keys(groupedByHandler).map(k => {
			const windowProperties = groupedByHandler[k]
			const index = sortedPinnedTaskbarItems.findIndex(x => x.handlerId === k)

			return {
				index,
				handlerId: k,
				windowProperties
			}
		})


		const items: (IPinnedTaskbarItem | { handlerId: string, items: ITaskbarItem[] })[] = []
		for (let i = 0; i < sortedPinnedTaskbarItems.length; i++) {
			const sortedPinnedTaskbarItem = sortedPinnedTaskbarItems[i]
			const foundWindow = windowTaskbarItemsWithIndices.find(x => x.index === i)
			if (foundWindow) {
				const { index, handlerId, windowProperties } = foundWindow

				const windowTaskbarItems: ITaskbarItem[] = windowProperties.map(wp => {
					return {
						index,
						...wp
					}
				})

				items.push({
					handlerId,
					items: windowTaskbarItems
				})
			} else {
				items.push(sortedPinnedTaskbarItem)
			}
		}

		const itemsLength = items.length

		const otherWindows: { handlerId: string, items: ITaskbarItem[] }[] = windowTaskbarItemsWithIndices
			.filter(x => x.index === -1)
			.map((x, i) => {
				const { handlerId, windowProperties } = x

				return {
					handlerId,
					items: windowProperties.map(wp => {
						return {
							index: itemsLength + i,
							...wp
						}
					})
				}
			})

		return items.concat(otherWindows).map((item, i) => {
			if (TASKBAR_ITEM_PINNED_DETERMINER in item) {
				const { handlerId } = item
				return (
					<TaskbarGroup
						key={`${handlerId}-${item.fullName}`}
						handlerId={handlerId}
						itemContext={item}
					/>
				)
			} else {
				const { handlerId, items } = item
				return (
					<TaskbarGroup
						key={`${handlerId}-${i}`}
						handlerId={handlerId}
						itemContext={items}
					/>
				)
			}
		})
	}, [windowProperties, PinnedTaskbarItems])

	return (
		<>
			{showSearch && (
				<Search
					text={searchBarText}
					positionRef={searchBarRef}
					onClickedOutside={onSearchClickedOutside}
				/>
			)}
			<div className="taskbar">
				<StartButton onStartButtonClicked={onStartButtonClicked} />
				<SearchBar
					type="text"
					value={searchBarText}
					placeholder="Search..."
					forwardRef={searchBarRef}
					onFocus={onSearchBarFocused}
					elementCallback={taskbarSearchBarCallback}
					onInputChange={onSearchInputChanged}
					onCancelClicked={onSearchCancelClicked}
				/>
				<div className="taskbar__groups-container">{TaskbarGroups}</div>
				<DateDisplay onDateClicked={onDateClicked} />
				<MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
			</div>
		</>
	)
}

export default Taskbar
