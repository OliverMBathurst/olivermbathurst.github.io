import { Leaf, Branch } from ".";
import { IRoot } from "../../interfaces/fs";

class Root implements IRoot {
    name: string
    leaves: Leaf[] = []
    branches: Branch[] = []

    constructor(name: string) {
        this.name = name
        
    }

    setLeaves(leaves: Leaf[]) {
        this.leaves = leaves
    }

    setBranches(branches: Branch[]) {
        this.branches = branches
    }
}

export default Root