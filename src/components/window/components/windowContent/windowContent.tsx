import { useContext, useEffect, useMemo, useState } from "react"
import { APPLICATION_DETERMINER, BRANCHING_CONTEXT_DETERMINER, LEAF_EXTENSION_PROPERTY_NAME } from "../../../../constants"
import { RegistryContext } from "../../../../contexts"
import { useFileSystem } from "../../../../hooks"
import { Context } from "../../../../types/fs"

interface IWindowContentProps {
    windowId: string
    context: Context
}

const WindowContent = (props: IWindowContentProps) => {
    const { context, windowId } = props
    const { validateFilePath } = useFileSystem()
    const { folderHandlerId, fileTypeAssociations, applicationPaths, applications } = useContext(RegistryContext)
    const [applicationHandlerId, setApplicationHandlerId] = useState<string | null>(null)
    const [application, setApplication] = useState<Context | null>(null)

    useEffect(() => {
        let handlerId: string | null = null

        if (APPLICATION_DETERMINER in context) {
            const applicationName = context.fullName
            const applicationId = Object.entries(applications)
                .find(a => a[1] === applicationName)
            if (applicationId) {
                handlerId = applicationId[0]
            }
        } else if (BRANCHING_CONTEXT_DETERMINER in context) {
            handlerId = folderHandlerId
        } else if (LEAF_EXTENSION_PROPERTY_NAME in context) {
            const handlerDetails = Object.entries(fileTypeAssociations)
                .find(x => x[1].indexOf(context.extension) !== -1)
            if (handlerDetails) {
                handlerId = handlerDetails[0]
            }
        }

        setApplicationHandlerId(handlerId)
    }, [context, applications, folderHandlerId, fileTypeAssociations, setApplicationHandlerId])

    useEffect(() => {
        if (applicationHandlerId) {
            const applicationPath = applicationPaths[applicationHandlerId]
            const resolvedContext = validateFilePath(applicationPath)
            if (resolvedContext) {
                setApplication(resolvedContext)
            }
        }

    }, [applicationHandlerId, applicationPaths, validateFilePath, setApplication])

    const Content = useMemo(() => {
        if (application && APPLICATION_DETERMINER in application) {
            return application.handle(windowId, context)
        }

        return null
    }, [application, windowId, context])

    return (
        <>
            {Content}
        </>
    )
}

export default WindowContent