import { FILETYPE_PDF } from "../constants"
import { IDataFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext } from "../types/fs"

class CV extends AbstractLeaf implements IDataFile {
	constructor(parent: BranchingContext) {
		super("My CV", FILETYPE_PDF, parent)
	}

	data = "/documents/Oliver Bathurst CV.pdf"
}

export default CV
