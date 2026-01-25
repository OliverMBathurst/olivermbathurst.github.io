import { BranchingContext, Context } from "../../../../../types/fs"

import { FileBrowserTreeFileRow } from "./fileBrowserTreeFileRow"
import { FileBrowserTreeFolderRow } from "./fileBrowserTreeFolderRow"

export { FileBrowserTreeFileRow, FileBrowserTreeFolderRow }

export interface IStartMenuFolderRowProps extends IStartMenuRowSharedProps<BranchingContext> {
	onFolderRowClicked: (fullPath: string, context: BranchingContext, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
	onFileRowClicked: (fullPath: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export interface IStartMenuFileRowProps extends IStartMenuRowSharedProps<Context> {
	onRowClicked: (fullPath: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

interface IStartMenuRowSharedProps<T extends Context> {
	windowId: string
	index: number
	context: T
	prefix: string
	onFileRowDoubleClicked: (context: Context, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}