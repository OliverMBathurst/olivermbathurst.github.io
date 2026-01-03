import { MouseEvent } from 'react'
import { useDisplayName, useIcon } from "../../../hooks"
import { Node } from "../../../types/fs"
import './fileBrowserRow.scss'

interface IFileBrowserRowProps {
	node: Node
	selected: boolean
	onRowDoubleClicked: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
	onRowClicked: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
}

const FileBrowserRow = (props: IFileBrowserRowProps) => {
	const { node, selected, onRowDoubleClicked, onRowClicked } = props
	const Icon = useIcon(node)
	const DisplayName = useDisplayName(node)

	return (
		<div
			className={`file-browser__row${selected ? "--selected" : ""}`}
			onDoubleClick={e => onRowDoubleClicked(e)}
			onClick={e => onRowClicked(e)}
		>
			<div className="file-browser__row__icon no-select">
				{Icon}
			</div>
			<div className="file-browser__row__name no-select">
				{DisplayName}
			</div>
		</div>)
}

export default FileBrowserRow