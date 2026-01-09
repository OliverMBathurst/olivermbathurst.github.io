import { useContext, useState } from "react"
import { WindowsContext } from "../../contexts"
import { Desktop } from "../desktop"
import { ScreenSaverTwo } from "../screenSaverTwo"
import { StartMenu } from "../startMenu"
import { Taskbar } from "../taskbar"
import { Window } from "../window"
import "./screen.scss"

const Screen = () => {
	const { windowProperties } = useContext(WindowsContext)

	const [startMenuShow, setStartMenuShow] = useState<boolean>(false)

	return (
		<div className="screen">
			<div className="screen__render-area">
				<ScreenSaverTwo />
				<Desktop />
				{windowProperties.map((p) => (
					<Window key={p.id} properties={p} />
				))}
				{startMenuShow && <StartMenu />}
			</div>
			<Taskbar onStartButtonClicked={() => setStartMenuShow((s) => !s)} />
		</div>
	)
}

export default Screen
