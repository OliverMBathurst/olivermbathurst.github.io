import { useMemo, useContext } from "react"
import { APPLICATION_DETERMINER,
BRANCHING_CONTEXT_DETERMINER,
CLASSNAMES } from "../../constants"
import { RecentsContext } from "../../contexts"
import { ISearchResult, IFileSystemResultTuple } from "../../interfaces/search"
import { SearchResultPaneRow } from "./components"
import { useFileSystem } from "../../hooks"
import "./searchResultPane.scss"
import { FileSystemFilterType } from "../../enums";
import { Context } from "../../types/fs";

const { NO_SELECT_CLASS } = CLASSNAMES

export interface ISearchResultPaneOptions {
	context?: Context,
	showRecents?: boolean,
	categorise?: boolean,
	filter?: FileSystemFilterType
}

interface ISearchPaneSection {
	filterType?: FileSystemFilterType,
	title?: string
	items: IFileSystemResultTuple[]
}

interface ISearchResultPaneProps {
	options?: ISearchResultPaneOptions
	searchResult: ISearchResult | null
	selectedContextKeys: string[]
	onRowClicked: (
		fileSystemResult: IFileSystemResultTuple,
		items: IFileSystemResultTuple[],
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onRowDoubleClicked: (
		fileSystemResult: IFileSystemResultTuple,
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
	onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	refCallback: (path: string, element: HTMLDivElement | null) => void
}

const SearchResultPane = (props: ISearchResultPaneProps) => {
	const {
		options,
		searchResult,
		selectedContextKeys,
		onRowClicked,
		onRowDoubleClicked,
		onClick,
		onKeyDown,
		refCallback
	} = props

	const { recents } = useContext(RecentsContext)
	const { validateFilePath } = useFileSystem()

	const showRecents = options?.showRecents ?? false
	const categorise = options?.categorise ?? false
	const filter = options?.filter ?? FileSystemFilterType.All

	const Content = useMemo(() => {
		let searchPanelSections: ISearchPaneSection[] = []

		let hasRecents = false
		if (!searchResult || searchResult.items.length === 0) {
			if (showRecents && recents.length > 0) {
				const tuples: IFileSystemResultTuple[] = []
				for (const recent of recents) {
					const { path } = recent
					const context = validateFilePath(path)

					if (!context) {
						continue
					}

					const item: IFileSystemResultTuple = {
						path,
						context
					}

					tuples.push(item)
					hasRecents = true
				}

				searchPanelSections.push({
					title: "Recents",
					items: tuples
				})
			} else {
				return (
					<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
						No results found
					</span>
				)
			}
		}

		if ((!searchResult || searchResult.items.length === 0) && !hasRecents) {
			return (
				<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
					{`No ${showRecents ? "recents" : "results"} found`}
				</span>
			)
		}
		
		const branches: ISearchPaneSection = {
			filterType: FileSystemFilterType.Folders,
			title: "Folders",
			items: []
		}
		const leaves: ISearchPaneSection = {
			filterType: FileSystemFilterType.Documents,
			title: "Documents",
			items: []
		}
		const executables: ISearchPaneSection = {
			filterType: FileSystemFilterType.Apps,
			title: "Apps",
			items: []
		}

		let renderingRecents = false
		let itemsReferenceArray: IFileSystemResultTuple[] = []
		if (searchResult && searchResult.items.length > 0) {
			itemsReferenceArray = searchResult.items
		} else if (hasRecents) {
			itemsReferenceArray = searchPanelSections[0].items
			renderingRecents = true
		}

		for (const item of itemsReferenceArray) {
			if (BRANCHING_CONTEXT_DETERMINER in item.context) {
				branches.items.push(item)
			} else if (APPLICATION_DETERMINER in item.context) {
				executables.items.push(item)
			} else {
				leaves.items.push(item)
			}
		}

		if (filter) {
			if (filter === FileSystemFilterType.Folders) {
				searchPanelSections = [branches]
			} else if (filter === FileSystemFilterType.Documents) {
				searchPanelSections = [leaves]
			} else if (filter === FileSystemFilterType.Apps) {
				searchPanelSections = [executables]
			} else {
				searchPanelSections = [branches, leaves, executables]
			}
		} else {
			searchPanelSections = [branches, leaves, executables]
		}

		const flattenedOrderedTuples = searchPanelSections.flatMap(x => x.items)

		if (searchPanelSections.length === 1 && searchPanelSections[0].items.length === 0) {
			return (
				<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
					{`No ${renderingRecents ? "recents" : "results"} found`}
				</span>
			)
		}

		return (
			<>
				{renderingRecents && (
					<span className={`search-result-pane__sub-heading ${NO_SELECT_CLASS}`}>
						Recents
					</span>
				)}
				{searchPanelSections
					.filter(x => x.items.length > 0)
					.map(section => {
						const { title, items } = section
						return (
							<div key={title}>
								<span
									className={`search-result-pane__sub-heading ${NO_SELECT_CLASS}`}
								>
									{title}
								</span>
								{items.map(item => {
									const { path } = item
									return (
										<SearchResultPaneRow
											key={`${title}-${path}`}
											refCallback={refCallback}
											item={item}
											term={searchResult?.term}
											selected={selectedContextKeys.indexOf(path) !== -1}
											onRowClicked={(e) => onRowClicked(item, flattenedOrderedTuples, e)}
											onRowDoubleClicked={(e) => onRowDoubleClicked(item, e)}
										/>
									)
								})}
							</div>
						)
					})}
			</>
		)
	}, [
		searchResult,
		showRecents,
		categorise,
		filter,
		recents,
		NO_SELECT_CLASS,
		refCallback,
		selectedContextKeys,
		onRowClicked,
		onRowDoubleClicked
	])

	return (
		<div
			className="search-result-pane"
			onClick={onClick}
			onKeyDown={onKeyDown}
			tabIndex={0}
		>
			{Content}
		</div>
	)
}

export default SearchResultPane
