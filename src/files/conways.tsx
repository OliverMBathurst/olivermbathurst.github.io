import { ConwaysGameOfLife } from "../components/games";
import { FILETYPE_GAME } from "../constants";
import { IGameFile } from "../interfaces/fs";
import { AbstractLeaf, BranchingContext, Context } from "../types/fs";

class Conways extends AbstractLeaf implements IGameFile {
    constructor(parent: BranchingContext) {
        super("Conway's Game Of Life", FILETYPE_GAME, parent)
    }

    render = (windowId: string, context: Context) => (
        <ConwaysGameOfLife windowId={windowId} context={context} />
    )
}

export default Conways