import { useContext, useMemo } from "react"
import { DesktopItemContext, FileSystemContext } from "../../contexts"
import { SpecialBranch } from "../../enums"
import { useFileSystem } from "../../hooks"
import { File } from "../file"
import { Folder } from "../folder"
import { Shortcut } from "../shortcut"
import "./desktop.scss"

const Desktop = () => {
	const { searchForBranchByType } = useFileSystem()
	const { root } = useContext(FileSystemContext)
	const { onDesktopClicked } = useContext(DesktopItemContext)

	const desktopBranch = useMemo(() => {
		return searchForBranchByType(root, SpecialBranch.Desktop)
	}, [searchForBranchByType, root])

	/*const onDesktopClickedInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()


	}*/

	return (
		<div className="desktop">
			<div className="desktop__grid" onClick={onDesktopClicked}>
				{desktopBranch?.branches.map((b) => {
					return (
						<Folder
							key={b.name}
							context={b}
						/>
					)
				})}
				{desktopBranch?.shortcuts.map((s) => {
					return (
						<Shortcut
							key={s.name}
							shortcut={s}
						/>)
				})}
				{desktopBranch?.leaves.map((l) => {
					const { name, extension } = l
					return (
						<File
							key={`${name}${extension}`}
							context={l}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default Desktop
