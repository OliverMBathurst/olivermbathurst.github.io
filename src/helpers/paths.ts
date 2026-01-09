import { BRANCHING_CONTEXT_PARENT_PROPERTY } from "../constants"
import { Context } from "../types/fs"
import { getDisplayName } from "./naming"

export const getFullPath = (context: Context) => {
	let displayName = getDisplayName(context)

	if (BRANCHING_CONTEXT_PARENT_PROPERTY in context && context.parent) {
		displayName = `${getFullPath(context.parent)}/${displayName}`
	}

	return displayName
}
