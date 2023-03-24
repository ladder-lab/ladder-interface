import Box from '@mui/material/Box'
import { Button, Stack, styled, Typography } from '@mui/material'
import { ReactComponent as Close } from 'assets/svg/close-btn.svg'
import Modal from '../../components/Modal'
import useBreakpoint from '../../hooks/useBreakpoint'
import { SbtListResult } from '../../hooks/useGetSbtList'

const StepText = styled(Typography)`
  font-size: 28px;
  font-weight: 500;
`
const GreenBtn = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  width: 'fit-content',
  cursor: 'pointer',
  color: 'white',
  backgroundColor: '#1F9898',
  padding: '6px 16px',
  borderRadius: '12px',
  marginRight: 8,
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

const GreenLineBtn = styled(Box)(() => ({
  fontSize: 16,
  fontWeight: 500,
  cursor: 'pointer',
  color: '#1F9898',
  backgroundColor: '#F6F6F6',
  padding: '6px 16px',
  border: '1px solid #1F9898',
  borderRadius: '12px',
  marginRight: 8
}))

export default function MintOrganModal({ hide, sbtInfo }: { hide: () => void; sbtInfo: SbtListResult }) {
  const isDownSm = useBreakpoint('sm')
  const verify = <GreenLineBtn>Verify</GreenLineBtn>

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
        <GreenBtn style={{ marginTop: '20px' }}>Tweet</GreenBtn>
        <StepText mt={47}>Step2</StepText>
        <Typography mt={20}>Follow Ladder and StarryNift on twitter</Typography>
        {isDownSm && verify}
        <Stack mt={20} direction={'row'} spacing={20}>
          {!isDownSm && verify}
          <GreenBtn>
            Follow <span style={{ fontWeight: 800 }}>Ladder</span>
          </GreenBtn>
          <GreenBtn>
            Follow <span style={{ fontWeight: 800 }}>{sbtInfo.name}</span>
          </GreenBtn>
        </Stack>
        <StepText mt={47}>Step3</StepText>
        <Typography mt={20}>Retweet Ladder&apos;s tweet</Typography>
        <Stack direction={'row'} mt={20} spacing={20}>
          <GreenLineBtn>Verify</GreenLineBtn>
          <GreenBtn fontWeight={600}>Retweet Now</GreenBtn>
        </Stack>
        <Box display={'flex'} gap={20} mt={20}>
          <Button>Mint</Button>
          <Button onClick={hide}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  )
}
