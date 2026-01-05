import { useEffect, useState } from "react"
import { LEAF_EXTENSION_PROPERTY_NAME } from "../constants"
import { Context } from "../types/fs"

const useDisplayName = (context: Context) => {
    const [displayName, setDisplayName] = useState<string>(context.name)

    useEffect(() => {
        let prefix = context.name

        if (LEAF_EXTENSION_PROPERTY_NAME in context) {
            setDisplayName(`${prefix}${context.extension}`)
        } else {
            setDisplayName(prefix)
        }
    }, [context])

    return displayName
}

export default useDisplayName