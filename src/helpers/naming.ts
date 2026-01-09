import { LEAF_EXTENSION_PROPERTY_NAME } from "../constants";
import { Context } from "../types/fs";

export const getDisplayName = (context: Context) => {
	const prefix = context.name
	if (LEAF_EXTENSION_PROPERTY_NAME in context) {
		return `${prefix}${context.extension}`
	}

	return prefix
}