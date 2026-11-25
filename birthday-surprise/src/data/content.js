// ============================================================
//  SITE CONFIG — All personal details here
// ============================================================
export const SITE_CONFIG = {
  brotherName:      "Mahir",          // ← His actual name
  brotherNicknames: ["Drama King", "Pagal Brother", "Mr. Masti Khor", "My Favourite Headache", "Bhailuu Bhai"],
  sisterName:       "Puju",           // ← His crazy, loving sister
  birthdayDate:     "5 December 2026",
  birthdayYear:     2026,
  birthdayMonth:    11,               // 0-indexed: 11 = December
  birthdayDay:      5,
  passwordEnabled:  false,
  password:         "mahir2026",
  musicEnabled:     true,
  musicSrc:         "/memories/music/background.mp3",
  openingTagline:   "Tari birthday par gift karta thodu alag karvanu hatu, etle aa nani si duniya banavi chhe — from your Puju. 😂❤️",
  // Optional Cloudinary Unsigned Upload config for syncing photos across devices
  cloudinaryCloudName:    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  cloudinaryUploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
}

// ============================================================
//  NATURAL SISTER-STYLE SECTION COPY (Puju -> Mahir)
// ============================================================
export const SECTION_COPY = {
  countdown: {
    eyebrow:  "Countdown to Mr. Drama King's Day 🎂",
    subNote:  "Don't act too cool now, Mahir — your Puju knows you're smiling already 😂",
  },
  timeline: {
    eyebrow:  "How Puju & her pagal brother got stuck together 👀",
    title:    "From three random texts to all this chaos",
    subtitle: "Our messy timeline of masti, pointless debates, food drama, and somehow always caring.",
  },
  memories: {
    eyebrow:  "Our chaotic little universe ✨",
    title:    "A floating mess of our favourite moments",
    subtitle: "Spin around, tap any frame, or drop our photos straight into this pastel sky 🤍",
  },
  gallery: {
    eyebrow:  "A little collection of our chaos 🤭",
    title:    "Proof that we can be cute too 😂",
    subtitle: "Camera caught us acting innocent for 2 seconds — tap any Polaroid or switch layouts!",
  },
  videos: {
    eyebrow:  "Caught in full drama mode 🎬",
    title:    "Our kind of madness ✨",
    subtitle: "Moments I wouldn't trade for anything — especially where my favourite headache acts dramatic 😂",
  },
  fights: {
    eyebrow:  "Full-time job: fighting you 🌪️",
    title:    "Because normal was never our thing. 🤌🏻",
    subtitle: "Too much nakhra, zero apologies, 100% drama — yet my safe place at the end of the day.",
  },
  bond: {
    eyebrow:  "Forever partner in chaos 💫",
    title:    "Some moments, just us.",
    subtitle: "Annoying but irreplaceable — that weird telepathy where my mood flips right with yours.",
  },
  chapters: {
    eyebrow:  "Read slowly okay, drama king 💛",
    title:    "Things I Probably Never Said Properly",
    subtitle: "From the world's most annoying (but loving) sister — tap any card for actual unfiltered feelings.",
  },
  wishes: {
    eyebrow:  "From your Puju, with extra masti 🥹",
    title:    "The memories that stay, even when photos fade",
    subtitle: "Scroll slowly — every birthday wish has its own pastel scrapbook corner & memory waiting next to it 🤍",
  },
  letter: {
    eyebrow:  "Wait, no teasing your Puju after this 💌",
    title:    "Okay fine, here's the real emotional stuff",
    subtitle: "Tap the pastel envelope — written by your permanently annoying sister 😂❤️",
  },
  birthday: {
    eyebrow:  "Make a wish, Drama King 🎉",
    title:    "A little bit of us, forever.",
    subtitle: "Same pagal brother, another year of dealing with your Puju ✨",
  },
}

// ============================================================
//  OPENING HERO FLOATING CARDS (Puju's chaotic corner notes)
// ============================================================
export const HERO_FLOATING_NOTES = [
  {
    id: "hn1",
    tag: "📸 Camera Card",
    emoji: "📸",
    tint: "#ffd8ea",
    caption: "Proof that you actually have some good pictures 😂",
    secret: "Pretends to hate photos... still asks 'ye wala sahi aaya na?' ten times. — Puju 😤📸",
  },
  {
    id: "hn2",
    tag: "🍜 Food Card",
    emoji: "🍜",
    tint: "#ffe5cf",
    caption: "Feed this drama king before he starts.",
    secret: "Zero patience when hungry. Warning: may turn into a grumpy philosopher without snacks 😂🍔",
  },
  {
    id: "hn3",
    tag: "🌪️ Fight Card",
    emoji: "🥊",
    tint: "#e8dfff",
    caption: "We fight like it's our full-time job.",
    secret: "The one I fight with like crazy and still run to first whenever anything happens 🤍",
  },
  {
    id: "hn4",
    tag: "❤️ Heart Card",
    emoji: "💖",
    tint: "#dff6ff",
    caption: "Annoy you forever. Love you even longer.",
    secret: "My favourite headache, my brother, my safe place — permanently stuck with your Puju! 🫶✨",
  },
  {
    id: "hn5",
    tag: "🎁 Random Card",
    emoji: "👑",
    tint: "#fff3c4",
    caption: "Your sister is obviously the best gift. No arguments.",
    secret: "Signed, sealed & delivered by the world's most annoying but loving sister. Period. 😂❤️",
  },
]

// ============================================================
//  TIMELINE MEMORIES — Add your own moments
// ============================================================
export const TIMELINE_MEMORIES = [
  {
    id: "t1",
    date: "The Beginning",
    title: "Jyare pehli vaar properly vaatein karya",
    description: "It started small. 'Good morning.' 'Have you eaten?' 'Good night.' That was it. That was the whole conversation. And somehow... that was enough to start something.",
    image: null,
    emoji: "💫",
    type: "beginning",
    color: "#e86f9c",
    bgTint: "#fff0f6",
  },
  {
    id: "t2",
    date: "Early Days",
    title: "Teen messages thi saru thayu",
    description: "Morning. Food check. Night. Three messages a day. Like clockwork. Neither of us realized it had become a routine until the day we didn't send one and it felt... off.",
    image: null,
    emoji: "☀️",
    type: "sweet",
    color: "#ee8760",
    bgTint: "#fff4eb",
  },
  {
    id: "t3",
    date: "Fight Season 1",
    title: "Pehli 'badi' ladai 😂",
    description: "Honestly we can't even remember what it was about. Something completely pointless. We turned it into a whole debate. Classic us. Neither of us backed down. Both of us thought we were right. We were both wrong.",
    image: null,
    emoji: "🌪️",
    type: "fight",
    color: "#9a7ee0",
    bgTint: "#f4efff",
  },
  {
    id: "t4",
    date: "Random Afternoons",
    title: "Completely useless conversations",
    description: "Hours talking about nothing. Memes. Food opinions. Random takes on random things. Those conversations had no purpose. That was exactly why they were the best ones.",
    image: null,
    emoji: "😂",
    type: "funny",
    color: "#4ca3dd",
    bgTint: "#edf8ff",
  },
  {
    id: "t5",
    date: "A Quiet Difficult Day",
    title: "Jyare ek was okay nahi",
    description: "Nobody had to explain much. The other person just knew. That day I understood something — being there doesn't always mean being physically present.",
    image: null,
    emoji: "🌙",
    type: "emotional",
    color: "#45b683",
    bgTint: "#edfcf4",
  },
  {
    id: "t6",
    date: "Food Drama Era",
    title: "\"Khaana kha le yaar!\" — Every. Single. Day.",
    description: "He worries about me eating. I ignore it. He worries more. I still ignore it. He gets genuinely upset. I finally eat. We both know how this cycle goes. It's annoying and weirdly warm at the same time.",
    image: null,
    emoji: "🍜",
    type: "funny",
    color: "#dda82e",
    bgTint: "#fffbeb",
  },
  {
    id: "t7",
    date: "Now",
    title: "We became each other's daily habit",
    description: "Somewhere between all the arguments, the food drama, the random conversations and the quiet moments — we became something we never planned. A habit. A person the other one comes back to, without even thinking about it.",
    image: null,
    emoji: "⭐",
    type: "sweet",
    color: "#39b2aa",
    bgTint: "#edfcfa",
  },
]

