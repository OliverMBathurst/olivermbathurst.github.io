import { useEffect, useState } from "react"
import { LEAF_EXTENSION_PROPERTY_NAME } from "../constants"
import { Node } from "../types/fs"

const useDisplayName = (node: Node) => {
    const [displayName, setDisplayName] = useState<string>(node.name)

    useEffect(() => {
        let prefix = node.name

        if (LEAF_EXTENSION_PROPERTY_NAME in node) {
            setDisplayName(`${prefix}${node.extension}`)
        } else {
            setDisplayName(prefix)
        }
    }, [node])

    return displayName
}

export default useDisplayName