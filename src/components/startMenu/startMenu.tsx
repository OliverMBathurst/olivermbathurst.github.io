import { useCallback, useContext, useMemo, useRef, useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER, BRANCHING_CONTEXT_PARENT_PROPERTY, TASKBAR_START_BUTTON_CLASS } from "../../constants"
import { FileSystemContext } from "../../contexts"
import { SpecialBranch } from "../../enums"
import { getFullPath } from "../../helpers/paths"
import { onSelectionRowClicked } from "../../helpers/selections"
import { useClickOutside, useFileSystem } from "../../hooks"
import { IForwardContextInformation } from "../../interfaces/fs"
import { Context, Leaf, Shortcut } from "../../types/fs"
import { StartMenuFileRow, StartMenuFolderRow } from "./components/startMenuRow"
import "./startMenu.scss"

interface IStartMenuProps {
	onClickOutside: () => void
}

const clickOutsideExclusions = [
	TASKBAR_START_BUTTON_CLASS
]

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside } = props
	const { root } = useContext(FileSystemContext)
	const { forwardContexts, searchForBranchByType } = useFileSystem(root)

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
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

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
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

	const desktopBranch = useMemo(() => {
		return searchForBranchByType(root, SpecialBranch.Desktop)
	}, [searchForBranchByType, root])

	const Items = useMemo(() => {
		const branches: IForwardContextInformation[] = []
		let nominatedFiles: Leaf[] = []
		let nominatedShortcuts: Shortcut[] = []
		
		for (const fcc of forwardContexts) {
			if (BRANCHING_CONTEXT_DETERMINER in fcc.context && BRANCHING_CONTEXT_PARENT_PROPERTY in fcc.context) {
				branches.push(fcc)
			}
		}

		if (desktopBranch) {
			nominatedFiles = [...desktopBranch.leaves]
			nominatedShortcuts = [...desktopBranch.shortcuts]
		}

		return { branches, nominatedFiles }
	}, [forwardContexts, desktopBranch])

	const onFolderClicked = (folderKey: string) => {
		setSelectedContextKeys([])

		setOpenedFolders(oF => {
			if (oF.indexOf(folderKey) === -1) {
				return [...oF, folderKey]
			}

			return [...oF].filter(o => o !== folderKey)
		})
	}

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__top-container">
				<div className="start-menu__top-container__left"></div>
				<div className="start-menu__top-container__right">
					<div className="start-menu__top-container__right__branches">
						<span className="start-menu__top-container__right__branches__text">
							Folders
						</span>
						{Items.branches.map(b => {
							const { context, fullPath } = b
							const prefix = "start-menu-branch"

							if (!(BRANCHING_CONTEXT_DETERMINER in context) || !(BRANCHING_CONTEXT_PARENT_PROPERTY in context)) {
								return null
							}

							return (
								<StartMenuFolderRow
									index={0}
									key={"init-" + prefix + fullPath}
									context={context}
									prefix={prefix + "branch-"}
									fullPath={fullPath}
									openedFolders={openedFolders}
									selectedContextKeys={selectedContextKeys}
									onFolderRowClicked={onFolderClicked}
									onFileRowClicked={onRowClicked}
								/>)
						})}
					</div>
					<div className="start-menu__top-container__right__files">
						<span className="start-menu__top-container__right__files__text">
							Suggested Files
						</span>
						{Items.nominatedFiles.map(f => {
							const prefix = "start-menu-leaf"
							const fp = getFullPath(f)

							return (
								<StartMenuFileRow
									index={0}
									key={"init-" + prefix + fp}
									context={f}
									prefix={prefix + "leaf-"}
									fullPath={fp}
									selectedContextKeys={selectedContextKeys}
									onRowClicked={onRowClicked}
								/>)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default StartMenu