import { JSX } from "react"
import { SpecialBranch } from "../../enums"
import { Branch, Leaf, Context, Root } from "../../types/fs"

interface ILeafAndBranchContext extends INamed {
	leaves: Leaf[]
	branches: Branch[]
	shortcuts: Context[]
}

interface IChildContext {
	parent: Branch | Root | null
}

export interface IShortcut extends INamed {}

export interface INamed {
	name: string
	toContextUniqueKey: () => string
}

export interface IRoot extends ILeafAndBranchContext {}

export interface IBranch extends ILeafAndBranchContext, IChildContext {
	type: SpecialBranch
}

export interface ILeaf extends IChildContext, INamed {
	extension: string
}

export interface IUrlShortcutFile extends ILeaf {
	url: string
}

export interface IWindowFile extends ILeaf {
	render: (props?: IWindowRenderProps) => JSX.Element
}

export interface IWindowRenderProps {
	onMouseOver?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
