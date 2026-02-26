import { CLASSNAMES } from "../../../../constants"
import { PlusIcon } from "../../../../icons"
import { BranchingContext } from "../../../../types/fs"
import { FileBrowserTab } from "./components"
import "./fileBrowserTabs.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IFileBrowserTabsProps {
    contexts: BranchingContext[]
    selectedTabIndex: number
    onTabOpened: () => void
    onTabClosed: (index: number) => void
    onTabSelected: (index: number) => void
}

const FileBrowserTabs = (props: IFileBrowserTabsProps) => {
    const { contexts, selectedTabIndex, onTabOpened, onTabClosed, onTabSelected } = props

    return (
        <div className="file-browser-tabs">
            {contexts.map((c, i) => {
                return (
                    <FileBrowserTab
                        key={`file-browser-tab-${c.fullName}-${i}`}
                        context={c}
                        onTabSelected={() => onTabSelected(i)}
                        onTabClosed={() => onTabClosed(i)}
                        selected={i === selectedTabIndex}
                    />
                )
            })}
            <div className={`file-browser-tabs__plus-container ${NO_SELECT_CLASS}`}>
                <PlusIcon onClick={onTabOpened} />
            </div>
        </div>
    )
}

export default FileBrowserTabs