import { useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { DESKTOP_ITEM_CLASS, DESKTOP_ITEM_ICON_CLASS, DESKTOP_ITEM_NAME_CLASS, NO_SELECT_CLASS } from "../../constants"
import { DesktopItemContext, FileSystemContext } from "../../contexts"
import { SpecialBranch } from "../../enums"
import { useFileSystem } from "../../hooks"
import { IPosition } from "../../interfaces/windows"
import { File } from "../file"
import { Folder } from "../folder"
import { Shortcut } from "../shortcut"
import "./desktop.scss"

const selectionRectangeStartExclusions = [
	DESKTOP_ITEM_CLASS,
	DESKTOP_ITEM_ICON_CLASS,
	DESKTOP_ITEM_NAME_CLASS,
	NO_SELECT_CLASS
]

const Desktop = () => {
	const { searchForBranchByType } = useFileSystem()
	const { root } = useContext(FileSystemContext)
	const { onDesktopClicked, onDesktopDragOver, onDesktopDrop } =
		useContext(DesktopItemContext)

	const selectionRectangeRef = useRef<HTMLDivElement | null>(null)
	const selecting = useRef<boolean>(false)
	const selectionRectangeStart = useRef<IPosition | undefined>(undefined)

	const desktopBranch = useMemo(() => {
		return searchForBranchByType(root, SpecialBranch.Desktop)
	}, [searchForBranchByType, root])

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
			if (selectionRectangeStartExclusions.some(x => elem.classList.contains(x))) {
				return
			}
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
					const { name, extension } = l
					return <File key={`${name}${extension}`} context={l} />
				})}
			</div>
		</div>
	)
}

export default Desktop
