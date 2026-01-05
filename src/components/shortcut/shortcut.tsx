import { useCallback, useContext } from "react"
import { WindowsContext } from "../../contexts"
import { IAddWindowProperties } from "../../interfaces/windows"
import { Shortcut as ShortcutType } from "../../types/fs"
import { DesktopItem } from "../desktop/components"

interface IShortcutProps {
	shortcut: ShortcutType
}

const Shortcut = (props: IShortcutProps) => {
	const { shortcut } = props

	const { addWindow } = useContext(WindowsContext)

	const onDoubleClick = useCallback(() => {
		const windowProperties: IAddWindowProperties = {
			context: shortcut.context,
			selected: true,
		}

		addWindow(windowProperties)
	}, [shortcut, addWindow])

	return <DesktopItem context={shortcut} onDoubleClick={onDoubleClick} />
}

export default Shortcut
