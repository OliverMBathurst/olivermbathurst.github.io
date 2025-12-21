import { CV, GitHub, LinkedIn } from '../files'
import { FileInfo } from "../interfaces/file"

const files: FileInfo[] = [
    new CV(),
    new LinkedIn(),
    new GitHub(),
]

class FileSystemService {
    fileInfos: FileInfo[] = files
}

export default FileSystemService