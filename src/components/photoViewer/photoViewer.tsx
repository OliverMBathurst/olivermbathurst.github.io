import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { ACCEPT_FILETYPE_IMAGES, ARRAY_DETERMINER, CLASSNAMES, FILETYPE_DATA_PROPERTY, IMAGE_DROP_TYPE } from "../../constants"
import { WindowsContext } from "../../contexts"
import { UploadedImageFile } from "../../files"
import { useFileDrop } from "../../hooks"
import { IWindowRenderProps } from "../../interfaces/fs"
import { FileSelector } from "../fileSelector"
import "./photoViewer.scss"

const {
	NO_SELECT_CLASS
} = CLASSNAMES

const PhotoViewer = (props: IWindowRenderProps) => {
	const { windowId, context } = props
	const [image, setImage] = useState<HTMLImageElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const noDataRef = useRef<HTMLDivElement | null>(null)
	const canvasContentRef = useRef<HTMLDivElement | null>(null)

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

	const drawImage = useCallback((
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
		canvasContext.drawImage(image, drawX, drawY, imageWidth, imageHeight)
	}, [])

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

    return (
		<div className="photo-viewer">
			{image && (
				<div className="photo-viewer__controls">
					<FileSelector
						accept={ACCEPT_FILETYPE_IMAGES}
						onChange={onInputChange}
						buttonText="Open"
					/>
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