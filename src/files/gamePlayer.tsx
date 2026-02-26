import { JSX } from "react"
import { Game } from "../components/game"
import { FILETYPE_EXECUTABLE } from "../constants"
import { IApplicationFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

const icon = "/src/icons/game.png"

class GamePlayer extends AbstractLeaf implements IApplicationFile {
	constructor(parent: BranchingContext) {
		super("Game Player", FILETYPE_EXECUTABLE, parent)
		this.icon = icon
	}

	handle = (windowId: string, context: Context, setWindowTopBar: (component: JSX.Element) => void) => (
		<Game windowId={windowId} context={context} setWindowTopBar={setWindowTopBar} />
	)
}

export default GamePlayer
