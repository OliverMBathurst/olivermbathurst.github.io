import { IStartMenuFolderRowProps, StartMenuFileRow } from ".."
import { NO_SELECT_CLASS } from "../../../../../../constants"
import { getIcon } from "../../../../../../helpers/icons"
import { getDisplayName } from "../../../../../../helpers/naming"
import { CollapseIcon, ExpandIcon } from "../../../../../../icons"
import "./startMenuFolderRow.scss"

const StartMenuFolderRow = (props: IStartMenuFolderRowProps) => {
	const {
		index,
		context,
		prefix,
		fullPath,
		openedFolders,
		selectedContextKeys,
		onFolderRowClicked,
		onFileRowClicked
	} = props

	const Icon = getIcon(context)
	const DisplayName = getDisplayName(context)
	const key = prefix + fullPath
	const opened = openedFolders.indexOf(key) !== -1

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
					key={`expanded-` + prefix + b.name}
					index={index + 1}
					context={b}
					prefix={prefix + "branch-"}
					fullPath={fullPath}
					openedFolders={openedFolders}
					selectedContextKeys={selectedContextKeys}
					onFolderRowClicked={onFolderRowClicked}
					onFileRowClicked={onFileRowClicked}
				/>
			)
		})

		items = items.concat([...context.leaves, ...context.shortcuts].map(c => {
			return (
				<StartMenuFileRow
					key={`expanded-` + prefix + c.name}
					index={index + 1}
					context={c}
					prefix={prefix + "leaf-"}
					fullPath={fullPath}
					selectedContextKeys={selectedContextKeys}
					onRowClicked={onFileRowClicked}
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