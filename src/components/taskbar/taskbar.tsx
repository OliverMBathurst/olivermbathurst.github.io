import { useCallback, useContext, useMemo, useRef, useState } from "react"
import { FileSystemContext, WindowsContext } from "../../contexts"
import { onMixedSelectionRowClicked } from "../../helpers/selections"
import { useSearch } from "../../hooks"
import { ISearchResult } from "../../interfaces/search"
import { ApplicationHandlerService } from "../../service"
import { Context } from "../../types/fs"
import { SearchBar } from "../searchBar"
import { SearchResultPane } from "../searchResultPane"
import {
	DateDisplay,
	MinimizeAllButton,
	StartButton,
	TaskbarItem
} from "./components"
import "./taskbar.scss"

interface ITaskbarProps {
	onStartButtonClicked: () => void
	onDateClicked: () => void
}

const applicationHandlerService = new ApplicationHandlerService()

const Taskbar = (props: ITaskbarProps) => {
	const { onStartButtonClicked, onDateClicked } = props
	const { windowProperties, onMinimizeAllButtonClicked } =
		useContext(WindowsContext)
	const { root, nonRootContextInformation } = useContext(FileSystemContext)
	const { searchForItems } = useSearch(root)
	const { addWindow } = useContext(WindowsContext)

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
			const windowProperties = applicationHandlerService.execute(context)
			if (windowProperties != null) {
				addWindow(windowProperties)
			}
		},
		[addWindow]
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

	const TaskbarItems = useMemo(() => {
		return windowProperties.map((wp) => {
			return <TaskbarItem key={wp.id} windowProperties={wp} />
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
					onChange={onSearchInputChanged}
				/>
				<div className="taskbar__items-container">{TaskbarItems}</div>
				<DateDisplay onDateClicked={onDateClicked} />
				<MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
			</div>
		</>
	)
}

export default Taskbar
