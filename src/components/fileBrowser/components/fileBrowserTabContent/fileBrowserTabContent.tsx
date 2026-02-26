import { memo, useCallback, useContext, useMemo, useRef, useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER, BRANCHING_CONTEXT_PARENT_PROPERTY, CLASSNAMES, FILE_BROWSER_TREE_MIN_WIDTH } from "../../../../constants"
import { RegistryContext, WindowsContext } from "../../../../contexts"
import { ExpandDirection, NavigationType } from "../../../../enums"
import { getFullPath } from "../../../../helpers/paths"
import { doRectanglesIntersect, onSelectionRowClicked } from "../../../../helpers/selections"
import { useFileSystem, useNavigationHistory, useSearchResultPane, useWindowSelectionRectangle } from "../../../../hooks"
import { WindowPropertiesService } from "../../../../services"
import { BranchingContext, Context, Leaf, Shortcut } from "../../../../types/fs"
import { Expandable } from "../../../expandable"
import { SearchBar } from "../../../searchBar"
import { FileBrowserGridView } from "../fileBrowserGridView"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import { FileBrowserNavigationControls } from "../fileBrowserNavigationControls"
import { FileBrowserRow } from "../fileBrowserRow"
import { FileBrowserTree } from "../fileBrowserTree"
import { FolderBaseInformation } from "../folderBaseInformation"
import { UpOneLevelRow } from "../upOneLevelRow"
import "./fileBrowserTabContent.scss"

const { FILE_BROWSER_CONTENT_RESULT_PANE_CLASS, FILE_BROWSER_GRID_VIEW_CLASS } =
	CLASSNAMES

const baseClickExclusions = [
	FILE_BROWSER_CONTENT_RESULT_PANE_CLASS,
	FILE_BROWSER_GRID_VIEW_CLASS
]

const selectionPanes = [
	FILE_BROWSER_CONTENT_RESULT_PANE_CLASS,
	FILE_BROWSER_GRID_VIEW_CLASS
]

const windowPropertiesService = new WindowPropertiesService()

interface IFileBrowserTabProps {
	context: BranchingContext
	selected: boolean
	setTabContext: (context: BranchingContext) => void
	arguments?: string
}

