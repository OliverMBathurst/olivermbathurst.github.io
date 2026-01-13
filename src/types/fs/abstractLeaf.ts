import { ILeaf } from "../../interfaces/fs"
import { Branch, Root } from "."

abstract class AbstractLeaf implements ILeaf {
	name: string
	extension: string
	parent: Branch | Root

	constructor(name: string, extension: string, parent: Branch | Root) {
		this.name = name
		this.extension = extension
		this.parent = parent
	}

	get fullName() {
		return `${this.name}.${this.extension}`
	}

	toContextUniqueKey: () => string = () => `${this.name}-${this.extension}`
}

export default AbstractLeaf
