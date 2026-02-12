import { Context } from "../../types/fs"

export interface IFileSystemResultTuple {
	context: Context
	path: string
}

export interface ILikenessResult extends IFileSystemResultTuple {
	score: number
}

export interface ISearchResult {
	term: string
	items: ILikenessResult[]
}