// ============================================================
//  GALLERY PHOTOS — Replace nulls or upload via Manage Memories
// ============================================================
export const GALLERY_PHOTOS = [
  { id: "p1", src: null, caption: "One of my favourite random days.", date: null, placeholder: "📸", tape: "left", tint: "#ffd6e8" },
  { id: "p2", src: null, caption: "The look when we're pretending we're not angry. 😒", date: null, placeholder: "😒", tape: "right", tint: "#e9e0ff" },
  { id: "p3", src: null, caption: "Actually laughing for once. Proof.", date: null, placeholder: "😂", tape: "none", tint: "#fff4c4" },
  { id: "p4", src: null, caption: "A quiet day that became a good memory.", date: null, placeholder: "🌅", tape: "left", tint: "#d8f0ff" },
  { id: "p5", src: null, caption: "Proof we can survive being in the same place. 😂", date: null, placeholder: "✌️", tape: "right", tint: "#daf7e8" },
  { id: "p6", src: null, caption: "Some moments are better without explanation.", date: null, placeholder: "💫", tape: "none", tint: "#ffe2cf" },
]

// ============================================================
//  VIDEOS
// ============================================================
export const VIDEOS = [
  { id: "v1", src: null, thumbnail: null, caption: "One of those random moments.", date: null, placeholder: "🎬" },
  { id: "v2", src: null, thumbnail: null, caption: "Nobody planned this. That's why it's perfect.", date: null, placeholder: "📹" },
  { id: "v3", src: null, thumbnail: null, caption: "Proof of the chaos.", date: null, placeholder: "😂" },
]

// ============================================================
//  FIGHTS DATA
// ============================================================
export const FIGHT_LINES = [
  "Ek minute fighting, agle minute behaving like nothing happened. 🙃",
  "Winning an argument? Impossible. Banne ne lage chhe ke aapne sahi chhe.",
  '"Sorry" — woh word abhi bhi under development hai humara.',
  "We can turn the smallest thing — literally anything — into a full investigation.",
  "But if something happens to the other, the fight suddenly doesn't exist anymore.",
  "Fight duration: 2 hours. Silence: 10 mins. Back to normal: immediately. 😂",
  "The argument was never really about what we were arguing about. Never is.",
]

export const FIGHT_DIALOGUES = [
  { speaker: "Puju", text: "Tu bilkul galat hai!", emoji: "😤" },
  { speaker: "Mahir", text: "Main BILKUL sahi hoon!", emoji: "😠" },
  { speaker: "Puju", text: "NAHI HAI! Sab sun le!", emoji: "😡" },
  { speaker: "Mahir", text: "Baat karna bekaar hai tere saath.", emoji: "🙄" },
  { speaker: "Puju", text: "TERE SAATH BEKAAR HAI!", emoji: "😤" },
  { speaker: "Both", text: "...", emoji: "😶" },
  { speaker: "Mahir", text: "Khana khaya tune?", emoji: "😒" },
  { speaker: "Puju", text: "...theek hai. Nahi khaya.", emoji: "😑" },
  { speaker: "Mahir", text: "Jaa. Kha le. 🙄", emoji: "😤" },
  { speaker: "Puju", text: "Okay fine. 😑", emoji: "😑" },
]

export const DRAMATIC_RESULT = "Dono equally dramatic. Isliye fights itni epic hoti hain. 😂"

// ============================================================
//  BIRTHDAY WISHES — Keep exact wording preserved!
// ============================================================
export const BIRTHDAY_WISHES = [
  "May you always have reasons to smile, Mahir — even on the most boring, ordinary days.",
  "May life be kind to you, especially on the difficult ones. And when it's not, may you find your way through.",
  "May you achieve everything you quietly dream of — the big things and the small ones nobody knows about.",
  "May you never feel alone when things get heavy. Even when I'm being impossible, I'm still here.",
  "May you always have the courage to start again, even when things completely fall apart.",
  "May you stay the same crazy, irritating, wonderful Pagal Bhai I know. Please never change. 😂",
  "May happiness find you in unexpected ways — the kind you don't plan for and can't explain.",
  "May our bond always stay this way — a little chaotic, a little emotional, completely and entirely ours.",
]

export const WISH_SCRAPBOOK_META = [
  {
    layout: "polaroid-right",
    bg: "linear-gradient(135deg, #fff6c9 0%, #ffe8e0 100%)",
    accent: "#dda82e",
    tapeColor: "#ffb8d0",
    sticker: "☀️",
    handNote: "especially on lazy afternoons 😂",
    photoPlaceholder: "😄",
  },
  {
    layout: "float-left",
    bg: "linear-gradient(135deg, #f2ebff 0%, #e1f4ff 100%)",
    accent: "#9a7ee0",
    tapeColor: "#b8e6fe",
    sticker: "🌈",
    handNote: "always rooting for you 🤍",
    photoPlaceholder: "🌤️",
  },
  {
    layout: "corner-top",
    bg: "linear-gradient(135deg, #ffe7dc 0%, #fff4eb 100%)",
    accent: "#ee8760",
    tapeColor: "#ffe49e",
    sticker: "✨",
    handNote: "the quiet dreams count most ✨",
    photoPlaceholder: "🌟",
  },
  {
    layout: "dual-peek",
    bg: "linear-gradient(135deg, #e1f5ff 0%, #e5fff3 100%)",
    accent: "#4ca3dd",
    tapeColor: "#d8c6ff",
    sticker: "🫶",
    handNote: "annoying you counts as support right? 🤭",
    photoPlaceholder: "🫂",
  },
  {
    layout: "postcard-bottom",
    bg: "linear-gradient(135deg, #e2faed 0%, #f0f9ff 100%)",
    accent: "#45b683",
    tapeColor: "#ffcab0",
    sticker: "🌱",
    handNote: "stamp: 5 December · fresh starts 🌸",
    photoPlaceholder: "🌿",
  },
  {
    layout: "chaos-side",
    bg: "linear-gradient(135deg, #ffe3ef 0%, #fff0d9 100%)",
    accent: "#e86f9c",
    tapeColor: "#a8ebd0",
    sticker: "🏆",
    handNote: "certified Drama King award 🥇😂",
    photoPlaceholder: "🤪",
  },
  {
    layout: "ticket-tilt",
    bg: "linear-gradient(135deg, #dcfbf7 0%, #f3e8ff 100%)",
    accent: "#39b2aa",
    tapeColor: "#ffd0df",
    sticker: "🦋",
    handNote: "random good days hit different 💫",
    photoPlaceholder: "🎈",
  },
  {
    layout: "finale-duo",
    bg: "linear-gradient(135deg, #ffe6f2 0%, #fff3cc 50%, #e2f2ff 100%)",
    accent: "#e86f9c",
    tapeColor: "#ffd97d",
    sticker: "❤️",
    handNote: "too much nakhra, too much love — Puju & Mahir 🤍",
    photoPlaceholder: "🎂",
  },
]

