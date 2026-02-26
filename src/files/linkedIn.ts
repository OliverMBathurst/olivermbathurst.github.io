import { FILETYPE_URL_SHORTCUT } from "../constants"
import { IUrlShortcutFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext } from "../types/fs"

class LinkedIn extends AbstractLeaf implements IUrlShortcutFile {
	url: string = "https://www.linkedin.com/in/oliverbathurst/"

	constructor(parent: BranchingContext) {
		super("My LinkedIn", FILETYPE_URL_SHORTCUT, parent)
	}
}

export default LinkedIn
