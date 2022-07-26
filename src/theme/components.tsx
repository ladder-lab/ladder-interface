import React, { HTMLProps, useCallback } from 'react'
import MuiCloseIcon from '@mui/icons-material/Close'
import { Link, IconButton, keyframes, styled, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { ReactComponent as ExternalArrow } from 'assets/svg/external_arrow.svg'

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

export function CloseIcon({ onClick, variant }: { onClick?: () => void; variant?: 'contained' | 'text' }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        padding: 0,
        position: 'absolute',
        top: variant === 'contained' ? '24px' : '36.5px',
        right: variant === 'contained' ? '32px' : '42.5px',
        width: {
          xs: variant === 'contained' ? 32 : 15,
          md: variant === 'contained' ? 52 : 15
        },
        height: {
          xs: variant === 'contained' ? 32 : 15,
          md: variant === 'contained' ? 52 : 15
        },
        background: variant === 'contained' ? theme => theme.palette.background.default : 'transparent',
        borderRadius: '8px',
        '&:hover': {
          background: 'transparent'
        },
        '&:hover svg': {
          color: theme => theme.palette.text.primary
        }
      }}
    >
      <MuiCloseIcon sx={{ color: theme => theme.palette.grey[500], size: 13 }} />
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
