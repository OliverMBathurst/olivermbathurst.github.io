import React, { memo } from 'react'
import { IStartMenuItem } from '../../../../../global/interfaces'
import './styles.scss'

interface IBottomBarProps {
    items: IStartMenuItem[]
}

const BottomBar = (props: IBottomBarProps) => {
    const { items } = props

    return (
        <div className="bottom-bar">
            {items.map((x, i) => {
                return (
                    <div key={`${x.name}-${i}`} className="bottom-bar-item" onClick={x.onClick}>
                        {x.icon}
                    </div>)
            })}
        </div>)
}

export default memo(BottomBar)