import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, Typography, Box, useTheme } from '@mui/material'
import InputLabel from './InputLabel'
import { useIsDarkMode } from 'state/user/hooks'

export interface InputProps {
  placeholder?: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  focused?: boolean
  outlined?: boolean
  type?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  maxWidth?: string | number
  height?: string | number
  error?: boolean
  smallPlaceholder?: boolean
  subStr?: string
  subStr2?: string
  helperText?: string
  borderRadius?: string
}

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  outlined,
  startAdornment,
  endAdornment,
  maxWidth,
  label,
  height,
  error,
  smallPlaceholder,
  subStr,
  subStr2,
  helperText,
  borderRadius = '8px',
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && <InputLabel helperText={helperText}>{label}</InputLabel>}
      <InputBase
        sx={{
          height: height || 52,
          borderRadius,
          background: theme.palette.background.default,
          padding: startAdornment ? 0 : '0 22px',
          '&.Mui-focused': {
            padding: 0,
            zIndex: 1
          },
          '&.Mui-focused:before': {
            display: 'none'
          },
          '& .MuiInputBase-input': {
            padding: startAdornment ? '0 0 0 17px' : 0
          },
          '&.Mui-focused .MuiInputBase-input': {
            height: '100%',
            width: '100%',
            background: theme.palette.background.default,
            padding: startAdornment ? '0 0 0 17px' : '0 22px',
            borderRadius: startAdornment ? `0 ${borderRadius} ${borderRadius} 0` : borderRadius,
            backgroundClip: 'padding-box',
            boxSizing: 'border-box'
          },
          '&.Mui-focused:after': {
            background: isDarkMode ? theme.gradient.gradient1 : '#1F9898',
            borderRadius,
            position: 'absolute',
            top: -1,
            right: -1,
            bottom: -1,
            left: -1,
            zIndex: -1,
            content: '""'
          },
          '& span': {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
            paddingRight: '0 !important'
          },
          '&.Mui-focused span': {
            background: theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: `${borderRadius} 0 0 ${borderRadius}`
          }
        }}
        color={error ? 'error' : 'primary'}
        fullWidth={true}
        placeholder={placeholder}
        inputRef={input => input && focused && input.focus()}
        onChange={onChange}
        value={value}
        disabled={disabled}
        type={type}
        startAdornment={startAdornment && <span style={{ paddingRight: 17 }}>{startAdornment}</span>}
        endAdornment={endAdornment && <span style={{ paddingRight: 20 }}>{endAdornment}</span>}
        {...rest}
      />
      <Box display="flex" justifyContent="space-between">
        {subStr && (
          <Typography fontSize={12} mt={12} sx={{ color: theme.palette.text.secondary }}>
            {subStr}
          </Typography>
        )}

        {subStr2 && (
          <Typography fontSize={12} mt={12} sx={{ color: theme.palette.text.secondary }}>
            {subStr2}
          </Typography>
        )}
      </Box>
    </div>
  )
}
