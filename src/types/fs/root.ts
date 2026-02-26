import { AbstractNamed, Branch, Leaf, Shortcut } from "."
import { IRoot } from "../../interfaces/fs"

class Root extends AbstractNamed implements IRoot {
	leaves: Leaf[] = []
	branches: Branch[] = []
	shortcuts: Shortcut[] = []

	constructor(name: string) {
		super(name, name)
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
