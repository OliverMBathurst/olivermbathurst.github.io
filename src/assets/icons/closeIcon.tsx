import React, { memo } from 'react'

const CloseIcon = () => {
    //Close Button icon by https://icons8.com
    return (
        <svg
            fill="#FFFFFF"
            viewBox="0 0 30 30"
            width="20px"
            height="20px"
        >
            <path d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z" />
        </svg>)
}

export default memo(CloseIcon)