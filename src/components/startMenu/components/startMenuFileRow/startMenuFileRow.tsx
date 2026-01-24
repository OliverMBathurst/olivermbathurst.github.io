import { IStartMenuFileRowProps } from ".."
import { NO_SELECT_CLASS } from "../../../../constants"
import { getIcon } from "../../../../helpers/icons"
import { getDisplayName } from "../../../../helpers/naming"
import "./startMenuFileRow.scss"

const StartMenuFileRow = (props: IStartMenuFileRowProps) => {
	const {
		index,
		context,
		prefix,
		selectedContextKey,
		onRowClicked,
		onFileRowDoubleClicked
	} = props

	const key = prefix

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const selected = selectedContextKey === key

	const style: React.CSSProperties = {
		paddingLeft: `${(2 * index) / 16}rem`
	}

	return (
		<div
			className={`start-menu-file-row${selected ? "--selected" : ""}`}
			key={key}
			style={style}
			onClick={(e) => onRowClicked(prefix, e)}
			onDoubleClick={(e) => onFileRowDoubleClicked(context, e)}
		>
			<div
				className={`start-menu-file-row__icon ${NO_SELECT_CLASS}`}
			>
				{Icon}
			</div>
			<div
				className={`start-menu-file-row__name ${NO_SELECT_CLASS}`}
			>
				{DisplayName}
			</div>
		</div>
	)
}

export default StartMenuFileRow