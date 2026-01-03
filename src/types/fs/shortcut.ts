import { Node } from ".";
import { IShortcut } from "../../interfaces/fs";

class Shortcut implements IShortcut {
    private _name: string
    node: Node

    constructor(
        node: Node,
        name: string
    ) {
        this.node = node
        this._name = name
    }

    get name() {
        return `${this._name} (Shortcut)`
    }

    toContextUniqueKey: () => string = () => `${this.name}-${this.node.name}-shortcut`
}

export default Shortcut