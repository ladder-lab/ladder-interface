import { useTestnetClaim } from '../../../hooks/useTestnetClaim'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box } from '@mui/material'
import ActionButton from '../../../components/Button/ActionButton'
import { StepDescText, StepNameText, StepText } from './Styled'

export default function Step3({ step }: { step: number }) {
  const { testnetClaim } = useTestnetClaim()
  const isDownMD = useBreakpoint('md')

  return (
    <Box
      flex={1}
      sx={{
        // opacity: step > 1 ? 1 : 0.4,
        opacity: step > 2 ? 1 : 0.4,
        minHeight: '200px',
        position: 'relative'
      }}
    >
      {/*<StepText>Step 3</StepText>*/}
      <StepText>Step 4</StepText>
      <StepNameText>Claim your test assets</StepNameText>
      <StepDescText>Claim your Ladder test assets on Sepolia Faucet</StepDescText>

      <Box
        sx={{
          position: isDownMD ? 'inherit' : 'absolute',
          marginTop: isDownMD ? '23px' : '0',
          bottom: 0
        }}
      >
        <ActionButton
          width={'247px'}
          // pending={claimState === ClaimState.UNKNOWN}
          onAction={testnetClaim}
          // disableAction={new Date() < new Date(v3ActiveTimeStamp[0])}
          // disableAction={!isOpenClaim && activeTimeStatus !== 'active'}
          actionText="Claim"
          error={step > 3 ? 'Test assets Claimed' : undefined}
          // disableAction={step < 2}
          disableAction={step < 3}
        />
      </Box>
    </Box>
  )
}
