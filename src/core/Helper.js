import fs from 'fs'
import _PATH from 'path'
import sharp from 'sharp'

export async function storeFile(file, path, filename) {
    const fullpath = `${process.cwd()}/${path}`
    if (!fs.existsSync(fullpath)) fs.mkdirSync(fullpath)
    await sharp(file.buffer).webp({
        quality: 20
    })
    .toFile(`${fullpath}/${filename}`)
    // fs.writeFileSync(`${fullpath}/${filename}`, file.buffer)
}

export async function removeFile(path) {
    const fullPath = _PATH.join(process.cwd(), path)
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
}