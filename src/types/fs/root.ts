import { Branch, Leaf, Shortcut } from "."
import { IRoot } from "../../interfaces/fs"

class Root implements IRoot {
	name: string
	leaves: Leaf[] = []
	branches: Branch[] = []
	shortcuts: Shortcut[] = []

	constructor(name: string) {
		this.name = name
	}

	toContextUniqueKey: () => string = () => this.name

	setLeaves(leaves: Leaf[]) {
		this.leaves = leaves
	}

	setBranches(branches: Branch[]) {
		this.branches = branches
	}

	setShortcuts(shortcuts: Shortcut[]) {
		this.shortcuts = shortcuts
	}
}

export default Root
