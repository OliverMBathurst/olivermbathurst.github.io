import { useRef } from "react"
import { CLASSNAMES } from "../../constants"
import { useClickOutside } from "../../hooks"
import { PowerIcon } from "../../icons"
import { Context } from "../../types/fs"
import { SearchBar } from "../searchBar"
import { ApplicationsSection, RecommendedSection } from "./components"
import "./startMenu.scss"

const { TASKBAR_START_BUTTON_CLASS } = CLASSNAMES

interface IStartMenuProps {
	onClickOutside: () => void
	onSearchBarFocused: () => void
	onItemClicked: (item: Context) => void
}

const clickOutsideExclusions = [TASKBAR_START_BUTTON_CLASS]

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside, onSearchBarFocused, onItemClicked } = props
	const startMenuRef = useRef<HTMLDivElement | null>(null)

	useClickOutside(startMenuRef, (e) => {
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
	})

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__top-container">
				<SearchBar
					type="text"
					placeholder="Search..."
					onFocus={onSearchBarFocused}
				/>
			</div>
			<div className="start-menu__bottom-container">
				<RecommendedSection onItemClicked={onItemClicked} />
				<ApplicationsSection onItemClicked={onItemClicked} />
			</div>
			<div className="start-menu__button-container">
				<PowerIcon onClick={() => window.location.reload()} />
			</div>
		</div>
	)
}

export default StartMenu