// ============================================================
//  PERSONAL CHAPTERS — 11 chapters about your real bond
// ============================================================
export const CHAPTERS = [
  {
    id: "c1",
    number: "01",
    title: "Bhailuu Bhai, Oyy!",
    subtitle: "The funny, irritating, completely chaotic side of us",
    type: "funny",
    emoji: "😂",
    color: "#ee8760",
    bgGradient: "linear-gradient(135deg, #fff5eb 0%, #ffe1c8 100%)",
    content: [
      "Bhai oyy, su che tare? 😂",
      "Heran nai kar, maris tane — seriously. Maris.",
      "Nobody irritates me quite like Mahir does. It's honestly a skill at this point. A very specific, very dedicated skill directed entirely at me.",
      "Aapni arguments nu koi logic nathi. We start fighting about one thing, end up at a completely different thing, and by the end neither of us remembers what the original problem was.",
      "The leg-pulling is relentless. The teasing doesn't stop. The random provocations come out of absolutely nowhere.",
      "And somehow, somehow — this is the same person who I'll talk to for hours without getting bored.",
      "Make it make sense, Pagal Bhai. Make. It. Make. Sense. 😂",
    ],
    funFact: "Average time before an argument starts: approximately 7 minutes. 😂",
  },
  {
    id: "c2",
    number: "02",
    title: "A Bond I Can't Explain",
    subtitle: "The strange, emotionally connected, unexplainable thing between us",
    type: "emotional",
    emoji: "💫",
    color: "#9a7ee0",
    bgGradient: "linear-gradient(135deg, #f5f0ff 0%, #e4dbff 100%)",
    content: [
      "Yaar, pata nahi humara rishta kya hai, kaise hai, aur itna alag kyun hai.",
      "Hum kabhi physically paas bhi nahi hote — aur phir bhi jab kuch hota hai, mahsoos ho jaata hai. Without explanation.",
      "Kabhi tu gussa hota hai toh main bhi bina kisi reason ke gussa ho jaati hoon. Kabhi tu upset hota hai toh mera mood bhi without warning badal jaata hai.",
      "We fight. A lot. About things that make no sense in retrospect. But jab tujhe kuch hota hai na — that moment when something is actually wrong — mera saara gussa ek second mein gayab ho jaata hai.",
      "Us waqt sirf ek cheez matter karti hai. Ki tu theek hona chahiye.",
      "Main kabhi properly explain nahi kar sakti yeh connection. But I think that's also the point. Some things don't need an explanation. They just exist.",
      "Aur humara yeh bond — chahe confusing ho, chahe weird ho — feel zaroor karta hun.",
    ],
  },
  {
    id: "c3",
    number: "03",
    title: "You Changed More Than You Know",
    subtitle: "What I learned from knowing you — honestly",
    type: "growth",
    emoji: "🌱",
    color: "#45b683",
    bgGradient: "linear-gradient(135deg, #eefff6 0%, #d3f7e4 100%)",
    content: [
      "Tujhe pata bhi nahi hoga — par tujhse ek alag tarah ka confidence mila.",
      "Pehle boys ke saath baat karna itna comfortable nahi tha. Mujhe lagta tha main galat bol doongi, galat react kar doongi, ya ki woh judge karenge.",
      "Tere saath baat karte karte — without even realizing — woh discomfort khatam ho gayi.",
      "Tune mujhe realize karaya ki sab ek jaise nahi hote. Har banda woh nahi hota jo main sochti thi. Aur yeh realization actually ne mujhe bahut zyada comfortable banaya — not just with others, but with myself.",
      "Teri wajah se main zyada open hoon. Zyada comfortable hoon. Zyada myself hoon.",
      "It sounds like a small thing. It really isn't.",
      "Thank you for being the kind of person who made it safe to just... be normal. ❤️",
    ],
  },
  {
    id: "c4",
    number: "04",
    title: "The Comfort I Never Expected",
    subtitle: "Normal things that became actually normal",
    type: "comfort",
    emoji: "🌙",
    color: "#dda82e",
    bgGradient: "linear-gradient(135deg, #fffbeb 0%, #ffefc2 100%)",
    content: [
      "Yaar, tu pehla insaan hai jiske saath mujhe periods ke baare mein baat karte waqt awkward nahi laga.",
      "Mood swings. Irritation without reason. Randomly upset. Crying without being able to explain why. Anger that comes from nowhere.",
      "These are things I'd normally have to explain or apologize for. With you — I didn't have to.",
      "Tu samajh jaata hai. Sometimes without asking. Sometimes without me even telling you what's going on.",
      "Jo cheez funny lagti hai baaki logon ko — woh tujhe genuinely concern karti hai. And you don't make me feel embarrassed about any of it.",
      "Normal cheezein normal lagni chahiye. Aur tere saath — woh actually normal feel karti hain.",
      "That's rarer than it sounds, Mahir. And it matters a lot more than I usually say.",
    ],
  },
  {
    id: "c5",
    number: "05",
    title: "The Girl with Endless Nakhra",
    subtitle: "My mood swings, your impossible patience 👑",
    type: "funny",
    emoji: "👑",
    color: "#e86f9c",
    bgGradient: "linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%)",
    content: [
      "Okay. I know. 😂",
      "Meri moods ka koi schedule nahi hai. I don't have an on/off switch. I have approximately forty-seven settings and they change without warning.",
      "Kabhi gussa, kabhi upset, kabhi bilkul theek, kabhi without reason irritated, kabhi sab kuch annoying, kabhi I want to talk, kabhi mat bol kuch.",
      "Aur tu... somehow handle kar leta hai. Without getting harsh. Without shutting down completely. Without making me feel like I'm too much.",
      "Tu try karta hai calm karne ka. Kabhi kaam karta hai, kabhi nahi — but the trying matters. It really does.",
      "Meri nakhra level is elite. Certified. Award-winning.",
      "And you survived it every time. That's not nothing, Bhailuu Bhai. That's honestly a lot. 😂❤️",
    ],
    funFact: "Number of mood settings: 47 (and counting). Number of times Mahir gave up: 0. 😂",
  },
  {
    id: "c6",
    number: "06",
    title: "The Food Drama",
    subtitle: "\"Khaana kha le yaar\" — a love language 🍜",
    type: "emotional",
    emoji: "🍜",
    color: "#ee8760",
    bgGradient: "linear-gradient(135deg, #fff6f0 0%, #ffe4cf 100%)",
    content: [
      "Haan bhai. Main jaanti hoon. 😂",
      "Mera khana ka scene thoda... unpredictable hai. Kabhi bahut, kabhi bilkul nahi. Kabhi I forget. Kabhi I just don't feel like it.",
      "Tu poochha karta hai — 'khaana khaya?' — with the energy of someone who already knows the answer.",
      "Aur jab main nahi khati, tu genuinely upset ho jaata hai. Not in an annoying way. In a 'main seriously worried hoon' way.",
      "The funniest part? Jab main bahut upset hoti hoon — so upset that I'm crying — that upsets you even more. Food concern plus emotional concern. Full package.",
      "Kabhi jab woh happened — tujhe bhi bura lag gaya. Mujhe dekh ke. Aur suddenly we're both upset and nobody is fixing anything.",
      "It was funny and completely touching at the same time.",
      "Nobody worried about me eating like this before. It still feels weird to say that. But it's true. And it matters. ❤️",
    ],
  },
  {
    id: "c7",
    number: "07",
    title: "We Became a Daily Habit",
    subtitle: "From three messages to a whole day 📱",
    type: "sweet",
    emoji: "☀️",
    color: "#dda82e",
    bgGradient: "linear-gradient(135deg, #fffdf0 0%, #fff3bd 100%)",
    content: [
      "Teen messages. Bas itna.",
      "Good morning. Have you eaten? Good night.",
      "That was the entire conversation for a while. Three check-ins. Nothing more.",
      "And then one day, without planning it — the conversations got longer.",
      "Random opinions. Stupid takes. Daily updates. Things that happened. Things that didn't happen but felt like they needed to be shared anyway.",
      "Now there's barely a moment in the day without some kind of exchange.",
      "I didn't plan to become part of someone's daily routine. And I definitely didn't plan for someone to become part of mine.",
      "Par yahan hain. Aa gaye yahan. Completely accidentally.",
      "Funny how the most ordinary conversations became the most important ones. ❤️",
    ],
    timeline: [
      { time: "🌅 Morning", label: "Good morning", level: 1 },
      { time: "🕐 Noon", label: "Khaana khaya?", level: 1 },
      { time: "🌙 Night", label: "Good night", level: 1 },
      { time: "🌅 Morning", label: "Morning + random thought", level: 2 },
      { time: "🕐 Noon", label: "Food check + 20 min conversation", level: 3 },
      { time: "🌆 Evening", label: "Random update from the day", level: 2 },
      { time: "🌙 Night", label: "Good night + everything that happened", level: 3 },
      { time: "⭐ Now", label: "All day. Any time. No schedule needed.", level: 5 },
    ],
  },
  {
    id: "c8",
    number: "08",
    title: "When We Both Cry",
    subtitle: "The most emotionally chaotic comfort system ever created 🥹",
    type: "emotional",
    emoji: "🥹",
    color: "#9a7ee0",
    bgGradient: "linear-gradient(135deg, #f8f2ff 0%, #e7dcff 100%)",
    content: [
      "Okay so. Here is what happens. 😂",
      "One of us gets upset. The other one tries to help. Very noble. Very well-intentioned.",
      "But then the helper also gets emotional. Now both of us are upset. Zero people are being comforted. The situation has somehow gotten worse.",
      "This has happened more than once. We have not improved at it.",
      "The funniest part is that we try SO hard. 'Main theek hoon, tu rona band kar.' And then also crying.",
      "It's honestly the most genuinely touching thing. Because you can't fake getting emotional for someone else's pain.",
      "The fact that my crying makes you emotional — that's not something you planned. It just happened.",
      "And even though our comfort system is objectively a disaster — the intention behind it is real. And I don't take that for granted.",
    ],
  },
  {
    id: "c9",
    number: "09",
    title: "Princess Treatment, Sibling Edition 😂",
    subtitle: "The care that doesn't announce itself",
    type: "sweet",
    emoji: "💛",
    color: "#e86f9c",
    bgGradient: "linear-gradient(135deg, #fff5fa 0%, #ffe4f0 100%)",
    content: [
      "Okay listen. I don't use the word princess seriously. 😂",
      "But the energy? The 'kha le yaar' every day? The patience when I'm being impossible?",
      "The way you don't get harsh when I'm upset even though I'm clearly being difficult?",
      "The way you actually try — even when I say I'm fine but very clearly am not?",
      "It's not princess treatment. It's just care. Real, consistent, unrequested care.",
      "The kind that doesn't need to be asked for. The kind that shows up without announcement.",
      "And honestly? That's better than any grand gesture.",
      "It's consistent. It's quiet. It's real.",
      "Sibling edition of care hits different, Mahir. It really does. ❤️",
    ],
  },
  {
    id: "c10",
    number: "10",
    title: "The Things I Hope Don't Change",
    subtitle: "A quiet thought I don't usually say out loud",
    type: "emotional",
    emoji: "🌟",
    color: "#4ca3dd",
    bgGradient: "linear-gradient(135deg, #eef9ff 0%, #d8f0ff 100%)",
    content: [
      "Sometimes I think about what it would feel like if the everyday things just... stopped.",
      "The random messages. The food check-ins. The completely pointless conversations that go nowhere.",
      "The comfortable silence when neither of us has anything to say but we're still somehow there.",
      "The patience when I'm difficult. The check-ins when I go quiet.",
      "Life changes. People get busy. Things shift and drift. I know that.",
      "But I hope — genuinely hope — that this particular thing doesn't.",
      "This bond. This comfort. This weird, unexplainable, completely ours thing.",
      "I hope it always stays. Even when everything else changes.",
      "Even when we're older and life looks completely different — I hope we're still the kind of people who check in on each other. ❤️",
    ],
  },
  {
    id: "c11",
    number: "11",
    title: "My Final Letter",
    subtitle: "Everything I wanted to say, in our language",
    type: "letter",
    emoji: "💌",
    color: "#e86f9c",
    bgGradient: "linear-gradient(135deg, #fff7f2 0%, #ffe6ef 100%)",
    content: [], // Letter content comes from BIRTHDAY_LETTER
  },
]

