import { useContext } from "react"
import { IStartMenuFileRowProps } from ".."
import { NO_SELECT_CLASS } from "../../../../../../constants"
import { FileBrowserContext } from "../../../../../../contexts"
import { getIcon } from "../../../../../../helpers/icons"
import { getDisplayName } from "../../../../../../helpers/naming"
import "./fileBrowserTreeFileRow.scss"

const FileBrowserTreeFileRow = (props: IStartMenuFileRowProps) => {
	const {
		windowId,
		index,
		context,
		prefix,
		onRowClicked,
		onFileRowDoubleClicked
	} = props

	const { treeSelectedContextKeys } = useContext(FileBrowserContext)
	const contextKeysForWindow = treeSelectedContextKeys[windowId] ?? []

	const key = prefix

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const selected = contextKeysForWindow.indexOf(key) !== -1

	const style: React.CSSProperties = {
		paddingLeft: `${((2 * index) / 16) + 1.5}rem`
	}

	return (
		<div
			className={`file-browser-tree__file-row${selected ? "--selected" : ""}`}
			key={key}
			style={style}
			onClick={(e) => onRowClicked(prefix, e)}
			onDoubleClick={(e) => onFileRowDoubleClicked(context, e)}
		>
			<div
				className={`file-browser-tree__file-row__icon ${NO_SELECT_CLASS}`}
			>
				{Icon}
			</div>
			<div
				className={`file-browser-tree__file-row__name ${NO_SELECT_CLASS}`}
			>
				{DisplayName}
			</div>
		</div>
	)
}

export default FileBrowserTreeFileRow