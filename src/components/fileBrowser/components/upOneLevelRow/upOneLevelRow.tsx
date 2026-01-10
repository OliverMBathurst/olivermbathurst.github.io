import { NO_SELECT_CLASS } from "../../../../constants"
import { FolderIcon } from "../../../../icons"
import "./upOneLevelRow.scss"

interface IUpOneLevelRowProps {
	onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const UpOneLevelRow = (props: IUpOneLevelRowProps) => {
	const { onRowDoubleClicked } = props
	return (
		<div className="up-one-level-row" onDoubleClick={onRowDoubleClicked}>
			<div className={`up-one-level-row__icon ${NO_SELECT_CLASS}`}>
				<FolderIcon />
			</div>
			<div className={`up-one-level-row__name ${NO_SELECT_CLASS}`}>...</div>
		</div>
	)
}

export default UpOneLevelRow
