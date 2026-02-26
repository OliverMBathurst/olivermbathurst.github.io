import { useEffect, useState } from "react"
import { getDisplayName } from "../helpers/naming"
import { Context } from "../types/fs"

const useDisplayName = (context: Context) => {
	const [displayName, setDisplayName] = useState<string>(context.name)

	useEffect(() => {
		setDisplayName(getDisplayName(context))
	}, [setDisplayName, getDisplayName, context])

	return displayName
}

export default useDisplayName
