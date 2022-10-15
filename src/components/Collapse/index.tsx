import { Box, Collapse as MuiCollapse, useTheme } from '@mui/material'
import { useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function Collapse({
  children,
  title,
  defaultOpen
}: {
  children: any
  title: string | JSX.Element
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  const theme = useTheme()
  return (
    <Box>
      <Box
        display={'grid'}
        alignItems="center"
        sx={{
          gridTemplateColumns: { xs: '1fr 36px', sm: '1fr 52px' },
          gap: { xs: 16, sm: 28 }
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
            borderRadius: '8px',
            border: `1px solid ${theme.palette.info.main}`,
            cursor: 'pointer'
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <KeyboardArrowUpIcon
              sx={{
                color: theme.palette.info.main
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                color: theme.palette.info.main
              }}
            />
          )}
        </Box>
      </Box>
      <MuiCollapse in={isOpen}>{children}</MuiCollapse>
    </Box>
  )
}
