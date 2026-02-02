import { FILETYPE_TEXT } from "../constants";
import { ITextFile } from "../interfaces/fs";
import { AbstractLeaf, BranchingContext } from "../types/fs";

class Credits extends AbstractLeaf implements ITextFile {
	constructor(parent: BranchingContext) {
		super("Credits", FILETYPE_TEXT, parent)
    }

    text: string = "Credit to:\n\tIcons8 for various icons.\n\tMicrosoft for Monaco Editor."
}

export default Credits