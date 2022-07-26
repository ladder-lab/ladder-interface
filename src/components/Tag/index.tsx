import React from 'react'
import { Box, SxProps, useTheme } from '@mui/material'
import { useIsDarkMode } from 'state/user/hooks'

export default function Tag({ children, sx }: { children: React.ReactNode; sx?: SxProps }) {
  const theme = useTheme()
  const darkMode = useIsDarkMode()

  return (
    <Box
      sx={{
        borderRadius: '10px',
        boxShadow: '0px 3px 10px rgba(0,0,0,0.15)',
        fontSize: 12,
        padding: '4px 12px',
        background: darkMode ? '#484D50' : '#FFFFFF',
        color: theme.palette.primary.main,
        ...sx
      }}
    >
      {children}
    </Box>
  )
}
