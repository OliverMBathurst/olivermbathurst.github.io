import { useCallback, useContext } from 'react'
import { WindowsContext } from '../../contexts'
import { resolveNodeSelection } from '../../helpers'
import { IAddWindowProperties } from '../../interfaces/windows'
import { Node } from '../../types/fs'
import { DesktopItem } from '../desktop/components'

interface IShortcutProps {
    node: Node
}

const Shortcut = (props: IShortcutProps) => {
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

export default Shortcut