import { useCallback, useContext } from "react"
import { RegistryContext, WindowsContext } from "../../contexts"
import { WindowPropertiesService } from "../../services"
import { BranchingContext } from "../../types/fs"
import { DesktopItem } from "../desktop/components"

interface IFolderProps {
	context: BranchingContext
}

const windowPropertiesService = new WindowPropertiesService();

const Folder = (props: IFolderProps) => {
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

export default Folder
