import {
    FILETYPE_URL_SHORTCUT,
    FILETYPE_URL_SHORTCUT_PROPERTY,
    LEAF_EXTENSION_PROPERTY_NAME,
    SHORTCUT_DETERMINER
} from "../constants"
import { IAddWindowProperties } from "../interfaces/windows"
import { Context } from "../types/fs"

interface IApplicationHandlerServiceOptions {}

class ApplicationHandlerService {
	execute = (
		context: Context,
		_?: IApplicationHandlerServiceOptions
	): IAddWindowProperties | null => {
		let resolvedContext: Context = context
		if (SHORTCUT_DETERMINER in resolvedContext) {
			resolvedContext = resolvedContext.context
		}

		if (
			FILETYPE_URL_SHORTCUT_PROPERTY in resolvedContext &&
			LEAF_EXTENSION_PROPERTY_NAME in resolvedContext &&
			resolvedContext.extension === FILETYPE_URL_SHORTCUT
		) {
			window.open(resolvedContext.url, "_blank")
			return null
		}

		const windowProperties: IAddWindowProperties = {
			context: resolvedContext
		}

		return windowProperties
	}
}

export default ApplicationHandlerService
