import { JSX } from "react";
import { BranchType } from "../../enums";
import { Branch, Leaf, Node, Root } from "../../types/fs";

interface ILeafAndBranchNode extends INamed {
	leaves: Leaf[]
	branches: Branch[]
	shortcuts: Node[]
}

interface IChildNode {
	parent: Branch | Root | null
}

export interface INamed {
	name: string
}

export interface IRoot extends ILeafAndBranchNode { }

export interface IBranch extends ILeafAndBranchNode, IChildNode {
	type: BranchType
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