const MAX_WIDTH = 1280
const JPEG_QUALITY = 0.8

export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas unavailable')); return }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        blob => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        'image/jpeg',
        JPEG_QUALITY,
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')) }
    img.src = url
  })
}
