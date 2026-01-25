import { FILETYPE_EXECUTABLE } from "../constants"
import { IBranchFile } from "../interfaces/fs"
import { IAddWindowProperties } from "../interfaces/windows"
import { AbstractLeaf, BranchingContext } from "../types/fs"

const imagePath = "/src/icons/folder.png"

class FileBrowser extends AbstractLeaf implements IBranchFile {
	constructor(parent: BranchingContext) {
		super("File Browser", FILETYPE_EXECUTABLE, parent)
		this.icon = imagePath
	}

	getBranchingContext = (context: BranchingContext) => {
		const properties: IAddWindowProperties = {
			context: context,
			openNewInstance: true
		}

		return properties
	}
}

export default FileBrowser
