import { Leaf, Root } from ".";
import { BranchType } from "../../enums";
import { IBranch } from "../../interfaces/fs";

class Branch implements IBranch {
    name: string
    type: BranchType
    leaves: Leaf[] = []
    branches: Branch[] = []
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

    setParent(parent: Branch | Root) {
        this.parent = parent
    }
}

export default Branch