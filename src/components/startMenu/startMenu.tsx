import { useContext, useEffect, useState } from "react"
import { NO_SELECT_CLASS } from "../../constants"
import { FileSystemContext } from "../../contexts"
import { getDisplayName } from "../../helpers/displayName"
import { getIcon } from "../../helpers/icon"
import { useFileSystem } from "../../hooks"
import { Leaf } from "../../types/fs"
import "./startMenu.scss"

const StartMenu = () => {
	const { root } = useContext(FileSystemContext)
	const { getFilesOfBranchRecursively } = useFileSystem(root)

	const [allLeaves, setAllLeaves] = useState<Leaf[]>([])

	useEffect(() => {
		const leaves = getFilesOfBranchRecursively()
		// test
		setAllLeaves([...leaves, ...leaves, ...leaves, ...leaves])
	}, [])

	return (
		<div className="start-menu">
			<div className="start-menu__top-container">
				<div className="start-menu__top-container__left">// apps</div>
				<div className="start-menu__top-container__right">
					{allLeaves.map(l => {
						const Icon = getIcon(l)
						const DisplayName = getDisplayName(l)
						return (
							<div className="start-menu__top-container__right__row">
								<div className={`start-menu__top-container__right__row__icon ${NO_SELECT_CLASS}`}>{Icon}</div>
								<div className={`start-menu__top-container__right__row__name ${NO_SELECT_CLASS}`}>
									{DisplayName}
								</div>
							</div>
						)
					})}
				</div>
			</div>
			<div className="start-menu__bottom-container">
				<div className="start-menu__bottom-container__search"></div>
			</div>
		</div>
	)
}

export default StartMenu
