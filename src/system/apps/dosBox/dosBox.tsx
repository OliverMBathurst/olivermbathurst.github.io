import { DosFactory } from "js-dos";
import { useEffect, useRef, memo } from "react";
import './styles.scss';
require("js-dos")

interface IDosBoxProps {
    url: string
}

const DosBox = (props: IDosBoxProps) => {
    const { url } = props
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        var win = window as any
        const Dos = (window as any).Dos as DosFactory

        if (canvasRef.current) {
            Dos(canvasRef.current, { wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js" }).ready(function (fs, main) {
                fs.extract(url).then(function () {
                    main(["-c", "DIGGER.COM"]).then(function (ci) {
                        win.ci = ci
                    })
                })
            })
        }
    }, [url])

    return <canvas ref={canvasRef} className="dosbox-canvas" />
}

export default memo(DosBox)