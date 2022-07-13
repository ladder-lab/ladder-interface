import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, styled, Typography, Box, useTheme } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
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
  endAdornment?: React.ReactNode
  maxWidth?: string | number
  height?: string | number
  error?: boolean
  smallPlaceholder?: boolean
  subStr?: string
  subStr2?: string
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  [`&.${inputBaseClasses.root}`]: {
    fontSize: 16,
    color: theme.palette.text.primary,
    fontWeight: 400,
    backgroundColor: theme.palette.background.default,
    paddingLeft: 20,
    borderRadius: 14
  },
  [`&.${inputBaseClasses.focused}`]: { border: `1px solid ${theme.palette.primary.main} !important` },
  [`& .${inputBaseClasses.input}`]: {
    maxWidth: '100%',
    '&::-webkit-outer-spin-button': {
      WebkitAppearance: 'none'
    },
    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none'
    },
    '&.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary
    }
  },
  [`&.${inputBaseClasses.disabled}`]: {
    cursor: 'not-allowed'
  }
}))

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  outlined,
  endAdornment,
  maxWidth,
  label,
  height,
  error,
  smallPlaceholder,
  subStr,
  subStr2,
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  const theme = useTheme()
  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInputBase
        sx={{
          height: height || 60,
          [`&.${inputBaseClasses.root}`]: {
            border: theme =>
              `1px solid ${outlined ? 'rgba(255,255,255,.4)' : error ? theme.palette.error.main : 'transparent'}`
          },
          [`&.${inputBaseClasses.focused}`]: {
            borderColor: theme =>
              error ? `${theme.palette.error.main}!important` : `${theme.palette.primary.main}!important`
          },
          [`& .${inputBaseClasses.input}`]: {
            '&::placeholder': {
              fontSize: smallPlaceholder ? 13 : 16,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }
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
