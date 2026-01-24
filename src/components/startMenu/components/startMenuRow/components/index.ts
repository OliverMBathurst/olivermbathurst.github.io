import { BranchingContext, Context } from "../../../../../types/fs"
import { StartMenuFileRow } from "./startMenuFileRow"
import { StartMenuFolderRow } from "./startMenuFolderRow"

export { StartMenuFileRow, StartMenuFolderRow }

export interface IStartMenuFolderRowProps extends IStartMenuRowSharedProps<BranchingContext> {
	openedFolders: string[]
	onFolderRowClicked: (fullPath: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
	onFileRowClicked: (context: Context, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export interface IStartMenuFileRowProps extends IStartMenuRowSharedProps<Context> {
	onRowClicked: (context: Context, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

interface IStartMenuRowSharedProps<T extends Context> {
	index: number
	context: T
	prefix: string
	fullPath: string
	selectedContextKeys: string[]
}