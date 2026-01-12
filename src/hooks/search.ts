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
                path: items[i].fullPath,
                score: checkLikeness(validatedContext.name, term)
            })
        }

        return results
    }

    const checkLikeness = (name: string, term: string): number => {
        // TODO return likeness
        return 0
    }

    return {
        searchForItems
    }
}

export default useSearch