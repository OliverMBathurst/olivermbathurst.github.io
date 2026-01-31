import {
    IApplicationFile,
    IDataFile,
    IUploadedWindowFile,
    IUrlShortcutFile
} from "../../interfaces/fs"
import AbstractLeaf from "./abstractLeaf"
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

export { AbstractLeaf, AbstractUploadedWindowFile, Branch, Root, Shortcut }
