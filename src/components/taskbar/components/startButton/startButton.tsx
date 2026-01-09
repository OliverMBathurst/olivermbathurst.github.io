import { NO_SELECT_CLASS } from "../../../../constants"
import { StartMenuIcon } from "../../../../icons"
import "./startButton.scss"

export interface IStartButtonProps {
	onStartButtonClicked: () => void
}

const StartButton = (props: IStartButtonProps) => {
	const { onStartButtonClicked } = props

	return (
		<div
			className={`start-button ${NO_SELECT_CLASS}`}
			onClick={onStartButtonClicked}
		>
			<StartMenuIcon />
		</div>
	)
}

export default StartButton
