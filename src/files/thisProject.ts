import { FILETYPE_URL_SHORTCUT } from "../constants"
import { IUrlShortcutFile } from "../interfaces/fs"
import { AbstractLeaf, Branch, Root } from "../types/fs"

class ThisProject extends AbstractLeaf implements IUrlShortcutFile {
	url: string = "https://github.com/OliverMBathurst/olivermbathurst.github.io"

	constructor(parent: Branch | Root) {
		super("This Project", FILETYPE_URL_SHORTCUT, parent)
	}
}

export default ThisProject
