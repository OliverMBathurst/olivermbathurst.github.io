import { CLASSNAMES } from "../../../../../../constants"
import { getIcon } from "../../../../../../helpers/icons"
import { getDisplayName } from "../../../../../../helpers/naming"
import { CollapseIcon, ExpandIcon } from "../../../../../../icons"
import { BranchingContext } from "../../../../../../types/fs"
import "./fileBrowserTreeFolderRow.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserTreeFolderRowProps {
	index: number
	context: BranchingContext
	prefix: string
	selectedContextKeys: string[]
	openContextKeys: string[]
	onBranchExpansionChanged: (
		fullPath: string,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => void
	onBranchRowClicked: (
		fullPath: string,
		context: BranchingContext,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => void
}

const FileBrowserTreeFolderRow = (props: IFileBrowserTreeFolderRowProps) => {
	const { index, context, prefix, selectedContextKeys, openContextKeys, onBranchRowClicked, onBranchExpansionChanged } = props

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const key = prefix

	const opened = openContextKeys.indexOf(key) !== -1
	const selected = selectedContextKeys.indexOf(key) !== -1
	const hasChildren = context.branches.length > 0

	const style: React.CSSProperties = {
		paddingLeft: `${(2 * index) / 16 + (!hasChildren ? 1.9 : 0.25)}rem`
	}

	const ExpandedItems = () => {
		if (!opened) {
			return null
		}

		return context.branches.map((b) => {
			return (
				<FileBrowserTreeFolderRow
					key={`expanded-${key}\\${b.fullName}`}
					index={index + 1}
					context={b}
					prefix={`${key}\\${b.fullName}`}
					selectedContextKeys={selectedContextKeys}
					openContextKeys={openContextKeys}
					onBranchRowClicked={onBranchRowClicked}
					onBranchExpansionChanged={onBranchExpansionChanged}
				/>
			)
		})
	}

	const onBranchRowClickedInternal = (
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		onBranchRowClicked(key, context, e)
	}

	const onExpansionButtonClickedInternal = (
		e: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		e.stopPropagation()
		onBranchExpansionChanged(key, e)
	}

	return (
		<>
			<div
				className={`file-browser-tree__folder-row${selected ? "--selected" : ""}`}
				key={key}
				style={style}
				onClick={onBranchRowClickedInternal}
			>
				{hasChildren && (
					<div
						className={`file-browser-tree__folder-row__arrow-container ${NO_SELECT_CLASS}`}
						onClick={onExpansionButtonClickedInternal}
					>
						{opened ? <CollapseIcon /> : <ExpandIcon />}
					</div>
				)}
				<div
					className={`file-browser-tree__folder-row__icon ${NO_SELECT_CLASS}`}
				>
					{Icon}
				</div>
				<div
					className={`file-browser-tree__folder-row__name ${NO_SELECT_CLASS}`}
				>
					{DisplayName}
				</div>
			</div>
			{opened && <ExpandedItems />}
		</>
	)
}

export default FileBrowserTreeFolderRow
