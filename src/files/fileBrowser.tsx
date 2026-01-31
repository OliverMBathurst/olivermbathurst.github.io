import { FILETYPE_EXECUTABLE } from "../constants"
import { IApplicationFile } from "../interfaces/fs"
import { FileBrowser as FileBrowserComponent } from "../components/fileBrowser"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

const imagePath = "/src/icons/folder.png"

class FileBrowser extends AbstractLeaf implements IApplicationFile {
	constructor(parent: BranchingContext) {
		super("File Browser", FILETYPE_EXECUTABLE, parent)
		this.icon = imagePath
	}

	handle = (windowId: string, context: Context) => (
		<FileBrowserComponent windowId={windowId} context={context} />
	)
}

export default FileBrowser
