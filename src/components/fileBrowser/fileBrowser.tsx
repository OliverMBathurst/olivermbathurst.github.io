import { useCallback, useContext, useMemo, useRef, useState } from "react"
import {
    BRANCHING_CONTEXT_DETERMINER,
    BRANCHING_CONTEXT_PARENT_PROPERTY,
    FILE_BROWSER_TREE_MIN_WIDTH
} from "../../constants"
import { FileBrowserContext, WindowsContext } from "../../contexts"
import { ExpandDirection } from "../../enums"
import {
    doRectanglesIntersect,
    onMixedSelectionRowClicked
} from "../../helpers/selections"
import { useWindowSelectionRectangle } from "../../hooks"
import { ISearchResult } from "../../interfaces/search"
import { ApplicationHandlerService } from "../../service"
import { BranchingContext, Context, Leaf, Shortcut } from "../../types/fs"
import { Expandable } from "../expandable"
import { SearchResultPane } from "../searchResultPane"
import {
    FileBrowserControls,
    FileBrowserGridView,
    FileBrowserRow,
    FolderBaseInformation,
    UpOneLevelRow
} from "./components"
import { FileBrowserTree } from "./components/fileBrowserTree"
import "./fileBrowser.scss"

interface IFileBrowserProps {
	windowId: string
	context: BranchingContext
}

const baseClickExclusions = ["file-browser__content__result-pane", "file-browser-grid-view"]

const selectionPanes = ["file-browser__content__result-pane", "file-browser-grid-view"]

const applicationHandlerService = new ApplicationHandlerService()

