import { useContext, useEffect, useState } from "react"
import {
	BRANCHING_CONTEXT_PARENT_PROPERTY,
	BRANCHING_CONTEXT_TYPE_PROPERTY
} from "../constants"
import { FileSystemContext } from "../contexts"
import { SpecialBranch } from "../enums"
import { getDisplayName } from "../helpers/naming"
import { getFullPath } from "../helpers/paths"
import { IForwardContext } from "../interfaces/fs"
import { Branch, BranchingContext, Context, Leaf } from "../types/fs"

const useFileSystem = (context?: BranchingContext) => {
	const { root, nonRootContextInformation } = useContext(FileSystemContext)

	const [currentContext, setCurrentContext] = useState<BranchingContext>(
		context ?? root
	)
	const [forwardContexts, setAllForwardContexts] = useState<IForwardContext[]>([])

	useEffect(() => {
		const fullPathOfCurrentContext = getFullPath(currentContext)
		const forwardContexts = [...nonRootContextInformation]
			.filter((ci) => ci.fullPath.startsWith(fullPathOfCurrentContext))
			.map((ci) => {
				let forwardPath = ci.fullPath.replace(fullPathOfCurrentContext, "")

				if (forwardPath.startsWith("\\")) {
					forwardPath = forwardPath.replace("\\", "")
				}

				return {
					forwardPath: forwardPath,
					fullPath: ci.fullPath,
					context: ci.context
				}
			})

		setAllForwardContexts(forwardContexts)
	}, [currentContext, nonRootContextInformation])

	const upOneLevel = () => {
		if (!(BRANCHING_CONTEXT_PARENT_PROPERTY in currentContext)) {
			return
		}

		if (currentContext.parent) {
			setCurrentContext(currentContext.parent)
		}
	}

	const enterBranch = (branchName: string) => {
		const foundBranch = currentContext.branches.find(
			(x) => x.name === branchName
		)
		if (foundBranch) {
			setCurrentContext(foundBranch)
		}
	}

	const searchForBranchByType = (
		branch: BranchingContext,
		branchType: SpecialBranch
	): Branch | null => {
		if (
			BRANCHING_CONTEXT_TYPE_PROPERTY in branch &&
			branch.type === branchType
		) {
			return branch
		}

		for (let i = 0; i < branch.branches.length; i++) {
			const foundFolder = searchForBranchByType(branch.branches[i], branchType)
			if (foundFolder) {
				return foundFolder
			}
		}

		return null
	}

	const getFilesOfBranchRecursively = (branch?: Branch): Leaf[] => {
		const targetBranch = branch ?? root
		let files: Leaf[] = [...targetBranch.leaves]
		for (const b of targetBranch.branches) {
			files = files.concat(getFilesOfBranchRecursively(b))
		}

		return files
	}

	const validateFilePath = (path: string): Context | null => {
		if (!path) {
			return root
		}

		const split = path.split("\\")
		if (split.length === 1) {
			if (split[0] === root.name) {
				return root
			}

			return null
		}

		if (split[0] !== root.name) {
			return root
		}

		let _context: BranchingContext = root
		for (let i = 1; i < split.length; i++) {
			const newContextName = split[i]
			if (newContextName === "") {
				return _context
			}

			const matchingBranch: BranchingContext | undefined =
				_context.branches.find((x) => x.name === newContextName)
			if (matchingBranch) {
				_context = matchingBranch
				continue
			}

			if (newContextName.indexOf(".") === -1) {
				return null
			}

			const matchingLeaf = _context.leaves.find(
				(x) => getDisplayName(x) === newContextName
			)
			if (matchingLeaf) {
				return matchingLeaf
			}

			const matchingShortcut = _context.shortcuts.find(
				(x) => getDisplayName(x) === newContextName
			)
			if (matchingShortcut) {
				return matchingShortcut
			}

			return null
		}

		return _context
	}

	return {
		forwardContexts,
		upOneLevel,
		enterBranch,
		currentContext,
		searchForBranchByType,
		getFilesOfBranchRecursively,
		validateFilePath
	}
}

export default useFileSystem
