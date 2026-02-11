import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { SearchResultPane } from "../components/searchResultPane"
import { FileSystemContext, RegistryContext, WindowsContext } from "../contexts"
import { onMixedSelectionRowClicked } from "../helpers/selections"
import { ISearchResult } from "../interfaces/search"
import { WindowPropertiesService } from "../services"
import { Context } from "../types/fs"

const windowPropertiesService = new WindowPropertiesService()

const useSearchPane = (text: string, context?: Context) => {
	const searchTimeout = useRef<number | undefined>(undefined)
	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)

	const { root, nonRootContextInformation, searchForItems } = useContext(FileSystemContext)
	const currentContext = context ?? root

	const { addWindow } = useContext(WindowsContext)
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
	}, [text, onSearchCancelled, searchForItems, currentContext, setSelectedContextKeys, setSearchResult])

	const onRowDoubleClicked = useCallback(
		(context: Context, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const windowProperties = windowPropertiesService.getProperties(
				context,
				registry
			)
			if (windowProperties != null) {
				addWindow(windowProperties)
			}
		},
		[addWindow, windowPropertiesService, registry]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const selectionOne = searchResult !== null

			const newSelectedContextKeys = onMixedSelectionRowClicked(
				context,
				selectionOne,
				e,
				selectedContextKeys,
				searchResult?.items ?? [],
				nonRootContextInformation,
				(x) => x.context.toContextUniqueKey(),
				(x) => x.context.toContextUniqueKey()
			)

			setSelectedContextKeys(newSelectedContextKeys)
		},
		[
			searchResult,
			onMixedSelectionRowClicked,
			selectedContextKeys,
			nonRootContextInformation,
			setSelectedContextKeys
		]
	)

	return (
		<SearchResultPane
			searchResult={searchResult}
			selectedContextKeys={selectedContextKeys}
			onRowClicked={onRowClicked}
			onRowDoubleClicked={onRowDoubleClicked}
			refCallback={(c, e) =>
				(elementRowReferences.current[c.toContextUniqueKey()] = e)
			}
		/>
	)
}

export default useSearchPane