import { useContext, useEffect, useState } from "react"
import {
	FILETYPE_EXECUTABLE,
	LEAF_EXTENSION_PROPERTY_NAME
} from "../../../../constants"
import { FileSystemContext } from "../../../../contexts"
import { INonRootContextInformation } from "../../../../interfaces/fs"
import { Context } from "../../../../types/fs"
import { ContainerSection } from "../containerSection"

interface IApplicationsSectionProps {
	onItemClicked: (item: Context) => void
}

const ApplicationsSection = (props: IApplicationsSectionProps) => {
	const { onItemClicked } = props
	const { nonRootContextInformation } = useContext(FileSystemContext)
	const [applicationInformation, setApplicationInformation] = useState<
		INonRootContextInformation[]
	>([])

	useEffect(() => {
		const apps = nonRootContextInformation.filter(
			(ci) =>
				LEAF_EXTENSION_PROPERTY_NAME in ci.context &&
				ci.context.extension === FILETYPE_EXECUTABLE
		)

		setApplicationInformation(apps)
	}, [nonRootContextInformation])

	return (
		<ContainerSection
			title="Applications"
			items={applicationInformation.map((x) => x.context)}
			onRecommendedItemClicked={onItemClicked}
		/>
	)
}

export default ApplicationsSection
