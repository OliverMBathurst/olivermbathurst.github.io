import { JSX } from "react"
import {
	BRANCHING_CONTEXT_TYPE_PROPERTY,
	FILETYPE_EXECUTABLE,
	FILETYPE_PDF,
	FILETYPE_SHORTCUT,
	FILETYPE_TEXT,
	FILETYPE_URL_SHORTCUT,
	LEAF_EXTENSION_PROPERTY_NAME,
    SHORTCUT_DETERMINER
} from "../constants"
import {
	PdfIcon,
	InternetIcon,
	TextFileIcon,
	ExecutableFileIcon,
	GenericFileIcon,
	FolderIcon,
	DriveIcon
} from "../icons"
import { Context } from "../types/fs"

export const getIcon = (
	context: Context,
	props?: React.ImgHTMLAttributes<HTMLImageElement>
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
			case FILETYPE_SHORTCUT:
				if (SHORTCUT_DETERMINER in context) {
					return getIcon(context.context, props)
				}
				throw new Error("Invalid shortcut")
			default:
				return <GenericFileIcon {...props} />
		}
	} else if (BRANCHING_CONTEXT_TYPE_PROPERTY in context) {
		return <FolderIcon {...props} />
	} else {
		return <DriveIcon {...props} />
	}
}
