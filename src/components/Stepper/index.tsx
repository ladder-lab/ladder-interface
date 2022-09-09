import React, { ReactElement, useCallback } from 'react'
import MuiStepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import MuiStepButton from '@mui/material/StepButton'
import MuiStepLabel from '@mui/material/StepLabel'
import MuiStepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { styled } from '@mui/material/styles'
import { ReactComponent as StepCompletedIcon } from 'assets/componentsIcon/step_completed_icon.svg'
import { Box } from '@mui/material'

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
      backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #FFFFFF 100%)`
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 100%, #FFFFFF 100%)`
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 1,
    border: 0,
    background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.4) 100%)',
    borderRadius: 1
  }
}))

export default function Stepper(props: Props) {
  const {
    activeStep,
    steps,
    completedIcon = <StepCompletedIcon />,
    connector = <Connector />,
    onStep,
    stepsDescription
  } = props

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
    <MuiStepper activeStep={activeStep} connector={connector} sx={{ background: 'transparent', padding: 0 }}>
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
            <MuiStepLabel
              StepIconComponent={(props: any) => <StepIcon {...props}>{label}</StepIcon>}
              sx={{
                '&.Mui-disabled': {
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  userSelect: 'all'
                },
                '& .Mui-completed': {
                  color: theme => theme.palette.primary.main
                }
              }}
            >
              {stepsDescription && stepsDescription[index]}
            </MuiStepLabel>
          </MuiStepButton>
        </MuiStep>
      ))}
    </MuiStepper>
  )
}
