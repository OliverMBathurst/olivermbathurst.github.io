import { JSX, useMemo } from "react"
import { NO_SELECT_CLASS } from "../constants"
import { getIcon } from "../helpers/icons"
import { Context } from "../types/fs"

const useIcon: (
	context: Context,
	noSelect?: boolean,
	options?: React.ImgHTMLAttributes<HTMLImageElement>
) => JSX.Element = (context: Context, noSelect: boolean = true, options) => {
	const Icon = useMemo(() => {
		const props: React.ImgHTMLAttributes<HTMLImageElement> = {
			className: noSelect ? NO_SELECT_CLASS : "",
			draggable: false,
			...options
		}

		return getIcon(context, props)
	}, [context, noSelect, getIcon])

	return <>{Icon}</>
}

export default useIcon
