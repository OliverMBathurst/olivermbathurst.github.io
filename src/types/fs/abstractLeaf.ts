import { BranchingContext } from "."
import { ILeaf } from "../../interfaces/fs"

abstract class AbstractLeaf implements ILeaf {
	name: string
	extension: string
	parent: BranchingContext
	_windowTopBarCustomIconDisplay: boolean = true
	_icon: string | null = null

	constructor(name: string, extension: string, parent: BranchingContext) {
		this.name = name
		this.extension = extension
		this.parent = parent
	}

	get windowTopBarCustomIconDisplay() {
		return this._windowTopBarCustomIconDisplay
	}

	set windowTopBarCustomIconDisplay(windowTopBarCustomIconDisplay: boolean) {
		this._windowTopBarCustomIconDisplay = windowTopBarCustomIconDisplay
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
