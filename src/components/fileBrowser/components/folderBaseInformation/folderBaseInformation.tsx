import { useMemo } from "react"
import {
    BRANCHING_CONTEXT_DETERMINER,
    CLASSNAMES,
    LEAF_EXTENSION_PROPERTY_NAME,
    SHORTCUT_DETERMINER
} from "../../../../constants"
import { ThumbsIcon } from "../../../../icons"
import { ISearchResult } from "../../../../interfaces/search"
import { Branch, BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import "./folderBaseInformation.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFolderBaseInformationProps {
	context: BranchingContext
	entities: (Branch | Shortcut | Leaf)[]
	selected: string[]
	thumbnailDisplay: boolean
	toggleDisplayMode: () => void
	searchResult?: ISearchResult
}

const FolderBaseInformation = (props: IFolderBaseInformationProps) => {
	const {
		context,
		entities,
		selected,
		searchResult,
		thumbnailDisplay,
		toggleDisplayMode
	} = props

	const Information = useMemo(() => {
		let entitiesLength = 0

		let leaves = []
		let shortcuts = []
		let branches = []

		if (searchResult) {
			const searchItems = searchResult?.items ?? []
			leaves = searchItems.filter(
				(x) =>
					LEAF_EXTENSION_PROPERTY_NAME in x.context &&
					!(SHORTCUT_DETERMINER in x.context)
			)
			branches = searchItems.filter(
				(x) => BRANCHING_CONTEXT_DETERMINER in x.context
			)
			shortcuts = searchItems.filter((x) => SHORTCUT_DETERMINER in x.context)
			entitiesLength = leaves.length + branches.length + shortcuts.length
		} else {
			leaves = context.leaves
			branches = context.branches
			shortcuts = context.shortcuts
			entitiesLength = entities.length
		}

		return {
			leaves,
			branches,
			shortcuts,
			entitiesLength,
			selectedLength: selected.length
		}
	}, [searchResult, selected, entities])

	const { entitiesLength, branches, leaves, shortcuts, selectedLength } =
		Information

	return (
		<div className="base-information-pane">
			<span className={`base-information-pane__text ${NO_SELECT_CLASS}`}>
				{`${selectedLength > 0 ? `Selected: ${selectedLength} item${selectedLength !== 1 ? "s" : ""} of ` : ""}${entitiesLength} item${entitiesLength !== 1 ? "s" : ""} | ${branches.length} folder${branches.length !== 1 ? "s" : ""} | ${leaves.length + shortcuts.length} file${leaves.length + shortcuts.length !== 1 ? "s" : ""}`}
			</span>
			<ThumbsIcon
				className={`base-information-pane__thumbs${thumbnailDisplay ? "--selected" : ""} ${NO_SELECT_CLASS}`}
				onClick={toggleDisplayMode}
			/>
		</div>
	)
}

export default FolderBaseInformation
