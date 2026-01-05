import { useDisplayName, useIcon } from "../../../../hooks"
import { Context } from "../../../../types/fs"
import "./desktopItem.scss"

interface IDesktopItemProps {
	context: Context
	onDoubleClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const DesktopItem = (props: IDesktopItemProps) => {
	const { context, onDoubleClick } = props

	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)

	return (
		<div className="desktop-item" onDoubleClick={onDoubleClick}>
			{Icon}
			<span className="desktop-item__name no-select">{DisplayName}</span>
		</div>
	)
}

export default DesktopItem
