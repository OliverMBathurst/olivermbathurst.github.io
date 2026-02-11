import { useContext, useEffect, useState } from "react"
import { FileSystemContext } from "../contexts"
import { getDisplayName } from "../helpers/naming"
import { IForwardContextInformation } from "../interfaces/fs"
import { Branch, BranchingContext, Context, Leaf } from "../types/fs"

const useFileSystem = (context?: BranchingContext) => {
	const { root, nonRootContextInformation, getForwardContexts } = useContext(FileSystemContext)

	const [currentContext, setCurrentContext] = useState<BranchingContext>(
		context ?? root
	)
	const [forwardContexts, setAllForwardContexts] = useState<
		IForwardContextInformation[]
	>([])

	useEffect(() => {
		const forwardContexts = getForwardContexts(currentContext)

		setAllForwardContexts(forwardContexts)
	}, [getForwardContexts, currentContext, nonRootContextInformation])


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
		setCurrentContext,
		currentContext,
		getFilesOfBranchRecursively,
		validateFilePath
	}
}

export default useFileSystem
