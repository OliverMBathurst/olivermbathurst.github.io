import { useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER } from "../../../../constants"
import { Context } from "../../../../types/fs"
import { StartMenuFileRow, StartMenuFolderRow } from "./components"
import "./startMenuRow.scss"

interface IStartMenuRowProps {
	index: number
	context: Context
	prefix: string
	fullPath: string
	selectedContextKeys: string[]
	setSelectedContextKeys: (selectedContextKeys: string[]) => void
	onRowClicked: (context: Context, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const StartMenuRow = (props: IStartMenuRowProps) => {
	const {
		index,
		context,
		prefix,
		fullPath,
		selectedContextKeys,
		setSelectedContextKeys,
		onRowClicked
	} = props

	const [openedFolders, setOpenedFolders] = useState<string[]>([])

	const onFolderClicked = (folderKey: string) => {
		setSelectedContextKeys([])

		setOpenedFolders(oF => {
			if (oF.indexOf(folderKey) === -1) {
				return [...oF, folderKey]
			}

			return [...oF].filter(o => o !== folderKey)
		})
	}

	if (BRANCHING_CONTEXT_DETERMINER in context) {
		return (
			<StartMenuFolderRow
				index={index}
				context={context}
				prefix={prefix + "branch-"}
				fullPath={fullPath}
				openedFolders={openedFolders}
				selectedContextKeys={selectedContextKeys}
				onFolderRowClicked={onFolderClicked}
				onFileRowClicked={onRowClicked}
			/>)
	}

	return (
		<StartMenuFileRow
			index={index}
			context={context}
			prefix={prefix + "leaf-"}
			fullPath={fullPath}
			selectedContextKeys={selectedContextKeys}
			onRowClicked={onRowClicked}
		/>)
}

export default StartMenuRow