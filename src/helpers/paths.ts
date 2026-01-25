import { BRANCHING_CONTEXT_PARENT_PROPERTY } from "../constants"
import { BranchingContext, Context } from "../types/fs"
import { getDisplayName } from "./naming"

export const getFullPath = (context: Context) => {
	let displayName = getDisplayName(context)

	if (BRANCHING_CONTEXT_PARENT_PROPERTY in context && context.parent) {
		displayName = `${getFullPath(context.parent)}\\${displayName}`
	}

	return displayName
}

export const getRoot = (context: Context) => {
	if (!(BRANCHING_CONTEXT_PARENT_PROPERTY in context)) {
		return null
	}

	let _context: BranchingContext | null = context.parent

	if (!_context) {
		return null
	}

	while (BRANCHING_CONTEXT_PARENT_PROPERTY in _context && _context.parent) {
		_context = _context.parent
	}

	return _context
}
