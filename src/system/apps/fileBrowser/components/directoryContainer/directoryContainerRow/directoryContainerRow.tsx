import React from 'react'
import { OSItemType } from '../../../../../../global/enums'
import { getDisplayIcon, getDisplayName } from '../../../../../../global/utils/helpers/displayHelper'
import './styles.scss'

interface IDirectoryContainerRowProps {
    name: string
    extension?: string
    displayName?: string
    type: OSItemType
    onDoubleClick: () => void
}

const DirectoryContainerRow = (rowProps: IDirectoryContainerRowProps): JSX.Element => {
    const {
        name,
        extension,
        displayName,
        type,
        onDoubleClick
    } = rowProps

    return (<div onDoubleClick={onDoubleClick} className="row-container-row">
        <div className="row-icon-container">{getDisplayIcon(type, 24, 24)}</div>
        <div className="row-name-container">{getDisplayName(type, displayName ? displayName : name, extension)}</div>
    </div>)
}

export default DirectoryContainerRow