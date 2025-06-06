import DataUriParse from 'datauri/parser.js'
import path from 'path'

const bufferGenerator = (file) => {
    const parser = new DataUriParse()
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

export default bufferGenerator;