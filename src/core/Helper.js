import fs from 'fs'
import _PATH from 'path'

export function storeFile(file, path, filename) {
    const fullpath = `${process.cwd()}/${path}`
    if (!fs.existsSync(fullpath)) fs.mkdirSync(fullpath)
    fs.writeFileSync(`${fullpath}/${filename}`, file.buffer)
}

export async function removeFile(path) {
    const fullPath = _PATH.join(process.cwd(), path)
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
}