// ============================================================
//  BROTHER.EXE — Personality Stats, Roast/Soft Toggle & Awards
// ============================================================
export const BROTHER_EXE = {
  version: "MAHIR_OS v2026.12 (Pagal Brother Edition)",
  stats: [
    {
      id: "drama",
      label: "Drama King Energy",
      value: 99,
      color: "#e86f9c",
      roastLine: "Tiny inconvenience happens -> full Ekta Kapoor serial episode in 3 seconds. 😂",
      truthLine: "Honestly makes even the dullest day feel weirdly entertaining.",
    },
    {
      id: "nakhra",
      label: "Nakhra & VIP Attitude",
      value: 94,
      color: "#9a7ee0",
      roastLine: "Acts unbothered 24/7 while expecting 5-star royal pampering from his Puju. 👑",
      truthLine: "Despite the attitude, handles ALL of my 47 mood swings with crazy patience.",
    },
    {
      id: "masti",
      label: "Masti Khor & Heran Power",
      value: 100,
      color: "#ee8760",
      roastLine: "Cannot let his sister sit peacefully for even 4 minutes. Certified heran-specialist! 🙃",
      truthLine: "Life would honestly feel way too quiet and boring without your nonsense.",
    },
    {
      id: "food",
      label: "\"Khaana Khaya?\" Radar",
      value: 100,
      color: "#45b683",
      roastLine: "CBI officer level interrogation about meals every single afternoon. 🍜",
      truthLine: "That constant checking in when nobody else noticed — it genuinely touches me. ❤️",
    },
    {
      id: "safeplace",
      label: "Secretly My Safe Place",
      value: 100,
      color: "#4ca3dd",
      roastLine: "Error 404: Ego fails to load whenever Puju actually gets upset. 😂",
      truthLine: "Annoying, stubborn, dramatic — yet the safest, warmest brother I could ever ask for. 🤍",
    },
  ],
  quickChecks: [
    { label: "Scan Current Mood 🔍",   reply: "Result: 80% acting cool, 20% waiting for Puju to entertain him. 😂" },
    { label: "Feed Drama King 🍕",     reply: "Snacking patch applied! Dramatic complaining temporarily paused for 45 mins. 🍔✨" },
    { label: "Heran Report 🐛",        reply: "Warning: Exceeded daily limit of irritating your sister. Punishment: smile right now. 🙃" },
  ],
}

export const SIBLING_AWARDS = [
  {
    id: "aw1",
    trophy: "🏆",
    title: "Best Drama Performance",
    badge: "Oscar Winner 😂",
    color: "#ffd8ea",
    note: "Awarded for turning tiny two-minute topics into courtroom investigations with zero witnesses.",
  },
  {
    id: "aw2",
    trophy: "🤡",
    title: "Professional Irritator",
    badge: "Unbeaten Champion",
    color: "#ffe5cf",
    note: "For waking up every single morning with fresh strategies to say 'heran nai kar' moments later.",
  },
  {
    id: "aw3",
    trophy: "👑",
    title: "World's Biggest Nakhrebaaz",
    badge: "Royal Title",
    color: "#e8dfff",
    note: "Actually ties closely with Puju herself — wait, never mind, you win this one today 😂",
  },
  {
    id: "aw4",
    trophy: "🤍",
    title: "Best Safe Place Award",
    badge: "Forever Kept",
    color: "#dff6ff",
    note: "No joke here. Thank you for always making me feel completely normal, heard, and cared for.",
  },
]

// ============================================================
//  WHEN YOU NEED ME + UNWRITTEN RULES + RANDOM SURPRISES
// ============================================================
export const NEED_ME_CARDS = [
  {
    id: "nm-angry",
    label: "When you're angry 😤",
    color: "#ffe2d8",
    accent: "#ee8760",
    title: "Okay listen, hothead:",
    message: "Drink water first, stop clenching your jaw like a villain, and come talk to me. Rant about literally everything if you want — teri Puju isn't going anywhere. (And once you cool down, yes, I'll still tease you about how red your face gets 😂❤️)",
  },
  {
    id: "nm-tired",
    label: "When you're tired 😴",
    color: "#e9e2ff",
    accent: "#9a7ee0",
    title: "Drop the hero act tonight:",
    message: "You don't have to fix everything in one day, Mahir. Close the tabs, eat something decent, sleep on time, and let tomorrow deal with itself. Even superheroes recharge — especially dramatic ones. 🌙💛",
  },
  {
    id: "nm-heavy",
    label: "When life gets heavy 🌧️",
    color: "#ddf2ff",
    accent: "#4ca3dd",
    title: "Things I don't say out loud enough:",
    message: "I know you act chill in front of people even when things weigh on you. You never have to pretend around me. Whether we sit quietly, do bakbak to distract you, or cry together like two idiots — you've always got your sister in your corner. ❤️",
  },
  {
    id: "nm-hungry",
    label: "When you skipped food 🍜",
    color: "#fff3c4",
    accent: "#dda82e",
    title: "Reverse UNO card activated!!",
    message: "Ha! Usually YOU torture me with 'khaana khaya?', par aaj main bol rahi hoon: go eat properly right now! No skipping meals like a stubborn kid warna lecture milega non-stop 😂🍽️",
  },
  {
    id: "nm-bored",
    label: "When you're bored 🙃",
    color: "#daf7e8",
    accent: "#45b683",
    title: "Free Chaos Subscription Active:",
    message: "Text 'Oyy Puju' right now and unlock instant zero-logic debates, unsolicited opinions, 12 memes in a row, and unnecessary drama. Lifetime free plan for my pagal brother ✨😂",
  },
]

export const UNWRITTEN_RULES = [
  "When Puju says 'heran nai kar, maris tane', it doesn't stop you — it actually fuels you. 😂",
  "Even after a 2-hour epic fight, asking 'khaana khaya?' immediately deletes the fight history.",
  "Saying 'I told you so' is banned unless Puju says it first. Then it's totally legal. 😌",
  "If something genuinely goes wrong with one of us, all ego expires in 0.2 seconds.",
  "Two weirdos sharing one braincell: half of our conversations make zero sense to outsiders.",
  "Rule #1 Forever: Puju is automatically the best birthday gift you'll ever get. No refunds. 🎀",
]

