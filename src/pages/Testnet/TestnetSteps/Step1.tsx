import { useVerifyTwitter } from '../../../hooks/useVerifyTwitter'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box } from '@mui/material'
import { StepBtn, StepDescText, StepNameText, StepText } from './Styled'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'

export default function Step1({ step }: { step: number }) {
  const { openVerify } = useVerifyTwitter()
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
          }}
        >
          <Twitter />
          {step > 1 ? 'Connected' : 'Connect'}
        </StepBtn>
      </Box>
    </Box>
  )
}
