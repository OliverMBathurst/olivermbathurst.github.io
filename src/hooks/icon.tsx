import { useMemo } from "react"
import { CLASSNAMES } from "../constants"
import { getIcon } from "../helpers/icons"
import { Context } from "../types/fs"

const { NO_SELECT_CLASS } = CLASSNAMES

const useIcon = (
	context: Context,
	noSelect: boolean = true,
	props?: React.ImgHTMLAttributes<HTMLImageElement>,
	showSelectedIcon?: boolean,
	showCustomIcon?: boolean
) => {
	const Icon = useMemo(() => {
		const _props: React.ImgHTMLAttributes<HTMLImageElement> = {
			className: noSelect ? NO_SELECT_CLASS : "",
			draggable: false,
			...props
		}

		return getIcon(
			context,
			_props,
			showSelectedIcon,
			undefined,
			showCustomIcon
		)
	}, [context, noSelect, props, showSelectedIcon, getIcon])

	return <>{Icon}</>
}

export default useIcon
