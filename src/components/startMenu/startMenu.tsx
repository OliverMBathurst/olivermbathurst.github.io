import { useContext, useEffect, useRef, useState } from "react"
import { NO_SELECT_CLASS } from "../../constants"
import { FileSystemContext } from "../../contexts"
import { getIcon } from "../../helpers/icons"
import { getDisplayName } from "../../helpers/naming"
import { getFullPath } from "../../helpers/paths"
import { useClickOutside, useFileSystem } from "../../hooks"
import { Leaf } from "../../types/fs"
import { SearchBar } from "../searchBar"
import "./startMenu.scss"

interface IStartMenuProps {
	onClickOutside: () => void
}

const StartMenu = (props: IStartMenuProps) => {
	const { onClickOutside } = props
	const { root } = useContext(FileSystemContext)
	const { getFilesOfBranchRecursively } = useFileSystem(root)
	const [allLeaves, setAllLeaves] = useState<Leaf[]>([])

	const startMenuRef = useRef<HTMLDivElement | null>(null)

	useClickOutside(startMenuRef, onClickOutside)

	useEffect(() => {
		const leaves = getFilesOfBranchRecursively()
		setAllLeaves([...leaves])
	}, [])

	return (
		<div className="start-menu" ref={startMenuRef}>
			<div className="start-menu__top-container">
				<div className="start-menu__top-container__left"></div>
				<div className="start-menu__top-container__right">
					{allLeaves.map((l) => {
						const Icon = getIcon(l)
						const DisplayName = getDisplayName(l)
						const key = getFullPath(l)
						return (
							<div className="start-menu__top-container__right__row" key={key}>
								<div
									className={`start-menu__top-container__right__row__icon ${NO_SELECT_CLASS}`}
								>
									{Icon}
								</div>
								<div
									className={`start-menu__top-container__right__row__name ${NO_SELECT_CLASS}`}
								>
									{DisplayName}
								</div>
							</div>
						)
					})}
				</div>
			</div>
			<div className="start-menu__bottom-container">
				<div className="start-menu__bottom-container__search">
					<SearchBar type="text" placeholder="Search..." />
				</div>
			</div>
		</div>
	)
}

export default StartMenu
