import { BranchType } from "../enums"
import { CV, GitHub, LinkedIn } from "../files"
import { Branch, BranchingNode, Root } from "../types/fs"


export const initialiseFileSystem = (): BranchingNode => {
    const desktopBranch = new Branch(
        "Desktop",
        BranchType.Desktop
    )

    desktopBranch.setLeaves([
        new CV(desktopBranch),
        new LinkedIn(desktopBranch),
        new GitHub(desktopBranch),
    ])

    const contentsBranch = new Branch(
        "Contents",
        BranchType.None
    )

    const root = new Root(
        "Root"
    )

    root.setBranches([contentsBranch])
    contentsBranch.setBranches([desktopBranch])

    contentsBranch.setParent(root)
    desktopBranch.setParent(contentsBranch)

    return root
}