import React, { ReactElement, useCallback } from 'react'
import MuiStepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import MuiStepButton from '@mui/material/StepButton'
import MuiStepLabel from '@mui/material/StepLabel'
import MuiStepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { styled } from '@mui/material/styles'
import { ReactComponent as StepCompletedIcon } from 'assets/componentsIcon/step_completed_icon.svg'
import { Box, Typography } from '@mui/material'
import { ReactComponent as BoxIcon } from 'assets/svg/airdrop/box_icon.svg'

interface Props {
  activeStep: number
  steps: number[]
  completedIcon?: React.ReactNode
  connector?: ReactElement
  onStep?: (step: number) => void
  stepsDescription?: string[]
}

const Connector = styled(MuiStepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(307deg, #7973FF 0%, #B481FF 100%)`
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(307deg, #7973FF 0%, #B481FF 100%)`
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 6,
    border: 0,
    background: '#E4E4E4',
    borderRadius: 10
  }
}))

export default function AirdropStepper(props: Props) {
  const { activeStep, steps, completedIcon = <StepCompletedIcon />, onStep, stepsDescription } = props

  const onClick = useCallback((val: string | number) => () => onStep && onStep(parseInt(val + '')), [onStep])

  function StepIcon(props: any) {
    const { active, completed, children } = props
    return (
      <Box
        sx={{
          borderRadius: '50%',
          border: completed ? '1px solid transparent' : '1px solid currentColor',
          opacity: active || completed ? 1 : 0.4,
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {completed ? completedIcon : children}
      </Box>
    )
  }

  return (
    <MuiStepper
      activeStep={activeStep}
      connector={<Connector />}
      sx={{ background: 'transparent', padding: 0, maxWidth: 520 }}
    >
      {steps.map((label, index) => (
        <MuiStep key={label}>
          <MuiStepButton
            onClick={onClick(index)}
            disabled={!onClick || index > activeStep}
            disableRipple
            sx={{
              ':disabled': {
                cursor: 'pointer',
                pointerEvents: 'auto'
              },
              color: theme => (index < activeStep ? theme.palette.primary.main : 'auto'),
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <BoxIcon />
            <MuiStepLabel
              StepIconComponent={(props: any) => (
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
                  <ellipse cx="9.32308" cy="9" rx="9.00667" ry="9" fill={props.completed ? '#7D74FF' : '#E0DEDE'} />
                  <ellipse cx="9.28403" cy="9" rx="3.75278" ry="3.75" fill="white" />
                </svg>
              )}
              sx={{
                display: 'grid',
                '&.Mui-disabled': {
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  userSelect: 'all'
                }
              }}
            >
              <Typography variant="h5" fontSize={12}>
                {stepsDescription && stepsDescription[index]}
              </Typography>
            </MuiStepLabel>
          </MuiStepButton>
        </MuiStep>
      ))}
    </MuiStepper>
  )
}
