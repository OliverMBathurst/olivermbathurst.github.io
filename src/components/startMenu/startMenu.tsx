import { useCallback, useContext, useRef, useState } from "react"
import { NO_SELECT_CLASS, TASKBAR_START_BUTTON_CLASS } from "../../constants"
import { FileSystemContext, WindowsContext } from "../../contexts"
import { getIcon } from "../../helpers/icons"
import { getDisplayName } from "../../helpers/naming"
import { onSelectionRowClicked } from "../../helpers/selections"
import { useClickOutside, useFileSystem } from "../../hooks"
import { ApplicationHandlerService } from "../../service"
import { Context } from "../../types/fs"
import "./startMenu.scss"

interface IStartMenuProps {
	onClickOutside: () => void
}

const clickOutsideExclusions = [
	TASKBAR_START_BUTTON_CLASS
]

const applicationHandlerService = new ApplicationHandlerService()

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside } = props

	const { addWindow } = useContext(WindowsContext)
	const { root } = useContext(FileSystemContext)
	const { forwardContexts } = useFileSystem(root)

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])

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
			const newSelectedContextKeys = onSelectionRowClicked(
				context,
				e,
				selectedContextKeys,
				forwardContexts,
				(x) => x.context.toContextUniqueKey()
			)

			setSelectedContextKeys(newSelectedContextKeys)
		},
		[
			onSelectionRowClicked,
			selectedContextKeys,
			forwardContexts,
			setSelectedContextKeys
		]
	)

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__top-container">
				<div className="start-menu__top-container__left"></div>
				<div className="start-menu__top-container__right">
					{forwardContexts.map((fc) => {
						const { context, fullPath } = fc
						const Icon = getIcon(context)
						const DisplayName = getDisplayName(context)
						const selected =
							selectedContextKeys.indexOf(context.toContextUniqueKey()) !== -1
						return (
							<div
								className={`start-menu__top-container__right__row${selected ? "--selected" : ""}`}
								key={fullPath}
								onClick={(e) => onRowClicked(context, e)}
								onDoubleClick={(e) => onRowDoubleClicked(context, e)}
							>
								<div
									className={`start-menu__top-container__right__row__icon ${NO_SELECT_CLASS}`}
								>
									{Icon}
								</div>
								<div
									className={`start-menu__top-container__right__row__name ${NO_SELECT_CLASS}`}
								>
									{DisplayName}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default StartMenu