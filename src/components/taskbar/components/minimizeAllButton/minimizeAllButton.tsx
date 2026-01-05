import React from "react"
import "./minimizeAllButton.scss"

interface IMinimizeAllButtonProps {
	onMinimizeAllClicked: () => void
}

const MinimizeAllButton = (props: IMinimizeAllButtonProps) => {
	const { onMinimizeAllClicked } = props

	return <div className="minimize-all" onClick={onMinimizeAllClicked} />
}
export default MinimizeAllButton
