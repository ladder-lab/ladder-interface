import { useActiveWeb3React } from '../../../hooks'
import { useWalletModalToggle } from '../../../state/application/hooks'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box, Button, styled } from '@mui/material'
import { StepDescText, StepNameText, StepText } from './Styled'

const StyledButtonWrapper = styled(Box)<{ isDownMD?: boolean }>(({ theme, isDownMD }) => ({
  maxWidth: 400,
  width: 'fit-content',
  position: isDownMD ? 'inherit' : 'absolute',
  bottom: 0,
  '& button': {
    maxWidth: 400,
    width: '100%',
    height: 50,
    fontSize: 16,
    padding: '0 60px',
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      padding: '0 40px'
    }
  }
}))

export default function Step0({ step, sign }: { step: number; sign: () => void }) {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const isDownMD = useBreakpoint('md')

  return (
    <>
      {account ? (
        <Box
          width={'100%'}
          flex={1}
          position={'relative'}
          style={{
            opacity: step === 0 ? 1 : 0.4
          }}
        >
          <StepText>Step 1</StepText>
          <StepNameText>Sign</StepNameText>
          <StepDescText>Please click this button to sign.</StepDescText>
          <StyledButtonWrapper mt={46} isDownMD={isDownMD}>
            <Button onClick={sign} disabled={step !== 0}>
              Sign to get token
            </Button>
          </StyledButtonWrapper>
        </Box>
      ) : (
        <Box width={'100%'} flex={1} position={'relative'}>
          <StepText>Step 1</StepText>
          <StepNameText>Connect Wallet</StepNameText>
          <StepDescText>Please connect your wallet to claim test assets</StepDescText>
          <StyledButtonWrapper mt={46} isDownMD={isDownMD}>
            <Button style={{ width: '144px' }} onClick={toggleWalletModal} disabled={step > 0}>
              <span style={{ fontSize: 14 }}>Connect</span>
            </Button>
          </StyledButtonWrapper>
        </Box>
      )}
    </>
  )
}
