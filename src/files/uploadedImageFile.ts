import { IUploadedWindowFile } from "../interfaces/fs";
import { AbstractUploadedWindowFile } from "../types/fs";

class UploadedImageFile extends AbstractUploadedWindowFile implements IUploadedWindowFile {
	constructor(
		name: string,
		fullName: string,
		path: string,
		openTime: number,
		extension: string
	) {
		super(name, fullName, path, openTime, extension)
		this.windowTopBarCustomIconDisplay = false
	}

}

export default UploadedImageFile