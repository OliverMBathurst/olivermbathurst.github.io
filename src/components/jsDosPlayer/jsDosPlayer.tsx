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
            src="https://dos.zone/player/?bundleUrl=https://cdn.dos.zone/original/2X/2/24b00b14f118580763440ecaddcc948f8cb94f14.jsdos"
            allowFullScreen
        />)
}

export default JsDosPlayer