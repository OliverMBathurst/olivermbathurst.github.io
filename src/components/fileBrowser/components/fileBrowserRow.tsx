import { useDisplayName, useIcon } from "../../../hooks"
import { Node } from "../../../types/fs"
import './fileBrowserRow.scss'

interface IFileBrowserRowProps {
	node: Node
	selected: boolean
	onRowDoubleClicked: () => void
	onRowClicked: () => void
}

const FileBrowserRow = (props: IFileBrowserRowProps) => {
	const { node, onRowDoubleClicked, onRowClicked } = props
	const Icon = useIcon(node)
	const DisplayName = useDisplayName(node)

	return (
		<div className="file-browser__row" onDoubleClick={onRowDoubleClicked} onClick={onRowClicked}>
			<div className="file-browser__row__icon">
				{Icon}
			</div>
			<div className="file-browser__row__name">
				{DisplayName}
			</div>
		</div>)
}

export default FileBrowserRow