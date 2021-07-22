import React, { memo } from 'react'
import './styles.scss'

const Wallpaper = () => {
    return (
        <div className="wallpaper">
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>
        </div>
    )
}

export default memo(Wallpaper)