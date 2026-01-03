import { useContext, useState } from "react"
import { BRANCHING_NODE_PARENT_PROPERTY, BRANCHING_NODE_TYPE_PROPERTY } from "../constants"
import { FileSystemContext } from "../contexts"
import { SpecialBranch } from "../enums"
import { Branch, BranchingNode } from "../types/fs"

const useFileSystem = (node?: BranchingNode) => {
    const { root } = useContext(FileSystemContext)
    const [currentNode, setCurrentNode] = useState<BranchingNode>(node ?? root)

    const upOneLevel = () => {
        if (!(BRANCHING_NODE_PARENT_PROPERTY in currentNode)) {
            return
        }

        if (currentNode.parent) {
            setCurrentNode(currentNode.parent)
        }
    }

    const enterBranch = (branchName: string) => {
        const foundBranch = currentNode.branches.find(x => x.name === branchName)
        if (foundBranch) {
            setCurrentNode(foundBranch)
        }
    }

    const searchForBranchByType = (branch: BranchingNode, branchType: SpecialBranch): Branch | null => {
        if ((BRANCHING_NODE_TYPE_PROPERTY in branch) && branch.type === branchType) {
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
        currentNode,
        searchForBranchByType
    }
}

export default useFileSystem