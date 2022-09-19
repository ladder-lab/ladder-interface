import { useMemo } from 'react'
import { Stepper as MuiStepper, StepLabel, Button } from '@mui/material'
import Step from '@mui/material/Step'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { ReactComponent as CheckIconLight } from 'assets/svg/stepper/checkl.svg'
import { ReactComponent as LoadingIconLight } from 'assets/svg/stepper/loadingl.svg'
import { ReactComponent as BgIconLight } from 'assets/svg/stepper/bgl.svg'
import { ReactComponent as CheckIconDark } from 'assets/svg/stepper/checkd.svg'
import { ReactComponent as LoadingIconDark } from 'assets/svg/stepper/loadingd.svg'
import { ReactComponent as BgIconDark } from 'assets/svg/stepper/bgd.svg'
import { useIsDarkMode } from 'state/user/hooks'
import { theme } from 'theme'

export default function Stepper() {
  const isDarkMode = useIsDarkMode()

  const steps = useMemo(() => {
    return [
      {
        icon: isDarkMode ? CheckIconDark : CheckIconLight,
        label: 'LIT-1',
        action: (
          <Button sx={{ width: 140, height: 51 }} onClick={() => {}} disabled>
            End
          </Button>
        )
      },
      {
        icon: isDarkMode ? LoadingIconDark : LoadingIconLight,
        label: 'LIT-2',
        action: (
          <Button sx={{ width: 140, height: 51 }} onClick={() => {}}>
            Register
          </Button>
        )
      },
      {
        icon: isDarkMode ? BgIconDark : BgIconLight,
        label: 'LIT-3'
      },
      {
        icon: isDarkMode ? BgIconDark : BgIconLight,
        label: 'LIT-4'
      }
    ]
  }, [isDarkMode])

  return (
    <MuiStepper
      alternativeLabel
      activeStep={1}
      connector={
        <StepConnector
          sx={{
            [`&.${stepConnectorClasses.alternativeLabel}`]: {
              top: 30
            },
            [`& .${stepConnectorClasses.line}`]: {
              height: 6,
              border: 0,
              backgroundColor: isDarkMode ? '#1B3536' : '#CEEAEA',
              borderRadius: 1
            }
          }}
        />
      }
    >
      {steps.map(({ icon, label, action }) => (
        <Step key={label}>
          <StepLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: theme.palette.text.primary,
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 36
              }
            }}
            StepIconComponent={icon}
          >
            {label}
            {action}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
