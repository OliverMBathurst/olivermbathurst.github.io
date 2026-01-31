import { IUploadedWindowFile } from "../interfaces/fs"
import { AbstractUploadedWindowFile } from "../types/fs"

class PdfFile
	extends AbstractUploadedWindowFile
	implements IUploadedWindowFile
{
}

export default PdfFile
