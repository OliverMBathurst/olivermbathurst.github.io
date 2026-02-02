import { MonacoEditor } from "../components/monaco";
import { FILETYPE_EXECUTABLE } from "../constants";
import { IApplicationFile } from "../interfaces/fs";
import { AbstractLeaf, BranchingContext, Context } from "../types/fs";

class TextFileViewer extends AbstractLeaf implements IApplicationFile {
    constructor(parent: BranchingContext) {
        super("Monaco Editor", FILETYPE_EXECUTABLE, parent)
    }

    handle = (windowId: string, context: Context) => (
        <MonacoEditor windowId={windowId} context={context} />
    )
}

export default TextFileViewer