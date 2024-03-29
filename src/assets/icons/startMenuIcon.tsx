import React, { memo } from 'react'


const StartMenuIcon = () => {
    return (
        <svg
            id="start-menu-icon"
            fill="#000000"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
        >
            <path d="M 0 2 L 0 4 L 24 4 L 24 2 Z M 0 11 L 0 13 L 24 13 L 24 11 Z M 0 20 L 0 22 L 24 22 L 24 20 Z" />
        </svg>)
}

export default memo(StartMenuIcon)