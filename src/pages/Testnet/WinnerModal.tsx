import Box from '@mui/material/Box'
import { Button, Typography, useTheme } from '@mui/material'
import { ReactComponent as Close } from 'assets/svg/close-btn.svg'
import { routes } from '../../constants/routes'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'

export default function WinnerModal({ hide }: { hide: () => void }) {
  const navigate = useNavigate()
  const theme = useTheme()
  return (
    <Modal>
      <Box
        sx={{
          padding: '37px 20px 47px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <Typography fontWeight={900} fontSize={20}>
            OUR MONOPOLY CAMPAIGN IS NOW CLOSED! 🤝
          </Typography>
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
        <Typography mt={50} fontSize={16} color={theme.palette.text.secondary}>
          SBT Winners will be able to claim their prize over the next 7 days
        </Typography>
        <Typography mt={18} fontSize={16} color={theme.palette.primary.main}>
          Mar 7th 19 PM SGT - Mar 13th 19PM SGT
        </Typography>
        <Button
          variant={'contained'}
          sx={{
            marginTop: '32px'
          }}
          onClick={() => {
            navigate(routes.winners)
            hide()
          }}
        >
          Find Prize Winners here!
        </Button>
      </Box>
    </Modal>
  )
}
