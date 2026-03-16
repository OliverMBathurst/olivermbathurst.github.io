import { JSX } from "react"
import { FileBrowser as FileBrowserComponent } from "../components/fileBrowser"
import { FILETYPE_EXECUTABLE } from "../constants"
import folder from "../icons/folder.png"
import { IApplicationFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

class FileBrowser extends AbstractLeaf implements IApplicationFile {
	constructor(parent: BranchingContext) {
		super("File Browser", FILETYPE_EXECUTABLE, parent)
		this.icon = folder
	}

	handle = (windowId: string, context: Context, setWindowTopBar: (component: JSX.Element) => void, _arguments?: string) => (
		<FileBrowserComponent windowId={windowId} context={context} setWindowTopBar={setWindowTopBar} arguments={_arguments} />
	)
}

export default FileBrowser
