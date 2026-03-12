import * as monaco from "monaco-editor"
import React, { JSX } from "react"
import { SpecialBranch } from "../../enums"
import {
	Branch,
	BranchingContext,
	Context,
	Leaf,
	Root,
	Shortcut
} from "../../types/fs"

export interface IShortcut extends INamed, IChildContext {}

export interface IRoot extends ILeafAndBranchContext {}

export interface ILeaf
	extends IChildContext, INamed, IIcon, IExtensionAvailable {}

export interface INamed {
	name: string
	fullName: string
	toContextUniqueKey: () => string
}

export interface IBranch extends ILeafAndBranchContext, IChildContext {
	type: SpecialBranch
}

export interface IIcon {
	icon: string | null
	windowTopBarCustomIconDisplay: boolean
}

export interface IUrlShortcutFile extends ILeaf {
	url: string
}

export interface IDataFile extends INamed, IExtensionAvailable {
	data: string | null
}

export interface ITextFile extends INamed, IExtensionAvailable {
	text: string
	language?: string
	path?: monaco.Uri
	options?: monaco.editor.IStandaloneEditorConstructionOptions
}

export interface IUploadedFile extends INamed, IIcon, IDataFile {
	path: string
	epoch: number
}

export interface IWindowRenderProps {
	windowId: string
	context: Context
	setWindowTopBar: (component: JSX.Element) => void
	arguments?: string
}

export interface IForwardContextInformation {
	forwardPath: string
	fullPath: string
	context: Context
}

export interface IContextInformationTuple {
	context: Branch | Leaf | Shortcut | Root
	fullPath: string
}

export interface IUploadedWindowFile extends IAbstractUploadedWindowFile {}

export interface IAbstractUploadedWindowFile
	extends IUploadedFile, INamed, IExtensionAvailable {}

export interface IApplicationFile extends INamed, IIcon, IExtensionAvailable {
	handle: (windowId: string, context: Context, setWindowTopBar: (component: JSX.Element) => void, _arguments?: string) => JSX.Element
}

export interface IGameFile extends INamed, IIcon, IExtensionAvailable {
	render: (windowId: string, context: Context) => JSX.Element
}

interface ILeafAndBranchContext extends INamed {
	leaves: Leaf[]
	branches: Branch[]
	shortcuts: Context[]
}

interface IChildContext {
	parent: BranchingContext | null
}

interface IExtensionAvailable {
	extension: string
}
