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
	filterType: FileSystemFilterType,
	title: string
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
		if (!searchResult || searchResult.items.length === 0) {
			if (showRecents && recents.length > 0) {
				const fsTuples: IFileSystemResultTuple[] = []
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

					fsTuples.push(item)
				}

				return (
					<>
						<span className={`search-result-pane__sub-heading ${NO_SELECT_CLASS}`}>
							Recents
						</span>
						{fsTuples.map((i) => {
							const { path } = i

							return (
								<SearchResultPaneRow
									key={path}
									refCallback={refCallback}
									item={i}
									selected={selectedContextKeys.indexOf(path) !== -1}
									onRowClicked={(e) => onRowClicked(i, fsTuples, e)}
									onRowDoubleClicked={(e) => onRowDoubleClicked(i, e)}
								/>
							)
						})}
					</>
				)
			}

			return (
				<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
					No results found
				</span>
			)
		}

		if (categorise) {
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

			for (const item of searchResult.items) {
				if (BRANCHING_CONTEXT_DETERMINER in item.context) {
					branches.items.push(item)
				} else if (APPLICATION_DETERMINER in item.context) {
					executables.items.push(item)
				} else {
					leaves.items.push(item)
				}
			}

			let sections: ISearchPaneSection[] = []
			if (filter === FileSystemFilterType.Apps) {
				sections.push(executables)
			} else if (filter === FileSystemFilterType.Documents) {
				sections.push(leaves)
			} else if (filter === FileSystemFilterType.Folders) {
				sections.push(branches)
			} else {
				sections = [
					branches,
					leaves,
					executables
				]
			}

			const flattenedOrderedTuples = sections.flatMap(x => x.items)

			return (
				<>
					{sections
						.filter(x => x.items.length > 0)
						.map(section => {
							const { title, items } = section
							return (
								<>
									<span className={`search-result-pane__sub-heading ${NO_SELECT_CLASS}`}>
										{title}
									</span>
									{items.map(item => {
										const { path } = item
										return (
											<SearchResultPaneRow
												key={path}
												refCallback={refCallback}
												item={item}
												term={searchResult.term}
												selected={selectedContextKeys.indexOf(path) !== -1}
												onRowClicked={(e) => onRowClicked(item, flattenedOrderedTuples, e)}
												onRowDoubleClicked={(e) => onRowDoubleClicked(item, e)}
											/>
										)
									})}
								</>
							)
						})}
				</>
			)
		}
	
		return searchResult.items.map((i) => {
			const { path } = i
			return (
				<SearchResultPaneRow
					key={path}
					refCallback={refCallback}
					item={i}
					term={searchResult.term}
					selected={selectedContextKeys.indexOf(path) !== -1}
					onRowClicked={(e) => onRowClicked(i, searchResult.items, e)}
					onRowDoubleClicked={(e) => onRowDoubleClicked(i, e)}
				/>
			)
		})
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
