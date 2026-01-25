import { useContext } from "react"
import {
	BRANCHING_CONTEXT_PARENT_PROPERTY,
	NO_SELECT_CLASS
} from "../../../../constants"
import { FileBrowserContext } from "../../../../contexts"
import { LeftArrowIcon, RightArrowIcon, UpArrowIcon } from "../../../../icons"
import { BranchingContext } from "../../../../types/fs"
import "./fileBrowserNavigationControls.scss"

interface IFileBrowserNavigationControlsProps {
	context: BranchingContext
	windowId: string
	onBacktrack: () => void
	onForwards: () => void
	onUpOneLevel: () => void
}

const FileBrowserNavigationControls = (
	props: IFileBrowserNavigationControlsProps
) => {
	const { context, windowId, onBacktrack, onForwards, onUpOneLevel } = props

	const { historyPointers, navigationHistory } = useContext(FileBrowserContext)

	const nav = navigationHistory[windowId] ?? []
	const point = historyPointers[windowId] ?? 0

	const upDisabled = !(BRANCHING_CONTEXT_PARENT_PROPERTY in context)
	const forwardsDisabled = point === nav.length - 1 || nav.length === 0
	const backwardsDisabled = point === 0

	const onUpClicked = () => {
		if (!upDisabled && context.parent) {
			onUpOneLevel()
		}
	}

	const onForwardsClicked = () => {
		if (!forwardsDisabled) {
			onForwards()
		}
	}

	const onBackwardsClicked = () => {
		if (!backwardsDisabled) {
			onBacktrack()
		}
	}

	return (
		<div className="file-browser-navigation-controls">
			<div
				className={`file-browser-navigation-controls__icon${backwardsDisabled ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onBackwardsClicked}
			>
				<LeftArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${forwardsDisabled ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onForwardsClicked}
			>
				<RightArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${upDisabled ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onUpClicked}
			>
				<UpArrowIcon />
			</div>
		</div>
	)
}

export default FileBrowserNavigationControls
