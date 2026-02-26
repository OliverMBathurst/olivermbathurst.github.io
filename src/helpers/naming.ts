import { LEAF_EXTENSION_PROPERTY_NAME } from "../constants"
import { Context } from "../types/fs"

export const getDisplayName = (context: Context, showExtension: boolean = true) => {
	const prefix = context.name
	if (LEAF_EXTENSION_PROPERTY_NAME in context && showExtension) {
		return `${prefix}${context.extension}`
	}

	return prefix
}
