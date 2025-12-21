import React from 'react'
import { FileSystemService } from '../../../services'
import { File } from '../../file'
import './desktopGrid.scss'

const fileSystemService = new FileSystemService()

const DesktopGrid = () => {
    return (
        <div className="desktop__grid">
            {fileSystemService.fileInfos.map((fi, i) => <File key={i} fileInfo={fi} />)}
        </div>)
}

export default DesktopGrid