import React, { memo } from 'react'

const MinimizeIcon = () => {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 30 30"
            preserveAspectRatio="xMidYMid meet"
        >
            <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
                fill="#FFFFFF" stroke="none">
                <path d="M50 160 l0 -110 110 0 110 0 0 110 0 110 -110 0 -110 0 0 -110z m200 0 l0 -90 -90 0 -90 0 0 90 0 90 90 0 90 0 0 -90z" />
                <path d="M90 110 c0 -6 30 -10 70 -10 40 0 70 4 70 10 0 6 -30 10 -70 10 -400 -70 -4 -70 -10z" />
            </g>
        </svg>)
}

export default memo(MinimizeIcon)