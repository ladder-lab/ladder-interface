import Box from '@mui/material/Box'
import { Button, Stack, styled, Typography } from '@mui/material'
import { ReactComponent as Close } from 'assets/svg/close-btn.svg'
import Modal from '../../components/Modal'
import useBreakpoint from '../../hooks/useBreakpoint'

const StepText = styled(Typography)`
  font-size: 28px;
  font-weight: 500;
`
export default function MintOrganModal({ hide }: { hide: () => void }) {
  const isDownSm = useBreakpoint('sm')
  const verify = <Button>Verify</Button>

  return (
    <Modal>
      <Box
        sx={{
          padding: '37px 20px 47px 20px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <StepText>Step1</StepText>
          <Button
            sx={{
              background: 'transparent',
              width: 'fit-content',
              '&:hover': {
                background: 'transparent'
              }
            }}
            onClick={hide}
          >
            <Close />
          </Button>
        </Box>
        <Typography>Please click this button below and tweet a verification message on Twitter</Typography>
        <Button style={{ marginTop: '20px' }}>Tweet</Button>
        <StepText mt={47}>Step2</StepText>
        <Typography mt={20}>Follow Ladder and StarryNift on twitter</Typography>
        {isDownSm && verify}
        <Stack mt={20} direction={'row'} spacing={20}>
          {!isDownSm && verify}
          <Button>Follow ladder</Button>
          <Button>Follow StarryNift</Button>
        </Stack>
        <StepText mt={47}>Step3</StepText>
        <Typography mt={20}>Retweet Ladder&apos;s tweet</Typography>
        <Stack direction={'row'} mt={20} spacing={20}>
          <Button>Verify</Button>
          <Button>Retweet Now</Button>
        </Stack>
        <Box display={'flex'} gap={20} mt={20}>
          <Button>Mint</Button>
          <Button>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  )
}
