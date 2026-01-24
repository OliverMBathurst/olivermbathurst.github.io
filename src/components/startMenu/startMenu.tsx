import { useContext, useRef, useState } from "react"
import { NO_SELECT_CLASS, TASKBAR_START_BUTTON_CLASS } from "../../constants"
import { FileSystemContext, WindowsContext } from "../../contexts"
import { useClickOutside } from "../../hooks"
import { ApplicationHandlerService } from "../../service"
import { Context } from "../../types/fs"
import { StartMenuFolderRow } from "./components"
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
	const { root } = useContext(FileSystemContext)
	const { addWindow } = useContext(WindowsContext)

	const [selectedContextKey, setSelectedContextKey] = useState<string | null>(null)
	const [openedFolders, setOpenedFolders] = useState<string[]>([])

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

	const onRowClicked = (fullPath: string, _: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setSelectedContextKey(fullPath)
	}

	const onFolderClicked = (folderKey: string) => {
		setSelectedContextKey(null)

		setOpenedFolders(oF => {
			if (oF.indexOf(folderKey) === -1) {
				return [...oF, folderKey]
			}

			return [...oF].filter(o => o !== folderKey)
		})
	}

	const onFileRowDoubleClicked = (context: Context, _: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const windowProperties = applicationHandlerService.execute(context)
		if (windowProperties != null) {
			setSelectedContextKey(null)
			addWindow(windowProperties)
		}
	}

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__top-container">
				<div className="start-menu__top-container__left"></div>
				<div className="start-menu__top-container__right">
					<div className="start-menu__top-container__right__branches">
						<span className={`start-menu__top-container__right__branches__text ${NO_SELECT_CLASS}`}>
							Quick Drive Access
						</span>
						<StartMenuFolderRow
							index={0}
							key="Root"
							context={root}
							prefix={root.fullName}
							openedFolders={openedFolders}
							selectedContextKey={selectedContextKey}
							onFolderRowClicked={onFolderClicked}
							onFileRowClicked={onRowClicked}
							onFileRowDoubleClicked={onFileRowDoubleClicked}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StartMenu