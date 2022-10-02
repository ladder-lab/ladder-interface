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
  imageWidth,
  imageHeight,
  images,
  maxWidth
}: {
  imageWidth?: number
  imageHeight?: number
  images: any
  maxWidth?: number
}) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = images.length

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
        style={{ padding: `0 calc((100% - ${imageWidth}px - 20px) / 2)` }}
        slideStyle={{ padding: { xs: '0 5px', md: '0 10px' } }}
      >
        {images.map((step: any, index: number) => (
          <Box key={index}>
            <Box
              component="img"
              sx={{
                height: imageHeight,
                display: 'block',
                maxWidth: imageWidth,
                overflow: 'hidden',
                width: imageWidth,
                borderRadius: '24px'
              }}
              src={step.imgPath}
              alt={step.label}
            />
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
