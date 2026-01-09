import { JSX } from "react"
import {
	BRANCHING_CONTEXT_TYPE_PROPERTY,
	FILETYPE_EXECUTABLE,
	FILETYPE_PDF,
	FILETYPE_TEXT,
	FILETYPE_URL_SHORTCUT,
	LEAF_EXTENSION_PROPERTY_NAME
} from "../constants"
import {
	PdfIcon,
	InternetIcon,
	TextFileIcon,
	ExecutableFileIcon,
	GenericFileIcon,
	FolderIcon,
	DriveIcon,
	IIconProps
} from "../icons"
import { Context } from "../types/fs"

export const getIcon = (
	context: Context,
	props?: IIconProps
): JSX.Element | null => {
	if (LEAF_EXTENSION_PROPERTY_NAME in context) {
		switch (context.extension) {
			case FILETYPE_PDF:
				return <PdfIcon {...props} />
			case FILETYPE_URL_SHORTCUT:
				return <InternetIcon {...props} />
			case FILETYPE_TEXT:
				return <TextFileIcon {...props} />
			case FILETYPE_EXECUTABLE:
				return <ExecutableFileIcon {...props} />
			default:
				return <GenericFileIcon {...props} />
		}
	} else if (BRANCHING_CONTEXT_TYPE_PROPERTY in context) {
		return <FolderIcon {...props} />
	} else {
		return <DriveIcon {...props} />
	}
}
