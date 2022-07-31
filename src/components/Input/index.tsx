import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, Typography, Box, useTheme } from '@mui/material'
import InputLabel from './InputLabel'

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
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  const theme = useTheme()
  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && <InputLabel helperText={helperText}>{label}</InputLabel>}
      <InputBase
        sx={{
          height: height || 60,
          borderRadius: '8px',
          background: theme.palette.background.default,
          padding: '0 22px',
          '&.Mui-focused': {
            background: theme.gradient.gradient1,
            height: height || 60,
            zIndex: 1,
            borderRadius: '8px',
            position: 'relative'
          },
          '&.Mui-focused:before': {
            height: height || 60,
            background: theme.palette.background.default,
            borderRadius: '8px',
            borderColor: 'transparent',
            backgroundClip: 'padding-box',
            position: 'absolute',
            top: 1,
            right: 1,
            bottom: 1,
            left: 1,
            zIndex: -1,
            width: '100%'
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
