import {
	IApplicationFile,
	IDataFile,
	IGameFile,
	ITextFile,
	IUploadedWindowFile,
	IUrlShortcutFile
} from "../../interfaces/fs"
import AbstractLeaf from "./abstractLeaf"
import AbstractNamed from "./abstractNamed"
import AbstractUploadedWindowFile from "./abstractUploadedFile"
import Branch from "./branch"
import Root from "./root"
import Shortcut from "./shortcut"

export type BranchingContext = Root | Branch

export type Context = Root | Branch | Leaf | Shortcut

export type Leaf =
	| IUrlShortcutFile
	| IUploadedWindowFile
	| IApplicationFile
	| IDataFile
	| ITextFile
	| IGameFile

export {
	AbstractLeaf,
	AbstractNamed,
	AbstractUploadedWindowFile,
	Branch,
	Root,
	Shortcut
}
