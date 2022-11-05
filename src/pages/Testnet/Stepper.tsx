import { useMemo, useState } from 'react'
import { Stepper as MuiStepper, StepLabel, Button, Typography, useTheme } from '@mui/material'
import Step from '@mui/material/Step'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { ReactComponent as CheckIconLight } from 'assets/svg/stepper/checkl.svg'
import { ReactComponent as LoadingIconLight } from 'assets/svg/stepper/loadingl.svg'
import { ReactComponent as BgIconLight } from 'assets/svg/stepper/bgl.svg'
import { ReactComponent as CheckIconDark } from 'assets/svg/stepper/checkd.svg'
import { ReactComponent as LoadingIconDark } from 'assets/svg/stepper/loadingd.svg'
import { ReactComponent as BgIconDark } from 'assets/svg/stepper/bgd.svg'
import { useIsDarkMode } from 'state/user/hooks'

export default function Stepper() {
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const [acitveStep] = useState(1)

  const steps = useMemo(() => {
    return [
      {
        label: 'LIT-1',
        actionText: 'End',
        onClick: () => {}
      },
      {
        label: 'LIT-2',
        actionText: 'Register',
        onClick: () => {}
      },
      {
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
      activeStep={acitveStep}
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
      {steps.map(({ label, actionText, onClick }, index) => (
        <Step key={label}>
          <StepLabel
            sx={{
              '& .MuiStepLabel-label': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 36
              }
            }}
            StepIconComponent={StepICon}
          >
            <Typography
              variant="h5"
              sx={{
                color: index == acitveStep ? theme.palette.text.primary : theme.palette.text.secondary,
                fontWeight: 700,
                fontSize: 16
              }}
            >
              {label}
            </Typography>
            <Button
              sx={{
                width: 140,
                height: 51,
                fontSize: 16,
                visibility: onClick ? 'visible' : 'hidden'
              }}
              onClick={onClick}
              disabled={acitveStep < index}
            >
              {actionText}
            </Button>
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}

function StepICon({ active, completed }: { active?: boolean; completed?: boolean }) {
  const isDarkMode = useIsDarkMode()

  if (active) {
    return isDarkMode ? <LoadingIconDark /> : <LoadingIconLight />
  }
  if (completed) {
    return isDarkMode ? <CheckIconDark /> : <CheckIconLight />
  }
  return isDarkMode ? <BgIconDark /> : <BgIconLight />
}
