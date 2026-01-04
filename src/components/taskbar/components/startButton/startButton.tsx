import { StartMenuIcon } from '../../../../icons'
import './startButton.scss'

export interface IStartButtonProps {
    onStartButtonClicked: () => void
}

const StartButton = (props: IStartButtonProps) => {
    const {
        onStartButtonClicked
    } = props

    return (
        <div
            className="start-button"
            onClick={onStartButtonClicked}
        >
            <StartMenuIcon />
        </div>)
}

export default StartButton