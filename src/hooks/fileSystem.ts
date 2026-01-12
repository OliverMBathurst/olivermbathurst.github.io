import { useContext, useEffect, useState } from "react"
import {
    BRANCHING_CONTEXT_PARENT_PROPERTY,
    BRANCHING_CONTEXT_TYPE_PROPERTY
} from "../constants"
import { FileSystemContext } from "../contexts"
import { SpecialBranch } from "../enums"
import { getDisplayName } from "../helpers/naming"
import { getFullPath } from "../helpers/paths"
import { IForwardPath } from "../interfaces/fs"
import { Branch, BranchingContext, Context, Leaf } from "../types/fs"

const useFileSystem = (context?: BranchingContext) => {
	const { root, allContextPaths } = useContext(FileSystemContext)

	const [currentContext, setCurrentContext] = useState<BranchingContext>(
		context ?? root
	)
	const [allForwardContextPaths, setAllForwardContextPaths] = useState<IForwardPath[]>(
		allContextPaths.map(cp => {
			return {
				path: cp,
				fullPath: cp
			}
		}))

	useEffect(() => {
		const fullPathOfCurrentContext = getFullPath(currentContext)
		const forwardItems = [...allContextPaths]
			.filter(p => p.startsWith(fullPathOfCurrentContext))
			.map(p => {
				let forwardPath = p.replace(fullPathOfCurrentContext, "")

				if (forwardPath.startsWith("\\")) {
					forwardPath = forwardPath.replace("\\", "")
				}

				return {
					path: forwardPath,
					fullPath: p
				}
			})

		setAllForwardContextPaths(forwardItems)
	}, [currentContext, allContextPaths])

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

			const matchingBranch: BranchingContext | undefined = _context.branches.find(x => x.name === newContextName)
			if (matchingBranch) {
				_context = matchingBranch
				continue
			}

			if (newContextName.indexOf(".") === -1) {
				return null
			}

			const matchingLeaf = _context.leaves.find(x => getDisplayName(x) === newContextName)
			if (matchingLeaf) {
				return matchingLeaf
			}

			const matchingShortcut = _context.shortcuts.find(x => getDisplayName(x) === newContextName)
			if (matchingShortcut) {
				return matchingShortcut
			}

			return null
		}

		return _context
	}

	return {
		allForwardContextPaths,
		upOneLevel,
		enterBranch,
		currentContext,
		searchForBranchByType,
		getFilesOfBranchRecursively,
		validateFilePath
	}
}

export default useFileSystem
