import { useDisplayName, useIcon } from "../../../hooks"
import { Context } from "../../../types/fs"
import './fileBrowserRow.scss'

interface IFileBrowserRowProps {
	context: Context
	selected: boolean
	onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onRowClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const FileBrowserRow = (props: IFileBrowserRowProps) => {
	const { context, selected, onRowDoubleClicked, onRowClicked } = props
	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)

	return (
		<div
			className={`file-browser__row${selected ? "--selected" : ""}`}
			onDoubleClick={onRowDoubleClicked}
			onClick={onRowClicked}
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