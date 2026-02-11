import { useContext, useEffect, useState } from "react"
import { RegistryContext } from "../../../../contexts"
import { useFileSystem } from "../../../../hooks"
import { Context } from "../../../../types/fs"
import { ContainerSection } from "../containerSection"

interface IApplicationsSectionProps {
	onItemClicked: (item: Context) => void
}

const ApplicationsSection = (props: IApplicationsSectionProps) => {
	const { onItemClicked } = props
	const { applicationPaths } = useContext(RegistryContext)
	const { validateFilePath } = useFileSystem()

	const [apps, setApps] = useState<Context[]>([])

	useEffect(() => {
		const appPaths = Object.values(applicationPaths)

		const resolvedApps = []
		for (const appPath of appPaths) {
			const validatedAppContext = validateFilePath(appPath)
			if (validatedAppContext) {
				resolvedApps.push(validatedAppContext)
			}
		}

		setApps(resolvedApps)
	}, [applicationPaths])

	return (
		<ContainerSection
			title="Applications"
			items={apps}
			onRecommendedItemClicked={onItemClicked}
		/>
	)
}

export default ApplicationsSection
