import { JSX } from "react";
import { PhotoViewer as PhotoViewerComponent } from "../components/photoViewer";
import { FILETYPE_EXECUTABLE } from "../constants";
import { IApplicationFile } from "../interfaces/fs";
import { AbstractLeaf, BranchingContext, Context } from "../types/fs";

const icon = "/src/icons/image.png"

class PhotoViewer extends AbstractLeaf implements IApplicationFile {
    constructor(parent: BranchingContext) {
        super("Photo Viewer", FILETYPE_EXECUTABLE, parent)
        this.icon = icon
    }

    handle = (windowId: string, context: Context, setWindowTopBar: (component: JSX.Element) => void, _arguments?: string) => (
        <PhotoViewerComponent windowId={windowId} context={context} setWindowTopBar={setWindowTopBar} arguments={_arguments} />
    )
}

export default PhotoViewer