import { Box, Collapse as MuiCollapse } from '@mui/material'
import { useState } from 'react'
import { ReactComponent as KeyboardArrowUpIcon } from 'assets/svg/round3/v4-arrow.svg'
import { ReactComponent as KeyboardArrowUpDarkIcon } from 'assets/svg/round3/dark_arrow_up.svg'
import { useIsDarkMode } from '../../state/user/hooks'

export default function CollapseWhite({
  children,
  title,
  defaultOpen
}: {
  children: any
  title: string | JSX.Element
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  const isDark = useIsDarkMode()
  return (
    <Box>
      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: { xs: '1fr 36px', sm: '1fr 52px' },
          gap: { xs: 16, sm: 28 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 0
        }}
      >
        {title}
        <Box
          sx={{
            width: { xs: 36, sm: 52 },
            height: { xs: 36, sm: 52 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            rotate: isOpen ? '0deg' : '180deg',
            cursor: 'pointer'
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isDark ? <KeyboardArrowUpDarkIcon /> : <KeyboardArrowUpIcon />}
        </Box>
      </Box>
      <MuiCollapse in={isOpen}>{children}</MuiCollapse>
    </Box>
  )
}
