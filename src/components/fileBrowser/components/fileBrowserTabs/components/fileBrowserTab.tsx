import { CLASSNAMES } from "../../../../../constants"
import { useDisplayName, useIcon } from "../../../../../hooks"
import { CloseIcon } from "../../../../../icons"
import { BranchingContext } from "../../../../../types/fs"
import "./fileBrowserTab.scss"
const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserTabProps {
	context: BranchingContext
	selected: boolean
	onTabSelected: () => void
	onTabClosed: () => void
}

const FileBrowserTab = (props: IFileBrowserTabProps) => {
	const { context, selected, onTabClosed, onTabSelected } = props

	const Icon = useIcon(context, true, { className: "file-browser-tab__icon-container__icon" })
	const DisplayName = useDisplayName(context)

	const onMouseDownInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (e.button === 1 || e.buttons === 4) {
			onTabClosed()
		} else if ((e.button === 0 || e.buttons === 1) && !selected) {
			onTabSelected()
		}
	}

	return (
		<div
			className={`file-browser-tab${selected ? "--selected" : ""}`}
			onMouseDown={onMouseDownInternal}
		>
			<div
				className={`file-browser-tab__icon-container ${NO_SELECT_CLASS}`}
				onMouseDown={(e) => e.stopPropagation()}
			>
				{Icon}
			</div>
			<span className={`file-browser-tab__title ${NO_SELECT_CLASS}`}>
				{DisplayName}
			</span>
			<div className={`file-browser-tab__close-button-container ${NO_SELECT_CLASS}`}>
				<CloseIcon
					className={NO_SELECT_CLASS}
					onClick={onTabClosed}
				/>
			</div>
        </div>)
}

export default FileBrowserTab