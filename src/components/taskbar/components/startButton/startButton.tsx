import {
	NO_SELECT_CLASS,
	TASKBAR_START_BUTTON_CLASS
} from "../../../../constants"
import { StartMenuIcon } from "../../../../icons"
import "./startButton.scss"

export interface IStartButtonProps {
	onStartButtonClicked: () => void
}

const StartButton = (props: IStartButtonProps) => {
	const { onStartButtonClicked } = props

	return (
		<div
			className={`${TASKBAR_START_BUTTON_CLASS} ${NO_SELECT_CLASS}`}
			onClick={onStartButtonClicked}
		>
			<StartMenuIcon />
		</div>
	)
}

export default StartButton
