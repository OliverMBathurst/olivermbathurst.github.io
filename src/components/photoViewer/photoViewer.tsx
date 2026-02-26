import { useContext, useEffect, useRef, useState } from "react"
import { ACCEPT_FILETYPE_IMAGES, ARRAY_DETERMINER, CLASSNAMES, FILETYPE_DATA_PROPERTY, IMAGE_DROP_TYPE } from "../../constants"
import { WindowsContext } from "../../contexts"
import { UploadedImageFile } from "../../files"
import { useFileDrop } from "../../hooks"
import { ZoomInIcon, ZoomOutIcon } from "../../icons"
import { IWindowRenderProps } from "../../interfaces/fs"
import { IPosition } from "../../interfaces/windows"
import { FileSelector } from "../fileSelector"
import "./photoViewer.scss"

const {
	NO_SELECT_CLASS
} = CLASSNAMES

const DPR = window.devicePixelRatio || 1
const ZOOM_INCREMENT = 0.10
const ZOOM_MINIMUM = 1
const ZOOM_MAXIMUM = 7

const PhotoViewer = (props: IWindowRenderProps) => {
	const { windowId, context } = props
	const [image, setImage] = useState<HTMLImageElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const noDataRef = useRef<HTMLDivElement | null>(null)
	const canvasContentRef = useRef<HTMLDivElement | null>(null)
	const previousMousePosition = useRef<IPosition>({
		x: 0,
		y: 0
	})
	const transform = useRef<IPosition>({
		x: 0,
		y: 0
	})
	const scale = useRef<number>(DPR)
	const isMouseDown = useRef<boolean>(false)

	const { setWindowContext } = useContext(WindowsContext)

	useFileDrop(
		canvasRef,
		(f) => !(ARRAY_DETERMINER in f) && onFileUploaded(f, f.webkitRelativePath),
		IMAGE_DROP_TYPE
	)

	useFileDrop(
		noDataRef,
		(f) => !(ARRAY_DETERMINER in f) && onFileUploaded(f, f.webkitRelativePath),
		IMAGE_DROP_TYPE
	)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			return
		}

		const context = canvas.getContext("2d")
		if (!context) {
			return
		}

		const rect = canvas.getBoundingClientRect()
		canvas.width = rect.width * DPR
		canvas.height = rect.height * DPR
		context.scale(DPR, DPR)
	}, [DPR])

	useEffect(() => {
		if (FILETYPE_DATA_PROPERTY in context && context.data) {
			const canvas = canvasRef.current
			const canvasContent = canvasContentRef.current
			if (!canvas || !canvasContent) {
				return
			}

			const canvasContext = canvas.getContext("2d")
			if (!canvasContext) {
				return
			}

			const contentRect = canvasContent.getBoundingClientRect()

			const canvasHeight = contentRect.height
			const canvasWidth = contentRect.width

			canvasContext.canvas.width = canvasWidth
			canvasContext.canvas.height = canvasHeight

			const img = new Image()
			img.src = context.data
			setImage(img)
		}
	}, [context, setImage])

	const drawImage = (
		image: HTMLImageElement,
		canvas: HTMLCanvasElement,
		canvasContext: CanvasRenderingContext2D
	) => {
		let imageHeight = image.height
		let imageWidth = image.width

		const imageHeightGreaterThanWidth = imageHeight > imageWidth
		const ratio = imageHeightGreaterThanWidth
			? imageHeight / imageWidth
			: imageWidth / imageHeight

		imageWidth = image.width > canvas.width
			? canvas.width
			: image.width

		imageHeight = image.height > canvas.height
			? canvas.height
			: image.height

		if (imageHeightGreaterThanWidth) {
			imageWidth /= ratio
		} else {
			imageHeight /= ratio
		}

		const drawX = (canvas.width / 2) - (imageWidth / 2)
		const drawY = (canvas.height / 2) - (imageHeight / 2)

		canvasContext.clearRect(0, 0, canvas.width, canvas.height)
		canvasContext.scale(scale.current, scale.current)
		canvasContext.drawImage(image, drawX, drawY, imageWidth, imageHeight)
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			return
		}

		const canvasContext = canvas.getContext("2d")
		if (!canvasContext) {
			return
		}

		if (!image) {
			return
		}

		drawImage(image, canvas, canvasContext)
	}, [image, drawImage])

	const onMouseMove = (e: MouseEvent) => {
		if (!isMouseDown.current) {
			return
		}

		const localX = e.clientX
		const localY = e.clientY

		const { x: previousX, y: previousY } = previousMousePosition.current

		const { x, y } = transform.current

		const transformX = x + (localX - previousX)
		const transformY = y + (localY - previousY)

		previousMousePosition.current.x = localX
		previousMousePosition.current.y = localY

		const canvas = canvasRef.current
		if (!canvas) {
			return
		}

		const canvasContext = canvas.getContext("2d")
		if (!canvasContext) {
			return
		}

		canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		canvasContext.setTransform(scale.current, 0, 0, scale.current, transformX, transformY);

		transform.current = { x: transformX, y: transformY }

		if (!image) {
			return
		}

		drawImage(image, canvas, canvasContext)
	}

	const onMouseDown = (e: MouseEvent) => {
		isMouseDown.current = true
		previousMousePosition.current = {
			x: e.clientX,
			y: e.clientY
		}
	}

	const onMouseUp = (_: MouseEvent) => {
		isMouseDown.current = false
	}

	const onMouseWheel = (e: WheelEvent) => {
		const oldScale = scale.current
		const { x: oldX, y: oldY } = transform.current

		const localX = e.clientX
		const localY = e.clientY

		const newScale = oldScale + (e.deltaY * -0.01)

		const newX = localX - (localX - oldX) * (newScale / oldScale)
		const newY = localY - (localY - oldY) * (newScale / oldScale)

		transform.current = { x: newX, y: newY }
		scale.current = newScale

		const canvas = canvasRef.current
		if (!canvas || !image) {
			return
		}

		const canvasContext = canvas.getContext("2d")
		if (!canvasContext) {
			return
		}

		drawImage(image, canvas, canvasContext)
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			return
		}

		canvas.addEventListener('mousedown', onMouseDown)
		canvas.addEventListener('mousemove', onMouseMove)
		canvas.addEventListener('mouseup', onMouseUp)
		canvas.addEventListener('wheel', onMouseWheel)

		return () => {
			if (canvas) {
				canvas.removeEventListener('mousedown', onMouseDown)
				canvas.removeEventListener('mousemove', onMouseMove)
				canvas.removeEventListener('mouseup', onMouseUp)
				canvas.removeEventListener('wheel', onMouseWheel)
			}
		}
	}, [onMouseDown, onMouseMove, onMouseUp])

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files && files.length > 0) {
			const file = files[0]
			onFileUploaded(file, e.target.value)
		}
	}

	const onFileUploaded = (file: File, path: string) => {
		const fileName = file.name.split(".")

		const uploadedFile = new UploadedImageFile(
			fileName[0],
			fileName[0] + "." + fileName[1],
			path,
			Date.now(),
			`.${fileName[1]}`
		)

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			const result = reader.result
			if (!(result instanceof ArrayBuffer)) {
				uploadedFile.data = result
				uploadedFile.icon = result
				setWindowContext(windowId, uploadedFile)
			}
		}
	}

	const onZoom = (zoomIn: boolean) => {
		if (zoomIn) {
			scale.current = scale.current + ZOOM_INCREMENT > ZOOM_MAXIMUM ? ZOOM_MAXIMUM : scale.current + ZOOM_INCREMENT
		} else {
			scale.current = scale.current - ZOOM_INCREMENT < ZOOM_MINIMUM ? ZOOM_MINIMUM : scale.current - ZOOM_INCREMENT
		}

		const canvas = canvasRef.current
		if (!canvas || !image) {
			return
		}

		const canvasContext = canvas.getContext("2d")
		if (!canvasContext) {
			return
		}

		drawImage(image, canvas, canvasContext)
	}

    return (
		<div className="photo-viewer">
			{image && (
				<div className="photo-viewer__controls">
					<FileSelector
						accept={ACCEPT_FILETYPE_IMAGES}
						onChange={onInputChange}
						buttonText="Open"
					/>
					<ZoomInIcon onClick={() => onZoom(true)} />
					<ZoomOutIcon onClick={() => onZoom(false)} />
				</div>
			)}
			<div
				className={`photo-viewer__content${image ? "--loaded" : ""}`}
				ref={canvasContentRef}
			>
				{FILETYPE_DATA_PROPERTY in context && context.data && (
					<canvas
						ref={canvasRef}
						className="photo-viewer__content__canvas"
					/>
				)}
				{!image && (
					<div className="photo-viewer__content__no-data" ref={noDataRef}>
						<span className={`photo-viewer__content__no-data ${NO_SELECT_CLASS}`}>
							<label className="photo-viewer__content__no-data__drop-zone">
								Click "Open" or drop image file here.
								<input
									className="photo-viewer__content__no-data__drop-zone__input"
									type="file"
									accept={ACCEPT_FILETYPE_IMAGES}
									onChange={onInputChange}
								/>
							</label>
						</span>
					</div>
				)}
            </div>
        </div>
    )
}

export default PhotoViewer