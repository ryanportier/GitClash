import { FighterClass, SpriteState } from '@/types'

const SPRITE_BASE = '/sprites'

// ============================================================
// SPRITE ASSET PATHS
// V1: SVG sprites auto-generated (works immediately)
// V2: Drop PNG pixel art at /sprites/{class}/{state}.png and change ext to 'png'
// ============================================================

export function getSpritePath(
  fighterClass: FighterClass,
  state: SpriteState,
  ext: 'svg' | 'png' = 'svg'
): string {
  return `${SPRITE_BASE}/${fighterClass}/${state}.${ext}`
}

export function getPortraitPath(fighterClass: FighterClass, ext: 'svg' | 'png' = 'svg'): string {
  return `${SPRITE_BASE}/${fighterClass}/idle.${ext}`
}

export function getDefaultSpritePath(state: SpriteState): string {
  return `${SPRITE_BASE}/rookie/${state}.svg`
}

export function getClassDisplayLabel(fighterClass: FighterClass): string {
  const labels: Record<FighterClass, string> = {
    'code-ranger':     'Code Ranger',
    'data-mage':       'Data Mage',
    'chain-knight':    'Chain Knight',
    'system-guardian': 'System Guardian',
    'merge-monk':      'Merge Monk',
    'architect':       'Architect',
    'rookie':          'Rookie',
  }
  return labels[fighterClass]
}

// ============================================================
// INLINE PLACEHOLDER SPRITE (SVG data URL)
// Used as fallback if file is missing or during SSR
// ============================================================

const CLASS_PIXEL_COLORS: Record<FighterClass, { primary: string; secondary: string; accent: string }> = {
  'code-ranger':     { primary: '#ff2040', secondary: '#5a0010', accent: '#ffffff' },
  'data-mage':       { primary: '#8000ff', secondary: '#3a0080', accent: '#d0a0ff' },
  'chain-knight':    { primary: '#ffaa00', secondary: '#805500', accent: '#ffffff' },
  'system-guardian': { primary: '#00cc60', secondary: '#003a1a', accent: '#ffffff' },
  'merge-monk':      { primary: '#ff4060', secondary: '#600020', accent: '#ffddee' },
  'architect':       { primary: '#ffcc00', secondary: '#5a3a00', accent: '#ffffff' },
  'rookie':          { primary: '#806060', secondary: '#2a1a1a', accent: '#c0a0a0' },
}

export function generatePlaceholderSvg(
  fighterClass: FighterClass,
  state: SpriteState = 'idle',
  size: number = 128,
): string {
  const colors = CLASS_PIXEL_COLORS[fighterClass]
  const isAttacking = state === 'attack'
  const isHit = state === 'hit'
  const isVictory = state === 'victory'
  const offsetX = isAttacking ? 8 : isHit ? -6 : 0
  const opacity = isHit ? 0.6 : 1

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16" style="image-rendering:pixelated">
    <g transform="translate(${offsetX / 8},0)" opacity="${opacity}">
      <rect x="5" y="1" width="6" height="5" fill="${colors.primary}"/>
      <rect x="6" y="2" width="1" height="1" fill="${colors.accent}"/>
      <rect x="9" y="2" width="1" height="1" fill="${colors.accent}"/>
      <rect x="4" y="6" width="8" height="5" fill="${colors.secondary}"/>
      <rect x="6" y="7" width="4" height="2" fill="${colors.primary}"/>
      <rect x="2" y="6" width="2" height="4" fill="${colors.primary}"/>
      <rect x="12" y="6" width="2" height="4" fill="${colors.primary}"/>
      <rect x="5" y="11" width="2" height="4" fill="${colors.primary}"/>
      <rect x="9" y="11" width="2" height="4" fill="${colors.primary}"/>
      <rect x="4" y="14" width="3" height="1" fill="${colors.secondary}"/>
      <rect x="9" y="14" width="3" height="1" fill="${colors.secondary}"/>
      ${isVictory ? `<rect x="12" y="3" width="2" height="4" fill="${colors.accent}"/>` : ''}
      ${isAttacking ? `<rect x="13" y="5" width="3" height="2" fill="${colors.accent}"/>` : ''}
    </g>
  </svg>`
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
