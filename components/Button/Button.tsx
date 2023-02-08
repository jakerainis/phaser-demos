import clsx from 'clsx'
import { ReactNode, useCallback } from 'react'

import css from './Button.module.css'

interface ButtonProps {
  className?: string
  children: ReactNode
  busy?: boolean
  disabled?: boolean
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'warning' | 'text'
}

export default function Button({
  busy,
  className,
  children,
  disabled,
  onClick,
  variant = 'primary',
}: ButtonProps) {
  const handleClick = useCallback(() => {
    if (!busy && !disabled && onClick) {
      onClick()
    }
  }, [busy, disabled, onClick])

  return (
    <button
      className={clsx(
        css.base,
        {
          [css.busy]: !!busy,
          [css.disabled]: !!disabled,
          [css.primary]: variant === 'primary',
          [css.secondary]: variant === 'secondary',
          [css.warning]: variant === 'warning',
          [css.text]: variant === 'text',
        },
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
