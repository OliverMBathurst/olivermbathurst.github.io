import { ILikenessResult } from "../interfaces/search"
import { BranchingContext } from "../types/fs"
import useFileSystem from "./fileSystem"

const useSearch = (context: BranchingContext) => {
	const { forwardContexts } = useFileSystem(context)

	const searchForItems = (term: string): ILikenessResult[] => {
		const items = forwardContexts
		const results: ILikenessResult[] = []

		for (let i = 0; i < items.length; i++) {
			const { context, fullPath } = items[i]

			results.push({
				context: context,
				path: fullPath,
				score:
					context.fullName
						.toLowerCase()
						.indexOf(term.toLowerCase()) === -1
						? 0
						: (term.length / context.fullName.length) * 100
			})
		}

		return results.filter((x) => x.score > 0)
	}

	return {
		searchForItems
	}
}

export default useSearch
