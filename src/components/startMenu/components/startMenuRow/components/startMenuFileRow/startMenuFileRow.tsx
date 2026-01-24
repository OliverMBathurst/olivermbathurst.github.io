import { useContext } from "react"
import { IStartMenuFileRowProps } from ".."
import { NO_SELECT_CLASS } from "../../../../../../constants"
import { WindowsContext } from "../../../../../../contexts"
import { getIcon } from "../../../../../../helpers/icons"
import { getDisplayName } from "../../../../../../helpers/naming"
import { useClick } from "../../../../../../hooks"
import { ApplicationHandlerService } from "../../../../../../service"
import { Context } from "../../../../../../types/fs"
import "./startMenuFileRow.scss"

const applicationHandlerService = new ApplicationHandlerService()

const StartMenuFileRow = (props: IStartMenuFileRowProps) => {
	const {
		index,
		context,
		prefix,
		fullPath,
		selectedContextKeys,
		onRowClicked
	} = props

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const selected =
		selectedContextKeys.indexOf(context.toContextUniqueKey()) !== -1

	const { addWindow } = useContext(WindowsContext)

	const style: React.CSSProperties = {
		paddingLeft: `${(2 * index) / 16}rem`
	}

	const onFileRowDoubleClicked = (context: Context, _: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const windowProperties = applicationHandlerService.execute(context)
		if (windowProperties != null) {
			addWindow(windowProperties)
		}
	}

	const click = useClick(
		(e) => onRowClicked(context, e),
		(e) => onFileRowDoubleClicked(context, e));

	return (
		<div
			className={`start-menu-file-row${selected ? "--selected" : ""}`}
			key={prefix + fullPath}
			style={style}
			onClick={click}
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