import * as monaco from "monaco-editor"
import { useContext, useEffect, useRef, useState } from "react"
import { FILETYPE_TEXT_PROPERTY } from "../../constants"
import { WindowsContext } from "../../contexts"
import TextFile from "../../files/textFile"
import { IWindowRenderProps } from "../../interfaces/fs"
import "./monacoEditor.scss"

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
	autoDetectHighContrast: true,
	theme: "vs-dark"
}

const MonacoEditor = (props: IWindowRenderProps) => {
	const { windowId, context } = props
	const { setWindowContext } = useContext(WindowsContext)

	const [internalValue, setInternalValue] = useState<string>("")
	const [position, setPosition] = useState<monaco.Position | null>(null)
	const [lineCount, setLineCount] = useState<number>(0)

	const monacoRenderRef = useRef<HTMLDivElement | null>(null)
	const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
		null
	)

	useEffect(() => {
		if (!monacoEditorRef.current) {
			return
		}

		const model = monacoEditorRef.current.getModel()
		if (model) {
			model.pushEditOperations(
				[],
				[
					{
						range: model.getFullModelRange(),
						text: internalValue
					}
				],
				(_: monaco.editor.IValidEditOperation[]) => null
			)
		}
	}, [internalValue])

	useEffect(() => {
		if (!monacoRenderRef.current) {
			return
		}

		if (!(FILETYPE_TEXT_PROPERTY in context)) {
			setWindowContext(windowId, new TextFile("Untitled"))
			return
		}

		const { text: value, language, path, options } = context

		const model = monaco.editor.createModel(value, language, path)
		const editor = monaco.editor.create(
			monacoRenderRef.current,
			options ?? defaultOptions
		)

		monacoEditorRef.current = editor
		setInternalValue(value)

		model.onDidChangeContent(() => {
			const value = model.getValue()
			setInternalValue(value)
		})

		editor.onDidChangeModelContent(() => {
			const editorModel = editor.getModel()
			if (editorModel) {
				setLineCount(editorModel.getLineCount())
			}
		})

		editor.onDidChangeCursorPosition(() => {
			setPosition(editor.getPosition())
		})

		setLineCount(model.getLineCount())

		return () => {
			editor.dispose()
			model.dispose()
		}
	}, [context, windowId, setInternalValue, setPosition, setLineCount])

	return (
		<>
			<div
				ref={monacoRenderRef}
				className="monaco-editor"
				key={`${windowId}-${context.fullName}`}
			/>
			<div className="monaco-editor__controls">
				<span className="monaco-editor__controls__lines">
					{`Lines ${lineCount}`}
				</span>
				<span className="monaco-editor__controls__other-info">
					{`Ln ${position?.lineNumber ?? 0}, Col ${position?.column ?? 0}`}
				</span>
			</div>
		</>
	)
}

export default MonacoEditor
