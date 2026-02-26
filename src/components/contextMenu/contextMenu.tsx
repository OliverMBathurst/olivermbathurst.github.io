import { JSX, useEffect, useRef } from "react"
import { CLASSNAMES } from "../../constants"
import { useClickOutside } from "../../hooks"
import "./contextMenu.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

const DEFAULT_PADDING_TOP = 16

export interface IContextMenuItem {
	value: string
	onClick: () => void
	selected?: boolean
	icon?: JSX.Element | null
}

interface IContextMenuProps<T> {
	positionRef: React.RefObject<T | null>
	items: IContextMenuItem[]
	onClickOutside?: () => void
	onMouseOver?: () => void
	paddingTop?: number
}

const ContextMenu = <T extends HTMLElement>(props: IContextMenuProps<T>) => {
	const { positionRef, items, onClickOutside, onMouseOver, paddingTop } = props
	const contextMenuRef = useRef<HTMLDivElement | null>(null)

	useClickOutside(contextMenuRef, () => onClickOutside && onClickOutside())

	useEffect(() => {
		if (!contextMenuRef.current || !positionRef.current) {
			return
		}

		const positionRect = positionRef.current.getBoundingClientRect()
		const contextRect = contextMenuRef.current.getBoundingClientRect()

		const middle = positionRect.left + (positionRect.width / 2)
		const bottom = window.innerHeight - positionRect.y + (paddingTop ?? DEFAULT_PADDING_TOP)

		contextMenuRef.current.style.left = `${middle - (contextRect.width / 2)}px`
		contextMenuRef.current.style.bottom = `${bottom}px`
	}, [paddingTop])

    return (
		<div className="context-menu" ref={contextMenuRef} onMouseOver={onMouseOver}>
			{items.map((item, i) => {
				const { icon, value, selected, onClick } = item
				return (
					<div
						key={`${value}-${i}`}
						className={`context-menu__item${selected ? "--selected" : ""} ${NO_SELECT_CLASS}`}
						onClick={onClick}
					>
						{icon}
						<span className="context-menu__item__text">{value}</span>
					</div>
				)
			})}
		</div>
    )
}

export default ContextMenu