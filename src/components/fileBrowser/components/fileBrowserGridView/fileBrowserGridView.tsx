import { useRef } from "react"
import { FILE_BROWSER_GRID_VIEW_CLASS, NO_SELECT_CLASS } from "../../../../constants"
import { ExpandDirection } from "../../../../enums"
import { getIcon } from "../../../../helpers/icons"
import { getType } from "../../../../helpers/type"
import { Branch, Context, Leaf, Shortcut } from "../../../../types/fs"
import { Expandable } from "../../../expandable"
import "./fileBrowserGridView.scss"

interface IFileBrowserGridViewProps {
	entities: (Branch | Shortcut | Leaf)[]
	selected: string[]
	setRowReference: (ref: HTMLElement | null, key: string) => void
	onRowDoubleClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		context: Context
	) => void
	onRowClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		context: Context
	) => void
}

const now = new Date()
now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
const formattedDate = now
	.toISOString()
	.slice(0, 19)
	.replaceAll("-", "/")
	.replaceAll("T", " ")

const gridHeaderExpandableProps = {
	allowedExpandDirections: ExpandDirection.Right,
	minWidth: 152
}

enum RowIdentifier {
	Name,
	DateModified,
	Type,
	Size
}

const rowCellClassNames: Record<RowIdentifier, string> = {
	[RowIdentifier.Name]: "file-browser-grid-view__content__row__cell__name",
	[RowIdentifier.DateModified]:
		"file-browser-grid-view__content__row__cell__date",
	[RowIdentifier.Type]: "file-browser-grid-view__content__row__cell__type",
	[RowIdentifier.Size]: "file-browser-grid-view__content__row__cell__size"
}

const FileBrowserGridView = (props: IFileBrowserGridViewProps) => {
	const {
		entities,
		selected,
		setRowReference,
		onRowDoubleClicked,
		onRowClicked
	} = props

	const gridRef = useRef<HTMLDivElement | null>(null)

	const onHeaderWidthChanged = (rowId: RowIdentifier, newWidth: number) => {
		const className = rowCellClassNames[rowId]

		if (gridRef.current) {
			const elems = gridRef.current.getElementsByClassName(className)
			for (const elem of elems) {
				elem.setAttribute("style", `width : ${newWidth}px`)
			}
		}
	}

	return (
		<div className={FILE_BROWSER_GRID_VIEW_CLASS} ref={gridRef}>
			<div className="file-browser-grid-view__head">
				<Expandable
					{...gridHeaderExpandableProps}
					onWidthChanged={(w) => onHeaderWidthChanged(RowIdentifier.Name, w)}
				>
					<div
						className={`file-browser-grid-view__head__name ${NO_SELECT_CLASS}`}
					>
						<span className="file-browser-grid-view__head__name__text">
							Name
						</span>
					</div>
				</Expandable>
				<Expandable
					{...gridHeaderExpandableProps}
					onWidthChanged={(w) =>
						onHeaderWidthChanged(RowIdentifier.DateModified, w)
					}
				>
					<div
						className={`file-browser-grid-view__head__date ${NO_SELECT_CLASS}`}
					>
						<span className="file-browser-grid-view__head__date__text">
							Date modified
						</span>
					</div>
				</Expandable>
				<Expandable
					{...gridHeaderExpandableProps}
					onWidthChanged={(w) => onHeaderWidthChanged(RowIdentifier.Type, w)}
				>
					<div
						className={`file-browser-grid-view__head__type ${NO_SELECT_CLASS}`}
					>
						<span className="file-browser-grid-view__head__type__text">
							Type
						</span>
					</div>
				</Expandable>
				<Expandable
					{...gridHeaderExpandableProps}
					onWidthChanged={(w) => onHeaderWidthChanged(RowIdentifier.Size, w)}
				>
					<div
						className={`file-browser-grid-view__head__size ${NO_SELECT_CLASS}`}
					>
						<span className="file-browser-grid-view__head__size__text">
							Size
						</span>
					</div>
				</Expandable>
			</div>
			<div className="file-browser-grid-view__content">
				{entities.map((e) => {
					const contextKey = e.toContextUniqueKey()
					const fileTypeDescriptor = getType(e)
					const _selected = selected.indexOf(contextKey) !== -1
					const icon = getIcon(e)

					return (
						<div
							key={contextKey}
							className={`file-browser-grid-view__content__row${_selected ? "--selected" : ""}`}
							ref={(elem) => setRowReference(elem, contextKey)}
							onClick={(ev) => onRowClicked(ev, e)}
							onDoubleClick={(ev) => onRowDoubleClicked(ev, e)}
						>
							<div
								className={`${rowCellClassNames[RowIdentifier.Name]} ${NO_SELECT_CLASS}`}
							>
								<div className="file-browser-grid-view__content__row__cell__name__inner">
									{icon}
									<span className="file-browser-grid-view__content__row__cell__name__text">
										{e.fullName}
									</span>
								</div>
							</div>
							<div
								className={`${rowCellClassNames[RowIdentifier.DateModified]} ${NO_SELECT_CLASS}`}
							>
								<span className="file-browser-grid-view__content__row__cell__date__text">
									{formattedDate}
								</span>
							</div>
							<div
								className={`${rowCellClassNames[RowIdentifier.Type]} ${NO_SELECT_CLASS}`}
							>
								<span className="file-browser-grid-view__content__row__cell__type__text">
									{fileTypeDescriptor}
								</span>
							</div>
							<div
								className={`${rowCellClassNames[RowIdentifier.Size]} ${NO_SELECT_CLASS}`}
							>
								<span className="file-browser-grid-view__content__row__cell__size__text">
									{0}
								</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default FileBrowserGridView
