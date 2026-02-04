import { JsDosPlayer as JsDosPlayerComponent } from "../components/jsDosPlayer"
import { FILETYPE_EXECUTABLE } from "../constants"
import { IApplicationFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

const icon = "/src/icons/jsDos.png"

class JsDosPlayer extends AbstractLeaf implements IApplicationFile {
    constructor(parent: BranchingContext) {
        super("JS-DOS Player", FILETYPE_EXECUTABLE, parent)
        this.icon = icon
    }

    handle = (windowId: string, context: Context) => (
        <JsDosPlayerComponent windowId={windowId} context={context} path="digger.jsdos" />
    )
}

export default JsDosPlayer