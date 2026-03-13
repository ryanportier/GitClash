import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
  href?: string
}

export function GitClashLogo({ size = 32, showText = true, className, href = '/' }: LogoProps) {
  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/logo.png"
        alt="GitClash"
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated' }}
      />
      {showText && (
        <span
          className="font-pixel neon-text-red animate-flicker"
          style={{ fontSize: size * 0.38 }}
        >
          GITCLASH
        </span>
      )}
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}
