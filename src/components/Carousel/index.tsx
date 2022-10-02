import { useState } from 'react'
import { useTheme, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

export default function Carousel({
  itemWidth,
  items,
  maxWidth,
  stepperPosition = 'center',
  stepperDark
}: {
  itemWidth?: number
  items: JSX.Element[]
  maxWidth?: number
  stepperPosition?: 'center' | 'left' | 'right'
  stepperDark?: boolean
}) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = items.length

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth
      }}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={(step: number) => setActiveStep(step)}
        enableMouseEvents
        style={{ padding: `0 calc((100% - ${itemWidth}px - 20px) / 2)` }}
        slideStyle={{ padding: { xs: '0 5px', md: '0 10px' } }}
      >
        {items}
      </AutoPlaySwipeableViews>
      <MobileStepper
        sx={{
          background: 'transparent',
          justifyContent:
            stepperPosition === 'left' ? 'flex-start' : stepperPosition === 'right' ? 'flex-end' : 'center',
          mt: 20,
          padding: 0,
          '& .MuiMobileStepper-dot': {
            backgroundColor: stepperDark ? 'rgba(18, 18, 18, 0.36)' : 'rgba(255, 255, 255, 0.36)'
          },
          '& .MuiMobileStepper-dotActive': {
            backgroundColor: stepperDark ? '#121212' : '#FFFFFF'
          }
        }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <IconButton
            onClick={() => setActiveStep(prevActiveStep => prevActiveStep + 1)}
            disabled={activeStep === maxSteps - 1}
            sx={{
              background: stepperDark ? '#121212' : '#FFFFFF',
              ml: 40,
              '&:hover': { background: stepperDark ? '#121212' : '#FFFFFF', opacity: 0.8 },
              '&:disabled': {
                background: stepperDark ? '#121212' : '#FFFFFF',
                opacity: 0.3
              }
            }}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft sx={{ color: stepperDark ? '#FFFFFF' : '#121212' }} />
            ) : (
              <KeyboardArrowRight sx={{ color: stepperDark ? '#FFFFFF' : '#121212' }} />
            )}
          </IconButton>
        }
        backButton={
          <IconButton
            onClick={() => setActiveStep(prevActiveStep => prevActiveStep - 1)}
            disabled={activeStep === 0}
            sx={{
              background: stepperDark ? '#121212' : '#FFFFFF',
              mr: 40,
              '&:hover': { background: stepperDark ? '#121212' : '#FFFFFF', opacity: 0.8 },
              '&:disabled': {
                background: stepperDark ? '#121212' : '#FFFFFF',
                opacity: 0.3
              }
            }}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight sx={{ color: stepperDark ? '#FFFFFF' : '#121212' }} />
            ) : (
              <KeyboardArrowLeft sx={{ color: stepperDark ? '#FFFFFF' : '#121212' }} />
            )}
          </IconButton>
        }
      />
    </Box>
  )
}
