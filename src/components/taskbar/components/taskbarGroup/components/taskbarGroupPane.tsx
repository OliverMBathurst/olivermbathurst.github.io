import { IWindowProperties } from "../../../../../interfaces/windows"

interface ITaskbarGroupPaneProps {
    items: IWindowProperties[]
    onGroupPaneItemClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const TaskbarGroupPane = (props: ITaskbarGroupPaneProps) => {
    const { items, onGroupPaneItemClicked } = props

    return (
        <>

        </>)
}

export default TaskbarGroupPane