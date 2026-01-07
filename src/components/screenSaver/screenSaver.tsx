import { useRef, useEffect } from "react"
import { useVisibility } from "../../hooks"
import "./screenSaver.scss"

const screensaverPaths: string[] = ["bg.png", "bg1.png", "bg2.png", "bg3.png"]

const ScreenSaver = () => {
	const screensaverOneRef = useRef<HTMLImageElement | null>(null)
	const screensaverTwoRef = useRef<HTMLImageElement | null>(null)

	const screensaverIndex = useRef<number>(0)
	const screensaverOneOpacity = useRef<number>(1.0)
	const screensaverOneFading = useRef<boolean>(false)

	const interval = useRef<NodeJS.Timer | undefined>(undefined)
	const innerInterval = useRef<NodeJS.Timer | undefined>(undefined)

	const visible = useVisibility(true)

	useEffect(() => {
		if (screensaverOneRef.current && screensaverTwoRef.current) {
			screensaverOneRef.current.src = screensaverPaths[screensaverIndex.current]
			screensaverTwoRef.current.src =
				screensaverPaths[screensaverIndex.current + 1]

			screensaverIndex.current = screensaverIndex.current + 1
		}
	}, [])

	useEffect(() => {
		const onOpacityChange = () => {
			clearInterval(interval.current)
			clearInterval(innerInterval.current)

			innerInterval.current = setInterval(() => {
				interval.current = setInterval(() => {
					if (!visible) {
						return
					}
					if (screensaverOneRef.current && screensaverTwoRef.current) {
						if (screensaverOneFading.current) {
							if (screensaverOneOpacity.current <= 0.0) {
								screensaverOneOpacity.current = 0.0

								const nextIdx =
									screensaverIndex.current + 2 < screensaverPaths.length
										? screensaverIndex.current + 2
										: screensaverIndex.current + 2 - screensaverPaths.length

								screensaverIndex.current = nextIdx
								screensaverOneRef.current.src = screensaverPaths[nextIdx]
								screensaverOneFading.current = false
								onOpacityChange()
							} else {
								screensaverOneOpacity.current =
									screensaverOneOpacity.current - 0.2
								screensaverOneRef.current.style.opacity = `${screensaverOneOpacity.current}`
							}
						} else {
							if (screensaverOneOpacity.current >= 1.0) {
								screensaverOneOpacity.current = 1.0

								const nextIdx =
									screensaverIndex.current + 3 < screensaverPaths.length
										? screensaverIndex.current + 3
										: screensaverIndex.current + 3 - screensaverPaths.length

								screensaverTwoRef.current.src = screensaverPaths[nextIdx]
								screensaverOneFading.current = true
								onOpacityChange()
							} else {
								screensaverOneOpacity.current =
									screensaverOneOpacity.current + 0.2
								screensaverOneRef.current.style.opacity = `${screensaverOneOpacity.current}`
							}
						}
					}
				}, 100)
			}, 5000)
		}

		if (visible) {
			onOpacityChange()
		}

		return () => {
			clearInterval(interval.current)
			clearInterval(innerInterval.current)
		}
	}, [visible])

	return (
		<>
			<div className="screen-saver__two">
				<img
					className="screen-saver__two__image"
					alt="Screen-saver"
					ref={screensaverTwoRef}
				/>
			</div>
			<div className="screen-saver__one">
				<img
					className="screen-saver__one__image"
					alt="Screen-saver"
					ref={screensaverOneRef}
				/>
			</div>
		</>
	)
}

export default ScreenSaver
