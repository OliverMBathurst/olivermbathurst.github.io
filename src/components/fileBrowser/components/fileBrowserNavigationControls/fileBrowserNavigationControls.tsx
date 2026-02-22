import { useMemo, useRef, useState } from "react"
import {
    CLASSNAMES
} from "../../../../constants"
import { CollapseIcon, ExpandIcon, LeftArrowIcon, RightArrowIcon, UpArrowIcon } from "../../../../icons"
import { Select } from "../../../select"
import "./fileBrowserNavigationControls.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserNavigationControlsProps {
	backwardsPossible: boolean
	forwardsPossible: boolean
	history: string[]
	historyPointer: number
	onHistoryItemClicked: (index: number) => void
	onBackwards: () => void
	onForwards: () => void
}

class FileBrowserNavigationControlsHistoryEntry {
	value: string
	index: number
	tooltip: string

	constructor(value: string, index: number) {
		this.tooltip = value
		this.index = index

		const splitPath = this.tooltip.split("\\")
		this.value = splitPath[splitPath.length - 1]
	}
}

const FileBrowserNavigationControls = (
	props: IFileBrowserNavigationControlsProps
) => {
	const {
		history,
		onBackwards,
		onForwards,
		backwardsPossible,
		forwardsPossible,
		onHistoryItemClicked,
		historyPointer
	} = props

	const [showHistory, setShowHistory] = useState<boolean>(false)
	const dropdownRef = useRef<HTMLDivElement | null>(null)

	const onForwardsClicked = () => {
		if (forwardsPossible) {
			onForwards()
		}
	}

	const onBackwardsClicked = () => {
		if (backwardsPossible) {
			onBackwards()
		}
	}

	const onHistoryClicked = () => setShowHistory(sh => !sh)

	const onHistoryClickedOutside = () => setShowHistory(false)

	const onHistoryItemSelected = (historyItem: FileBrowserNavigationControlsHistoryEntry) => {
		setShowHistory(false)
		onHistoryItemClicked(historyItem.index)
	}

	const History = useMemo(() => {
		const historiesWithLastIndices: Record<string, number> = {}

		let selectedValue: string | null = null
		for (let historyIdx = 0; historyIdx < history.length; historyIdx++) {
			const historyValue = history[historyIdx]

			if (historyPointer === historyIdx) {
				selectedValue = historyValue
			}

			historiesWithLastIndices[historyValue] = historyIdx
		}

		const items: FileBrowserNavigationControlsHistoryEntry[] = []
		const keys = Object.keys(historiesWithLastIndices)

		let selectedIndex: number | null = null
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			const index = historiesWithLastIndices[key]

			if (key === selectedValue) {
				selectedIndex = i
			}

			items.push(
				new FileBrowserNavigationControlsHistoryEntry(
					key,
					index
				)
			)
		}

		return {
			Items: items,
			SelectedValue: selectedIndex !== null ? items[selectedIndex] : null
		}
	}, [history, historyPointer])

	return (
		<div className="file-browser-navigation-controls">
			<div
				className={`file-browser-navigation-controls__icon${!backwardsPossible ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onBackwardsClicked}
			>
				<LeftArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${!forwardsPossible ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onForwardsClicked}
			>
				<RightArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${!backwardsPossible ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				onClick={onBackwardsClicked}
			>
				<UpArrowIcon />
			</div>
			<div
				className={`file-browser-navigation-controls__icon${history.length === 0 ? "--disabled" : ""} ${NO_SELECT_CLASS}`}
				ref={dropdownRef}
				onClick={onHistoryClicked}
			>
				{showHistory ? <CollapseIcon /> : <ExpandIcon />}
			</div>
			{showHistory && (
				<Select
					items={History.Items}
					selected={History.SelectedValue}
					positionRef={dropdownRef}
					onItemSelected={onHistoryItemSelected}
					onClickOutside={onHistoryClickedOutside}
				/>)
			}
		</div>
	)
}

export default FileBrowserNavigationControls