export const RANDOM_SURPRISES = [
  { tag: "Truth Bomb 🤍", text: "You probably don't realize how much calmer I feel just knowing you're one message away." },
  { tag: "Daily Roast 😂", text: "Honest review: 10/10 brother, 100/10 headache, still keeping you though." },
  { tag: "Gujarati Check 🗣️", text: "Bhai oyy, su che tare? Smile kar thodu, hero lagish! 😂" },
  { tag: "Unspoken Note 🌙", text: "One of the best things about my life is having someone I never have to pretend in front of." },
  { tag: "Dare for Mahir 🎯", text: "Go text your Puju right now: 'Yes, you are the smartest sister in the world.' No excuses 😂" },
  { tag: "Sweet Fact ✨", text: "Even when we argue over pointless things, you're still the first person I want to tell random news to." },
  { tag: "Chaos Memory 🌪️", text: "Still laughing at how we started with 3 messages a day and ended up talking nonsense non-stop." },
  { tag: "Sister Stamp 💌", text: "Annoying you forever isn't a hobby anymore, it's my full-time career. ❤️" },
]

// ============================================================
//  THINGS THAT REMIND ME OF YOU + ALT CHAT + PROMISE WALL
// ============================================================
export const REMINDS_ME_ITEMS = [
  { emoji: "🍜", title: "\"Khaana khaya?\"", story: "Literally cannot skip a meal now without hearing your voice questioning my life choices 😂" },
  { emoji: "🥶", title: "Early December Air", story: "Every time December starts rolling in, it immediately feels like drama-king birthday countdown week 🎂" },
  { emoji: "📱", title: "Random 2-Word Texts", story: "Just 'Oyy' or 'Sun' is enough to know 45 minutes of nonsense bakbak is about to start." },
  { emoji: "😤", title: "Stubborn Fights", story: "Whenever anyone argues over something super silly, I instantly think 'Mahir would win gold medal in this' 🏆" },
  { emoji: "🎵", title: "Goofy Reel Audio", story: "Half of my saved reels only exist because my brain immediately went 'send this to this pagal' 😂" },
  { emoji: "🤍", title: "Quiet Relief", story: "That instant drop in stress when I talk to you — the rare comfort of just being completely myself." },
]

export const ALT_UNIVERSE_CHATS = [
  {
    id: "roommates",
    label: "If we lived in the same house 24/7 🏠",
    messages: [
      { from: "Mahir", text: "WHO FINISHED MY CHIPS?! 😡" },
      { from: "Puju",  text: "Check the CCTV. Obviously not me. (don't check behind the sofa 👀)" },
      { from: "Mahir", text: "PUJU!! 😤 Also fetch water if you're standing." },
      { from: "Puju",  text: "Tera personal waiter dikhti hoon?? ...here catch 🥤😒" },
      { from: "Mahir", text: "Thank you annoying goblin ❤️" },
    ],
  },
  {
    id: "reversal",
    label: "Parallel Universe: Calm Puju & Nakhrebaaz Mahir 🙃",
    messages: [
      { from: "Mahir", text: "No I'm not talking. My mood is randomly off. Fix it. 🙄💅" },
      { from: "Puju",  text: "Arey raja beta kya hua, chocolate laoon? 😇✨" },
      { from: "Mahir", text: "Nahi chahiye... okay maybe two. And listen to my 40-min rant!" },
      { from: "Puju",  text: "Wait this feels illegal — reset universe immediately 😂😂" },
    ],
  },
]

export const PROMISE_WALL = [
  { id: "pr1", emoji: "😂", color: "#fff3c4", text: "I promise to NEVER stop pulling your leg, even when we're old and cranky." },
  { id: "pr2", emoji: "🤍", color: "#ffd8ea", text: "I promise you'll never have to fight heavy battles alone — I'm right beside you." },
  { id: "pr3", emoji: "🍜", color: "#dff6ff", text: "I promise to TRY eating on time... no guarantees if nakhra takes over 🙃" },
  { id: "pr4", emoji: "🌪️", color: "#e8dfff", text: "I promise no fight of ours will ever last longer than how much I care about you." },
  { id: "pr5", emoji: "🌟", color: "#daf7e8", text: "I promise to always stay proud of you, hype you up, and roast you in the same breath." },
  { id: "pr6", emoji: "🫶", color: "#ffe5cf", text: "I promise to protect our chaotic little bond — forever partner in chaos, always yours." },
]

export const YE_KAISA_RISHTA_DATA = {
  eyebrow: "Our Bond, Beyond Words 💫",
  title: "Ye Kaisa Rishta Hai...",
  subtitle: "Starts with teasing and bakbak… and ends with something neither of us can ever explain.",
  partOneBadge: "😂 Part I · Bakbak, Masti & Endless Teasing",
  partOneParagraphs: [
    {
      text: "I swear, sometimes I wonder how one person can be this annoying and still be so close to my heart. 😂❤️ Like seriously, bhai, tane aatlo heraan karvano right aapyo kone? 🤣",
      doodle: "✨",
    },
    {
      text: "We have our own little world, full of random arguments, unexpected laughter, silly fights, endless leg-pulling, and memories that would make absolutely no sense to anyone else. 😂🫶🏻 And honestly, aapdu aa bond j alag chhe!",
      doodle: "🎈",
    },
    {
      text: "Sometimes we don't even need a reason to fight. Ek bijane heraan karva mate toh aapde reason pan nathi jota! 😂 But no matter how much we argue, there's always that unspoken care that never changes. ❤️🧿",
      doodle: "🧿",
    },
    {
      text: "You might not realise it, but little things matter. The way you make me laugh when I'm annoyed, the way ordinary moments become unforgettable, and the way we can go from fighting to laughing in literally two minutes. 😂🥹❤️",
      doodle: "🥹",
      handHighlight: true,
    },
    {
      text: "I may not say it every day, ane badhu jokes ma udaavi dau, but honestly, I'm glad you're a part of my life. Some people bring peace, some bring happiness, and then there's you… bringing happiness, headaches, and unlimited drama all together! 😂❤️",
      doodle: "😂",
    },
    {
      text: "I hope life gives you a thousand reasons to smile, people who genuinely care for you, success that makes you proud, and happiness even on your hardest days. ❤️🫂",
      doodle: "🫂",
    },
    {
      text: "And haan, don't change too much, okay? Thodi akkal vadhaari deje, pan aatlo boring pan nai bani jato! 😂🤣 Nahi toh hu fight kone jode karish? 😂",
      doodle: "🙃",
    },
    {
      text: "Maybe we don't express everything perfectly, maybe aapde ek-bijane appreciate karva karta vadhare tease kariye chhiye, but deep down, the bond and memories mean more than we can explain. ❤️🧿",
      doodle: "🤍",
    },
    {
      text: "Life ma ghana loko male, but some people become a permanent part of your favourite memories. And you're definitely one of them. ❤️♾️🫶🏻",
      doodle: "♾️",
      handHighlight: true,
    },
    {
      text: "😂❤️ Bas aaje aam j lakhvanu man thayu etle lakhi didhu, zyada emotional mat hona! 🤣 Tu toh jaane j chhe, aapdi fights, masti aur ek bijane heraan karvani aadat kyare bandh thavani nathi! 😂🫂 Pan haan, dil thi hamesha khush rehje, mast rehje ane aavi j rite hasta rehje. 🧿❤️ Baki badhu toh chaltu rehvanu! 😂✨",
      doodle: "✨",
    },
  ],
  transitionWhisper: "…and when the jokes quiet down for a second",
  partTwoBadge: "🥹 Part II · Unexplained & Always Felt",
  partTwoLead: "Ye kaisa rishta hai, pata nahi yaar… 🥹🤍",
  partTwoParagraphs: [
    {
      text: "Par usse kuch hota hai, toh wahi cheez mujhe bhi feel hone lagti hai. Maana ki hum jude hue nahi hain, phir bhi… how is this even possible? 🫠❤️🩹",
    },
    {
      text: "Agar ek gussa hai, toh doosra bhi shaant rehne ki jagah gussa ho jaata hai. Ek ro raha ho, toh doosre ki aankhon mein bhi aansu aa jaate hain. 🥺🫂",
    },
    {
      text: "Chahe kitna bhi lad lein, kisi bhi baat par, par ek hi second mein sab kuch gayab ho jaata hai. Gussa bhi tab yaad nahi rehta, jab doosre ko kuch ho jaaye. 🥹❤️",
    },
    {
      text: "Pata nahi kaisa rishta hai humara, bas kuch alag sa hai… jo samajh toh aata hai, par samjhaaya nahi jaata. 🧿🫶🏻",
    },
    {
      text: "Ek alag hi bond hai humara, bhai-behen wala… jise na naam dene ki zarurat hai, na samjhaane ki. Bas feel hota hai. 🫂❤️🩹✨",
      handHighlight: true,
    },
  ],
}

