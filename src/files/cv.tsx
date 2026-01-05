import { FILETYPE_PDF } from "../constants"
import { IWindowFile, IWindowRenderProps } from "../interfaces/fs"
import { AbstractLeaf, Branch, Root } from "../types/fs"

class CV extends AbstractLeaf implements IWindowFile {
	constructor(parent: Branch | Root) {
		super("My CV", FILETYPE_PDF, parent)
	}

	render = (props?: IWindowRenderProps) => (
		<object
			title={this.name}
			data="/documents/Oliver Bathurst CV.pdf"
			width="100%"
			height="100%"
			{...props}
		>
			Sorry, your browser doesn't support PDF preview.
		</object>
	)
}

export default CV
