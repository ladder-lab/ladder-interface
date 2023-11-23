import React from 'react'
import { styled, SxProps, Typography, Box } from '@mui/material'
import { CloseIcon } from 'theme/components'
import { BackBtn } from 'theme/components'
import Settings from 'components/essential/Settings'

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
    maxWidth: 'unset',
    paddingTop: 20,
    margin: '54px 0 24px'
  },
  margin: '54px 0 80px'
}))

interface Props {
  children: React.ReactNode
  width?: number | string
  onReturnClick?: () => void
  title?: string
  maxWidth?: string
  closeIcon?: boolean
  setting?: boolean
  sx?: SxProps
}

export default function AppBody(props: Props) {
  const { children, closeIcon, onReturnClick, width, maxWidth, title, setting, sx } = props

  return (
    <Root
      sx={{
        width: width || 680,
        maxWidth: { xs: maxWidth || 'calc(100% - 32px)', md: maxWidth || 680 },
        ...sx
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" gap={20} alignItems="center">
          {onReturnClick && <BackBtn onClick={onReturnClick} />}
          {title && (
            <Typography
              variant="h5"
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
        {setting && <Settings />}
      </Box>

      {closeIcon && (
        <CloseIcon
          onClick={onReturnClick}
          sx={{
            position: 'absolute',
            top: 24,
            right: 32
          }}
        />
      )}
      {children}
    </Root>
  )
}
