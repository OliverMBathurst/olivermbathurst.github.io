import { JSX } from "react";
import { SpecialBranch } from "../../enums";
import { Branch, Leaf, Node, Root } from "../../types/fs";

interface ILeafAndBranchNode extends INamed {
	leaves: Leaf[]
	branches: Branch[]
	shortcuts: Node[]
}

interface IChildNode {
	parent: Branch | Root | null
}

export interface IShortcut extends INamed { }

export interface INamed {
	name: string
	toContextUniqueKey: () => string
}

export interface IRoot extends ILeafAndBranchNode { }

export interface IBranch extends ILeafAndBranchNode, IChildNode {
	type: SpecialBranch
}

export interface ILeaf extends IChildNode, INamed {
	extension: string
}

export interface IUrlShortcutFile extends ILeaf {
	url: string
}

export interface IWindowFile extends ILeaf {
	render: (props?: IWindowRenderProps) => JSX.Element
}

export interface IWindowRenderProps {
	onMouseOver?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}