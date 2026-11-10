/* Inline SVGs replacing the emoji/dingbat glyphs used as icons.
   `1em` sizing keeps the metrics of the glyphs they replace; fill and
   stroke use currentColor so the existing state colors (is-liked,
   is-saved, is-flagged, .star) keep working unchanged. */

function Svg({ solid = false, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={solid ? 1 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ verticalAlign: "-0.125em" }}
    >
      {children}
    </svg>
  )
}

export function IconX() {
  return (
    <Svg>
      <path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  )
}

export function IconMessage() {
  return (
    <Svg>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Svg>
  )
}

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"

export function IconStar({ filled = true }) {
  return filled ? (
    <Svg solid>
      <path d={STAR_PATH} stroke="none" />
    </Svg>
  ) : (
    <Svg>
      <path d={STAR_PATH} />
    </Svg>
  )
}

export function IconHeart() {
  return (
    <Svg solid>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  )
}

export function IconComment() {
  return (
    <Svg>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Svg>
  )
}

export function IconShare() {
  return (
    <Svg>
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
    </Svg>
  )
}

export function IconFlag() {
  return (
    <Svg>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
    </Svg>
  )
}

export function IconTrash() {
  return (
    <Svg>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
    </Svg>
  )
}

export function IconFace() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </Svg>
  )
}

export function IconList() {
  return (
    <Svg>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </Svg>
  )
}

export function IconGrid() {
  return (
    <Svg>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </Svg>
  )
}
