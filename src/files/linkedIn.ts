import { FILETYPE_URL_SHORTCUT } from "../constants"
import { IUrlShortcutFile } from "../interfaces/fs"
import { AbstractLeaf, Branch, Root } from "../types/fs"

class LinkedIn extends AbstractLeaf implements IUrlShortcutFile {
	url: string = "https://www.linkedin.com/in/oliverbathurst/"

	constructor(parent: Branch | Root) {
		super("My LinkedIn", FILETYPE_URL_SHORTCUT, parent)
	}
}

export default LinkedIn
