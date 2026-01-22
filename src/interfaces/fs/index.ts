import { JSX } from "react"
import { SpecialBranch } from "../../enums"
import { Branch, BranchingContext, Context, Leaf } from "../../types/fs"
import { IAddWindowProperties } from "../windows"

interface ILeafAndBranchContext extends INamed {
	leaves: Leaf[]
	branches: Branch[]
	shortcuts: Context[]
}

interface IChildContext {
	parent: BranchingContext | null
}

export interface IShortcut extends INamed, IChildContext {}

export interface INamed {
	name: string
	fullName: string
	toContextUniqueKey: () => string
}

export interface IRoot extends ILeafAndBranchContext {}

export interface IBranch extends ILeafAndBranchContext, IChildContext {
	type: SpecialBranch
}

export interface ILeaf extends IChildContext, INamed {
	extension: string
	icon: string | null
}

export interface IUrlShortcutFile extends ILeaf {
	url: string
}

export interface IWindowFile extends ILeaf {
	render: (props?: IWindowRenderProps) => JSX.Element
}

export interface IBranchFile extends ILeaf {
	getBranchingContext: (context: BranchingContext) => IAddWindowProperties
}

export interface IWindowRenderProps {
	onMouseOver?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export interface IForwardPath {
	path: string
	fullPath: string
}
