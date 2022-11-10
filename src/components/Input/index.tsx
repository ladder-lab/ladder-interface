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
  // outlined?: boolean
  type?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  maxWidth?: string | number
  height?: string | number
  error?: boolean
  // smallPlaceholder?: boolean
  subStr?: string
  subStr2?: string
  helperText?: string
  borderRadius?: string
  requiredLabel?: boolean
}

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  // outlined,
  startAdornment,
  endAdornment,
  maxWidth,
  label,
  height,
  error,
  // smallPlaceholder,
  subStr,
  subStr2,
  helperText,
  borderRadius = '8px',
  requiredLabel,
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && (
        <InputLabel required={requiredLabel} helperText={helperText}>
          {label}
        </InputLabel>
      )}
      <InputBase
        sx={{
          height: height || 52,
          borderRadius,
          padding: 0,
          zIndex: 1,
          // background: error ? 'red' : 'transparent',
          '&.Mui-focused:before': {
            display: 'none'
          },
          '& .MuiInputBase-input': {
            height: '100%',
            padding: `0 ${endAdornment ? '60px' : '22px'} 0 ${startAdornment ? '60px' : '22px'}`,
            backgroundClip: 'padding-box',
            boxSizing: 'border-box',
            background: theme.palette.background.default,
            borderRadius
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.text.secondary,
            opacity: theme.palette.action.disabledOpacity
          },
          '&.Mui-focused .MuiInputBase-input, &:hover .MuiInputBase-input': {
            height: '100%',
            width: '100%',
            background: theme.palette.background.default,
            padding: `0 ${endAdornment ? '60px' : '22px'} 0 ${startAdornment ? '60px' : '22px'}`,
            borderRadius
          },
          '&:after': {
            top: -1,
            right: -1,
            bottom: -1,
            left: -1,
            zIndex: -1,
            content: '""',
            borderRadius: `calc(${borderRadius} + 1px)`,
            position: 'absolute',
            background: error ? `${theme.palette.error.main}!important` : 'transparent'
          },
          '&.Mui-focused:after, &:hover:after': {
            background: isDarkMode ? theme.gradient.gradient1 : '#1F9898'
          },
          '&.Mui-disabled:hover:after': {
            background: 'unset'
          },
          '& span': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
            paddingRight: '0 !important',
            position: 'absolute'
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
        endAdornment={endAdornment && <span style={{ paddingRight: 20, right: 0 }}>{endAdornment}</span>}
        {...rest}
      />
      <Box display="flex" justifyContent="space-between">
        {subStr && (
          <Typography
            fontSize={12}
            mt={12}
            sx={{ color: error ? theme.palette.error.main : theme.palette.text.secondary }}
          >
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
