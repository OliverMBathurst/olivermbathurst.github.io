import { JSX } from "react"
import { SpecialBranch } from "../../enums"
import {
	Branch,
	BranchingContext,
	Context,
	Leaf,
	Shortcut
} from "../../types/fs"
import { IAddWindowProperties } from "../windows"
export interface IShortcut extends INamed, IChildContext {}

export interface IRoot extends ILeafAndBranchContext {}

export interface ILeaf extends IChildContext, INamed, IIcon, IExtensionAvailable { }

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
}

export interface IUrlShortcutFile extends ILeaf {
	url: string
}

export interface IUploadedFile extends INamed, IIcon {
	data: string | null
	path: string
	epoch: number
}

export interface IBranchFile extends ILeaf {
	getBranchingContext: (context: BranchingContext) => IAddWindowProperties
}

export interface IWindowRenderProps<T> {
	windowId: string
	context: Context
	onMouseOver?: (e: React.MouseEvent<T, MouseEvent>) => void
}

export interface IForwardContextInformation {
	forwardPath: string
	fullPath: string
	context: Context
}

export interface IForwardContext<T extends Context> {
	forwardPath: string
	fullPath: string
	context: T
}

export interface INonRootContextInformation {
	context: Branch | Leaf | Shortcut
	fullPath: string
}

export interface IUploadedWindowFile extends IAbstractUploadedWindowFile, IRenderable { }

export interface IAbstractUploadedWindowFile extends IUploadedFile, INamed, IExtensionAvailable { }

export interface IWindowFile extends ILeaf, IRenderable { }

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

interface IRenderable {
	render: (windowId: string, context: Context, props?: IWindowRenderProps<HTMLElement>) => JSX.Element
}