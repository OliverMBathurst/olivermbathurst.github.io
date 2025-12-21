import { FILETYPE_PDF } from '../constants';
import { IFile } from "../interfaces/file";

class CV implements IFile {
    name: string = "My CV";
    extension: string = FILETYPE_PDF;
    render = () => (
        <object
            title="My CV"
            data="/documents/Oliver Bathurst CV.pdf"
            width="100%"
            height="100%"
        >
            Sorry, your browser doesn't support PDF preview.
        </object>)
}

export default CV