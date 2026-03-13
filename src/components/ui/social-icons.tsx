// Twitter/X and Bankr SVG icons (lucide doesn't have these)

export function TwitterXIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

export function BankrIcon({ className = "w-4 h-4" }: { className?: string }) {
  // Bankr.bot pixel-style B icon
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="currentColor" opacity="0.15"/>
      <rect x="6" y="4" width="3" height="16" fill="currentColor"/>
      <rect x="9" y="4" width="6" height="3" fill="currentColor"/>
      <rect x="9" y="10" width="5" height="3" fill="currentColor"/>
      <rect x="9" y="17" width="6" height="3" fill="currentColor"/>
      <rect x="15" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="14" y="13" width="3" height="4" fill="currentColor"/>
    </svg>
  )
}
