import { FILETYPE_TEXT } from "../constants"
import { ITextFile } from "../interfaces/fs"
import { AbstractNamed } from "../types/fs"

class TextFile extends AbstractNamed implements ITextFile {
	text = ""
	extension = FILETYPE_TEXT

	constructor(name: string) {
		super(name, `${name}${FILETYPE_TEXT}`)
	}

	toContextUniqueKey = () => `${this.name}${FILETYPE_TEXT}`
}

export default TextFile
