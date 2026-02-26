import { FILETYPE_URL_SHORTCUT } from "../constants"
import { IUrlShortcutFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext } from "../types/fs"

class GitHub extends AbstractLeaf implements IUrlShortcutFile {
	url: string = "https://github.com/OliverMBathurst"

	constructor(parent: BranchingContext) {
		super("My GitHub", FILETYPE_URL_SHORTCUT, parent)
	}
}

export default GitHub
