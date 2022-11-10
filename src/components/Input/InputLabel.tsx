import React from 'react'
import { InputLabel as MuiInputLabel, Typography } from '@mui/material'
// import { ReactComponent as InfoIcon } from '../../assets/componentsIcon/info_icon.svg'
import QuestionHelper from 'components/essential/QuestionHelper'

export default function InputLabel({
  children,
  // infoIcon,
  helperText,
  required,
  style
}: {
  children?: React.ReactNode
  helperText?: string
  style?: React.CSSProperties
  required?: boolean
}) {
  return (
    <MuiInputLabel
      sx={{
        color: theme => theme.palette.text.secondary,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '148.69%',
          ...style
        }}
      >
        {children}
      </div>
      {helperText && (
        <QuestionHelper text={helperText} style={{ marginLeft: 4 }} />
        // <InfoIcon
        //   style={{
        //     marginLeft: 4,
        //     cursor: 'pointer'
        //   }}
        // />
      )}
      {required && (
        <Typography
          sx={{
            ml: '0.4rem',
            color: theme => theme.palette.error.main
          }}
        >
          *
        </Typography>
      )}
    </MuiInputLabel>
  )
}
