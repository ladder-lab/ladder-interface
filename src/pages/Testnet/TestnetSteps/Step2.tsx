import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box } from '@mui/material'
import { StepBtn, StepDescText, StepNameText, StepText } from './Styled'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'

export default function Step2({ step, checkMakeTwitter }: { step: number; checkMakeTwitter: () => void }) {
  const isDownMD = useBreakpoint('md')

  return (
    <Box
      flex={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '200px',
        opacity: step === 2 ? 1 : 0.4
      }}
    >
      <Box>
        <StepText>Step 3</StepText>
        <StepNameText>Make a tweet</StepNameText>
        <StepDescText>Please tweet to receive free Ladder test assets</StepDescText>
      </Box>
      <Box display={'flex'} mt={23} gap={isDownMD ? 12 : 20} flexDirection={isDownMD ? 'column' : 'row'}>
        <StepBtn
          sx={{
            pointerEvents: step !== 2 ? 'none' : 'auto',
            '& svg': {
              fill: 'white',
              opacity: 1
            }
          }}
          onClick={() => {
            if (step < 2) return
            checkMakeTwitter()
          }}
        >
          <Twitter />
          {step > 2 ? 'Tweeted' : 'Tweet'}
        </StepBtn>
      </Box>
    </Box>
  )
}
