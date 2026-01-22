import { NO_SELECT_CLASS } from "../../../../constants"
import { getIcon } from "../../../../helpers/icons"
import { getType } from "../../../../helpers/type"
import { Branch, Context, Leaf, Shortcut } from "../../../../types/fs"
import "./fileBrowserGridView.scss"

interface IFileBrowserGridViewProps {
    entities: (Branch | Shortcut | Leaf)[]
    selected: string[]
    setRowReference: (ref: HTMLElement | null, key: string) => void
    onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, context: Context) => void
    onRowClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, context: Context) => void
}

const now = new Date()
now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
const formattedDate = now
    .toISOString()
    .slice(0, 19)
    .replaceAll("-", "/")
    .replaceAll("T", " ")

const FileBrowserGridView = (props: IFileBrowserGridViewProps) => {
    const {
        entities,
        selected,
        setRowReference,
        onRowDoubleClicked,
        onRowClicked
    } = props


    return (
        <div className="file-browser-grid-view">
            <div className="file-browser-grid-view__head">
                <div className={`file-browser-grid-view__head__name ${NO_SELECT_CLASS}`}>Name</div>
                <div className={`file-browser-grid-view__head__date ${NO_SELECT_CLASS}`}>Date modified</div>
                <div className={`file-browser-grid-view__head__type ${NO_SELECT_CLASS}`}>Type</div>
                <div className={`file-browser-grid-view__head__size ${NO_SELECT_CLASS}`}>Size</div>
            </div>
            <div className="file-browser-grid-view__content">
                {entities.map(e => {
                    const contextKey = e.toContextUniqueKey()
                    const fileTypeDescriptor = getType(e)
                    const _selected = selected.indexOf(contextKey) !== -1
                    const icon = getIcon(e)

                    return (
                        <div
                            key={contextKey}
                            className={`file-browser-grid-view__content__row${_selected ? "--selected" : ""}`}
                            ref={elem => setRowReference(elem, contextKey)}
                            onClick={(ev) => onRowClicked(ev, e)}
                            onDoubleClick={(ev) => onRowDoubleClicked(ev, e)}
                        >
                            <div className={`file-browser-grid-view__content__row__cell__name ${NO_SELECT_CLASS}`}>{icon}<span>{e.fullName}</span></div>
                            <div className={`file-browser-grid-view__content__row__cell__date ${NO_SELECT_CLASS}`}><span>{formattedDate}</span></div>
                            <div className={`file-browser-grid-view__content__row__cell__type ${NO_SELECT_CLASS}`}><span>{fileTypeDescriptor}</span></div>
                            <div className={`file-browser-grid-view__content__row__cell__size ${NO_SELECT_CLASS}`}><span>{0}</span></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FileBrowserGridView