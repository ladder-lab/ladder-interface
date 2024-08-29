import { Dispatch, SetStateAction } from 'react'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box } from '@mui/material'
import { StepBtn, StepDescText, StepNameText, StepText } from './Styled'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'

export default function Step2({
  step,
  setStep,
  makeTwitter,
  checkMakeTwitter,
  setIsMakeTwitter
}: {
  step: number
  setStep: (step: number) => void
  makeTwitter: boolean
  checkMakeTwitter: () => void
  setIsMakeTwitter: Dispatch<SetStateAction<boolean>>
}) {
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
        // opacity: step > 0 ? 1 : 0.4
      }}
    >
      <Box>
        <StepText>Step 3</StepText>
        {/*<StepText>Step 2</StepText>*/}
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
            window.open(
              `https://twitter.com/intent/tweet?text=Something's%20stirring%20in%20the%20world%20of%20NFTs.%20%0A%0A%20Are%20you%20ready%20to%20explore?%20%F0%9F%8C%AA%EF%B8%8F%20@Ladder_NFT%20%0A%0A%20`,
              'intent',
              'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
            )
            setTimeout(() => {
              if (step < 3) {
                setIsMakeTwitter(true)
                setStep(3)
              }
            }, 5000)
          }}
        >
          <Twitter />
          {makeTwitter ? 'Tweeted' : 'Tweet'}
        </StepBtn>
        {/*{!makeTwitter && (*/}
        {false && (
          <StepBtn
            sx={{
              border: '1px solid #1F9898',
              backgroundColor: 'transparent',
              color: '#1F9898',
              pointerEvents: step < 2 ? 'none' : 'auto'
            }}
            onClick={checkMakeTwitter}
          >
            Verify
          </StepBtn>
        )}
      </Box>
    </Box>
  )
}
