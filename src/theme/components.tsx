import React, { HTMLProps, useCallback } from 'react'
import MuiCloseIcon from '@mui/icons-material/Close'
import { Link, IconButton, keyframes, styled, Theme, useTheme, ButtonBase } from '@mui/material'
import { SxProps } from '@mui/system'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { ReactComponent as ExternalArrow } from 'assets/svg/external_arrow.svg'
import { useIsDarkMode } from 'state/user/hooks'

export function BackBtn({ onClick, sx }: { onClick?: () => void; sx?: SxProps }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        padding: 0,
        width: 52,
        height: 52,
        background: theme => theme.palette.background.default,
        borderRadius: '8px',
        ...sx
      }}
    >
      <ArrowBackIosNewIcon sx={{ color: theme => theme.palette.grey[500], size: 13 }} />
    </IconButton>
  )
}

export function CloseIcon({
  onClick,
  variant = 'button',
  sx
}: {
  onClick?: () => void
  variant?: 'button' | 'plain'
  sx?: SxProps
}) {
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()

  if (variant === 'plain') {
    return (
      <ButtonBase onClick={onClick} sx={{ position: 'absolute', ...sx }}>
        <MuiCloseIcon sx={{ color: theme => theme.palette.text.primary, size: 13 }} />
      </ButtonBase>
    )
  }

  return (
    <IconButton
      onClick={onClick}
      sx={{
        padding: 0,
        position: 'absolute',
        background: theme.palette.background.default,
        borderRadius: '8px',
        width: { xs: 32, md: 52 },
        height: { xs: 32, md: 52 },
        '&:hover': {
          background: isDarkMode ? '#484D50' : '#1F9898'
        },
        ...sx
      }}
    >
      <MuiCloseIcon sx={{ color: theme => theme.palette.text.primary, size: 13 }} />
    </IconButton>
  )
}

export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  style,
  sx,
  className,
  children,
  underline,
  showIcon
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  underline?: 'always' | 'hover' | 'none'
  className?: string
  showIcon?: boolean
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
      } else {
        event.preventDefault()
        window.location.href = href
      }
    },
    [href, target]
  )
  return (
    <Link
      className={className}
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      style={style}
      sx={sx}
      underline={underline ?? 'none'}
    >
      {children}
      {showIcon && <ExternalArrow style={{ marginLeft: 8 }} />}
    </Link>
  )
}

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

export const AnimatedWrapper = styled('div')(`
pointer-events: none;
display: flex;
align-items: center;
justify-content: center;
height: 100%;
width: 100%;
`)

export const AnimatedImg = styled('div')(`
animation: ${pulse} 800ms linear infinite;
& > * {
  width: 72px;
})
`)

export const Dots = styled('span')(`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`)
