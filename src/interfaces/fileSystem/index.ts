import { DirectoryType } from "../../enums";
import { FileInfo } from "../file";

export interface IDirectory {
	name: string
	type: DirectoryType
	files: FileInfo[]
	directories: IDirectory[]
	parentDirectory?: IDirectory
}