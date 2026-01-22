import { BranchingContext } from "."
import { ILeaf } from "../../interfaces/fs"

abstract class AbstractLeaf implements ILeaf {
	name: string
	extension: string
	parent: BranchingContext
	_icon: string | null = null

	constructor(name: string, extension: string, parent: BranchingContext) {
		this.name = name
		this.extension = extension
		this.parent = parent
	}

	get icon() {
		return this._icon
	}

	set icon(icon: string | null) {
		this._icon = icon
	}

	get fullName() {
		return `${this.name}${this.extension}`
	}

	toContextUniqueKey: () => string = () => `${this.name}-${this.extension}`
}

export default AbstractLeaf
