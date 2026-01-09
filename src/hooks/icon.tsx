import { JSX, useMemo } from "react"
import {
    NO_SELECT_CLASS
} from "../constants"
import { getIcon } from "../helpers/icon"
import {
    IIconProps
} from "../icons"
import { Context } from "../types/fs"

const useIcon: (context: Context, noSelect?: boolean) => JSX.Element = (
	context: Context,
	noSelect: boolean = true
) => {
	const Icon = useMemo(() => {
		const props: IIconProps = {
			className: noSelect ? NO_SELECT_CLASS : "",
			draggable: false
		}

		return getIcon(context, props)
	}, [context, noSelect, getIcon])

	return <>{Icon}</>
}

export default useIcon
