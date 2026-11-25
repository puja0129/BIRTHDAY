/**
 * myMedia.js — Automatically bundles & exposes every photo, video, and audio
 * file inside d:\mahi\birthday-surprise\MY\ using Vite's static asset glob.
 *
 * Works both locally (`npm run dev`) and in production builds (`npm run build` / Vercel).
 */

const IMAGE_GLOB = import.meta.glob(
  '/MY/**/*.{jpg,jpeg,png,webp,gif,avif,bmp,JPG,JPEG,PNG,WEBP,GIF,AVIF,BMP}',
  { eager: true, query: '?url', import: 'default' }
)

const VIDEO_GLOB = import.meta.glob(
  '/MY/**/*.{mp4,mov,webm,m4v,MP4,MOV,WEBM,M4V}',
  { eager: true, query: '?url', import: 'default' }
)

const AUDIO_GLOB = import.meta.glob(
  '/MY/**/*.{mp3,wav,ogg,m4a,MP3,WAV,OGG,M4A}',
  { eager: true, query: '?url', import: 'default' }
)

const KNOWN_SECTIONS = new Set([
  'hero', 'story', 'memories', 'gallery', 'album', 'videos',
  'brother-songs', 'tom-and-jerry', 'our-memories', 'reminds-me', 'sibling-chaos',
  'fights', 'bond', 'rishta', 'wishes', 'teddy', 'letter', 'birthday',
  'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11',
])

const PASTEL_TINTS = ['#ffd6e8', '#e9e0ff', '#d8f0ff', '#fff4c4', '#daf7e8', '#ffe2cf']

const SIBLING_CAPTIONS = [
  "One of my favourite random days. 🤍",
  "The look when pretending not to smile 😂",
  "Proof we can behave nicely for 2 seconds.",
  "A little bit of our chaos 🤭",
  "Our kind of madness ✨",
  "No explanation needed for this one 💫",
  "Mr. Drama King caught off guard 😂",
  "Too much nakhra, too much love ❤️",
  "Best headache I ever got stuck with 🫶",
  "Some moments, just us.",
  "Because normal was never our thing. 🤌🏻",
  "Memories I wouldn't trade for anything 🤍",
]

// Clean raw phone/camera filenames so random IDs don't clutter Polaroid captions
function deriveCleanCaption(filePath, index, type) {
  const filename = filePath.split('/').pop() || ''
  const stem = filename.replace(/\.[^/.]+$/, '').trim()
  const looksLikeCameraId =
    /^(img|dsc|pxl|vid|mov|screenshot|snap|whatsapp|photo|image|pic|mvi|p)[-_ ]?\d+/i.test(stem) ||
    /^\d{6,}/.test(stem) ||
    /^[0-9a-f-]{12,}$/i.test(stem) ||
    /^image\s*\(\d+\)$/i.test(stem) ||
    stem.length <= 2

  if (!looksLikeCameraId && stem) {
    return stem.replace(/[_-]+/g, ' ')
  }
  return type === 'video'
    ? `Caught on camera — part ${index + 1} 🎬`
    : SIBLING_CAPTIONS[index % SIBLING_CAPTIONS.length]
}

// Check if placed inside a subfolder matching a website section (e.g., MY/wishes/pic.jpg)
function detectSubfolderSection(filePath, defaultSection) {
  const parts = filePath.replace(/^\/?MY\//i, '').split('/')
  if (parts.length > 1) {
    const folder = parts[0].trim().toLowerCase()
    if (KNOWN_SECTIONS.has(folder)) return folder
  }
  return defaultSection
}

function buildMediaList(globMap, type, defaultSection) {
  const entries = Object.entries(globMap).sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' })
  )

  return entries.map(([path, url], index) => {
    const filename = path.split('/').pop() || `memory-${index + 1}`
    return {
      id: `my-${path}`,
      builtin: true,
      sourcePath: path,
      url,
      remoteUrl: url,
      blob: null,
      type,
      name: filename,
      title: '',
      caption: deriveCleanCaption(path, index, type),
      date: '',
      category: type === 'video' ? 'Funny & Chaotic' : 'Special Days',
      section: detectSubfolderSection(path, defaultSection),
      layout: type === 'video' ? 'video-card' : 'polaroid',
      crop: { position: 'center 22%', fit: 'cover' },
      tint: PASTEL_TINTS[index % PASTEL_TINTS.length],
      tape: index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : 'none',
      order: index,
    }
  })
}

export const MY_PHOTOS = buildMediaList(IMAGE_GLOB, 'photo', 'gallery')
export const MY_VIDEOS = buildMediaList(VIDEO_GLOB, 'video', 'videos')
export const MY_MEDIA  = [...MY_PHOTOS, ...MY_VIDEOS]

const audioEntries = Object.entries(AUDIO_GLOB).sort(([a], [b]) => a.localeCompare(b))
export const MY_AUDIO_SRC = audioEntries.length > 0 ? audioEntries[0][1] : null

export const MY_AUDIO_FILES = audioEntries.map(([path, url], index) => {
  const filename = path.split('/').pop() || `song-${index + 1}`
  const cleanTitle = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim()
  return {
    id: `my-song-${index + 1}-${filename}`,
    title: cleanTitle || `Memory Track ${index + 1}`,
    artist: 'From Your MY Folder 🎵',
    audioUrl: url,
    sourcePath: path,
  }
})
