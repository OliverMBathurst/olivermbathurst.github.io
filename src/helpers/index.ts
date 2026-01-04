import { BRANCHING_NODE_PARENT_PROPERTY, FILETYPE_RENDERABLE_PROPERTY, FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY, LEAF_EXTENSION_PROPERTY_NAME, SHORTCUT_DETERMINER } from "../constants"
import { NodeType, SpecialBranch, WindowExpandDirection } from "../enums"
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

export const getCursor = (direction: WindowExpandDirection, defaultCursor: string): string => {
    switch (direction) {
        case WindowExpandDirection.BottomLeft:
        case WindowExpandDirection.TopRight:
            return 'nesw-resize'
        case WindowExpandDirection.BottomRight:
        case WindowExpandDirection.TopLeft:
            return 'nwse-resize'
        case WindowExpandDirection.Bottom:
        case WindowExpandDirection.Top:
            return 'ns-resize'
        case WindowExpandDirection.Left:
        case WindowExpandDirection.Right:
            return 'ew-resize'
        default:
            return defaultCursor
    }
}

export const getExpandDirectionByRefAndPosition: (ref: React.RefObject<HTMLDivElement | null>, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => WindowExpandDirection = (ref: React.RefObject<HTMLDivElement | null>, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let expandDirection: WindowExpandDirection = WindowExpandDirection.None
    if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect()
        if (rect) {
            const getWithinBounds = (a: number, b: number): boolean => Math.abs(Math.round(a) - Math.round(b)) <= 1

            if (getWithinBounds(e.clientY, rect.top)) {
                if (getWithinBounds(e.clientX, rect.left)) {
                    expandDirection = WindowExpandDirection.TopLeft
                } else if (getWithinBounds(e.clientX, rect.right)) {
                    expandDirection = WindowExpandDirection.TopRight
                } else {
                    expandDirection = WindowExpandDirection.Top
                }
            } else if (getWithinBounds(e.clientY, rect.bottom)) {
                if (getWithinBounds(e.clientX, rect.left)) {
                    expandDirection = WindowExpandDirection.BottomLeft
                } else if (getWithinBounds(e.clientX, rect.right)) {
                    expandDirection = WindowExpandDirection.BottomRight
                } else {
                    expandDirection = WindowExpandDirection.Bottom
                }
            } else if (getWithinBounds(e.clientX, rect.left) && e.clientY > rect.top && e.clientY < rect.bottom) {
                expandDirection = WindowExpandDirection.Left
            } else if (getWithinBounds(e.clientX, rect.right) && e.clientY > rect.top && e.clientY < rect.bottom) {
                expandDirection = WindowExpandDirection.Right
            }
        }
    }

    return expandDirection
}