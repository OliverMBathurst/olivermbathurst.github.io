import { MouseEvent } from "react"
import { useDisplayName, useIcon } from "../../../../hooks"
import { Node } from "../../../../types/fs"
import './desktopItem.scss'

interface IDesktopItemProps {
    node: Node
    onDoubleClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
}

const DesktopItem = (props: IDesktopItemProps) => {
    const { node, onDoubleClick } = props

    const Icon = useIcon(node)
    const DisplayName = useDisplayName(node)


    return (
        <div className="desktop-item" onDoubleClick={onDoubleClick}>
            {Icon}
            <span className="desktop-item__name no-select">
                {DisplayName}
            </span>
        </div>)
}

export default DesktopItem