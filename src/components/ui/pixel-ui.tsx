'use client'
import { cn } from '@/lib/utils'
import { FighterClass, Rarity, RARITY_CONFIG, CLASS_CONFIGS } from '@/types'
import { HTMLAttributes, ButtonHTMLAttributes } from 'react'

// ============================================================
// PIXEL BUTTON
// ============================================================
interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}
export function PixelButton({ variant = 'primary', size = 'md', className, children, ...props }: PixelButtonProps) {
  const variants = {
    primary:   'bg-ember-700 border-ember-500 text-white hover:bg-ember-600 shadow-[inset_-2px_-2px_0_#2a0000,inset_2px_2px_0_#ff3030]',
    secondary: 'bg-iron-700 border-iron-500 text-iron-100 hover:bg-iron-600 shadow-[inset_-2px_-2px_0_#080202,inset_2px_2px_0_#524040]',
    danger:    'bg-ember-900 border-neon-red text-red-100 hover:bg-ember-800 shadow-[inset_-2px_-2px_0_#2a0000,inset_2px_2px_0_#ff1030]',
    ghost:     'bg-transparent border-iron-500 text-iron-200 hover:border-ember-500 hover:text-ember-400',
  }
  const sizes = { sm: 'px-3 py-1 text-xs', md: 'px-5 py-2 text-sm', lg: 'px-8 py-3 text-base' }
  return (
    <button
      className={cn(
        'font-pixel border-2 uppercase tracking-wider transition-all duration-100',
        'active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ============================================================
// PIXEL PANEL
// ============================================================
interface PixelPanelProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: string
  title?: string
}
export function PixelPanel({ glowColor, title, className, children, ...props }: PixelPanelProps) {
  return (
    <div
      className={cn('relative bg-void-900 border-2 border-iron-700 p-4', className)}
      style={glowColor ? { borderColor: glowColor, boxShadow: `0 0 14px ${glowColor}33` } : {}}
      {...props}
    >
      {title && (
        <div
          className="absolute -top-3 left-4 bg-void-900 px-2 font-pixel text-xs uppercase tracking-widest"
          style={glowColor ? { color: glowColor } : { color: '#ff1030' }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

// ============================================================
// RARITY BADGE
// ============================================================
export function RarityBadge({ rarity }: { rarity: Rarity }) {
  const cfg = RARITY_CONFIG[rarity]
  return (
    <span
      className="font-pixel text-xs px-2 py-0.5 border uppercase tracking-widest"
      style={{ color: cfg.color, borderColor: cfg.color, boxShadow: `0 0 6px ${cfg.glowColor}55`, background: `${cfg.color}18` }}
    >
      {cfg.label}
    </span>
  )
}

// ============================================================
// CLASS BADGE
// ============================================================
export function ClassBadge({ fighterClass }: { fighterClass: FighterClass }) {
  const cfg = CLASS_CONFIGS[fighterClass]
  return (
    <span
      className="font-pixel text-xs px-2 py-0.5 border uppercase tracking-widest"
      style={{ color: cfg.color, borderColor: cfg.color, background: `${cfg.color}18` }}
    >
      {cfg.displayName}
    </span>
  )
}

// ============================================================
// HP BAR
// ============================================================
interface HpBarProps { current: number; max: number; color?: string; className?: string; showNumbers?: boolean }
export function HpBar({ current, max, className, showNumbers = true }: HpBarProps) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  const barColor = pct > 50 ? '#00ff80' : pct > 25 ? '#ffcc00' : '#ff1030'
  return (
    <div className={cn('w-full', className)}>
      {showNumbers && (
        <div className="flex justify-between font-pixel text-xs mb-1">
          <span style={{ color: barColor }}>HP</span>
          <span className="text-iron-300">{current}/{max}</span>
        </div>
      )}
      <div className="w-full h-3 bg-void-800 border border-iron-700 relative overflow-hidden">
        <div className="h-full transition-all duration-500 ease-out"
             style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}aa, ${barColor})` }} />
        <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none" />
      </div>
    </div>
  )
}

// ============================================================
// STAT BAR
// ============================================================
interface StatBarProps { label: string; value: number; max?: number; color?: string }
export function StatBar({ label, value, max = 100, color = '#e81010' }: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="font-pixel text-xs text-iron-300 w-16 uppercase">{label}</span>
      <div className="flex-1 h-2 bg-void-800 border border-iron-700">
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 4px ${color}` }} />
      </div>
      <span className="font-pixel text-xs text-iron-200 w-8 text-right">{value}</span>
    </div>
  )
}

// ============================================================
// PIXEL DIVIDER
// ============================================================
export function PixelDivider({ color = '#221010' }: { color?: string }) {
  return <div className="w-full h-px my-3" style={{ backgroundColor: color }} />
}

// ============================================================
// PIXEL LOADER
// ============================================================
export function PixelLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-ember-600"
               style={{ animationDelay: `${i * 0.1}s`, animation: 'blink 1.2s step-end infinite' }} />
        ))}
      </div>
      {label && <p className="font-pixel text-xs text-ember-400 animate-pulse uppercase tracking-widest">{label}</p>}
    </div>
  )
}
