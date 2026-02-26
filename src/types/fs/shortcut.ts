import { AbstractLeaf, BranchingContext, Context } from "."
import { FILETYPE_SHORTCUT } from "../../constants"
import { IShortcut } from "../../interfaces/fs"

class Shortcut extends AbstractLeaf implements IShortcut {
	context: Context

	constructor(parent: BranchingContext, context: Context, name: string) {
		super(`${name} (Shortcut)`, FILETYPE_SHORTCUT, parent)
		this.context = context
	}
}

export default Shortcut
