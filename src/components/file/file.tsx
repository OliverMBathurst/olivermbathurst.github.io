import { useCallback, useContext } from "react"
import { RegistryContext, WindowsContext } from "../../contexts"
import { WindowPropertiesService } from "../../services"
import { Leaf } from "../../types/fs"
import { DesktopItem } from "../desktop/components"

interface IFileProps {
	context: Leaf
}

const windowPropertiesService = new WindowPropertiesService();

const File = (props: IFileProps) => {
	const { context } = props

	const { addWindow } = useContext(WindowsContext)
	const registry = useContext(RegistryContext)

	const onDoubleClick = useCallback(() => {
		const windowProperties = windowPropertiesService.getProperties(context, registry)
		if (!windowProperties) {
			return
		}

		addWindow(windowProperties)
	}, [context, addWindow, windowPropertiesService, registry])

	return <DesktopItem context={context} onDoubleClick={onDoubleClick} />
}

export default File
