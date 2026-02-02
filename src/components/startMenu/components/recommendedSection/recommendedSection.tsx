import { useContext, useMemo } from "react"
import { BRANCHING_CONTEXT_DETERMINER } from "../../../../constants"
import { RegistryContext } from "../../../../contexts"
import { SpecialBranch } from "../../../../enums"
import { useFileSystem } from "../../../../hooks"
import { BranchingContext, Context } from "../../../../types/fs"
import { ContainerSection } from "../containerSection"

interface IRecommendedSectionProps {
	onItemClicked: (item: Context) => void
}

const RecommendedSection = (props: IRecommendedSectionProps) => {
	const { onItemClicked } = props
	const { validateFilePath } = useFileSystem()
	const { specialBranchPaths } = useContext(RegistryContext)

	const desktopBranch: BranchingContext | null = useMemo(() => {
		const validatedDesktopBranch = validateFilePath(specialBranchPaths[SpecialBranch.Desktop])
		if (!validatedDesktopBranch) {
			return null
		}

		if (BRANCHING_CONTEXT_DETERMINER in validatedDesktopBranch) {
			return validatedDesktopBranch
		}

		return null
	}, [validateFilePath, specialBranchPaths])


	return (
		<ContainerSection 
			title="Recommended" 
			items={desktopBranch?.leaves ?? []}
			onRecommendedItemClicked={onItemClicked}
		/>)
}

export default RecommendedSection