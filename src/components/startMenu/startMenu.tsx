import { useRef } from "react"
import { NO_SELECT_CLASS, TASKBAR_START_BUTTON_CLASS } from "../../constants"
import { useClickOutside } from "../../hooks"
import "./startMenu.scss"

interface IStartMenuProps {
	onClickOutside: () => void
}

const clickOutsideExclusions = [
	TASKBAR_START_BUTTON_CLASS
]

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside } = props

	const startMenuRef = useRef<HTMLDivElement | null>(null)

	useClickOutside(startMenuRef, (e) => {
		let validClick: boolean = true
		if (e.target instanceof HTMLElement) {
			const elem = e.target as HTMLElement
			if (clickOutsideExclusions.some((x) => elem.classList.contains(x) || elem.parentElement?.classList.contains(x))) {
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
				<div className="start-menu__top-container__left"></div>
				<div className="start-menu__top-container__right">
					<div className="start-menu__top-container__right__branches">
						<span className={`start-menu__top-container__right__branches__text ${NO_SELECT_CLASS}`}>
							Applications
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StartMenu