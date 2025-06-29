interface GuitarIconProps {
  className?: string
}

export function GuitarIcon({ className }: GuitarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v20" />
      <path d="M8 5h8" />
      <path d="M8 19h8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M5 12h2" />
      <path d="M17 12h2" />
      <path d="M12 8v1" />
      <path d="M12 15v1" />
    </svg>
  )
}
