import { useVerifyTwitter } from '../../../hooks/useVerifyTwitter'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box } from '@mui/material'
import { StepBtn, StepDescText, StepNameText, StepText } from './Styled'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'

export default function Step1({
  step,
  setStep,
  oauth,
  verifyOauth
}: {
  step: number
  setStep: (step: number) => void
  oauth: boolean
  verifyOauth?: () => void
}) {
  const { openVerify } = useVerifyTwitter(true)
  const isDownMD = useBreakpoint('md')

  return (
    <Box
      flex={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '200px',
        opacity: step === 1 ? 1 : 0.4
      }}
    >
      <StepText>Step 2</StepText>
      <StepNameText>Connect Twitter</StepNameText>
      <StepDescText>Please connect and verify your twitter account</StepDescText>
      <Box display={'flex'} mt={23} gap={isDownMD ? 12 : 20} flexDirection={isDownMD ? 'column' : 'row'}>
        <StepBtn
          sx={{
            pointerEvents: step !== 1 ? 'none' : 'auto',
            '& svg': {
              fill: 'white',
              opacity: 1
            }
          }}
          onClick={() => {
            if (step < 1) return
            openVerify()
            setTimeout(() => {
              if (step < 2 && oauth) {
                setStep(2)
              }
            }, 5000)
            // let counter = 0
            // const intervalId = setInterval(() => {
            //   counter++
            //   if (counter > 20 || oauth) {
            //     clearInterval(intervalId)
            //     return
            //   }
            //   verifyOauth()
            // }, 1000)
          }}
        >
          <Twitter />
          {oauth ? 'Connected' : 'Connect'}
        </StepBtn>
        {/*{!oauth && (*/}
        {false && (
          <StepBtn
            sx={{
              pointerEvents: step < 1 ? 'none' : 'auto',
              border: '1px solid #1F9898',
              backgroundColor: 'transparent',
              color: '#1F9898'
            }}
            onClick={() => {
              if (step < 1) return
              if (!oauth) {
                verifyOauth()
              }
            }}
          >
            Verify
          </StepBtn>
        )}
      </Box>
    </Box>
  )
}
