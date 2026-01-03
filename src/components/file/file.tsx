import { useCallback, useContext } from 'react'
import { WindowsContext } from '../../contexts'
import { resolveNodeSelection } from '../../helpers'
import { IAddWindowProperties } from '../../interfaces/windows'
import { BranchingNode, Leaf } from '../../types/fs'
import { DesktopItem } from '../desktop/components'

interface IFileProps {
    executionContext: BranchingNode,
    node: Leaf
}

const File = (props: IFileProps) => {
    const {
        node
    } = props

    const { addWindow } = useContext(WindowsContext)

    const onDoubleClick = useCallback(() => {
        const resolvedNodeSelection = resolveNodeSelection(node)

        if (resolvedNodeSelection.alreadyResolved) {
            return
        }

        if (!resolvedNodeSelection.resolvedNode) {
            throw new Error("Failed to resolve Node")
        }

        const windowProperties: IAddWindowProperties = {
            context: resolvedNodeSelection.resolvedNode,
            selected: true
        }

        addWindow(windowProperties)
    }, [node, addWindow])

    return <DesktopItem node={node} onDoubleClick={onDoubleClick} />
}

export default File