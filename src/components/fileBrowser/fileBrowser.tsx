import { useCallback, useContext, useMemo, useRef, useState } from "react"
import {
    BRANCHING_CONTEXT_DETERMINER,
    BRANCHING_CONTEXT_PARENT_PROPERTY,
    LEAF_EXTENSION_PROPERTY_NAME,
    NO_SELECT_CLASS,
    SHORTCUT_DETERMINER
} from "../../constants"
import { WindowsContext } from "../../contexts"
import {
    doRectanglesIntersect,
    onSelectionRowClicked
} from "../../helpers/selections"
import { useWindowSelectionRectangle } from "../../hooks"
import { ISearchResult } from "../../interfaces/search"
import { ApplicationHandlerService } from "../../service"
import { BranchingContext, Context, Leaf, Shortcut } from "../../types/fs"
import { SearchResultPane } from "../searchResultPane"
import {
    FileBrowserControls,
    FileBrowserRow,
    UpOneLevelRow
} from "./components"
import "./fileBrowser.scss"

interface IFileBrowserProps {
	windowId: string
	context: BranchingContext
}

const baseClickExclusion = "file-browser__result-pane"

const applicationHandlerService = new ApplicationHandlerService()

const FileBrowser = (props: IFileBrowserProps) => {
	const { windowId, context } = props
	const [selected, setSelected] = useState<string[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)

	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})
	const fileBrowserRef = useRef<HTMLDivElement | null>(null)

	const { addWindow, setWindowContext } = useContext(WindowsContext)

	if (!(BRANCHING_CONTEXT_DETERMINER in context)) {
		throw new Error("File Browser invoked on non-branching Context")
	}

	const Entities = useMemo(() => {
		return [...context.branches, ...context.shortcuts, ...context.leaves]
	}, [context])

	const onRowDoubleClicked = useCallback(
		(context: Context, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const windowProperties = applicationHandlerService.execute(context)
			if (windowProperties != null) {
				if (BRANCHING_CONTEXT_DETERMINER in windowProperties.context) {
					elementRowReferences.current = {}
					setWindowContext(windowId, windowProperties.context)
				} else {
					addWindow(windowProperties)
				}
			}
		},
		[addWindow, windowId, setWindowContext]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const newSelectedContextKeys = onSelectionRowClicked(
				context,
				searchResult !== null,
				e,
				selected,
				searchResult?.items ?? [],
				Entities,
				x => x.context.toContextUniqueKey(),
				x => x.toContextUniqueKey()
			)

			setSelected(newSelectedContextKeys)
		},
		[
			searchResult,
			onSelectionRowClicked,
			selected,
			Entities,
			setSelected
		]
	)

	const upOneLevel = () => {
		if (BRANCHING_CONTEXT_PARENT_PROPERTY in context && context.parent) {
			elementRowReferences.current = {}
			setWindowContext(windowId, context.parent)
		}
	}

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
		if (e.currentTarget.className === baseClickExclusion) {
			if (
				e.target instanceof HTMLElement &&
				e.target.className === baseClickExclusion
			) {
				setSelected([])
			}
		}
	}

	const onDirectoryChanged = (context: BranchingContext) => {
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

	const SelectionRectangle = useWindowSelectionRectangle(
		fileBrowserRef,
		onSelectionChanged
	)

	const BaseInformation = () => {
		let entitiesLength = 0

		let leaves = []
		let shortcuts = []
		let branches = []

		if (searchResult) {
			const searchItems = searchResult?.items ?? []
			leaves = searchItems.filter(
				(x) =>
					LEAF_EXTENSION_PROPERTY_NAME in x.context &&
					!(SHORTCUT_DETERMINER in x.context)
			)
			branches = searchItems.filter(
				(x) => BRANCHING_CONTEXT_DETERMINER in x.context
			)
			shortcuts = searchItems.filter((x) => SHORTCUT_DETERMINER in x.context)
			entitiesLength = leaves.length + branches.length + shortcuts.length
		} else {
			leaves = context.leaves
			branches = context.branches
			shortcuts = context.shortcuts
			entitiesLength = Entities.length
		}

		return (
			<div className="file-browser__information-pane">
				<span className={`file-browser__information-pane ${NO_SELECT_CLASS}`}>
					{`${entitiesLength} item${entitiesLength !== 1 ? "s" : ""} | ${branches.length} folder${branches.length !== 1 ? "s" : ""}, ${leaves.length + shortcuts.length} file${leaves.length + shortcuts.length !== 1 ? "s" : ""}`}
				</span>
			</div>
		)
	}

	return (
		<div className="file-browser">
			<FileBrowserControls
				context={context}
				onDirectoryChanged={onDirectoryChanged}
				onFileNavigation={onFileNavigation}
				onSearchCompleted={onSearchCompleted}
				onSearchCancelled={onSearchCancelled}
			/>
			<div
				className="file-browser__result-pane"
				ref={fileBrowserRef}
				onMouseDown={onFileBrowserMouseDown}
			>
				{SelectionRectangle}
				{BRANCHING_CONTEXT_PARENT_PROPERTY in context &&
					context.parent &&
					!searchResult && <UpOneLevelRow onRowDoubleClicked={upOneLevel} />}
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
				{!searchResult &&
					Entities.map((e) => {
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
								onRowDoubleClicked={(ev) => onRowDoubleClicked(e, ev)}
							/>
						)
					})}
			</div>
			<BaseInformation />
		</div>
	)
}

export default FileBrowser