const FileBrowserTabContent = (props: IFileBrowserTabProps) => {
	const { context: initialContext, selected: tabSelected, setTabContext, arguments: _arguments } = props
	const { validateFilePath } = useFileSystem()
	const {
		history,
		historyPointer,
		addHistory,
		backwardsPossible,
		forwardsPossible,
		navigate,
		navigateToIndex
	} = useNavigationHistory<string>(getFullPath(initialContext))

	const [context, setContext] = useState<BranchingContext>(initialContext)
	const [thumbnailView, setThumbnailView] = useState<boolean>(true)

	const [selected, setSelected] = useState<string[]>(() => {
		if (_arguments) {
			const selectedLeaf = validateFilePath(_arguments)
			if (selectedLeaf) {
				return [selectedLeaf.toContextUniqueKey()]
			}
		}

		return []
	})
	const [searchText, setSearchText] = useState<string>("")

	const { SearchResultPane, searchResult } = useSearchResultPane(searchText, { context: context })

	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})
	const fileBrowserPaneRef = useRef<HTMLDivElement | null>(null)

	const { addWindow } = useContext(WindowsContext)
	const registry = useContext(RegistryContext)

	const Entities = useMemo(() => {
		return [
			...context.branches,
			...context.shortcuts,
			...context.leaves
		]
	}, [context])

	const onRowDoubleClicked = useCallback(
		(context: Context) => {
			const windowProperties = windowPropertiesService.getProperties(
				context,
				registry
			)

			if (windowProperties != null) {
				if (
					BRANCHING_CONTEXT_DETERMINER in windowProperties.context &&
					!windowProperties.openNewInstance
				) {
					elementRowReferences.current = {}
					addHistory(getFullPath(windowProperties.context))
					setTabContext(windowProperties.context)
					setContext(windowProperties.context)
				} else {
					addWindow(windowProperties)
				}
			}
		},
		[
			addWindow,
			setTabContext,
			setContext,
			addHistory,
			getFullPath,
			windowPropertiesService,
			registry
		]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const newSelectedContextKeys = onSelectionRowClicked(
				context,
				e,
				selected,
				Entities,
				(x) => x.toContextUniqueKey()
			)

			setSelected(newSelectedContextKeys)
		},
		[onSelectionRowClicked, selected, Entities, setSelected]
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
				e.target instanceof HTMLElement &&
				baseClickExclusions.indexOf(e.target.className) !== -1
			) {
				setSelected([])
			}
		}
	}

	const onFileBrowserKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" && selected.length > 0) {
			const entities: Context[] = Entities

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
				const addWindowProperties = windowPropertiesService.getProperties(
					branches[i],
					registry
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

	const onPreNavigation = () => {
		setSelected([])
		elementRowReferences.current = {}
	}

	const onNavigationToHistoryIndex = (historyIndex: number) => {
		onPreNavigation()
		const history = navigateToIndex(historyIndex)
		if (!history) {
			return
		}
		const context = validateFilePath(history)
		if (context && BRANCHING_CONTEXT_DETERMINER in context) {
			setTabContext(context)
			setContext(context)
		}
	}

	const onNavigation = (navigationType: NavigationType) => {
		onPreNavigation()
		const history = navigate(navigationType)
		const context = validateFilePath(history)
		if (context && BRANCHING_CONTEXT_DETERMINER in context) {
			setTabContext(context)
			setContext(context)
		}
	}

	const onBackwards = () => onNavigation(NavigationType.Backwards)

	const onForwards = () => onNavigation(NavigationType.Forwards)

	const onUpOneLevel = () => onNavigation(NavigationType.Upwards)

	const onDirectoryChanged = (context: BranchingContext) => {
		setSelected([])
		addHistory(getFullPath(context))
		setTabContext(context)
		setContext(context)
	}

	const onFileNavigation = (context: Leaf | Shortcut) => {
		const windowProperties = windowPropertiesService.getProperties(
			context,
			registry
		)
		if (windowProperties != null) {
			addWindow(windowProperties)
		}
	}

	const onSearchTextChanged = (text: string) => {
		setSelected([])
		setSearchText(text)
	}

	const onSearchCancelled = () => {
		elementRowReferences.current = {}
		setSelected([])
		setSearchText("")
	}

	const onDisplayModeChange = () => {
		elementRowReferences.current = {}
		setSelected([])
		setThumbnailView(tv => !tv)
	}

	const Display = useMemo(() => {
		if (searchResult) {
			return null
		}

		if (!thumbnailView) {
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
		thumbnailView,
		selected,
		onRowClicked,
		onRowDoubleClicked
	])

	const SelectionRectangle = useWindowSelectionRectangle(
		fileBrowserPaneRef,
		onSelectionChanged,
		selectionPanes
	)

	if (!tabSelected) {
		return null
	}

	return (
		<div className="file-browser__tab-content">
			<div className="file-browser__tab-content__controls">
				<FileBrowserNavigationControls
					onBackwards={onBackwards}
					onForwards={onForwards}
					backwardsPossible={backwardsPossible}
					forwardsPossible={forwardsPossible}
					history={history}
					historyPointer={historyPointer}
					onHistoryItemClicked={onNavigationToHistoryIndex}
				/>
				<FileBrowserLocationBar
					context={context}
					onDirectoryChanged={onDirectoryChanged}
					onFileNavigation={onFileNavigation}
				/>
				<SearchBar
					placeholder="Search..."
					value={searchText}
					onInputChange={onSearchTextChanged}
					onCancelClicked={onSearchCancelled}
				/>
			</div>
			<div className="file-browser__tab-content__content">
				<Expandable
					allowedExpandDirections={ExpandDirection.Right}
					minWidth={FILE_BROWSER_TREE_MIN_WIDTH}
				>
					<div className="file-browser__tab-content__content__tree-pane">
						<FileBrowserTree
							onDirectoryChanged={onDirectoryChanged}
						/>
					</div>
				</Expandable>
				<div
					className={FILE_BROWSER_CONTENT_RESULT_PANE_CLASS}
					ref={fileBrowserPaneRef}
					onMouseDown={onFileBrowserMouseDown}
					onKeyDown={onFileBrowserKeyDown}
					tabIndex={0}
				>
					{SelectionRectangle}
					{BRANCHING_CONTEXT_PARENT_PROPERTY in context &&
						context.parent &&
						thumbnailView &&
						!searchResult && (
							<UpOneLevelRow onRowDoubleClicked={onUpOneLevel} />
						)}
					{searchResult && SearchResultPane}
					{Display}
				</div>
			</div>
			<FolderBaseInformation
				context={context}
				entities={Entities}
				selected={selected}
				thumbnailDisplay={thumbnailView}
				toggleDisplayMode={onDisplayModeChange}
			/>
		</div>
	)
}

export default memo(FileBrowserTabContent)