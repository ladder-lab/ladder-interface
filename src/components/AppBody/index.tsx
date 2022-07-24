import React from 'react'
import { styled, SxProps, Typography, Box } from '@mui/material'
import { CloseIcon } from 'theme/components'
import { BackBtn } from 'theme/components'

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  background: theme.palette.background.paper,
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxSizing: 'border-box',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '100%!important',
    maxWidth: 'unset'
  }
}))

interface Props {
  children: React.ReactNode
  width?: number | string
  onReturnClick?: () => void
  title?: string
  maxWidth?: string
  closeIcon?: boolean
  sx?: SxProps
}

export default function AppBody(props: Props) {
  const { children, closeIcon, onReturnClick, width, maxWidth, title, sx } = props

  return (
    <Root
      sx={{
        width: width || 560,
        maxWidth: maxWidth || 560,
        ...sx
      }}
    >
      <Box display="flex" gap={20} alignItems="center">
        {onReturnClick && <BackBtn onClick={onReturnClick} />}
        {title && (
          <Typography
            sx={{
              fontSize: {
                xs: 20,
                md: 28
              }
            }}
          >
            {title}
          </Typography>
        )}
      </Box>

      {closeIcon && <CloseIcon onClick={onReturnClick} />}
      {children}
    </Root>
  )
}
