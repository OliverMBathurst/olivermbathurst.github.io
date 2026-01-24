import { IStartMenuFolderRowProps, StartMenuFileRow } from ".."
import { NO_SELECT_CLASS } from "../../../../constants"
import { getIcon } from "../../../../helpers/icons"
import { getDisplayName } from "../../../../helpers/naming"
import { CollapseIcon, ExpandIcon } from "../../../../icons"
import "./startMenuFolderRow.scss"

const StartMenuFolderRow = (props: IStartMenuFolderRowProps) => {
	const {
		index,
		context,
		prefix,
		openedFolders,
		selectedContextKey,
		onFolderRowClicked,
		onFileRowClicked,
		onFileRowDoubleClicked
	} = props

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const key = prefix
	const opened = openedFolders.indexOf(prefix) !== -1

	const style: React.CSSProperties = {
		paddingLeft: `${(2 * index) / 16}rem`
	}

	const ExpandedItems = () => {
		if (!opened) {
			return null
		}

		let items = [...context.branches].map(b => {
			return (
				<StartMenuFolderRow
					key={`expanded-${key}\\${b.fullName}`}
					index={index + 1}
					context={b}
					prefix={`${key}\\${b.fullName}`}
					openedFolders={openedFolders}
					selectedContextKey={selectedContextKey}
					onFolderRowClicked={onFolderRowClicked}
					onFileRowClicked={onFileRowClicked}
					onFileRowDoubleClicked={onFileRowDoubleClicked}
				/>
			)
		})

		items = items.concat([...context.leaves, ...context.shortcuts].map(c => {
			return (
				<StartMenuFileRow
					key={`expanded-${key}\\${c.fullName}`}
					index={index + 1}
					context={c}
					prefix={`${key}\\${c.fullName}`}
					selectedContextKey={selectedContextKey}
					onRowClicked={onFileRowClicked}
					onFileRowDoubleClicked={onFileRowDoubleClicked}
				/>
			)
		}))

		return items
	}

	return (
		<>
			<div
				className="start-menu-folder-row"
				key={key}
				style={style}
				onClick={(e) => onFolderRowClicked(key, e)}
			>
				<div
					className={`start-menu-folder-row__icon ${NO_SELECT_CLASS}`}
				>
					{Icon}
				</div>
				<div
					className={`start-menu-folder-row__name ${NO_SELECT_CLASS}`}
				>
					{DisplayName}
				</div>
				<div className={`start-menu-folder-row__arrow-container ${NO_SELECT_CLASS}`}>
					{opened ? <CollapseIcon /> : <ExpandIcon />}
				</div>
			</div>
			{opened && <ExpandedItems />}
		</>
	)
}

export default StartMenuFolderRow