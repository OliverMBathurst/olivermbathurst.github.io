import { useContext } from "react"
import { IStartMenuFolderRowProps } from ".."
import { NO_SELECT_CLASS } from "../../../../../../constants"
import { FileBrowserContext } from "../../../../../../contexts"
import { getIcon } from "../../../../../../helpers/icons"
import { getDisplayName } from "../../../../../../helpers/naming"
import { CollapseIcon, ExpandIcon } from "../../../../../../icons"
import { FileBrowserTreeFileRow } from "..//fileBrowserTreeFileRow"
import "./fileBrowserTreeFolderRow.scss"

const FileBrowserTreeFolderRow = (props: IStartMenuFolderRowProps) => {
	const {
		windowId,
		index,
		context,
		prefix,
		onFolderRowClicked,
		onFileRowClicked,
		onFileRowDoubleClicked
	} = props

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

	const style: React.CSSProperties = {
		paddingLeft: `${((2 * index) / 16) + 0.25}rem`
	}

	const ExpandedItems = () => {
		if (!opened) {
			return null
		}

		let items = [...context.branches].map(b => {
			return (
				<FileBrowserTreeFolderRow
					windowId={windowId}
					key={`expanded-${key}\\${b.fullName}`}
					index={index + 1}
					context={b}
					prefix={`${key}\\${b.fullName}`}
					onFolderRowClicked={onFolderRowClicked}
					onFileRowClicked={onFileRowClicked}
					onFileRowDoubleClicked={onFileRowDoubleClicked}
				/>
			)
		})

		items = items.concat([...context.leaves, ...context.shortcuts].map(c => {
			return (
				<FileBrowserTreeFileRow
					windowId={windowId}
					key={`expanded-${key}\\${c.fullName}`}
					index={index + 1}
					context={c}
					prefix={`${key}\\${c.fullName}`}
					onRowClicked={onFileRowClicked}
					onFileRowDoubleClicked={onFileRowDoubleClicked}
				/>
			)
		}))

		return items
	}

	const onFolderRowClickedInternal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		onFolderRowClicked(key, context, e)
	}

	const onExpansionButtonClickedInternal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setTreeOpenFolderContextKeysForWindow(windowId, (oF) => {
			if (oF.indexOf(key) === -1) {
				return [...oF, key]
			}

			return [...oF].filter(o => o !== key)
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
				<div
					className={`file-browser-tree__folder-row__arrow-container ${NO_SELECT_CLASS}`}
					onClick={onExpansionButtonClickedInternal}
				>
					{opened ? <CollapseIcon /> : <ExpandIcon />}
				</div>
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