import { AbstractNamed, BranchingContext, Leaf, Shortcut } from "."
import { SpecialBranch } from "../../enums"
import { IBranch } from "../../interfaces/fs"

class Branch extends AbstractNamed implements IBranch {
	type: SpecialBranch
	leaves: Leaf[] = []
	branches: Branch[] = []
	shortcuts: Shortcut[] = []
	parent: BranchingContext | null = null

	constructor(name: string, type: SpecialBranch) {
		super(name, name)
		this.type = type
	}

	toContextUniqueKey: () => string = () => `${this.name}-${this.type}`

	setLeaves(leaves: Leaf[]) {
		this.leaves = leaves
	}

	setBranches(branches: Branch[]) {
		this.branches = branches
	}

	setShortcuts(shortcuts: Shortcut[]) {
		this.shortcuts = shortcuts
	}

	setParent(parent: BranchingContext) {
		this.parent = parent
	}
}

export default Branch