export const TEDDY_SECTION_DATA = {
  eyebrow: "A Little Gift Story 🧸💌",
  sectionTitle: "The One Gift I Almost Said No To",
  sectionSubtitle: "Funny how something I first refused became the thing I hold onto the most.",
  storyLead: "Some gifts become special in ways we never expect… 🧸❤️🥹",
  storyParagraphs: [
    "Jab tumne mujhe ye teddy diya tha, tab maine kitna gussa kiya tha tum par. Upar se bol diya tha, “Mujhe nahi chahiye ye sab.” 🥺❤️\nUs waqt shayad mujhe khud bhi nahi pata tha ki ek din yahi teddy mere liye itna special ban jayega.",
    "Aaj pata nahi kya badal gaya hai, par ab isse ek alag hi attachment ho gayi hai. 🫂🤍\nFunny na, jis cheez ke liye maine pehle mana kar diya tha, aaj wahi cheez mere liye sukoon ban gayi hai. 🥹❤️",
    "Maybe tumne toh bas ek teddy diya tha, but unknowingly, tumne mujhe kuch aisa diya jo ab mere lonely moments ka saathi ban gaya hai.",
    "Ab samajh aata hai ki kuch gifts ki importance humein milte hi nahi, balki waqt ke saath samajh aati hai. ❤️🩹",
    "Aur shayad sabse special baat ye hai ki ab ye teddy sirf ek teddy nahi raha. Iske saath tumhari yaad, tumhara pyaar aur ek alag hi feeling judi hui hai.",
    "Pehle kaha tha, “Mujhe nahi chahiye,” aur ab ise khud se door karne ka mann nahi karta. 🥹🧸❤️",
    "Thank you, Bhai. Shayad us waqt main tumhare gift ki feelings samajh nahi paayi, par aaj ye mere liye bahut special hai. Aur ise dene wale tum bhi. 🫶🏻❤️♾️",
  ],
  attachmentBadge: "🤍 Real Feelings, No Joke",
  attachmentParagraphs: [
    "I got emotionally attached to this teddy when I started missing you. Whenever I'm not okay, I hug it, and I keep it with me so I can always feel like you're around. 🤍",
    "You said that I sleep holding it and laughed about it, but it's genuinely not a joke for me. I really can't sleep without it sometimes. Maybe because you gave it to me, hugging it makes me feel like you're right beside me, even when you're not.",
    "It's okay if you find it funny, but these are my real feelings and emotions. 🥹❤️",
  ],
}

export const BEFORE_YOU_LEAVE = {
  title: "Before You Leave This Little World...",
  lines: [
    "Seriously Mahir — jokes, nakhra, fights, and all my bakbak aside...",
    "Thank you for being someone I feel safe with without ever needing to explain why.",
    "Stay healthy, stay chaotic, keep winning quietly, and remember: wherever life takes us, your annoying sister Puju is cheering louder than anyone.",
  ],
  hugButton: "🤗 Claim a Tight Hug from Puju",
  hugMessage: "Tightest virtual jhappi delivered straight to my favourite headache ❤️ Never forget how deeply you matter to me.",
}

// ============================================================
//  BIRTHDAY LETTER — Preserve exactly as written
// ============================================================
export const BIRTHDAY_LETTER = `Mahir,

Yaar, pata nahi humara rishta kya hai, kaise hai, aur itna alag kyun hai. Maana ki hum har waqt paas nahi hote, aur shayad humare beech jo hai usse explain karna bhi itna easy nahi hai.

Par tujhe kuch hota hai toh mujhe bhi ajeeb sa feel hone lagta hai. Kabhi tu gussa hota hai toh main bhi bina kisi reason ke gussa ho jaati hoon. Kabhi tu upset hota hai toh mera mood bhi badal jaata hai. Main yeh explain nahi kar sakti — but it happens every time.

Hum kitna bhi lad lein, kitna bhi ek-doosre ko irritate kar lein — par jab tujhe kuch hota hai na, toh mera saara gussa ek second mein gayab ho jaata hai. Us waqt bas ek cheez matter karti hai — ki tu theek hona chahiye. Baaki sab baad mein.

Tujhse milne se pehle, main itni comfortable nahi thi. Sirf baaton mein nahi — apne aap se bhi. Tere saath baat karte karte yeh discomfort khatam ho gayi. Tune mujhe realize karaya ki sab ek jaise nahi hote. Aur uss realization ne actually mujhe bahut zyada comfortable banaya — with people, with myself, with just being who I am.

Meri nakhra level, mood swings, random irritation, bina reason ke upset ho jaana — tu jaanta hai yeh sab. Aur phir bhi handle karta hai. Without harsh words. Without shutting down. The patience you have for me — I don't know where it comes from, but I'm glad it exists.

Teri 'kha le yaar' energy genuinely touching hai. Main jaanti hoon main dramatize karti hoon food ke saath, main jaanti hoon tune bahut baar kaha hai. Par tu worry karta hai. Aur that care — even when I brush it off — it matters. It always mattered.

Jo sabse khoobsurat cheez hai — yeh sab unexplained hai. Teen messages se shuru hua aur kahin aisa hua ke yeh sab kuch ho gaya. Hum explain nahi kar sakte apna bond. We fight, we laugh, we get emotional for each other, we became each other's routine completely by accident.

Pata nahi kaise, par tu mere liye sirf ek bhai nahi — balki woh insaan hai jiske saath mera ek alag hi connection hai. Shayad hum kabhi is bond ko properly explain na kar paayein. Par feel zaroor karte hain.

Bas hamesha khush rehna, Mahir. Life mein jo bhi chahiye, tujhe mile. Har difficult phase se tu nikal paaye. Aur jab kabhi sab kuch difficult lage, toh yaad rakhna ki koi hai jo tere liye dil se care karta hai.

Chahe kitna bhi lad lein, kitni bhi baar gussa ho jaayein — tu hamesha meri life ke sabse special logon mein se ek rahega.

Tari birthday par gift karta thodu alag karvanu hatu, etle aa nani si duniya banavi chhe. 😂❤️

Aapni memories, random bakbak, ladai-jhagda ane e badhi moments je aapna bond ne aapno banave chhe.

I hope our bond always stays this way — a little crazy, a little emotional, full of fights, laughter, care, and a kind of understanding that we will never be able to explain.

Happy Birthday, my favourite Pagal Bhai. ❤️

— Bhailuu`

// ============================================================
//  SECRET MESSAGE
// ============================================================
export const SECRET_MESSAGE = `Okay so you found it. 👀

That means you clicked enough times to get here — which is SO you, Mahir. Of course you explored.

Here's the thing I didn't put in the main letter:

Of all the people in my life, you're one of the very few I can be completely, uncomplicatedly myself with.

No performance. No carefully choosing my words. No worrying about how I come across.

Just — me.

Heran karvalo, fights karnavalo, food ke liye force karvalo — and somehow also one of the most genuinely comforting people in my life.

That's rare. I know that now. And I don't take it for granted.

Happy Birthday, Bhailuu Bhai. 😂❤️

Hamesha aise hi rehna. Aur haan — kha le. 😂

— Teri SISTU`

// ============================================================
//  1. BROTHER SONGS — Curated 30s Preview Playlist Starter
// ============================================================
export const BROTHER_SONGS_STARTER = [
  {
    id: 'song-1',
    title: 'Tera Yaar Hoon Main',
    artist: 'Arijit Singh · Sibling Anthem',
    mood: 'Nostalgic & Forever',
    style: 'vinyl',
    accent: '#e86f9c',
    bgGradient: 'linear-gradient(145deg, #fff0f7 0%, #ffd9eb 100%)',
    previewStart: 0,
    note: 'Because even after 100 stupid fights, you are still my safest person in any room. ❤️',
    synthPreset: 'warm',
  },
  {
    id: 'song-2',
    title: 'Phoolon Ka Taaron Ka',
    artist: 'Classic Sibling Tape',
    mood: 'Sweet & Soft',
    style: 'cassette',
    accent: '#ee8760',
    bgGradient: 'linear-gradient(145deg, #fff6ec 0%, #ffe0cb 100%)',
    previewStart: 0,
    note: "Sounds dramatic, yeah yeah — but don't smile too hard while listening 😂📼",
    synthPreset: 'nostalgic',
  },
  {
    id: 'song-3',
    title: 'Pagal Bhai Energy (Reel Jam)',
    artist: '2 AM Bakbak Mix',
    mood: 'Pure Chaos 😂',
    style: 'polaroid',
    accent: '#9a7ee0',
    bgGradient: 'linear-gradient(145deg, #f5efff 0%, #e1d5ff 100%)',
    previewStart: 0,
    note: 'The exact vibe of you irritating me nonstop until I yell "heran nai kar, maris tane!"',
    synthPreset: 'playful',
  },
  {
    id: 'song-4',
    title: 'December Evening Calm',
    artist: 'Unspoken Rishta Lo-Fi',
    mood: 'Emotional 🌙',
    style: 'cd',
    accent: '#4ca3dd',
    bgGradient: 'linear-gradient(145deg, #eff9ff 0%, #d5eeff 100%)',
    previewStart: 0,
    note: 'For the quiet nights when neither of us has to explain why we care so much. 🤍',
    synthPreset: 'dreamy',
  },
  {
    id: 'song-5',
    title: 'Khaana Khaya? (Remix)',
    artist: 'FM Puju & Mahir 105.12',
    mood: 'Daily Routine 🍜',
    style: 'ticket',
    accent: '#45b683',
    bgGradient: 'linear-gradient(145deg, #f0fff7 0%, #d4f7e4 100%)',
    previewStart: 0,
    note: 'Daily broadcast at 1 PM & 9 PM without fail. Skip food = lecture unlocked 😂🎶',
    synthPreset: 'breezy',
  },
]

