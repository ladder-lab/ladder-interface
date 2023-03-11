import Box from '@mui/material/Box'
import { Button, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as Close } from 'assets/svg/close-btn.svg'
import Modal from '../../components/Modal'
import { ExternalLink } from '../../theme/components'

export const PrizeLink = styled(ExternalLink)`
  text-decoration: underline;
  color: #828282;
`
export default function FirstPrizeModal({ hide }: { hide: () => void }) {
  const theme = useTheme()
  const ThemeText = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main
  }))
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
            How to claim #First Prize
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
          Congratulations to the winner of our exciting event! Thank you for being a part of it and we hope you had a
          great time.
          <br />
          <br />
          We have shared the winner&lsquo;s addresses with our partners, who will now distribute the award. To claim
          your prize, please open a ticket in the relevant Discord channel:
          <br />
          <br />
          <ThemeText>• NextType WL</ThemeText>:{' '}
          <PrizeLink href={'https://discord.com/invite/VH7Xh87UBC'}>https://discord.com/invite/VH7Xh87UBC</PrizeLink>
          <br />
          <ThemeText>• Furion WL</ThemeText>:
          <PrizeLink href={'https://discord.com/invite/projectfurion'}>
            {' '}
            https://discord.com/invite/projectfurion
          </PrizeLink>
          <br />
          <ThemeText>• StarryNift WL</ThemeText>:
          <PrizeLink href={'https://discord.com/invite/GBjzJUUEUt'}> https://discord.com/invite/GBjzJUUEUt</PrizeLink>
          <br />
          <ThemeText>• GP of Game Space</ThemeText>:
          <PrizeLink href={'http://discord.gg/u7aPn4YzpT'}> http://discord.gg/u7aPn4YzpT</PrizeLink>
          <br />
          <ThemeText>• FANSI Allow list</ThemeText>
          <br />
        </Typography>
        <Typography fontSize={16} color={theme.palette.text.secondary} ml={12}>
          FANSI WL winners can participate in this invitation-only Freemint event hold by FANSI
          ((https://www.fansi.me/). The event will start with free minting on 3/15 at 15:00 (UTC+8), with unique Open
          edition gameplay. Please be sure to register your website information in advance to ensure the smooth running
          of the event.(https://metaboom.fansi.me/TenMinsSalvation)
        </Typography>
        <Button
          variant={'contained'}
          sx={{
            marginTop: '32px'
          }}
          onClick={() => {
            hide()
          }}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  )
}
