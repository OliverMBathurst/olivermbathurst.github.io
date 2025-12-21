import React, { useCallback, useContext } from 'react'
import { FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY } from '../../constants'
import { WindowsContext } from '../../contexts'
import { useIcon } from '../../hooks'
import { FileInfo } from '../../interfaces/file'
import { IAddWindowProperties } from '../../interfaces/windows'
import './file.scss'

interface IFileProps {
    fileInfo: FileInfo
}

const File = (props: IFileProps) => {
    const {
        fileInfo
    } = props

    const { name, extension } = fileInfo
    const { addWindow } = useContext(WindowsContext)
    const Icon = useIcon(extension)

    const onDoubleClick = useCallback(() => {
        const windowProperties: IAddWindowProperties = {
            fileInfo: fileInfo,
            selected: true
        }

        if (fileInfo.extension === FILETYPE_URL_SHORTCUT
            && FILETYPE_URL_SHORTCUT_PROPERTY in fileInfo) {
            window.open(fileInfo.url, '_blank')
        } else {
            addWindow(windowProperties)
        }
    }, [fileInfo, addWindow])

    return (
        <div className="file" onDoubleClick={onDoubleClick}>
            {Icon}
            <span className="file__name no-select">
                {`${name}${extension}`}
            </span>
        </div>)
}

export default File