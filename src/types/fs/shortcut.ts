import { Node } from ".";
import { INamed } from "../../interfaces/fs";

class Shortcut implements INamed {
    node: Node
    name: string

    constructor(
        node: Node,
        name: string
    ) {
        this.node = node
        this.name = name
    }
}

export default Shortcut