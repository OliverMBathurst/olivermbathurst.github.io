import { useCallback, useContext, useMemo, useRef, useState } from "react"
import { FileSystemContext, RegistryContext, WindowsContext } from "../../contexts"
import { onMixedSelectionRowClicked } from "../../helpers/selections"
import { useSearch } from "../../hooks"
import { ISearchResult } from "../../interfaces/search"
import { IWindowProperties } from "../../interfaces/windows"
import { WindowPropertiesService } from "../../services"
import { Context } from "../../types/fs"
import { SearchBar } from "../searchBar"
import { SearchResultPane } from "../searchResultPane"
import {
    DateDisplay,
    MinimizeAllButton,
    StartButton
} from "./components"
import { TaskbarGroup } from "./components/taskbarGroup"
import "./taskbar.scss"

interface ITaskbarProps {
	onStartButtonClicked: () => void
	onDateClicked: () => void
	taskbarSearchBarCallback: (elem: HTMLInputElement) => void
}

const windowPropertiesService = new WindowPropertiesService()

const Taskbar = (props: ITaskbarProps) => {
	const { onStartButtonClicked, onDateClicked, taskbarSearchBarCallback } = props
	const { windowProperties, onMinimizeAllButtonClicked } =
		useContext(WindowsContext)
	const { root, nonRootContextInformation } = useContext(FileSystemContext)
	const { searchForItems } = useSearch(root)
	const { addWindow } = useContext(WindowsContext)
	const registry = useContext(RegistryContext)

	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)
	const searchTimeout = useRef<number | undefined>(undefined)

	const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearTimeout(searchTimeout.current)
		searchTimeout.current = setTimeout(() => {
			const val = e.target.value
			if (val === "") {
				onSearchCancelled()
			} else {
				const items = searchForItems(val)
				elementRowReferences.current = {}
				setSelectedContextKeys([])
				setSearchResult({
					term: val,
					items
				})
			}
		}, 300)
	}

	const onSearchCancelled = () => {
		setSearchResult(null)
		elementRowReferences.current = {}
		setSelectedContextKeys([])
	}

	const onRowDoubleClicked = useCallback(
		(context: Context, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const windowProperties = windowPropertiesService.getProperties(context, registry)
			if (windowProperties != null) {
				addWindow(windowProperties)
			}
		},
		[addWindow, windowPropertiesService, registry]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const selectionOne = searchResult !== null

			const newSelectedContextKeys = onMixedSelectionRowClicked(
				context,
				selectionOne,
				e,
				selectedContextKeys,
				searchResult?.items ?? [],
				nonRootContextInformation,
				(x) => x.context.toContextUniqueKey(),
				(x) => x.context.toContextUniqueKey()
			)

			setSelectedContextKeys(newSelectedContextKeys)
		},
		[
			searchResult,
			onMixedSelectionRowClicked,
			selectedContextKeys,
			nonRootContextInformation,
			setSelectedContextKeys
		]
	)

	const TaskbarGroups = useMemo(() => {
		const groupedByHandler: Record<string, IWindowProperties[]> = {}
		for (const wp of windowProperties) {
			if (groupedByHandler[wp.handlerId]) {
				groupedByHandler[wp.handlerId] = [...groupedByHandler[wp.handlerId], wp]
			} else {
				groupedByHandler[wp.handlerId] = [wp]
			}
		}

		return Object.keys(groupedByHandler).map(k => {
			return (<TaskbarGroup key={k} handlerId={k} items={groupedByHandler[k]} />)
		})
	}, [windowProperties])

	return (
		<>
			{searchResult && (
				<SearchResultPane
					searchResult={searchResult}
					selectedContextKeys={selectedContextKeys}
					onRowClicked={onRowClicked}
					onRowDoubleClicked={onRowDoubleClicked}
					refCallback={(c, e) =>
						(elementRowReferences.current[c.toContextUniqueKey()] = e)
					}
				/>
			)}
			<div className="taskbar">
				<StartButton onStartButtonClicked={onStartButtonClicked} />
				<SearchBar
					type="text"
					placeholder="Search..."
					elementCallback={taskbarSearchBarCallback}
					onChange={onSearchInputChanged}
				/>
				<div className="taskbar__groups-container">{TaskbarGroups}</div>
				<DateDisplay onDateClicked={onDateClicked} />
				<MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
			</div>
		</>
	)
}

export default Taskbar
