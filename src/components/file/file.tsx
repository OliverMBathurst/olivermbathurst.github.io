import { useCallback, useContext } from 'react'
import { FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY } from '../../constants'
import { WindowsContext } from '../../contexts'
import { useIcon } from '../../hooks'
import { IAddWindowProperties } from '../../interfaces/windows'
import { BranchingNode, Leaf } from '../../types/fs'
import './file.scss'

interface IFileProps {
    executionContext: BranchingNode,
    leaf: Leaf
}

const File = (props: IFileProps) => {
    const {
        leaf
    } = props

    const { name, extension } = leaf
    const { addWindow } = useContext(WindowsContext)
    const Icon = useIcon(leaf)

    const onDoubleClick = useCallback(() => {
        const windowProperties: IAddWindowProperties = {
            context: leaf,
            selected: true
        }

        if (leaf.extension === FILETYPE_URL_SHORTCUT
            && FILETYPE_URL_SHORTCUT_PROPERTY in leaf) {
            window.open(leaf.url, '_blank')
        } else {
            addWindow(windowProperties)
        }
    }, [leaf, addWindow])

    return (
        <div className="file" onDoubleClick={onDoubleClick}>
            {Icon}
            <span className="file__name no-select">
                {`${name}${extension}`}
            </span>
        </div>)
}

export default File