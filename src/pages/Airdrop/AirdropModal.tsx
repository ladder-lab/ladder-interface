import { Box, Button, Typography } from '@mui/material'
import Modal from 'components/Modal'
import boxModalUrl from 'assets/images/box_modal.png'
import luckModalUrl from 'assets/images/luck_modal.png'
import boxModalUrl2 from 'assets/images/box_modal2.png'
import luckModalUrl2 from 'assets/images/luck_modal2.png'
import incompleteModalUrl from 'assets/images/incomplete_modal.png'
import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'theme/components'
import { ActivityProps } from './Activity'

export default function BoxModal({ getBox, BoxId }: { getBox: () => void; BoxId?: string }) {
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
        <Button onClick={getBox} disabled={BoxId === 'lockLP' || BoxId === ActivityProps.Mint}>
          GET IT NOW
        </Button>
      </Box>
    </Modal>
  )
}

export function IncompleteModal({ route, action, link }: { route?: string; link?: string; action?: () => void }) {
  const { hideModal } = useModal()
  return (
    <Modal maxWidth="360px">
      <Box padding={'60px 24px'} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={incompleteModalUrl} />

        <Typography textAlign={'center'}>
          Your task has not been completed yet,
          <br /> Go on and finish!
        </Typography>
        {action ? (
          <Button
            onClick={() => {
              action && action()
              hideModal()
            }}
            sx={{ mt: '20px' }}
          >
            TO FINISH
          </Button>
        ) : route ? (
          <Link to={route ?? ''} style={{ width: '100%' }} onClick={hideModal}>
            <Button> TO FINISH </Button>
          </Link>
        ) : link ? (
          <ExternalLink href={link ?? ''} style={{ width: '100%' }}>
            <Button onClick={hideModal}> TO FINISH </Button>
          </ExternalLink>
        ) : (
          <Button onClick={hideModal} sx={{ mt: '20px' }}>
            CLOSE
          </Button>
        )}
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
