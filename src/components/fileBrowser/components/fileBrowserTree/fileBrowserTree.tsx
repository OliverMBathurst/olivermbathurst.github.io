import { useContext } from "react"
import { FileBrowserContext, FileSystemContext } from "../../../../contexts"
import { BranchingContext } from "../../../../types/fs"
import { FileBrowserTreeFolderRow } from "./components"
import "./fileBrowserTree.scss"

interface IFileBrowserTreeProps {
	windowId: string
	onDirectoryChanged: (context: BranchingContext) => void
}

const FileBrowserTree = (props: IFileBrowserTreeProps) => {
	const { windowId, onDirectoryChanged } = props
	const { setSelectedTreeContextKeysForWindow } = useContext(FileBrowserContext)
	const { root } = useContext(FileSystemContext)

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
			/>
		</div>
	)
}

export default FileBrowserTree
