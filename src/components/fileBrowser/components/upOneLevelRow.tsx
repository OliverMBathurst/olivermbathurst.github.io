import { FolderIcon } from '../../../icons'
import './fileBrowserRow.scss'

interface IUpOneLevelRowProps {
	onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const UpOneLevelRow = (props: IUpOneLevelRowProps) => {
	const { onRowDoubleClicked } = props
	return (
		<div
			className="file-browser__row"
			onDoubleClick={onRowDoubleClicked}
		>
			<div className="file-browser__row__icon no-select">
				<FolderIcon />
			</div>
			<div className="file-browser__row__name no-select">
				...
			</div>
		</div>)
}

export default UpOneLevelRow