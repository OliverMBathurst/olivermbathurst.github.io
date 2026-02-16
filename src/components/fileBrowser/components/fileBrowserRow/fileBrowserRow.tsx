import { CLASSNAMES } from "../../../../constants"
import { useDisplayName, useIcon } from "../../../../hooks"
import { Context } from "../../../../types/fs"
import "./fileBrowserRow.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserRowProps {
	context: Context
	selected: boolean
	setRowReference: (ref: HTMLElement | null) => void
	onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onRowClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const FileBrowserRow = (props: IFileBrowserRowProps) => {
	const {
		context,
		selected,
		setRowReference,
		onRowDoubleClicked,
		onRowClicked
	} = props
	const Icon = useIcon(context, true, undefined, selected)
	const DisplayName = useDisplayName(context)

	return (
		<div
			className={`file-browser__row${selected ? "--selected" : ""}`}
			ref={(r) => setRowReference(r)}
			onDoubleClick={onRowDoubleClicked}
			onClick={onRowClicked}
		>
			<div className={`file-browser__row__icon ${NO_SELECT_CLASS}`}>{Icon}</div>
			<div className={`file-browser__row__name ${NO_SELECT_CLASS}`}>
				{DisplayName}
			</div>
		</div>
	)
}

export default FileBrowserRow
