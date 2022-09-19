import { Box, Typography, useTheme, Button, Grid } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Stepper from './Stepper'
import { ReactComponent as FacuetFirstLight } from 'assets/svg/faucet/firstl.svg'
import { ReactComponent as FacuetSecondLight } from 'assets/svg/faucet/secondl.svg'
import { ReactComponent as FacuetThirdLight } from 'assets/svg/faucet/thirdl.svg'
import { ReactComponent as FacuetFirstDark } from 'assets/svg/faucet/firstd.svg'
import { ReactComponent as FacuetSecondDark } from 'assets/svg/faucet/secondd.svg'
import { ReactComponent as FacuetThirdDark } from 'assets/svg/faucet/thirdd.svg'
import { useIsDarkMode } from 'state/user/hooks'
import { ReactComponent as BgLowerLeftLight } from 'assets/svg/bg/lowerleftl.svg'
import { ReactComponent as BgLowerRightLight } from 'assets/svg/bg/lowerrightl.svg'
import { ReactComponent as BgLowerLeftDark } from 'assets/svg/bg/lowerleftd.svg'
import { ReactComponent as BgLowerRightDark } from 'assets/svg/bg/lowerrightd.svg'
import BgLight from 'assets/images/bg_light.png'
import BgDark from 'assets/images/bg_dark.png'

export default function Testnet() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <Box width="100%" height="100%" position="relative" sx={{ transform: 'translateY(-54px)' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
          pt: theme.height.header,
          pb: 120,
          backgroundImage: `url(${isDarkMode ? BgDark : BgLight})`,
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }}
      >
        <Typography component="h5" sx={{ fontSize: 45, fontWeight: 700, textAlign: 'center' }}>
          Incredible liquidity pool! <br /> Quickly find real-time value of NFTs.
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 500, textAlign: 'center' }}>
          Ladder Protocol a decentralized NFT AMM, enabling instantd NFT swaps and better price discovery.
          <br /> In fact, Ladder is the first protocol that allows you to Swap an NFT as easily as swapping a Token
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: '100%', background: theme.palette.background.paper, padding: '100px 46px' }}>
        <Stepper />

        <Typography component="h5" sx={{ fontSize: 20, fontWeight: 700, mt: 100, mb: 24 }}>
          Ladder incentivized testnet stage 2
        </Typography>
        <Typography component="h5" sx={{ lineHeight: '170%', mb: 32, fontSize: 20 }}>
          We gonna Airdrop another 3000 raffle whitelist to participate in testnet activity,and we will start Alpha-test
          in the stage with LAD rewards.
          <br /> 1. This version of the product (Ladder V2) will support the creation of Pairs between any
          ERC721/ERC1155/ERC20 <br /> 2. Support for asset Swap routing of associated Pairs
        </Typography>

        <ExternalLink href="#" underline="always">
          More Details
        </ExternalLink>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 120, width: '100%' }}>
          <Box sx={{ display: 'grid', gap: 16 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 32 }}>ladder test faucet</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 20 }}>Each IP/address can only claim once</Typography>
          </Box>
          <Button onClick={() => {}} sx={{ width: 400, height: 50, fontSize: 16 }}>
            Connect the wallet to claim your test assets
          </Button>
        </Box>

        <Grid container mt={36} width="100%" spacing={20}>
          <Grid item xs={12} md={4}>
            <FaucetCard
              icon={isDarkMode ? <FacuetFirstDark /> : <FacuetFirstLight />}
              title="laddertest-erc20"
              link="#"
              amount={0}
              onClick={() => {}}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FaucetCard
              icon={isDarkMode ? <FacuetSecondDark /> : <FacuetSecondLight />}
              title="laddertest-erc20"
              link="#"
              amount={0}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FaucetCard
              icon={isDarkMode ? <FacuetThirdDark /> : <FacuetThirdLight />}
              title="laddertest-erc20"
              link="#"
              amount={0}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h5" mt={180} mb={24} fontWeight={700} fontSize={32}>
            Feedback
          </Typography>
          <Typography fontWeight={500} fontSize={20} mb={61}>
            Please leave your feedback to us, help us improve products!
          </Typography>
          <Button onClick={() => {}} sx={{ width: 226, height: 52, fontSize: 16 }}>
            Write Feedback
          </Button>
        </Box>
      </Box>
      {isDarkMode ? (
        <BgLowerLeftDark style={{ position: 'absolute', left: 0, bottom: 0 }} />
      ) : (
        <BgLowerLeftLight style={{ position: 'absolute', left: 0, bottom: 0 }} />
      )}

      {isDarkMode ? (
        <BgLowerRightDark style={{ position: 'absolute', right: 0, bottom: 0 }} />
      ) : (
        <BgLowerRightLight style={{ position: 'absolute', right: 0, bottom: 0 }} />
      )}
    </Box>
  )
}

function FaucetCard({
  icon,
  title,
  link,
  amount,
  onClick
}: {
  icon: JSX.Element
  title: string
  link: string
  amount: number
  onClick?: () => void
}) {
  return (
    <Box
      sx={{
        borderRadius: '16px',
        padding: '36px 40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        boxShadow: '0px 4px 11px rgba(51, 51, 51, 0.07)',
        height: 308
      }}
    >
      {icon}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          mt: 60,
          mb: 34
        }}
      >
        <ExternalLink href={link} showIcon sx={{ fontSize: 20, color: theme => theme.palette.text.primary }}>
          {title}
        </ExternalLink>
        <Typography sx={{ fontSize: 20 }}> amount: {amount}</Typography>
      </Box>
      {onClick && <Button onClick={onClick}>Import Token</Button>}
    </Box>
  )
}
