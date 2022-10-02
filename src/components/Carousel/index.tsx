import { useMemo, useState } from 'react'
import { useTheme, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import useBreakpoint from 'hooks/useBreakpoint'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const images = [
  {
    label: 'San Francisco – Oakland Bay Bridge, United States',
    imgPath: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    label: 'Bird',
    imgPath: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    label: 'Bali, Indonesia',
    imgPath: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250'
  },
  {
    label: 'San Francisco – Oakland Bay Bridge, United States',
    imgPath: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    label: 'Bird',
    imgPath: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
  },
  {
    label: 'Bali, Indonesia',
    imgPath: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250'
  }
]

export default function Carousel() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = images.length
  const isDownMd = useBreakpoint('md')

  const imageSize = useMemo(() => {
    return {
      width: isDownMd ? 180 : 380,
      height: isDownMd ? 218 : 460
    }
  }, [isDownMd])

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 700
      }}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={(step: number) => setActiveStep(step)}
        enableMouseEvents
        style={{ padding: `0 calc((100% - ${imageSize.width}px - 20px) / 2)` }}
        slideStyle={{ padding: { xs: '0 5px', md: '0 10px' } }}
      >
        {images.map((step, index) => (
          <Box key={step.label}>
            <Box
              component="img"
              sx={{
                height: imageSize.height,
                display: 'block',
                maxWidth: imageSize.width,
                overflow: 'hidden',
                width: imageSize.width,
                borderRadius: '24px'
              }}
              src={step.imgPath}
              alt={step.label}
            />
            {/* {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: 255,
                  display: 'block',
                  maxWidth: 400,
                  overflow: 'hidden',
                  width: '100%',
                  borderRadius: '24px'
                }}
                src={step.imgPath}
                alt={step.label}
              />
            ) : null} */}
          </Box>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        sx={{ background: 'transparent', justifyContent: 'center', mt: 20, padding: 0 }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <IconButton
            onClick={() => setActiveStep(prevActiveStep => prevActiveStep + 1)}
            disabled={activeStep === maxSteps - 1}
            sx={{ background: theme.palette.background.paper, ml: 40 }}
          >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
        }
        backButton={
          <IconButton
            onClick={() => setActiveStep(prevActiveStep => prevActiveStep - 1)}
            disabled={activeStep === 0}
            sx={{ background: theme.palette.background.paper, mr: 40 }}
          >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
        }
      />
    </Box>
  )
}
