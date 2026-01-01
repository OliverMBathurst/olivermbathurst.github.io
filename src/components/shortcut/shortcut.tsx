import { useCallback, useContext } from 'react'
import { FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY, LEAF_EXTENSION_PROPERTY_NAME } from '../../constants'
import { WindowsContext } from '../../contexts'
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
        const windowProperties: IAddWindowProperties = {
            context: node,
            selected: true
        }

        if (FILETYPE_URL_SHORTCUT_PROPERTY in node
            && LEAF_EXTENSION_PROPERTY_NAME in node
            && node.extension === FILETYPE_URL_SHORTCUT) {
                window.open(node.url, '_blank')
        } else {
            addWindow(windowProperties)
        }
    }, [node, addWindow])

    return <DesktopItem node={node} onDoubleClick={onDoubleClick} />
}

export default Shortcut