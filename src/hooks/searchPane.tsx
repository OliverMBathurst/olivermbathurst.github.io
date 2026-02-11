import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { SearchResultPane } from "../components/searchResultPane"
import { FileSystemContext, RegistryContext, WindowsContext } from "../contexts"
import { onMixedSelectionRowClicked } from "../helpers/selections"
import { IForwardContextInformation } from "../interfaces/fs"
import { ILikenessResult, ISearchResult } from "../interfaces/search"
import { WindowPropertiesService } from "../services"
import { Context } from "../types/fs"
import { BRANCHING_CONTEXT_DETERMINER, LEAF_EXTENSION_PROPERTY_NAME } from "../constants"

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
		(likenessResult: ILikenessResult, _?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

	const onSearchResultPaneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter"
			&& selectedContextKeys.length > 0
			&& searchResult
		) {
			const selectedItems = searchResult.items.filter(
				(e) => selectedContextKeys.indexOf(e.path) !== -1
			)
			const leaves = selectedItems.filter(
				(x) => LEAF_EXTENSION_PROPERTY_NAME in x.context
			)
			const branches = selectedItems.filter(
				(x) => BRANCHING_CONTEXT_DETERMINER in x.context
			)

			for (let i = 0; i < leaves.length; i++) {
				onRowDoubleClicked(leaves[i])
			}

			for (let i = 0; i < branches.length - 1; i++) {
				const addWindowProperties = windowPropertiesService.getProperties(
					branches[i].context,
					registry
				)
				if (addWindowProperties) {
					addWindow({ ...addWindowProperties, openNewInstance: true })
				}
			}

			if (branches.length > 0) {
				onRowDoubleClicked(branches[branches.length - 1])
			}
		}
	}

	return {
		SearchPane: (
			<SearchResultPane
				searchResult={searchResult}
				selectedContextKeys={selectedContextKeys}
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

export default useSearchPane