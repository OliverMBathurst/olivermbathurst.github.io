import { useContext, useState } from "react"
import { FileSystemContext } from "../../../../contexts"
import { BranchingContext } from "../../../../types/fs"
import { FileBrowserTreeFolderRow } from "./components"
import "./fileBrowserTree.scss"

interface IFileBrowserTreeProps {
	onDirectoryChanged: (context: BranchingContext) => void
}

const FileBrowserTree = (props: IFileBrowserTreeProps) => {
	const { onDirectoryChanged } = props
	const { root } = useContext(FileSystemContext)

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
	const [openContextKeys, setOpenContextKeys] = useState<string[]>([])

	const onBranchClicked = (fullPath: string, context: BranchingContext) => {
		setSelectedContextKeys([fullPath])
		onDirectoryChanged(context)
	}

	const onBranchExpansionChanged = (fullPath: string) => {
		setOpenContextKeys(o => {
			if (o.indexOf(fullPath) !== -1) {
				return [...o].filter(b => b !== fullPath)
			}

			return [...o, fullPath]
		})
	}

	return (
		<div className="file-browser-tree">
			<FileBrowserTreeFolderRow
				selectedContextKeys={selectedContextKeys}
				openContextKeys={openContextKeys}
				index={0}
				key="Root"
				context={root}
				prefix={root.fullName}
				onBranchRowClicked={onBranchClicked}
				onBranchExpansionChanged={onBranchExpansionChanged}
			/>
		</div>
	)
}

export default FileBrowserTree
