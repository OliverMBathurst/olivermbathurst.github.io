import { BRANCHING_CONTEXT_DETERMINER, BRANCHING_CONTEXT_PARENT_PROPERTY, FILETYPE_EXECUTABLE, FILETYPE_PDF, FILETYPE_TEXT, FILETYPE_URL_SHORTCUT, SHORTCUT_DETERMINER } from "../constants";
import { Context, Leaf } from "../types/fs";

export const getType = (context: Context) => {
    if (BRANCHING_CONTEXT_DETERMINER in context) {

        if (!(BRANCHING_CONTEXT_PARENT_PROPERTY in context)) {
            return "Drive"
        }

        return "Folder"
    }

    if (SHORTCUT_DETERMINER in context) {
        return "Shortcut"
    }

    return getFileTypeNameByExtension(context)
}


const getFileTypeNameByExtension = (context: Leaf) => {
    switch (context.extension) {
        case FILETYPE_TEXT:
            return "Text File"
        case FILETYPE_PDF:
            return "PDF File"
        case FILETYPE_EXECUTABLE:
            return "Executable"
        case FILETYPE_URL_SHORTCUT:
            return "HTML File"
    }

    return "File"
}