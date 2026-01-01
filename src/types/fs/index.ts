import { IUrlShortcutFile, IWindowFile } from "../../interfaces/fs";
import AbstractLeaf from './abstractLeaf';
import Branch from "./branch";
import Root from "./root";
import Shortcut from "./shortcut";

export type BranchingNode = Root | Branch

export type Node = Root | Branch | Leaf | Shortcut

export type Leaf = IUrlShortcutFile | IWindowFile

export { AbstractLeaf, Branch, Root, Shortcut };
