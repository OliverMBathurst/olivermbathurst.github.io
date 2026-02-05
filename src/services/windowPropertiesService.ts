import {
    APPLICATION_DETERMINER,
    BRANCHING_CONTEXT_DETERMINER,
    FILETYPE_URL_SHORTCUT,
    FILETYPE_URL_SHORTCUT_PROPERTY,
    LEAF_EXTENSION_PROPERTY_NAME,
    SHORTCUT_DETERMINER
} from "../constants"
import { IRegistryContext } from "../contexts"
import { IAddWindowProperties } from "../interfaces/windows"
import { Context } from "../types/fs"

class WindowPropertiesService {
	getProperties = (
		context: Context,
		registry: IRegistryContext
	): IAddWindowProperties | null => {
		const { applications, branchHandlerId, fileTypeAssociations } = registry

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

		let handlerId: string | null = null

		if (APPLICATION_DETERMINER in resolvedContext) {
			const applicationName = resolvedContext.fullName
			const applicationId = Object.entries(applications)
				.find(a => a[1] === applicationName)
			if (applicationId) {
				handlerId = applicationId[0]
			}
		} else if (BRANCHING_CONTEXT_DETERMINER in resolvedContext) {
			handlerId = branchHandlerId
		} else if (LEAF_EXTENSION_PROPERTY_NAME in resolvedContext) {
			const ext = resolvedContext.extension
			const handlerDetails = Object.entries(fileTypeAssociations)
				.find(x => x[1].indexOf(ext) !== -1)
			if (handlerDetails) {
				handlerId = handlerDetails[0]
			}
		}

		if (!handlerId) {
			throw new Error("Missing handler.")
		}

		const windowProperties: IAddWindowProperties = {
			context: resolvedContext,
			handlerId
		}

		return windowProperties
	}
}

export default WindowPropertiesService
