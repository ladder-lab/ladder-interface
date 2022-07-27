import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  children?: React.ReactNode
  primary?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}

export default function SelectButton(props: Props) {
  const { onClick, disabled, style = {}, width, height, primary, children } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={Object.assign(
        {
          width: width || '100%',
          height: height || 60,
          backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.default,
          color: theme.palette.text.primary,
          borderRadius: 1,
          fontSize: 16,
          fontWeight: 400,
          transition: '.3s',
          padding: '0 15.67px 0 20px',
          border: '1px solid transparent',
          '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`
          },
          display: 'flex',
          justifyContent: 'space-between'
        },
        style
      )}
    >
      {children}
      <ExpandMoreIcon />
    </ButtonBase>
  )
}
