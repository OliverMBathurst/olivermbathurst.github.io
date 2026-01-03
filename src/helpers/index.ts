import { BRANCHING_NODE_PARENT_PROPERTY, FILETYPE_RENDERABLE_PROPERTY, FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY, LEAF_EXTENSION_PROPERTY_NAME, SHORTCUT_DETERMINER } from "../constants"
import { NodeType, SpecialBranch } from "../enums"
import { CV, GitHub, LinkedIn } from "../files"
import { Branch, BranchingNode, Node, Root, Shortcut } from "../types/fs"


export const initialiseFileSystem = (): BranchingNode => {
    const desktopBranch = new Branch(
        "Desktop",
        SpecialBranch.Desktop
    )

    const root = new Root(
        "Root"
    )

    desktopBranch.setLeaves([
        new CV(desktopBranch),
        new LinkedIn(desktopBranch),
        new GitHub(desktopBranch)
    ])

    const contentsBranch = new Branch(
        "Contents",
        SpecialBranch.None
    )

    root.setBranches([contentsBranch])
    contentsBranch.setBranches([desktopBranch])

    contentsBranch.setParent(root)
    desktopBranch.setParent(contentsBranch)
    desktopBranch.setShortcuts([new Shortcut(root, "Root")])

    return root
}


export const resolveNodeSelection = (node: Node): { alreadyResolved: boolean, nodeType: NodeType, resolvedNode?: Node } => {
    if (FILETYPE_URL_SHORTCUT_PROPERTY in node
        && LEAF_EXTENSION_PROPERTY_NAME in node
        && node.extension === FILETYPE_URL_SHORTCUT) {
        window.open(node.url, '_blank')

        return { alreadyResolved: true, nodeType: NodeType.Url }
    } else if (SHORTCUT_DETERMINER in node) {
        let resolvedContext: Node = node

        while (SHORTCUT_DETERMINER in resolvedContext) {
            resolvedContext = resolvedContext.node
        }

        return { alreadyResolved: false, nodeType: NodeType.Shortcut, resolvedNode: resolvedContext }
    } else if (FILETYPE_RENDERABLE_PROPERTY in node) {
        return { alreadyResolved: false, nodeType: NodeType.Renderable, resolvedNode: node }
    } else if (BRANCHING_NODE_PARENT_PROPERTY in node) {
        return { alreadyResolved: false, nodeType: NodeType.Branch, resolvedNode: node }
    } else {
        return { alreadyResolved: false, nodeType: NodeType.Root, resolvedNode: node }
    }
}