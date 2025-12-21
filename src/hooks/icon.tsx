import { JSX, useMemo } from 'react'
import { FILETYPE_EXECUTABLE, FILETYPE_PDF, FILETYPE_TEXT, FILETYPE_URL_SHORTCUT } from "../constants"
import { ExecutableFileIcon, GenericFileIcon, InternetIcon, PdfIcon, TextFileIcon } from "../icons"

export const useIcon: (extension: string, noSelect?: boolean) => JSX.Element = (extension: string, noSelect: boolean = true) => {
    const Icon = useMemo(() => {
        let props = {
            className: noSelect ? "no-select" : ""
        }

        switch (extension) {
            case FILETYPE_PDF:
                return <PdfIcon {...props} />
            case FILETYPE_URL_SHORTCUT:
                return <InternetIcon {...props} />
            case FILETYPE_TEXT:
                return <TextFileIcon {...props} />
            case FILETYPE_EXECUTABLE:
                return <ExecutableFileIcon {...props} />
            default:
                return <GenericFileIcon />
        }
    }, [extension, noSelect])

    return (
        <>
            {Icon}
        </>)
}