import { useCallback, useContext } from 'react'
import { FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY, LEAF_EXTENSION_PROPERTY_NAME } from '../../constants'
import { WindowsContext } from '../../contexts'
import { IAddWindowProperties } from '../../interfaces/windows'
import { BranchingContext, Leaf } from '../../types/fs'
import { DesktopItem } from '../desktop/components'

interface IFileProps {
    executionContext: BranchingContext,
    context: Leaf
}

const File = (props: IFileProps) => {
    const {
        context
    } = props

    const { addWindow } = useContext(WindowsContext)

    const onDoubleClick = useCallback(() => {
        if (FILETYPE_URL_SHORTCUT_PROPERTY in context
            && LEAF_EXTENSION_PROPERTY_NAME in context
            && context.extension === FILETYPE_URL_SHORTCUT) {
            window.open(context.url, '_blank')
            return
        }

        const windowProperties: IAddWindowProperties = {
            context: context,
            selected: true
        }

        addWindow(windowProperties)
    }, [context, addWindow])

    return <DesktopItem context={context} onDoubleClick={onDoubleClick} />
}

export default File