const FileBrowser = (props: IFileBrowserProps) => {
	const { windowId, context } = props
	const { displaySettings, toggleDisplaySetting } =
		useContext(FileBrowserContext)
	const [selected, setSelected] = useState<string[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)

	const {
		addNavigationHistory,
		addToHistoryPointer,
		subtractFromHistoryPointer,
		navigationHistory,
		historyPointers,
		setNavigationHistoryForWindow
	} = useContext(FileBrowserContext)

	const nav = navigationHistory[windowId] ?? []
	const point = historyPointers[windowId] ?? 0

	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})
	const fileBrowserPaneRef = useRef<HTMLDivElement | null>(null)

	const thumbnailDisplay = displaySettings[windowId] ?? true

	const { addWindow, setWindowContext } = useContext(WindowsContext)

	if (!(BRANCHING_CONTEXT_DETERMINER in context)) {
		throw new Error("File Browser invoked on non-branching Context")
	}

	const Entities = useMemo(() => {
		return [...context.branches, ...context.shortcuts, ...context.leaves]
	}, [context])

	const onRowDoubleClicked = useCallback(
		(context: Context) => {
			const windowProperties = applicationHandlerService.execute(context)
			if (windowProperties != null) {
				if (
					BRANCHING_CONTEXT_DETERMINER in windowProperties.context &&
					!windowProperties.openNewInstance
				) {
					elementRowReferences.current = {}
					addNavigationHistory(windowId, windowProperties.context)
					setWindowContext(windowId, windowProperties.context)
				} else {
					addWindow(windowProperties)
				}
			}
		},
		[addWindow, windowId, setWindowContext, addNavigationHistory]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const newSelectedContextKeys = onMixedSelectionRowClicked(
				context,
				searchResult !== null,
				e,
				selected,
				searchResult?.items ?? [],
				Entities,
				(x) => x.context.toContextUniqueKey(),
				(x) => x.toContextUniqueKey()
			)

			setSelected(newSelectedContextKeys)
		},
		[searchResult, onMixedSelectionRowClicked, selected, Entities, setSelected]
	)

	const onSelectionChanged = (selectionRectangle: DOMRect) => {
		const elems = elementRowReferences.current

		const rowElementKeys = Object.keys(elems)
		const selectedContextKeys: string[] = []
		for (let i = 0; i < rowElementKeys.length; i++) {
			const rowElement = elems[rowElementKeys[i]]
			if (rowElement) {
				const rowRectangle = rowElement.getBoundingClientRect()
				if (doRectanglesIntersect(selectionRectangle, rowRectangle)) {
					selectedContextKeys.push(rowElementKeys[i])
				}
			}
		}

		setSelected(selectedContextKeys)
	}

	const onFileBrowserMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (baseClickExclusions.indexOf(e.currentTarget.className) !== -1) {
			if (
				e.target instanceof HTMLElement
				&& baseClickExclusions.indexOf(e.target.className) !== -1
			) {
				setSelected([])
			}
		}
	}

	const onFileBrowserKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" && selected.length > 0) {
			let entities: Context[] = Entities
			if (searchResult) {
				entities = searchResult.items.map((i) => i.context)
			}

			const selectedEntities = entities.filter(
				(e) => selected.indexOf(e.toContextUniqueKey()) !== -1
			)
			const leaves = selectedEntities.filter(
				(x) => !(BRANCHING_CONTEXT_DETERMINER in x)
			)
			const branches = selectedEntities.filter(
				(x) => BRANCHING_CONTEXT_DETERMINER in x
			)

			for (let i = 0; i < leaves.length; i++) {
				onRowDoubleClicked(leaves[i])
			}

			for (let i = 0; i < branches.length - 1; i++) {
				const addWindowProperties = applicationHandlerService.execute(
					branches[i]
				)
				if (addWindowProperties) {
					addWindow({ ...addWindowProperties, openNewInstance: true })
				}
			}

			if (branches.length > 0) {
				onRowDoubleClicked(branches[branches.length - 1])
			}
		}
	}

	const onBacktrack = () => {
		elementRowReferences.current = {}
		const hp = point - 1
		subtractFromHistoryPointer(windowId)
		setWindowContext(windowId, nav[hp])
	}

	const onForwards = () => {
		elementRowReferences.current = {}
		const hp = point + 1
		addToHistoryPointer(windowId)
		setWindowContext(windowId, nav[hp])
	}

	const onUpOneLevel = () => {
		if (BRANCHING_CONTEXT_PARENT_PROPERTY in context && context.parent) {
			elementRowReferences.current = {}
			const parentContext = context.parent
			const hp = point - 1
			subtractFromHistoryPointer(windowId)

			setNavigationHistoryForWindow(windowId, (nh) => {
				const prev = [...nh]
				prev[hp] = parentContext
				return prev
			})

			setWindowContext(windowId, parentContext)
		}
	}

	const onDirectoryChanged = (context: BranchingContext) => {
		addNavigationHistory(windowId, context)
		setWindowContext(windowId, context)
	}

	const onFileNavigation = (context: Leaf | Shortcut) => {
		const windowProperties = applicationHandlerService.execute(context)
		if (windowProperties != null) {
			addWindow(windowProperties)
		}
	}

	const onSearchCompleted = (result: ISearchResult) => {
		elementRowReferences.current = {}
		setSelected([])
		setSearchResult(result)
	}

	const onSearchCancelled = () => {
		elementRowReferences.current = {}
		setSelected([])
		setSearchResult(null)
	}

	const onDisplayModeChange = () => {
		elementRowReferences.current = {}
		setSelected([])
		setSearchResult(null)
		toggleDisplaySetting(windowId)
	}

	const Display = useMemo(() => {
		if (searchResult) {
			return null
		}

		if (!thumbnailDisplay) {
			return (
				<FileBrowserGridView
					entities={Entities}
					selected={selected}
					setRowReference={(r, key) => (elementRowReferences.current[key] = r)}
					onRowClicked={(ev, c) => onRowClicked(c, ev)}
					onRowDoubleClicked={(_, c) => onRowDoubleClicked(c)}
				/>
			)
		}

		return (
			<>
				{Entities.map((e) => {
					const contextKey = e.toContextUniqueKey()
					return (
						<FileBrowserRow
							key={contextKey}
							context={e}
							selected={selected.indexOf(contextKey) !== -1}
							setRowReference={(r) =>
								(elementRowReferences.current[contextKey] = r)
							}
							onRowClicked={(ev) => onRowClicked(e, ev)}
							onRowDoubleClicked={(_) => onRowDoubleClicked(e)}
						/>
					)
				})}
			</>
		)
	}, [
		searchResult,
		Entities,
		thumbnailDisplay,
		selected,
		onRowClicked,
		onRowDoubleClicked
	])

	const SelectionRectangle = useWindowSelectionRectangle(
		fileBrowserPaneRef,
		onSelectionChanged,
		selectionPanes
	)

	return (
		<div className="file-browser">
			<FileBrowserControls
				windowId={windowId}
				context={context}
				onDirectoryChanged={onDirectoryChanged}
				onFileNavigation={onFileNavigation}
				onSearchCompleted={onSearchCompleted}
				onSearchCancelled={onSearchCancelled}
				onBacktrack={onBacktrack}
				onForwards={onForwards}
				onUpOneLevel={onUpOneLevel}
			/>
			<div className="file-browser__content">
				<Expandable
					allowedExpandDirections={ExpandDirection.Right}
					minWidth={FILE_BROWSER_TREE_MIN_WIDTH}
				>
					<div className="file-browser__content__tree-pane">
						<FileBrowserTree
							windowId={windowId}
							onDirectoryChanged={onDirectoryChanged}
						/>
					</div>
				</Expandable>
				<div
					className="file-browser__content__result-pane"
					ref={fileBrowserPaneRef}
					onMouseDown={onFileBrowserMouseDown}
					onKeyDown={onFileBrowserKeyDown}
					tabIndex={0}
				>
					{SelectionRectangle}
					{BRANCHING_CONTEXT_PARENT_PROPERTY in context &&
						context.parent &&
						thumbnailDisplay &&
						!searchResult && (
							<UpOneLevelRow onRowDoubleClicked={onUpOneLevel} />
						)}
					{searchResult && (
						<SearchResultPane
							searchResult={searchResult}
							selectedContextKeys={selected}
							onRowClicked={onRowClicked}
							onRowDoubleClicked={onRowDoubleClicked}
							refCallback={(c, e) =>
								(elementRowReferences.current[c.toContextUniqueKey()] = e)
							}
						/>
					)}
					{Display}
				</div>
			</div>
			<FolderBaseInformation
				context={context}
				entities={Entities}
				selected={selected}
				thumbnailDisplay={thumbnailDisplay}
				toggleDisplayMode={onDisplayModeChange}
			/>
		</div>
	)
}

export default FileBrowser
