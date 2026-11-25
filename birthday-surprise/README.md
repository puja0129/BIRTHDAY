# 🎂 Birthday Surprise for Mahir — Interactive Pastel Scrapbook

A custom, pastel, 3D + scrapbook birthday experience built for **Mahir** (December 5) from his **Bhailuu** — featuring personal Hindi-Gujarati-English writing, interactive sections, 3D scenes, and a built-in drag-and-drop **Memory & Scrapbook Studio**.

---

## ✨ Sections Included

- **Pastel 3D Opening World**: Animated pastel aurora sky, 3D opening keepsake envelope, floating balloons & clouds, mouse/touch parallax Polaroids with secret click notes, confetti burst, and `"Enter Our Little World ✨"`.
- **Birthday Countdown**: Dynamically calculates time remaining until the next 5 December (IST) and switches to a birthday celebration automatically on the day.
- **Our Story Timeline**: Scroll-driven rainbow timeline with mixed photos/videos per moment.
- **3D Memory World**: Bright pastel 3D orbiting gallery displaying uploaded photos right on 3D Polaroid frames.
- **Photo Polaroids & Scrapbook**: Lightbox gallery with 6 switchable layouts (`Polaroids`, `Scrapbook`, `Collage`, `Masonry`, `Clean Grid`, `Free-form`) + crop focus controls.
- **Video Memories & Montage**: Individual clip player plus a sequential Memory Montage slideshow mode.
- **Our Fights**: Interactive Fight/Peace chat simulator + funny photo stickers + Dramatic Verdict reveal.
- **Our Bond**: Pastel glowing twin light orbs with floating bond Polaroids.
- **Personal Chapters (11 Chapters)**: Cards with washi tape accents covering all real memories, habits, nakhra, food drama, and chapter photos.
- **Scroll Scrapbook Wishes**: All 8 wishes revealed uniquely on scroll with unexpected Polaroids popping in around each wish.
- **Pastel Envelope Letter**: Click-to-unseal 3D envelope revealing ruled stationery paper.
- **Birthday Cake Finale**: 3D pastel frosted tiered cake with blowable candles, confetti shower, and birthday montage.
- **Hidden Secret**: Tap the heart in the footer 5 times to unlock an extra private note.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or pnpm

```bash
cd birthday-surprise
npm install
npm run dev
```

Then open `http://localhost:5173`.

---

## 🎨 Using the Built-In Memory & Scrapbook Studio (No Coding Needed!)

Once inside the website, click the floating **"🎨 Manage Memories"** button (bottom-right) or drag photos/videos straight onto any dotted section box on the page!

### What works right out of the box:
1. **Upload Mixed Media**: Drop JPG, PNG, WEBP, MP4, MOV files together from laptop or phone.
2. **Drag Onto Page Mode**: Click **"Drag Onto Page"** inside the studio header to shrink it into a bottom dock tray, then drag any thumbnail onto **Our Story**, **3D Memory World**, **Photo Polaroids**, **Birthday Wishes**, **The Letter**, **Fights**, **Our Bond**, or **Birthday Surprise**.
3. **Edit & Customize**: Set titles, captions, dates, folders (`Funny & Chaotic`, `Sweet & Soft`, `Childhood & Old`, etc.), Polaroid/collage styles, crop positions (`Focus Top / Faces`), and replace files anytime.
4. **Reorder & Undo/Redo**: Reorder items via drag or mobile up/down arrow buttons, remove from a section without deleting the file, and undo/redo recent edits.

---

## ☁️ Media Persistence & Vercel Sharing Setup (Important!)

Because Vercel serves static frontend builds (no writable server filesystem):

### Mode 1: Immediate Browser Persistence (Zero Setup)
- All uploaded photos/videos are saved inside your browser's **IndexedDB** (`birthday-media-db`) and all captions, order, crop settings, and section placements are saved in **localStorage**.
- Refreshing the page keeps everything intact on that device.

### Mode 2: Cross-Device Sync for Mahir's Phone (Recommended before sharing your Vercel link!)
If you upload photos on your laptop and send the Vercel link to Mahir's phone, browser IndexedDB is device-local unless photos have cloud or hosted URLs. Two easy ways to share your curated photos across every device:

#### Option A: Free Cloudinary + Manifest Export (No Coding Required)
1. Create a free account on [Cloudinary](https://cloudinary.com/), go to **Settings → Upload → Add upload preset**, set **Signing Mode = Unsigned**, and copy your **Cloud Name** & **Upload Preset**.
2. Open **"🎨 Manage Memories" → "Vercel Sync & Backup"** tab on your site and paste your Cloud Name & Preset (or set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in Vercel Environment Variables).
3. Upload & arrange all your photos and captions — each file automatically receives a persistent CDN URL.
4. Click **"Export media-manifest.json"**, save the file to `public/memories/media-manifest.json`, commit, and push to Vercel! Every visitor (including Mahir on his phone) will see every photo, caption, and layout automatically.

#### Option B: Drop Photos/Videos in `MY/` or `public/memories/` (Zero-Config Vercel Hosting!)
- Place photos & videos anywhere inside **`MY/`** (`d:\mahi\birthday-surprise\MY\`). Vite automatically bundles and distributes all of them across the Opening World, Our Story, 3D Memory World, Photo Polaroids, Wishes, Fights, Bond, Letter, and Birthday Finale for both local preview and Vercel builds!
- Optional subfolders inside `MY/` like `MY/hero/`, `MY/wishes/`, `MY/letter/`, or `MY/birthday/` map directly to those sections.
- For music, place an `.mp3` inside `MY/` or at `public/memories/music/background.mp3`.

---

## 🌐 Deploying to Vercel

```bash
npm run build   # verify production bundle
vercel --prod   # or push to GitHub connected to Vercel
```

The included `vercel.json` handles build output (`dist`) and SPA routing automatically.

---

Made with ❤️ for **Mahir** (5 December) — from his **Bhailuu**.
