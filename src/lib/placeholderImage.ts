// Self-contained SVG data URI — no external image dependency. See DECISIONS.md #5.
export function placeholderImage(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" rx="24" fill="${bg}"/>
    <text x="50%" y="54%" font-size="104" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
