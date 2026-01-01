import { Leaf, Root, Shortcut } from ".";
import { BranchType } from "../../enums";
import { IBranch } from "../../interfaces/fs";

class Branch implements IBranch {
    name: string
    type: BranchType
    leaves: Leaf[] = []
    branches: Branch[] = []
    shortcuts: Shortcut[] = []
    parent: Branch | Root | null = null

    constructor(
        name: string,
        type: BranchType
    ) {
        this.name = name
        this.type = type
    }

    setLeaves(leaves: Leaf[]) {
        this.leaves = leaves
    }

    setBranches(branches: Branch[]) {
        this.branches = branches
    }

    setShortcuts(shortcuts: Shortcut[]) {
        this.shortcuts = shortcuts
    }

    setParent(parent: Branch | Root) {
        this.parent = parent
    }
}

export default Branch