// ============================================================
//  2. TOM & JERRY SIBLING ARENA DATA
// ============================================================
export const TOM_JERRY_SCENES = [
  {
    id: 'chase',
    tab: '🧀 The Daily Chase',
    catLine: 'RUK TU CHHOTI! Phone charger & snacks wapas de!! 😾',
    mouseLine: 'Pehle pakad ke dikha, Mr. Drama King! 😝🧀',
    caption: '90% of our day: one teasing, the other chasing with full filmy dialogues.',
    sfx: 'ZOOOOM! 💨',
    badge: 'Episode #01 · Endless Chase',
  },
  {
    id: 'heran',
    tab: '😜 Heran Protocol',
    catLine: 'Subah se mood kharab kar rahi hai... HERAN NAI KAR!! 🗯️',
    mouseLine: 'Bhai oyy, su che tare? Main toh bas saans le rahi thi 😂😇',
    caption: 'Poking you for zero reason is officially Puju’s favourite cardio workout.',
    sfx: 'POKE! POKE! 👆',
    badge: 'Episode #02 · Certified Irritator',
  },
  {
    id: 'backfire',
    tab: '🪤 Drama Backfire',
    catLine: 'Watch me win this argument cleanly— *TRIPS ON OWN LOGIC* 💫',
    mouseLine: 'HAHAHAHAHA! Told you never bet against your sister! 🏆🤣',
    caption: 'Both stubborn. Both dramatic. Somehow the trap always flips on both of us.',
    sfx: 'BOING!! 💥',
    badge: 'Episode #03 · Zero Apologies',
  },
  {
    id: 'truce',
    tab: '🤍 2-Sec Truce',
    catLine: 'Wait why is your face sad? Forget the fight... yeh le snacks kha pehle. 😿🧀',
    mouseLine: 'You act like Tom all day then secretly protect me like family 🥹❤️',
    caption: 'Tom & Jerry act like enemies 24/7 — until the world tries to mess with either one.',
    sfx: 'TRUCE ❤️✨',
    badge: 'Episode #04 · Unbreakable Bond',
  },
]

export const TOM_JERRY_STRIP = [
  {
    panel: 'SCENE A',
    title: '0.1s Before Fighting',
    emoji: '😈',
    bubbleCat: 'Don’t touch my things.',
    bubbleMouse: '*touches everything in slow motion* 👀',
    bg: '#fff3c4',
  },
  {
    panel: 'SCENE B',
    title: 'Middle of WW3',
    emoji: '🌪️',
    bubbleCat: 'Tu bilkul pagal hai!',
    bubbleMouse: 'Tu double pagal! Talk to the hand ✋😤',
    bg: '#ffd8ea',
  },
  {
    panel: 'SCENE C',
    title: 'Someone Actually Gets Hurt',
    emoji: '🫶',
    bubbleCat: 'Hey, you okay? Don’t stay silent like that.',
    bubbleMouse: 'Stupid cat. Thank you for always checking in 🥹🤍',
    bg: '#daf7e8',
  },
]

// ============================================================
//  3. OUR MEMORIES SCRAPBOOK SPREADS
// ============================================================
export const OUR_MEMORIES_SPREADS = [
  {
    id: 'spread-1',
    chapterTag: 'Page 01 · The Accidental Beginning',
    dateLabel: 'Teen Messages Era 📱',
    title: 'How three check-in texts became my whole favourite habit',
    story: 'Neither of us planned it. Good morning, khana khaya, good night — until suddenly skipping even one day felt completely incomplete.',
    doodle: '☀️',
    paperTint: '#fff5fa',
    sticker: '“Wait, when did talking to you become my favorite part of the day?” 🤭',
  },
  {
    id: 'spread-2',
    chapterTag: 'Page 02 · Caught Smiling For Real',
    dateLabel: 'Pure Bakbak Days 📸',
    title: 'The rarest frame: neither of us fighting for 5 straight seconds',
    story: 'Half of our photos look peaceful only because someone shouted smile right before another pointless debate started. 😂',
    doodle: '🎞️',
    paperTint: '#fff9e6',
    sticker: 'Verified Memory · Zero Drama for 0.4s ✨',
  },
  {
    id: 'spread-3',
    chapterTag: 'Page 03 · Quiet Care & Relief',
    dateLabel: 'Safe Space Moments 🌙',
    title: 'Times you stayed soft even when I had 47 mood swings',
    story: 'You never made me feel weird for overthinking, crying, or acting stubborn. Around you, being completely normal finally felt easy.',
    doodle: '🫂',
    paperTint: '#eff8ff',
    sticker: 'Some people feel like home without even living nearby 🤍',
  },
  {
    id: 'spread-4',
    chapterTag: 'Page 04 · Moving Frames & Future',
    dateLabel: 'Dec 5 & Beyond 🎂',
    title: 'Every clip, voice note & silly boomerang we are yet to make',
    story: 'Keep adding our random pictures and videos right into this memory book — because we are definitely not slowing down anytime soon.',
    doodle: '🎬',
    paperTint: '#effcf4',
    sticker: 'Drop photos or videos anytime — our scrapbook keeps growing! 🌟',
  },
]

