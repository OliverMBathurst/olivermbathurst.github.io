import { useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { BRANCHING_CONTEXT_DETERMINER, CLASSNAMES } from "../../constants"
import { DesktopItemContext, RegistryContext } from "../../contexts"
import { SpecialBranch } from "../../enums"
import { isMouseDownLeftClick } from "../../helpers/click"
import { useFileSystem } from "../../hooks"
import { IPosition } from "../../interfaces/windows"
import { File } from "../file"
import { Folder } from "../folder"
import { Shortcut } from "../shortcut"
import "./desktop.scss"
import { BranchingContext } from "../../types/fs"

const {
	DESKTOP_ITEM_CLASS,
	DESKTOP_ITEM_ICON_CLASS,
	DESKTOP_ITEM_NAME_CLASS,
	NO_SELECT_CLASS
} = CLASSNAMES

const selectionRectangeStartExclusions = [
	DESKTOP_ITEM_CLASS,
	DESKTOP_ITEM_ICON_CLASS,
	DESKTOP_ITEM_NAME_CLASS,
	NO_SELECT_CLASS
]

const Desktop = () => {
	const {
		onDesktopClicked,
		onDesktopDragOver,
		onDesktopDrop,
		elementReferences,
		setSelectedContextKeys
	} = useContext(DesktopItemContext)
	const { validateFilePath } = useFileSystem()
	const { specialBranchPaths } = useContext(RegistryContext)

	const selectionRectangeRef = useRef<HTMLDivElement | null>(null)
	const selecting = useRef<boolean>(false)
	const selectionRectangeStart = useRef<IPosition | undefined>(undefined)

	const desktopBranch: BranchingContext | null = useMemo(() => {
		const validatedDesktopBranch = validateFilePath(
			specialBranchPaths[SpecialBranch.Desktop]
		)
		if (!validatedDesktopBranch) {
			return null
		}

		if (BRANCHING_CONTEXT_DETERMINER in validatedDesktopBranch) {
			return validatedDesktopBranch
		}

		return null
	}, [validateFilePath, specialBranchPaths])

	const onMouseUp = useCallback((_: MouseEvent) => {
		if (selectionRectangeRef.current) {
			selecting.current = false
			selectionRectangeRef.current.style.visibility = "hidden"
		}
	}, [])

	useEffect(() => {
		document.addEventListener("mouseup", onMouseUp)

		return () => {
			document.removeEventListener("mouseup", onMouseUp)
		}
	}, [onMouseUp])

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (e.target instanceof HTMLElement) {
			const elem = e.target as HTMLElement
			if (
				selectionRectangeStartExclusions.some((x) => elem.classList.contains(x))
			) {
				return
			}
		}

		if (!isMouseDownLeftClick(e)) {
			return
		}

		if (selectionRectangeRef.current) {
			selectionRectangeRef.current.style.width = `0px`
			selectionRectangeRef.current.style.height = `0px`

			selectionRectangeRef.current.style.visibility = "visible"
			selecting.current = true

			selectionRectangeStart.current = {
				x: e.clientX,
				y: e.clientY
			}

			selectionRectangeRef.current.style.left = `${e.clientX}px`
			selectionRectangeRef.current.style.top = `${e.clientY}px`
		}
	}

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (
			selectionRectangeRef.current &&
			selecting.current &&
			selectionRectangeStart.current
		) {
			const newWidth = Math.abs(selectionRectangeStart.current.x - e.clientX)
			const newHeight = Math.abs(selectionRectangeStart.current.y - e.clientY)

			if (selectionRectangeStart.current.x > e.clientX) {
				selectionRectangeRef.current.style.left = `${e.clientX}px`
			}

			if (selectionRectangeStart.current.y > e.clientY) {
				selectionRectangeRef.current.style.top = `${e.clientY}px`
			}

			selectionRectangeRef.current.style.width = `${newWidth}px`
			selectionRectangeRef.current.style.height = `${newHeight}px`

			const rectangleIntersection = (r: DOMRect, r1: DOMRect): boolean => {
				return !(
					r1.left > r.right ||
					r1.right < r.left ||
					r1.top > r.bottom ||
					r1.bottom < r.top
				)
			}

			const newSelectionRectangle =
				selectionRectangeRef.current.getBoundingClientRect()

			const elementReferenceKeys = Object.keys(elementReferences)
			const selectedDesktopItemContextKeys = []
			for (let i = 0; i < elementReferenceKeys.length; i++) {
				const elem = elementReferences[elementReferenceKeys[i]]
				const rect = elem.getBoundingClientRect()

				if (rectangleIntersection(rect, newSelectionRectangle)) {
					selectedDesktopItemContextKeys.push(elementReferenceKeys[i])
				}
			}

			setSelectedContextKeys(selectedDesktopItemContextKeys)
		}
	}

	return (
		<div
			className="desktop"
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
		>
			<div
				className="desktop__selection-rectangle"
				ref={selectionRectangeRef}
			/>
			<div
				className="desktop__grid"
				onClick={onDesktopClicked}
				onDrop={onDesktopDrop}
				onDragOver={onDesktopDragOver}
			>
				{desktopBranch?.branches.map((b) => {
					return <Folder key={b.name} context={b} />
				})}
				{desktopBranch?.shortcuts.map((s) => {
					return <Shortcut key={s.name} shortcut={s} />
				})}
				{desktopBranch?.leaves.map((l) => {
					const { fullName } = l
					return <File key={fullName} context={l} />
				})}
			</div>
		</div>
	)
}

export default Desktop
