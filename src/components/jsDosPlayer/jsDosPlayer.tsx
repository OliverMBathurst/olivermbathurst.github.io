import { useRef } from "react"
import { Context } from "../../types/fs"

interface IJsDosPlayerProps {
    windowId: string
    context: Context
    path?: string
}

const JsDosPlayer = (props: IJsDosPlayerProps) => {
    const { windowId, context, path } = props
    const jsDosRef = useRef<HTMLIFrameElement | null>(null)
    
    return (
        <iframe
            key={`${windowId}-${context.fullName}`}
            ref={jsDosRef}
            className="js-dos-player"
            id="jsdos"
            src="https://dos.zone/doom-dec-1993/"
            allowFullScreen
        />)
}

export default JsDosPlayer