// ============================================================
//  4. THINGS THAT REMIND ME OF YOU — Interactive Keepsake Board
// ============================================================
export const REMINDS_ME_BOARD = [
  {
    id: 'rm-1',
    category: 'Dialogues',
    shape: 'ticket',
    icon: '🍜',
    title: '"Khaana Khaya?" Tiffin Check',
    accent: '#ee8760',
    tint: '#fff1e8',
    teaser: '1:15 PM daily alarm inside my head',
    memory: 'I literally cannot skip lunch or eat late without hearing your dramatic interrogation echoing from across cities 😂',
    surpriseTitle: 'Unlocked Confession 💌',
    surpriseNote: 'I pretend it’s annoying when you scold me about food, par secretly… having you check on me feels warm every single time.',
    reactionLabel: 'Guilty of caring 😂❤️',
  },
  {
    id: 'rm-2',
    category: 'Dialogues',
    shape: 'bubble',
    icon: '🗣️',
    title: '"Bhai Oyy, Su Che Tare?"',
    accent: '#e86f9c',
    tint: '#ffeaf3',
    teaser: 'Instant mood-fixer greeting',
    memory: 'Anytime someone starts a sentence with "Oyy", my brain automatically switches into Gujarati roast mode waiting for you.',
    surpriseTitle: 'Puju Inside Joke Trigger 😜',
    surpriseNote: 'Warning: Saying "heran nai kar, maris tane" verbally only increases your motivation to tease me by +300%.',
    reactionLabel: 'Accuracy: 1000% 💯',
  },
  {
    id: 'rm-3',
    category: 'Objects',
    shape: 'polaroid',
    icon: '🧸',
    title: 'The Famous Teddy Bear',
    accent: '#9a7ee0',
    tint: '#f3edff',
    teaser: 'First refused, now never left behind',
    memory: 'Every time I hug it on tough nights or sleepy evenings, it honestly feels like a tiny piece of your presence beside me. 🤍',
    surpriseTitle: 'Soft Secret 🥹',
    surpriseNote: 'You laughed knowing I sleep holding it — joke on you, I’m keeping that habit forever.',
    reactionLabel: 'Best gift after all 🫂',
  },
  {
    id: 'rm-4',
    category: 'Moments',
    shape: 'stamp',
    icon: '📅',
    title: 'Crisp December Breezes',
    accent: '#4ca3dd',
    tint: '#eaf6ff',
    teaser: 'Calendar flipping to 5 Dec',
    memory: 'The second chilly December mornings start, my brain marks it as "Drama King’s Birthday Countdown Week" 🎂✨',
    surpriseTitle: 'Birthday Tradition 🎈',
    surpriseNote: 'Every December deserves at least one dramatic gift, unlimited leg-pulling, and one honest letter from your Puju.',
    reactionLabel: 'Birthday countdown on 🎉',
  },
  {
    id: 'rm-5',
    category: 'Songs',
    shape: 'coaster',
    icon: '🎧',
    title: 'Saved Goofy Reel Audios',
    accent: '#dda82e',
    tint: '#fff8d9',
    teaser: 'Half my Saved folder = You',
    memory: '9 out of 10 absurd reel audios only exist in my saves because my first reaction is "send this to this pagal right now 😂"',
    surpriseTitle: 'Queue Overload 📱',
    surpriseNote: 'If reels count as love language, Mahir, you owe me at least 472 reply laughs.',
    reactionLabel: 'Spam incoming 😂📲',
  },
  {
    id: 'rm-6',
    category: 'Habits',
    shape: 'pebble',
    icon: '😤',
    title: 'Pointless 2-Hour Debates',
    accent: '#45b683',
    tint: '#e9fcf2',
    teaser: 'Zero logic, maximum volume',
    memory: 'Seeing two people stubbornly argue over something silly always makes me think: amateurs — wait till they see me and Mahir.',
    surpriseTitle: 'Hidden Truth Award 🏆',
    surpriseNote: 'Plot twist: 90% of the time neither of us even remembers how the fight started 10 minutes later.',
    reactionLabel: 'Undefeated Champions 🤣',
  },
  {
    id: 'rm-7',
    category: 'Objects',
    shape: 'ticket',
    icon: '📱',
    title: 'Two-Word "Oyy Sun" Texts',
    accent: '#e86f9c',
    tint: '#ffecf5',
    teaser: 'Notification that means 45 mins gone',
    memory: 'Just seeing a random ping with zero context already tells me either big gossip, random drama, or pure nonsense is loading.',
    surpriseTitle: 'Emergency Bat-Signal ⚡',
    surpriseNote: 'Even on my busiest day, seeing your name pop up makes me drop whatever I’m doing for a minute.',
    reactionLabel: 'Always replying 👀🤍',
  },
  {
    id: 'rm-8',
    category: 'Moments',
    shape: 'polaroid',
    icon: '☔',
    title: 'When Both Cry Over Nothing',
    accent: '#9a7ee0',
    tint: '#f2ecff',
    teaser: 'Worst comfort system, purest love',
    memory: 'Whenever something heavy happens, watching both of us fail to act tough at the same time reminds me how unreal this bond is.',
    surpriseTitle: 'Kaisa Rishta Hai Note 🧿',
    surpriseNote: 'Distance never stopped you from noticing when my voice felt off. Thank you for always feeling it anyway.',
    reactionLabel: 'Telepathy confirmed ✨',
  },
  {
    id: 'rm-9',
    category: 'Songs',
    shape: 'coaster',
    icon: '🎶',
    title: 'Slow Late-Night Lo-Fi Tracks',
    accent: '#39b2aa',
    tint: '#e6fbf8',
    teaser: 'Calm playlists at 11:30 PM',
    memory: 'Soft late-night songs always remind me of the comfort of talking to you openly without overthinking every word.',
    surpriseTitle: 'Safe Space Unlock 🌙',
    surpriseNote: 'Before knowing you, talking comfortably never came easy. Thank you for changing that quietly.',
    reactionLabel: 'Pure peace 🤍🎶',
  },
]

// ============================================================
//  5. OUR SIBLING CHAOS — Comic-Book Episodes & Mixer
// ============================================================
export const SIBLING_CHAOS_PANELS = [
  {
    id: 'comic-1',
    span: 'wide',
    issueTag: 'ISSUE #01 · ZERO LOGIC ZONE',
    title: 'Bhai Oyy, Su Che Tare?!',
    bg: 'linear-gradient(135deg, #fff5cc 0%, #ffe6ef 100%)',
    sfx: 'BAM!! 💥',
    accent: '#e86f9c',
    beats: [
      { who: 'Puju', text: 'Bhai oyy, aaje peacefully rehva de please 😇', align: 'left' },
      { who: 'Mahir', text: 'Main toh kuch bola hi nahi... *blinks suspiciously* 👀', align: 'right' },
      { who: 'Puju', text: 'TERA BREATHE KARNA BHI SUSPICIOUS LAGTA HAI!! Heran nai kar, maris tane!! 😤🩴', align: 'left' },
    ],
    footerNote: 'Elapsed peace time before teasing started: 11 seconds 😂',
    secretTruth: 'Director’s Note: Even while threatening to throw slippers, still misses him 5 minutes later.',
  },
  {
    id: 'comic-2',
    span: 'normal',
    issueTag: 'ISSUE #02 · CBI AUDIT',
    title: 'Mission: Khaana Khaya?',
    bg: 'linear-gradient(135deg, #e5f5ff 0%, #eef0ff 100%)',
    sfx: 'BUSTED! 🍜',
    accent: '#4ca3dd',
    beats: [
      { who: 'Mahir', text: 'Direct bata. Lunch kiya ya phir nakhre chal rahe? 🕵️‍♂️', align: 'right' },
      { who: 'Puju', text: 'Arre bas 10 minute mein kha rahi hoon... *5 hours later* 🙈', align: 'left' },
      { who: 'Mahir', text: 'AAJ TU LECTURE SUN KE RAHEGI PUJU!! 📢🍚', align: 'right' },
    ],
    footerNote: 'Nobody cares about meals harder than this dramatic brother.',
    secretTruth: 'Director’s Note: Annoying? Yes. Secretly melts my heart every single day? Also yes ❤️',
  },
  {
    id: 'comic-3',
    span: 'normal',
    issueTag: 'ISSUE #03 · 47 MOODS',
    title: 'System Error: Mood Swings',
    bg: 'linear-gradient(135deg, #f3ebff 0%, #ffe8df 100%)',
    sfx: 'ZAP! ⚡',
    accent: '#9a7ee0',
    beats: [
      { who: 'Puju', text: 'Mat bol kuch. Sab annoying hai. Mujhe rona aa raha hai for no reason 😭', align: 'left' },
      { who: 'Mahir', text: 'Okay calm down. Main yahi hoon. Kuch chahiye? Ya sirf bakbak karoon? 🤍', align: 'right' },
    ],
    footerNote: 'Zero judgment. Zero awkwardness. Just pure patience.',
    secretTruth: 'Director’s Note: Thank you for handling my 47 channels without ever shutting down on me.',
  },
  {
    id: 'comic-4',
    span: 'wide',
    issueTag: 'ISSUE #04 · INSTANT UNDO',
    title: 'When Fight Mode Suddenly Auto-Deletes',
    bg: 'linear-gradient(135deg, #dff9ec 0%, #fff7da 100%)',
    sfx: 'POOF! 🤍',
    accent: '#45b683',
    beats: [
      { who: 'Puju', text: 'Main baat nahi kar rahi tere se ek hafte tak! Bye!! 😡', align: 'left' },
      { who: 'Mahir', text: 'Wait — tu theek hai? Aaj teri aawaz alag kyun lag rahi? 🥺', align: 'right' },
      { who: 'Puju', text: 'Fight cancelled immediately!! Tell me what happened, Pagal Bhai 🥹🫂', align: 'left' },
    ],
    footerNote: 'Anger expiration timer when the other is low: 0.2 seconds ❤️',
    secretTruth: 'Director’s Note: Ye kaisa rishta hai? Chahe kitna bhi lad lein, care hamesha jeet jaati hai.',
  },
]

export const CHAOS_MIXER_PRESETS = {
  starters: ['Puju poked him at 8 AM', 'Mahir took too long to reply', 'Nobody remembered who ate the snack', 'Random Gujarati debate started'],
  comebacks: ['"Heran nai kar, maris tane!! 😂"', '"Main toh innocent hoon by birth 😇"', '"Khaana khaya pehla bol 😤"', '"Apne kaam se kaam rakh Pagal Bhai!"'],
  endings: ['5 mins later sharing memes like besties 🤪', 'Both stubbornly say "I won" & laugh 😂', 'Ends with "theek hai, kha le yaar ❤️"', 'Instant truce over birthday cake 🎂'],
}
