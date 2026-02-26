import { useEffect, useRef } from "react"
import { CLASSNAMES } from "../../constants"
import { useClickOutside } from "../../hooks"
import "./select.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface ISelectOptionValue {
    value: string
    tooltip?: string
}

interface ISelectProps<T, E> {
    positionRef: React.RefObject<E | null>
    items: T[]
    selected?: T | null
    onItemSelected: (item: T) => void
    onClickOutside?: () => void
}

const SELECT_DROPDOWN_PADDING_PX = 5

const Select = <T extends ISelectOptionValue, E extends HTMLElement>(props: ISelectProps<T, E>) => {
    const {
        items,
        selected,
        positionRef,
        onItemSelected,
        onClickOutside
    } = props

    const selectRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(selectRef, () => {
        if (onClickOutside) {
            onClickOutside()
        }
    })

    useEffect(() => {
        if (selectRef.current && positionRef.current) {
            const positionRectangle = positionRef.current.getBoundingClientRect()

            const offsetLeft = positionRef.current.offsetLeft
            const offsetTop = positionRef.current.offsetTop + positionRectangle.height + SELECT_DROPDOWN_PADDING_PX

            selectRef.current.style.left = `${offsetLeft}px`
            selectRef.current.style.top = `${offsetTop}px`
        }
    }, [])

    return (
        <div className="select" ref={selectRef}>
            {items.map((item, i) => {
                const _selected = selected && item === selected
                const displayValue = item.value
                const tooltip = item.tooltip

                return (
                    <div
                        key={`${i}-${displayValue}`}
                        className={`select__option${_selected ? "--selected" : ""} ${NO_SELECT_CLASS}`}
                        title={tooltip}
                        onClick={() => onItemSelected(item)}
                    >
                        {displayValue}
                    </div>
                )
            })}
        </div>)
}

export default Select