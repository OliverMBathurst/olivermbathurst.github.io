import { useCallback, useContext } from "react"
import { WindowsContext } from "../../contexts"
import { IAddWindowProperties } from "../../interfaces/windows"
import { BranchingContext } from "../../types/fs"
import { DesktopItem } from "../desktop/components"

interface IFolderProps {
	context: BranchingContext
}

const Folder = (props: IFolderProps) => {
	const { context } = props

	const { addWindow } = useContext(WindowsContext)

	const onDoubleClick = useCallback(() => {
		const windowProperties: IAddWindowProperties = {
			context: context,
			selected: true
		}

		addWindow(windowProperties)
	}, [context, addWindow])

	return <DesktopItem context={context} onDoubleClick={onDoubleClick} />
}

export default Folder
