import { ILikenessResult } from "../interfaces/search"
import { BranchingContext } from "../types/fs"
import useFileSystem from "./fileSystem"

const useSearch = (context: BranchingContext) => {
	const { allForwardContextPaths, validateFilePath } = useFileSystem(context)

	const searchForItems = (term: string): ILikenessResult[] => {
		const items = allForwardContextPaths
		const results: ILikenessResult[] = []

		for (let i = 0; i < items.length; i++) {
			const validatedContext = validateFilePath(items[i].fullPath)

			if (!validatedContext) {
				continue
			}

			results.push({
				context: validatedContext,
				path: items[i].fullPath,
				score:
					validatedContext.fullName.toLowerCase().indexOf(term.toLowerCase()) === -1
						? 0
						: (term.length / validatedContext.fullName.length) * 100
			})
		}

		return results.filter((x) => x.score > 0)
	}

	return {
		searchForItems
	}
}

export default useSearch
