import { useContext, useState } from "react"
import { BRANCHING_CONTEXT_PARENT_PROPERTY, BRANCHING_CONTEXT_TYPE_PROPERTY } from "../constants"
import { FileSystemContext } from "../contexts"
import { SpecialBranch } from "../enums"
import { Branch, BranchingContext } from "../types/fs"

const useFileSystem = (context?: BranchingContext) => {
    const { root } = useContext(FileSystemContext)
    const [currentContext, setCurrentContext] = useState<BranchingContext>(context ?? root)

    const upOneLevel = () => {
        if (!(BRANCHING_CONTEXT_PARENT_PROPERTY in currentContext)) {
            return
        }

        if (currentContext.parent) {
            setCurrentContext(currentContext.parent)
        }
    }

    const enterBranch = (branchName: string) => {
        const foundBranch = currentContext.branches.find(x => x.name === branchName)
        if (foundBranch) {
            setCurrentContext(foundBranch)
        }
    }

    const searchForBranchByType = (branch: BranchingContext, branchType: SpecialBranch): Branch | null => {
        if ((BRANCHING_CONTEXT_TYPE_PROPERTY in branch) && branch.type === branchType) {
            return branch
        }

        for (let i = 0; i < branch.branches.length; i++) {
            const foundFolder = searchForBranchByType(branch.branches[i], branchType)
            if (foundFolder) {
                return foundFolder
            }
        }

        return null
    }

    return {
        upOneLevel,
        enterBranch,
        currentContext,
        searchForBranchByType
    }
}

export default useFileSystem