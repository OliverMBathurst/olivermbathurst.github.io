import { useCallback, useContext } from 'react'
import { WindowsContext } from '../../contexts'
import { IAddWindowProperties } from '../../interfaces/windows'
import { BranchingNode } from '../../types/fs'
import { DesktopItem } from '../desktop/components'

interface IFolderProps {
    node: BranchingNode
}

const Folder = (props: IFolderProps) => {
    const {
        node
    } = props

    const { addWindow } = useContext(WindowsContext)

    const onDoubleClick = useCallback(() => {
        const windowProperties: IAddWindowProperties = {
            context: node,
            selected: true
        }

        addWindow(windowProperties)
    }, [node, addWindow])

    return <DesktopItem node={node} onDoubleClick={onDoubleClick} />
}

export default Folder