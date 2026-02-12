import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { ISearchResultPaneOptions, SearchResultPane } from "../components/searchResultPane"
import { BRANCHING_CONTEXT_DETERMINER, LEAF_EXTENSION_PROPERTY_NAME, CLASSNAMES } from "../constants"
import { FileSystemContext, RegistryContext, WindowsContext } from "../contexts"
import { onSelectionRowClicked } from "../helpers/selections"
import { IFileSystemResultTuple, ISearchResult } from "../interfaces/search"
import { WindowPropertiesService } from "../services"
import useFileSystem from "./fileSystem"

const { 
	SEARCH_RESULT_PANE_CLASSES: { 
		ROW 
	}
} = CLASSNAMES

const windowPropertiesService = new WindowPropertiesService()

const useSearchResultPane = (
	text: string,
	options?: ISearchResultPaneOptions
) => {
	const searchTimeout = useRef<number | undefined>(undefined)
	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})
	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)
	const { root, searchForItems } = useContext(FileSystemContext)
	const currentContext = options?.context ?? root

	const { addWindow } = useContext(WindowsContext)
	const { validateFilePath } = useFileSystem()
	const registry = useContext(RegistryContext)

	const onSearchCancelled = () => {
		setSearchResult(null)
		elementRowReferences.current = {}
		setSelectedContextKeys([])
	}

	useEffect(() => {
		clearTimeout(searchTimeout.current)

		searchTimeout.current = setTimeout(() => {
			if (text === "") {
				onSearchCancelled()
			} else {
				const items = searchForItems(text, currentContext)
				elementRowReferences.current = {}
				setSelectedContextKeys([])
				setSearchResult({
					term: text,
					items
				})
			}
		}, 300)
	}, [
		text,
		searchForItems,
		currentContext,
		setSelectedContextKeys,
		setSearchResult
	])

	const onRowDoubleClicked = useCallback(
		(fileSystemResult: IFileSystemResultTuple, _?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const windowProperties = windowPropertiesService.getProperties(
				fileSystemResult.context,
				registry
			)
			if (windowProperties != null) {
				addWindow(windowProperties)
			}
		},
		[addWindow, windowPropertiesService, registry]
	)

	const onRowClicked = useCallback(
		(fileSystemResult: IFileSystemResultTuple, items: IFileSystemResultTuple[], e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const { path, context } = fileSystemResult
			
			const newSelectedContextKeys = onSelectionRowClicked(
				context,
				e,
				selectedContextKeys,
				items,
				(x) => x.path,
				path
			)

			setSelectedContextKeys(newSelectedContextKeys)
		},
		[
			onSelectionRowClicked,
			selectedContextKeys,
			setSelectedContextKeys
		]
	)

	const onSearchResultPaneClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (selectedContextKeys.length > 0 && e.target instanceof HTMLElement) {
			if (e.target.className.indexOf(ROW) === -1 
				&& e.target.parentElement?.className.indexOf(ROW) === -1
			) {
				setSelectedContextKeys([])
			}
		}
	}

	const onSearchResultPaneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" && selectedContextKeys.length > 0) {
			const results = selectedContextKeys.map(x => {
				return {
					path: x,
					context: validateFilePath(x)
				}
			})

			const leaves = results.filter(
				(x) => x.context && LEAF_EXTENSION_PROPERTY_NAME in x.context
			)
			const branches = results.filter(
				(x) => x.context && BRANCHING_CONTEXT_DETERMINER in x.context
			)

			for (let i = 0; i < leaves.length; i++) {
				const leaf = leaves[i]
				if (leaf.context) {
					const item = {
						path: leaf.path,
						context: leaf.context
					}

					onRowDoubleClicked(item)
				}
			}

			for (let i = 0; i < branches.length - 1; i++) {
				const branchContext = branches[i].context
				if (!branchContext) {
					continue
				}

				const addWindowProperties = windowPropertiesService.getProperties(
					branchContext,
					registry
				)
				if (addWindowProperties) {
					addWindow({ ...addWindowProperties, openNewInstance: true })
				}
			}

			if (branches.length > 0) {
				const branch = branches[branches.length - 1]
				const branchContext = branch.context

				if (branchContext) {
					const item = {
						path: branch.path,
						context: branchContext
					}
					onRowDoubleClicked(item)
				}
			}
		}
	}

	return {
		SearchPane: (
			<SearchResultPane
				options={options}
				searchResult={searchResult}
				selectedContextKeys={selectedContextKeys}
				onClick={onSearchResultPaneClick}
				onKeyDown={onSearchResultPaneKeyDown}
				onRowClicked={onRowClicked}
				onRowDoubleClicked={onRowDoubleClicked}
				refCallback={(p, e) =>
					(elementRowReferences.current[p] = e)
				}
			/>
		),
		searchResult
	}
}

export default useSearchResultPane