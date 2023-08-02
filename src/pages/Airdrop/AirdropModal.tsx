import { Box, Button, Typography } from '@mui/material'
import Modal from 'components/Modal'
import boxModalUrl from 'assets/images/box_modal.png'
import luckModalUrl from 'assets/images/luck_modal.png'
import boxModalUrl2 from 'assets/images/box_modal2.png'
import luckModalUrl2 from 'assets/images/luck_modal2.png'
import incompleteModalUrl from 'assets/images/incomplete_modal.png'
import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'

export default function BoxModal({ getBox }: { getBox: () => void }) {
  const isDardMode = useIsDarkMode()
  return (
    <Modal maxWidth="360px">
      <Box padding={24} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={isDardMode ? boxModalUrl2 : boxModalUrl} />
        <Typography variant="h5">Congrats !</Typography>
        <Typography textAlign={'center'}>
          The task has been completed!
          <br />
          Congrats on your 1 box reward!
        </Typography>
        <Button onClick={getBox}>GET IT NOW</Button>
      </Box>
    </Modal>
  )
}

export function IncompleteModal() {
  const { hideModal } = useModal()
  return (
    <Modal maxWidth="360px">
      <Box padding={'60px 24px'} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={incompleteModalUrl} />

        <Typography textAlign={'center'}>
          Your task has not been completed yet,
          <br /> Go on and finish!
        </Typography>
        <Button onClick={hideModal} sx={{ mt: '20px' }}>
          CLOSE
        </Button>
      </Box>
    </Modal>
  )
}

export function LuckModal({ getLuck }: { getLuck: () => void }) {
  const isDardMode = useIsDarkMode()
  return (
    <Modal maxWidth="360px">
      <Box padding={24} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={isDardMode ? luckModalUrl2 : luckModalUrl} />
        <Typography variant="h5">Congrats !</Typography>
        <Typography textAlign={'center'}>
          The task has been completed!
          <br />
          Your luck has increased by 10%.
        </Typography>
        <Button onClick={getLuck}>GET IT NOW</Button>
      </Box>
    </Modal>
  )
}
