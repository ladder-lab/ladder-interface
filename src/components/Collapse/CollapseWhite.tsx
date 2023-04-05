import { Box, Collapse as MuiCollapse } from '@mui/material'
import { useState } from 'react'
import { ReactComponent as KeyboardArrowUpIcon } from 'assets/svg/round3/v4-arrow.svg'

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
  return (
    <Box>
      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: { xs: '1fr 36px', sm: '1fr 52px' },
          gap: { xs: 16, sm: 28 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 15
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
            cursor: 'pointer'
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <KeyboardArrowUpIcon />
          ) : (
            <Box
              sx={{
                rotate: '180deg'
              }}
            >
              <KeyboardArrowUpIcon />
            </Box>
          )}
        </Box>
      </Box>
      <MuiCollapse in={isOpen}>{children}</MuiCollapse>
    </Box>
  )
}
