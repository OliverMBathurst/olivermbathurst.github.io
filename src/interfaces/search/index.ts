import { Context } from "../../types/fs"

export interface ILikenessResult {
	context: Context
	path: string
	score: number
}

export interface ISearchResult {
	term: string
	items: ILikenessResult[]
}
