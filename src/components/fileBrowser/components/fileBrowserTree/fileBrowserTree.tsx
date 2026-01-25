import { useContext } from "react"
import { FileBrowserContext, FileSystemContext, WindowsContext } from "../../../../contexts"
import { ApplicationHandlerService } from "../../../../service"
import { BranchingContext, Context } from "../../../../types/fs"
import { FileBrowserTreeFolderRow } from "./components"
import "./fileBrowserTree.scss"

const applicationHandlerService = new ApplicationHandlerService()

interface IFileBrowserTreeProps {
	windowId: string
	onDirectoryChanged: (context: BranchingContext) => void
}

const FileBrowserTree = (props: IFileBrowserTreeProps) => {
	const { windowId, onDirectoryChanged } = props

	const { setSelectedTreeContextKeysForWindow } = useContext(FileBrowserContext)
    const { root } = useContext(FileSystemContext)
	const { addWindow } = useContext(WindowsContext)

	const onRowClicked = (fullPath: string, _: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setSelectedTreeContextKeysForWindow(windowId, (_) => [fullPath])
	}

	const onFileRowDoubleClicked = (context: Context, _: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const windowProperties = applicationHandlerService.execute(context)
		if (windowProperties != null) {
			setSelectedTreeContextKeysForWindow(windowId, (_) => [])
			addWindow(windowProperties)
		}
	}

	const onFolderClicked = (fullPath: string, context: BranchingContext) => {
		setSelectedTreeContextKeysForWindow(windowId, (_) => [fullPath])
		onDirectoryChanged(context)
	}

	return (
		<div className="file-browser-tree">
			<FileBrowserTreeFolderRow
				windowId={windowId}
				index={0}
				key="Root"
				context={root}
				prefix={root.fullName}
				onFolderRowClicked={onFolderClicked}
				onFileRowClicked={onRowClicked}
				onFileRowDoubleClicked={onFileRowDoubleClicked}
			/>
		</div>
    )
}


export default FileBrowserTree