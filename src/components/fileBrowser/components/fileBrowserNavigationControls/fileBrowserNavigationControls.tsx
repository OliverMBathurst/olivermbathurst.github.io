import {
    CLASSNAMES
} from "../../../../constants"
import { LeftArrowIcon, RightArrowIcon, UpArrowIcon } from "../../../../icons"
import "./fileBrowserNavigationControls.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserNavigationControlsProps {
	backwardsPossible: boolean
	forwardsPossible: boolean
	onBackwards: () => void
	onForwards: () => void
}

const FileBrowserNavigationControls = (
	props: IFileBrowserNavigationControlsProps
) => {
	const { onBackwards, onForwards, backwardsPossible, forwardsPossible } = props

	const onForwardsClicked = () => {
		if (forwardsPossible) {
			onForwards()
		}
	}

	const onBackwardsClicked = () => {
		if (backwardsPossible) {
			onBackwards()
		}
	}

	return (
		<div className="file-browser-navigation-controls">
			<div
				className={`file-browser-navigation-controls__icon${!backwardsPossible ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onBackwardsClicked}
			>
				<LeftArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${!forwardsPossible ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onForwardsClicked}
			>
				<RightArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${!backwardsPossible ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onBackwardsClicked}
			>
				<UpArrowIcon />
			</div>
		</div>
	)
}

export default FileBrowserNavigationControls
