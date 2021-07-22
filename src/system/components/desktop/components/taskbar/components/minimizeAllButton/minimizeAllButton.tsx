import React, { memo } from 'react'
import './styles.scss'

interface IMinimizeAllButtonProps {
    onMinimizeAllClicked: () => void
}

const MinimizeAllButton = (props: IMinimizeAllButtonProps) => {
    const { onMinimizeAllClicked } = props


    return (<div className="minimize-all" onClick={onMinimizeAllClicked}/>)
}
export default memo(MinimizeAllButton)