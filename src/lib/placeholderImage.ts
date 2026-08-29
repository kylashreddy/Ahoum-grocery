// Self-contained SVG data URI — no external image dependency. See DECISIONS.md #5.
export function placeholderImage(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" rx="24" fill="${bg}"/>
    <text x="50%" y="54%" font-size="104" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// A richer hero illustration for category cards: gradient background, soft
// decorative blobs, and a drop-shadowed emoji — same offline-safe approach,
// just a nicer composition for cards that need to carry more visual weight.
export function categoryHeroImage(emoji: string, colorFrom: string, colorTo: string): string {
  const gradientId = `g-${colorFrom.replace("#", "")}-${colorTo.replace("#", "")}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colorFrom}"/>
        <stop offset="100%" stop-color="${colorTo}"/>
      </linearGradient>
      <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.18"/>
      </filter>
    </defs>
    <rect width="400" height="400" fill="url(#${gradientId})"/>
    <circle cx="60" cy="330" r="90" fill="#ffffff" opacity="0.12"/>
    <circle cx="345" cy="70" r="60" fill="#ffffff" opacity="0.15"/>
    <text x="50%" y="56%" font-size="180" text-anchor="middle" dominant-baseline="middle" filter="url(#soft-shadow)">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
