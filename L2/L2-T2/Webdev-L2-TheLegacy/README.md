# THE LEGACY — Albert Einstein Tribute

**OASIS INFOBYTE SIP** — Web Development & Designing  
**Level 2 Task 2**

---

## Objective

Build a visually engaging tribute website for a respected historical figure. The project emphasizes professional editorial design, semantic HTML5, responsive layout, and original content — presenting a digital tribute that resembles a museum-grade digital editorial rather than a basic beginner page.

---

## Person Selected

**Albert Einstein** (1879–1955) — Theoretical physicist, Nobel laureate, and one of the most influential scientists in human history. Known for the theory of relativity, the photoelectric effect, and mass-energy equivalence.

---

## Features

- Hero section with full-viewport background image and typographic hierarchy
- Introduction section with editorial-style pull quote
- Two-column layout for Early Life and Legacy sections
- Contribution cards with numbered entries for major scientific achievements
- Chronological timeline with alternating left/right milestones and animated reveal
- Distinct quote block on a dark background
- Footer with attribution and image source

---

## Technologies

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure (`header`, `main`, `section`, `article`, `blockquote`, `footer`) |
| CSS3 | Responsive layout, typography hierarchy, color palette, animations |
| JavaScript | Scroll reveal via `IntersectionObserver`, subtle hero parallax |
| Google Fonts | Playfair Display (serif) + Inter (sans-serif) |

---

## Design System

### Color Palette

| Color | Hex | Usage |
|---|---|---|
| Warm White | `#faf9f6` | Primary background |
| Warm Beige | `#f0ede6` | Alternating sections |
| Dark Charcoal | `#1a1a1a` | Hero background, quote block |
| Deep Gold | `#8b6914` | Accent color (labels, markers, links) |
| Muted Gold | `#c4a24e` | Secondary accent, divider |

### Typography

- **Playfair Display** — Hero title, section titles, timeline years, blockquote
- **Inter** — Body text, labels, captions, footer

---

## Image Source / Attribution

**Hero Image:** `Albert_Einstein_Head.jpg` from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Albert_Einstein_Head.jpg)  
**License:** Public Domain — No copyright restrictions  
**Note:** Image is loaded remotely from Wikimedia CDN. No local copy is stored in the `assets/` directory.

---

## How to Run

1. Clone or download the project folder
2. Open `index.html` in any modern web browser
3. The page uses a remote image from Wikimedia Commons and fonts from Google Fonts — ensure an internet connection is available

```bash
# Alternatively, serve locally with Python:
cd the-legacy
python -m http.server 8000
# Then open http://localhost:8000
```

---

## Responsive Behavior

| Viewport | Behavior |
|---|---|
| Desktop (>900px) | Two-column layouts, full timeline with alternating sides |
| Tablet (600–900px) | Single-column content, timeline collapses to left-aligned |
| Mobile (<600px) | Adjusted spacing, smaller typography, stacked cards |

- No horizontal scrolling on any device
- Images scale correctly via `max-width: 100%` and `object-fit`
- Typography uses `clamp()` for fluid scaling

---

## Author

Created for OASIS INFOBYTE SIP — Web Development & Designing — Level 2 Task 2
