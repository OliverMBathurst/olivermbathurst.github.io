import { useContext } from "react"
import { CLASSNAMES } from "../../../../../../constants"
import { FileBrowserContext } from "../../../../../../contexts"
import { getIcon } from "../../../../../../helpers/icons"
import { getDisplayName } from "../../../../../../helpers/naming"
import { CollapseIcon, ExpandIcon } from "../../../../../../icons"
import { BranchingContext } from "../../../../../../types/fs"
import "./fileBrowserTreeFolderRow.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserTreeFolderRowProps {
	windowId: string
	index: number
	context: BranchingContext
	prefix: string
	onFolderRowClicked: (
		fullPath: string,
		context: BranchingContext,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => void
}

const FileBrowserTreeFolderRow = (props: IFileBrowserTreeFolderRowProps) => {
	const { windowId, index, context, prefix, onFolderRowClicked } = props

	const {
		treeSelectedContextKeys,
		treeOpenFolderContextKeys,
		setTreeOpenFolderContextKeysForWindow
	} = useContext(FileBrowserContext)

	const contextKeysForWindow = treeSelectedContextKeys[windowId] ?? []
	const openFolders = treeOpenFolderContextKeys[windowId] ?? []

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const key = prefix

	const opened = openFolders.indexOf(key) !== -1
	const selected = contextKeysForWindow.indexOf(key) !== -1

	const hasChildren = context.branches.length > 0

	const style: React.CSSProperties = {
		paddingLeft: `${(2 * index) / 16 + (!hasChildren ? 1.9 : 0.25)}rem`
	}

	const ExpandedItems = () => {
		if (!opened) {
			return null
		}

		return context.branches.map((b) => {
			return (
				<FileBrowserTreeFolderRow
					windowId={windowId}
					key={`expanded-${key}\\${b.fullName}`}
					index={index + 1}
					context={b}
					prefix={`${key}\\${b.fullName}`}
					onFolderRowClicked={onFolderRowClicked}
				/>
			)
		})
	}

	const onFolderRowClickedInternal = (
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		onFolderRowClicked(key, context, e)
	}

	const onExpansionButtonClickedInternal = (
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		e.stopPropagation()
		setTreeOpenFolderContextKeysForWindow(windowId, (oF) => {
			if (oF.indexOf(key) === -1) {
				return [...oF, key]
			}

			return [...oF].filter((o) => o !== key)
		})
	}

	return (
		<>
			<div
				className={`file-browser-tree__folder-row${selected ? "--selected" : ""}`}
				key={key}
				style={style}
				onClick={onFolderRowClickedInternal}
			>
				{hasChildren && (
					<div
						className={`file-browser-tree__folder-row__arrow-container ${NO_SELECT_CLASS}`}
						onClick={onExpansionButtonClickedInternal}
					>
						{opened ? <CollapseIcon /> : <ExpandIcon />}
					</div>
				)}
				<div
					className={`file-browser-tree__folder-row__icon ${NO_SELECT_CLASS}`}
				>
					{Icon}
				</div>
				<div
					className={`file-browser-tree__folder-row__name ${NO_SELECT_CLASS}`}
				>
					{DisplayName}
				</div>
			</div>
			{opened && <ExpandedItems />}
		</>
	)
}

export default FileBrowserTreeFolderRow
