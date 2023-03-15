import Box from '@mui/material/Box'
import { Button, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as Close } from 'assets/svg/close-btn.svg'
import Modal from '../../components/Modal'
import { PrizeLink } from './FirstPrizeModal'

export default function SecondPrizeModal({ hide }: { hide: () => void }) {
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
          <ThemeText>• Gritti NFT</ThemeText>:{' '}
          <PrizeLink href={'https://discord.com/invite/gritti'}>https://discord.com/invite/gritti</PrizeLink>
          <br />
          <ThemeText>• Genso NFT</ThemeText>: you’ll get NFT in your wallet within 3-5 working days
          <br />
          <ThemeText>• Isekai WL</ThemeText>:{' '}
          <PrizeLink href={'https://discord.com/invite/isekaimetaverse'}>
            https://discord.com/invite/isekaimetaverse
          </PrizeLink>
          <br />
          <ThemeText>• NextType WL </ThemeText>:{' '}
          <PrizeLink href={'https://discord.com/invite/VH7Xh87UBC'}>https://discord.com/invite/VH7Xh87UBC</PrizeLink>
          <br />
          <ThemeText>• Furion WL</ThemeText>:
          <PrizeLink href={'https://discord.com/invite/projectfurion'}>
            https://discord.com/invite/projectfurion
          </PrizeLink>
          <br />
          <ThemeText>• StarryNift WL</ThemeText>:{' '}
          <PrizeLink href={'https://discord.com/invite/GBjzJUUEUt'}>https://discord.com/invite/GBjzJUUEUt</PrizeLink>
          <br />
          <ThemeText>• GP of Game Space </ThemeText>:
          <PrizeLink href={'http://discord.gg/u7aPn4YzpT'}>http://discord.gg/u7aPn4YzpT</PrizeLink>
          <br />
          <ThemeText>• Metaboom NFT: </ThemeText>
        </Typography>
        <Typography fontSize={16} color={theme.palette.text.secondary} ml={12}>
          Metaboom winner will receive Metaboom NFT airdropped by Fansi(
          <PrizeLink href={'https://www.fansi.me/'}>https://www.fansi.me/</PrizeLink>) before Mar 26th. Holding this NFT
          enables you access more features on Fansi.
        </Typography>
        <Typography fontSize={16} color={theme.palette.text.secondary} width={'100%'}>
          <ThemeText>• FANSI Allow list</ThemeText>:
          <PrizeLink href={'https://discord.com/invite/gritti'}> https://discord.com/invite/gritti</PrizeLink>
        </Typography>
        <Typography fontSize={16} color={theme.palette.text.secondary} ml={12}>
          FANSI WL winners can participate in this invitation-only Freemint event hold by FANSI ((
          <PrizeLink href={'https://www.fansi.me/'}>https://www.fansi.me/</PrizeLink>). The event will start with free
          minting on 3/15 at 15:00 (UTC+8), with unique Open edition gameplay. Please be sure to register your website
          information in advance to ensure the smooth running of the event.(
          <PrizeLink href={'https://metaboom.fansi.me/TenMinsSalvation'}>
            https://metaboom.fansi.me/TenMinsSalvation
          </PrizeLink>
          )
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
