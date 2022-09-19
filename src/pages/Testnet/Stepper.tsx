import { useCallback } from 'react'
import { styled } from '@mui/material/styles'
import { Stepper as MuiStepper, StepLabel } from '@mui/material'
import Step from '@mui/material/Step'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { ReactComponent as CheckIconLight } from 'assets/svg/stepper/checkl.svg'
import { ReactComponent as LoadingIconLight } from 'assets/svg/stepper/loadingl.svg'
import { ReactComponent as BgIconLight } from 'assets/svg/stepper/bgl.svg'
import { ReactComponent as CheckIconDark } from 'assets/svg/stepper/checkd.svg'
import { ReactComponent as LoadingIconDark } from 'assets/svg/stepper/loadingd.svg'
import { ReactComponent as BgIconDark } from 'assets/svg/stepper/bgd.svg'
import { useIsDarkMode } from 'state/user/hooks'

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 30
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.background.default,
    borderRadius: 1
  }
}))

const steps = ['LIT-1', 'LIT-2', 'LIT-3', 'LIT-4']

export default function Stepper() {
  const isDarkMode = useIsDarkMode()

  const getIcon = useCallback(
    (label: string) => {
      if (label === steps[0]) {
        return isDarkMode ? CheckIconDark : CheckIconLight
      }

      if (label === steps[1]) {
        return isDarkMode ? LoadingIconDark : LoadingIconLight
      }

      return isDarkMode ? BgIconDark : BgIconLight
    },
    [isDarkMode]
  )

  return (
    <MuiStepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
      {steps.map(label => (
        <Step key={label}>
          <StepLabel StepIconComponent={getIcon(label)}>{label}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
