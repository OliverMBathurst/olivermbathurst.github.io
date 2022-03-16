import React, { memo } from 'react'
import { IIconProps } from '../../global/interfaces'

const FileIcon = (props: IIconProps) => {
    const { width = 48, height = 48 } = props

    return (
        <svg
            viewBox="0 0 48 48"
            width={`${width}px`}
            height={`${height}px`}>
            <path fill="#FFFFFF" d="M40 45L8 45 8 3 30 3 40 13z" />
            <path fill="#D3D3D3" d="M38.5 14L29 14 29 4.5z" />
            <path fill="#000000" d="M16 21H33V23H16zM16 25H29V27H16zM16 29H33V31H16zM16 33H29V35H16z" />
        </svg>)
}

export default memo(FileIcon)