import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { SearchResultPane } from "../components/searchResultPane"
import { FileSystemContext, RegistryContext, WindowsContext } from "../contexts"
import { onMixedSelectionRowClicked } from "../helpers/selections"
import { IForwardContextInformation } from "../interfaces/fs"
import { ILikenessResult, ISearchResult } from "../interfaces/search"
import { WindowPropertiesService } from "../services"
import { Context } from "../types/fs"

const windowPropertiesService = new WindowPropertiesService()

const useSearchPane = (text: string, context?: Context) => {
	const searchTimeout = useRef<number | undefined>(undefined)
	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})

	const [forrwardContexts, setForwardContexts] = useState<IForwardContextInformation[]>([])
	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)
	const { root, searchForItems, getForwardContexts } = useContext(FileSystemContext)
	const currentContext = context ?? root

	const { addWindow } = useContext(WindowsContext)
	const registry = useContext(RegistryContext)

	const onSearchCancelled = () => {
		setSearchResult(null)
		elementRowReferences.current = {}
		setSelectedContextKeys([])
	}

	useEffect(() => {
		const forwardContexts = getForwardContexts(currentContext)
		setForwardContexts(forwardContexts)
	}, [getForwardContexts, currentContext, setForwardContexts])

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
		(likenessResult: ILikenessResult, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const windowProperties = windowPropertiesService.getProperties(
				likenessResult.context,
				registry
			)
			if (windowProperties != null) {
				addWindow(windowProperties)
			}
		},
		[addWindow, windowPropertiesService, registry]
	)

	const onRowClicked = useCallback(
		(likenessResult: ILikenessResult, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const newSelectedContextKeys = onMixedSelectionRowClicked(
				likenessResult.context,
				searchResult !== null,
				e,
				selectedContextKeys,
				searchResult?.items ?? [],
				forrwardContexts,
				(x) => x.path,
				(x) => x.fullPath,
				likenessResult.path
			)

			setSelectedContextKeys(newSelectedContextKeys)
		},
		[
			searchResult,
			onMixedSelectionRowClicked,
			selectedContextKeys,
			forrwardContexts,
			setSelectedContextKeys
		]
	)


	return {
		SearchPane: (
			<SearchResultPane
				searchResult={searchResult}
				selectedContextKeys={selectedContextKeys}
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

export default useSearchPane