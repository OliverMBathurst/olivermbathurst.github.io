import { useContext, useEffect, useMemo, useState } from "react"
import { APPLICATION_DETERMINER } from "../../../../constants"
import { RegistryContext } from "../../../../contexts"
import { useFileSystem } from "../../../../hooks"
import { Context } from "../../../../types/fs"

interface IWindowContentProps {
	windowId: string
	context: Context
	handlerId: string
	arguments?: string
}

const WindowContent = (props: IWindowContentProps) => {
	const { context, windowId, handlerId, arguments: _arguments } = props
	const { validateFilePath } = useFileSystem()
	const { applicationPaths } = useContext(RegistryContext)
	const [application, setApplication] = useState<Context | null>(null)

	useEffect(() => {
		const applicationPath = applicationPaths[handlerId]
		const resolvedContext = validateFilePath(applicationPath)
		if (resolvedContext) {
			setApplication(resolvedContext)
		}
	}, [applicationPaths, handlerId, validateFilePath, setApplication])

	const Content = useMemo(() => {
		if (application && APPLICATION_DETERMINER in application) {
			return application.handle(windowId, context, _arguments)
		}

		return null
	}, [application, windowId, context, _arguments])

	return <>{Content}</>
}

export default WindowContent
