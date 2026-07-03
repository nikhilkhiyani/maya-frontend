'use client'

import { cn } from '@/lib/utils'

interface CtaArrowButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

/**
 * On-brand animated CTA: a dark pill with an amber offset shadow and a set of
 * chevrons that slide in and pulse amber on hover. Used for the primary
 * "Buy Now" / "Pay" actions.
 */
export function CtaArrowButton({
  children,
  onClick,
  disabled,
  type = 'button',
  className,
}: CtaArrowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn('cta-arrow', className)}
    >
      <span>{children}</span>
      <svg
        className="cta-arrow-icon"
        viewBox="0 0 66 43"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g fill="none" fillRule="evenodd">
          <path
            className="one"
            d="M40.154 3.895 43.976.139a.5.5 0 0 1 .701 0l21.015 20.646a1 1 0 0 1 .009 1.414l-.009.009-21.015 20.649a.5.5 0 0 1-.701 0l-3.822-3.754a.5.5 0 0 1 0-.706l16.839-16.537a.5.5 0 0 0 0-.713L40.154 4.608a.5.5 0 0 1 0-.713Z"
          />
          <path
            className="two"
            d="M20.154 3.895 23.976.139a.5.5 0 0 1 .701 0l21.015 20.646a1 1 0 0 1 .009 1.414l-.009.009-21.015 20.649a.5.5 0 0 1-.701 0l-3.822-3.754a.5.5 0 0 1 0-.706l16.839-16.537a.5.5 0 0 0 0-.713L20.154 4.608a.5.5 0 0 1 0-.713Z"
          />
          <path
            className="three"
            d="M.154 3.895 3.976.139a.5.5 0 0 1 .701 0l21.015 20.646a1 1 0 0 1 .009 1.414l-.009.009L4.677 42.861a.5.5 0 0 1-.701 0L.154 39.107a.5.5 0 0 1 0-.706l16.839-16.537a.5.5 0 0 0 0-.713L.154 4.608a.5.5 0 0 1 0-.713Z"
          />
        </g>
      </svg>
    </button>
  )
}
