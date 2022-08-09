import React from 'react'
import { ButtonBase, useTheme, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useIsDarkMode } from 'state/user/hooks'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  children?: React.ReactNode
  primary?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  selected?: boolean
}

export default function SelectButton(props: Props) {
  const { onClick, disabled, style = {}, width, height, primary, children, selected } = props
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={Object.assign(
        {
          width: width || '100%',
          height: height || 52,
          backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.default,
          color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
          borderRadius: 1,
          fontSize: 16,
          fontWeight: 400,
          transition: '.3s',
          padding: '0 15.67px 0 20px',
          position: 'relative',
          '& *': {
            zIndex: 2
          },
          '&:hover, :active': {
            borderRadius: '10px',
            background: isDarkMode ? theme.gradient.gradient1 : '#1F9898',
            backgroundClip: 'padding-box',
            zIndex: 1
          },
          '&:before': {
            background: theme.palette.background.default,
            position: 'absolute',
            borderRadius: '9px',
            top: 1,
            right: 1,
            bottom: 1,
            left: 1,
            content: '""',
            pointerEvents: 'none !important'
          },
          display: 'flex',
          justifyContent: 'space-between',
          '&.MuiButtonBase-root.Mui-disabled': {
            opacity: theme.palette.action.disabledOpacity
          }
        },
        style
      )}
    >
      <Box>{children}</Box>
      <ExpandMoreIcon />
    </ButtonBase>
  )
}
