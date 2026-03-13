const fs = require('fs')
const path = require('path')

const CLASSES = {
  'code-ranger':     { p: '#ff2040', s: '#5a0010', a: '#ffffff', e: '#ff6080' },
  'data-mage':       { p: '#a040ff', s: '#2a0060', a: '#e0c0ff', e: '#d080ff' },
  'chain-knight':    { p: '#ff8800', s: '#6b2200', a: '#ffe0a0', e: '#ffaa40' },
  'system-guardian': { p: '#00cc60', s: '#003a1a', a: '#ffffff', e: '#00ff80' },
  'merge-monk':      { p: '#ff4060', s: '#600020', a: '#ffddee', e: '#ff80a0' },
  'architect':       { p: '#ffcc00', s: '#5a3a00', a: '#ffffff', e: '#ffe040' },
  'rookie':          { p: '#806060', s: '#2a1a1a', a: '#c0a0a0', e: '#a07070' },
}

const STATES = ['idle', 'attack', 'hit', 'victory', 'defeat']

function sprite(cls, state, c) {
  const tx = state === 'attack' ? 4 : state === 'hit' ? -4 : 0
  const ty = state === 'victory' ? -3 : state === 'defeat' ? 3 : 0
  const op = state === 'hit' ? 0.65 : state === 'defeat' ? 0.5 : 1

  const weaponEl = state === 'attack' ? `
    <rect x="33" y="14" width="3" height="10" fill="${c.e}" opacity="0.9"/>
    <rect x="31" y="12" width="7" height="2" fill="${c.e}" opacity="0.9"/>` : ''

  const auraEl = state === 'victory' ? `
    <rect x="12" y="4" width="4" height="2" fill="${c.e}" opacity="0.8"/>
    <rect x="32" y="4" width="4" height="2" fill="${c.e}" opacity="0.8"/>
    <rect x="22" y="2" width="4" height="2" fill="${c.e}" opacity="0.9"/>` : ''

  const hitEl = state === 'hit' ? `
    <rect x="16" y="16" width="4" height="4" fill="#ff2040" opacity="0.7"/>
    <rect x="28" y="16" width="4" height="4" fill="#ff2040" opacity="0.7"/>` : ''

  const defeatEl = state === 'defeat' ? `
    <rect x="18" y="22" width="12" height="2" fill="${c.p}" opacity="0.3"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <g transform="translate(${tx},${ty})" opacity="${op}">
    ${auraEl}
    <rect x="16" y="6" width="16" height="12" fill="${c.p}"/>
    <rect x="19" y="10" width="3" height="3" fill="${c.s}"/>
    <rect x="26" y="10" width="3" height="3" fill="${c.s}"/>
    <rect x="20" y="11" width="1" height="1" fill="${c.e}"/>
    <rect x="27" y="11" width="1" height="1" fill="${c.e}"/>
    <rect x="21" y="15" width="6" height="1" fill="${c.s}"/>
    <rect x="20" y="18" width="8" height="2" fill="${c.p}"/>
    <rect x="12" y="20" width="24" height="14" fill="${c.s}"/>
    <rect x="16" y="22" width="16" height="8" fill="${c.p}" opacity="0.7"/>
    <rect x="20" y="24" width="8" height="4" fill="${c.e}" opacity="0.4"/>
    <rect x="6" y="20" width="6" height="10" fill="${c.p}"/>
    <rect x="5" y="29" width="8" height="4" fill="${c.p}" opacity="0.8"/>
    <rect x="36" y="20" width="6" height="10" fill="${c.p}"/>
    <rect x="35" y="29" width="8" height="4" fill="${c.p}" opacity="0.8"/>
    ${weaponEl}
    <rect x="12" y="34" width="24" height="3" fill="${c.e}" opacity="0.5"/>
    <rect x="14" y="37" width="8" height="8" fill="${c.p}"/>
    <rect x="26" y="37" width="8" height="8" fill="${c.p}"/>
    <rect x="12" y="43" width="10" height="3" fill="${c.s}"/>
    <rect x="26" y="43" width="10" height="3" fill="${c.s}"/>
    ${hitEl}${defeatEl}
  </g>
</svg>`
}

for (const [cls, colors] of Object.entries(CLASSES)) {
  for (const state of STATES) {
    const dir = path.join(__dirname, '..', 'public', 'sprites', cls)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${state}.svg`), sprite(cls, state, colors))
  }
  console.log(`✓ ${cls}`)
}
console.log('All sprites done!')
