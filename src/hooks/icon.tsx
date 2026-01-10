import { JSX, useMemo } from "react"
import { NO_SELECT_CLASS } from "../constants"
import { getIcon } from "../helpers/icons"
import { IIconProps } from "../icons"
import { Context } from "../types/fs"

const useIcon: (context: Context, noSelect?: boolean, options?: IIconProps) => JSX.Element = (
	context: Context,
	noSelect: boolean = true,
	options
) => {
	const Icon = useMemo(() => {
		const props: IIconProps = {
			className: noSelect ? NO_SELECT_CLASS : "",
			draggable: false,
			...options
		}

		return getIcon(context, props)
	}, [context, noSelect, getIcon])

	return <>{Icon}</>
}

export default useIcon
