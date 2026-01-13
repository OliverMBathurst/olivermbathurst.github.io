import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { NO_SELECT_CLASS } from "../../constants"
import { FileSystemContext, WindowsContext } from "../../contexts"
import { getIcon } from "../../helpers/icons"
import { getDisplayName } from "../../helpers/naming"
import { getFullPath } from "../../helpers/paths"
import { onSelectionRowClicked } from "../../helpers/selections"
import { useClickOutside, useFileSystem, useSearch } from "../../hooks"
import { ISearchResult } from "../../interfaces/search"
import { ApplicationHandlerService } from "../../service"
import { Context, Leaf } from "../../types/fs"
import { SearchBar } from "../searchBar"
import { SearchResultPane } from "../searchResultPane"
import "./startMenu.scss"

interface IStartMenuProps {
	onClickOutside: () => void
}

const applicationHandlerService = new ApplicationHandlerService()

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside } = props

	const { addWindow } = useContext(WindowsContext)
	const { root } = useContext(FileSystemContext)
	const { getFilesOfBranchRecursively } = useFileSystem(root)
	const { searchForItems } = useSearch(root)

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])
	const [allLeaves, setAllLeaves] = useState<Leaf[]>([])
	const [searchResult, setSearchResult] = useState<ISearchResult | null>(null)

	const startMenuRef = useRef<HTMLDivElement | null>(null)
	const searchTimeout = useRef<number | undefined>(undefined)
	const elementRowReferences = useRef<Record<string, HTMLElement | null>>({})

	useClickOutside(startMenuRef, onClickOutside)

	useEffect(() => {
		const leaves = getFilesOfBranchRecursively()
		setAllLeaves([...leaves])
	}, [])

	const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearTimeout(searchTimeout.current)
		searchTimeout.current = setTimeout(() => {
			const val = e.target.value
			if (val === "") {
				onSearchCancelled()
			} else {
				const items = searchForItems(val)
				setSelectedContextKeys([])
				setSearchResult({
					term: val,
					items
				})
			}
		}, 300)
	}

	const onSearchCancelled = () => {
		setSearchResult(null)
		setSelectedContextKeys([])
	}

	const onRowDoubleClicked = useCallback(
		(context: Context, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const windowProperties = applicationHandlerService.execute(context)
			if (windowProperties != null) {
				addWindow(windowProperties)
			}
		},
		[addWindow]
	)

	const onRowClicked = useCallback(
		(context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const selectionOne = searchResult !== null

			const newSelectedContextKeys = onSelectionRowClicked(
				context,
				selectionOne,
				e,
				selectedContextKeys,
				searchResult?.items ?? [],
				allLeaves,
				(x) => x.context.toContextUniqueKey(),
				(x) => x.toContextUniqueKey()
			)

			setSelectedContextKeys(newSelectedContextKeys)
		},
		[
			searchResult,
			onSelectionRowClicked,
			selectedContextKeys,
			allLeaves,
			setSelectedContextKeys
		]
	)

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__top-container">
				<div className="start-menu__top-container__left"></div>
				<div className="start-menu__top-container__right">
					{searchResult && (
						<SearchResultPane
							searchResult={searchResult}
							selectedContextKeys={selectedContextKeys}
							onRowClicked={onRowClicked}
							onRowDoubleClicked={onRowDoubleClicked}
							refCallback={(c, e) =>
								(elementRowReferences.current[c.toContextUniqueKey()] = e)
							}
						/>
					)}
					{!searchResult &&
						allLeaves.map((l) => {
							const Icon = getIcon(l)
							const DisplayName = getDisplayName(l)
							const selected =
								selectedContextKeys.indexOf(l.toContextUniqueKey()) !== -1
							const key = getFullPath(l)
							return (
								<div
									className={`start-menu__top-container__right__row${selected ? "--selected" : ""}`}
									key={key}
									onClick={(e) => onRowClicked(l, e)}
									onDoubleClick={(e) => onRowDoubleClicked(l, e)}
								>
									<div
										className={`start-menu__top-container__right__row__icon ${NO_SELECT_CLASS}`}
									>
										{Icon}
									</div>
									<div
										className={`start-menu__top-container__right__row__name ${NO_SELECT_CLASS}`}
									>
										{DisplayName}
									</div>
								</div>
							)
						})}
				</div>
			</div>
			<div className="start-menu__bottom-container">
				<div className="start-menu__bottom-container__search">
					<SearchBar
						type="text"
						placeholder="Search..."
						onChange={onSearchInputChanged}
						onCancelClicked={onSearchCancelled}
					/>
				</div>
			</div>
		</div>
	)
}

export default StartMenu
