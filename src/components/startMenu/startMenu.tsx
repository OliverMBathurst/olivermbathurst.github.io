import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER, CLASSNAMES } from "../../constants"
import { RegistryContext } from "../../contexts"
import { SpecialBranch } from "../../enums"
import { onSelectionRowClicked } from "../../helpers/selections"
import { useClickOutside, useFileSystem } from "../../hooks"
import { PowerIcon } from "../../icons"
import { Context } from "../../types/fs"
import { SearchBar } from "../searchBar"
import { ContainerSection } from "./components"
import "./startMenu.scss"

const { TASKBAR_START_BUTTON_CLASS } = CLASSNAMES

interface IStartMenuProps {
	onClickOutside: () => void
	onSearchBarFocused: () => void
	onItemDoubleClicked: (item: Context) => void
}

const clickOutsideExclusions = [TASKBAR_START_BUTTON_CLASS]

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside, onSearchBarFocused, onItemDoubleClicked } = props
	const startMenuRef = useRef<HTMLDivElement | null>(null)
	const [items, setItems] = useState<Context[]>([])
	const [selected, setSelected] = useState<string[]>([])

	const { specialBranchPaths } = useContext(RegistryContext)
	const { validateFilePath } = useFileSystem()

	useEffect(() => {
		const startMenuPath = specialBranchPaths[SpecialBranch.StartMenu]
		if (startMenuPath) {
			const validatedContext = validateFilePath(startMenuPath)
			if (validatedContext && BRANCHING_CONTEXT_DETERMINER in validatedContext) {
				const items = [
					...validatedContext.branches,
					...validatedContext.leaves,
					...validatedContext.shortcuts
				]

				setItems(items)
			}
		}
	}, [specialBranchPaths, setItems])

	const onClickOutsideInternal = useCallback((e: MouseEvent) => {
		let validClick: boolean = true
		if (e.target instanceof HTMLElement) {
			const elem = e.target as HTMLElement
			if (
				clickOutsideExclusions.some(
					(x) =>
						elem.classList.contains(x) ||
						elem.parentElement?.classList.contains(x)
				)
			) {
				validClick = false
			}
		}

		if (validClick) {
			onClickOutside()
		}
	}, [clickOutsideExclusions, onClickOutside])

	useClickOutside(startMenuRef, onClickOutsideInternal)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const newSelectedContextKeys = onSelectionRowClicked(
				context,
				e,
				selected,
				items,
				(x) => x.toContextUniqueKey()
			)

			setSelected(newSelectedContextKeys)
		},
		[onSelectionRowClicked, selected, items, setSelected]
	)

	const onRowDoubleClicked = useCallback(
		(context: Context, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			onItemDoubleClicked(context)
			setSelected([])
		},
		[onItemDoubleClicked, setSelected]
	)

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__button-container">
				<PowerIcon onClick={() => window.location.reload()} />
			</div>
			<div className="start-menu__side-container">
				<div className="start-menu__side-container__top-container">
					<SearchBar
						type="text"
						placeholder="Search..."
						onFocus={onSearchBarFocused}
					/>
				</div>
				<div className="start-menu__side-container__bottom-container">
					<ContainerSection
						items={items}
						selected={selected}
						onItemClicked={onRowClicked}
						onItemDoubleClicked={onRowDoubleClicked}
					/>
				</div>
			</div>
		</div>
	)
}

export default StartMenu
