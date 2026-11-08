const allImages = import.meta.glob(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}',
  { eager: true, query: '?url', import: 'default' }
)

// Returns the URLs of all images in a folder, sorted by file name
export function getImages(folder) {
  return Object.entries(allImages)
    .filter(([path]) => path.includes(`/images/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url)
}