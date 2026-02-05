import { useCallback, useContext } from "react"
import { RegistryContext, WindowsContext } from "../../contexts"
import { WindowPropertiesService } from "../../services"
import { Shortcut as ShortcutType } from "../../types/fs"
import { DesktopItem } from "../desktop/components"

interface IShortcutProps {
	shortcut: ShortcutType
}

const windowPropertiesService = new WindowPropertiesService();

const Shortcut = (props: IShortcutProps) => {
	const { shortcut } = props

	const { addWindow } = useContext(WindowsContext)
	const registry = useContext(RegistryContext)

	const onDoubleClick = useCallback(() => {
		const windowProperties = windowPropertiesService.getProperties(shortcut, registry)
		if (!windowProperties) {
			return
		}

		addWindow(windowProperties)
	}, [shortcut, addWindow, windowPropertiesService, registry])

	return <DesktopItem context={shortcut} onDoubleClick={onDoubleClick} />
}

export default Shortcut
