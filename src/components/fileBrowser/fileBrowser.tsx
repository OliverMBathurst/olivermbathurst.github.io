import { useCallback, useContext, useMemo, useRef, useState } from "react"
import {
    BRANCHING_CONTEXT_DETERMINER,
    BRANCHING_CONTEXT_PARENT_PROPERTY,
    FILETYPE_RENDERABLE_PROPERTY,
    FILETYPE_URL_SHORTCUT,
    FILETYPE_URL_SHORTCUT_PROPERTY,
    LEAF_EXTENSION_PROPERTY_NAME,
    SHORTCUT_DETERMINER
} from "../../constants"
import { WindowsContext } from "../../contexts"
import { doRectanglesIntersect } from "../../helpers/selections"
import { useWindowSelectionRectangle } from "../../hooks"
import { IAddWindowProperties } from "../../interfaces/windows"
import { BranchingContext, Context } from "../../types/fs"
import { FileBrowserControls, FileBrowserRow, UpOneLevelRow } from "./components"
import "./fileBrowser.scss"

interface IFileBrowserProps {
	windowId: string
	context: BranchingContext
}

let rowReferences: Record<string, HTMLElement | null> = {}

const clickOutsideExclusions = ["file-browser__row", "file-browser-controls"]

const FileBrowser = (props: IFileBrowserProps) => {
	const { windowId, context } = props

	const [selected, setSelected] = useState<string[]>([])
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
			let resolvedContext: Context = context
			if (SHORTCUT_DETERMINER in resolvedContext) {
				resolvedContext = resolvedContext.context
			}

			if (
				FILETYPE_URL_SHORTCUT_PROPERTY in resolvedContext &&
				LEAF_EXTENSION_PROPERTY_NAME in resolvedContext &&
				resolvedContext.extension === FILETYPE_URL_SHORTCUT
			) {
				window.open(resolvedContext.url, "_blank")
			} else if (FILETYPE_RENDERABLE_PROPERTY in resolvedContext) {
				const windowProperties: IAddWindowProperties = {
					context: resolvedContext
				}

				addWindow(windowProperties)
			} else if (BRANCHING_CONTEXT_DETERMINER in resolvedContext) {
				rowReferences = {}
				setWindowContext(windowId, resolvedContext)
			}
		},
		[addWindow, windowId, setWindowContext]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const contextKey = context.toContextUniqueKey()

			if (e.shiftKey) {
				if (selected.length === 0) {
					setSelected([contextKey])
				} else {
					if (selected.length === 1 && selected[0] === contextKey) {
						return
					}

					const identities = Entities.map((x) => x.toContextUniqueKey())

					const initialSelectionIndex = identities.indexOf(selected[0])
					const newSelectionIndex = identities.indexOf(contextKey)

					const newSelection: string[] = [selected[0]]

					if (newSelectionIndex > initialSelectionIndex) {
						for (
							let i = initialSelectionIndex + 1;
							i <= newSelectionIndex;
							i++
						) {
							newSelection.push(identities[i])
						}
					} else {
						for (let i = newSelectionIndex; i < initialSelectionIndex; i++) {
							newSelection.push(identities[i])
						}
					}

					setSelected(newSelection)
				}
			} else if (e.ctrlKey) {
				if (selected.indexOf(contextKey) === -1) {
					setSelected((s) => [...s, contextKey])
				} else {
					setSelected((s) => [...s].filter((x) => x !== contextKey))
				}
			} else {
				setSelected([contextKey])
			}
		},
		[selected, Entities]
	)

	const upOneLevel = () => {
		if (BRANCHING_CONTEXT_PARENT_PROPERTY in context && context.parent) {
			rowReferences = {}
			setWindowContext(windowId, context.parent)
		}
	}

	const onSelectionChanged = (selectionRectangle: DOMRect) => {
		const rowElementKeys = Object.keys(rowReferences)
		const selectedContextKeys: string[] = []
		for (let i = 0; i < rowElementKeys.length; i++) {
			const rowElement = rowReferences[rowElementKeys[i]]
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
		if (
			!(e.target instanceof HTMLElement) ||
			!clickOutsideExclusions.some((x) =>
				(e.target as HTMLElement).classList.contains(x)
			)
		) {
			setSelected([])
		}
	}

	const SelectionRectangle = useWindowSelectionRectangle(
		fileBrowserRef,
		onSelectionChanged
	)

	return (
		<div className="file-browser">
			<FileBrowserControls context={context} />
			<div
				className="file-browser__result-pane"
				ref={fileBrowserRef}
				onMouseDown={onFileBrowserMouseDown}
			>
				{SelectionRectangle}
				{BRANCHING_CONTEXT_PARENT_PROPERTY in context && context.parent && (
					<UpOneLevelRow onRowDoubleClicked={upOneLevel} />
				)}
				{Entities.map((e) => {
					const contextKey = e.toContextUniqueKey()
					return (
						<FileBrowserRow
							key={contextKey}
							context={e}
							selected={selected.indexOf(contextKey) !== -1}
							setRowReference={(r) => (rowReferences[contextKey] = r)}
							onRowClicked={(ev) => onRowClicked(e, ev)}
							onRowDoubleClicked={(ev) => onRowDoubleClicked(e, ev)}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default FileBrowser
