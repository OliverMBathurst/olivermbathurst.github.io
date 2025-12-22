import { FILETYPE_PDF } from '../constants';
import { IWindowFile, IWindowRenderProps } from "../interfaces/file";

class CV implements IWindowFile {
    name: string = "My CV";
    extension: string = FILETYPE_PDF;
    render = (props?: IWindowRenderProps) => (
        <object
            title="My CV"
            data="/documents/Oliver Bathurst CV.pdf"
            width="100%"
            height="100%"
            {...props}
        >
            Sorry, your browser doesn't support PDF preview.
        </object>)
}

export default CV