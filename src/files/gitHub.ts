import { FILETYPE_URL_SHORTCUT } from "../constants"
import { IUrlShortcutFile } from "../interfaces/fs"
import { AbstractLeaf, Branch, Root } from "../types/fs"

class GitHub extends AbstractLeaf implements IUrlShortcutFile {
    url: string = "https://github.com/OliverMBathurst"

    constructor(parent: Branch | Root) {
        super("My GitHub", FILETYPE_URL_SHORTCUT, parent)
    }
}

export default GitHub