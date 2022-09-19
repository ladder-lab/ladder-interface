import { Box, Typography, useTheme, Button } from '@mui/material'
import { ExternalLink } from 'theme/components'

export default function Testnet() {
  const theme = useTheme()

  return (
    <Box width="100%" height="100%">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
          height: 490
          // height: `calc(570px - ${theme.height.header})`
        }}
      >
        <Typography sx={{ fontSize: 45, fontWeight: 700, width: 980, textAlign: 'center' }}>
          Incredible liquidity pool! Quickly find real-time value of NFTs.
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 500, width: 890, textAlign: 'center' }}>
          Ladder Protocol a decentralized NFT AMM, enabling instantd NFT swaps and better price discovery. In fact,
          Ladder is the first protocol that allows you to Swap an NFT as easily as swapping a Token
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: '100%', background: theme.palette.background.paper, padding: '100px 46px' }}>
        <Typography sx={{ height: 24, fontWeight: 700 }}>Ladder incentivized testnet stage 2</Typography>
        <Typography sx={{ lineHeight: '170%' }}>
          We gonna Airdrop another 3000 raffle whitelist to participate in testnet activity,and we will start Alpha-test
          in the stage with LAD rewards.
          <br /> 1. This version of the product (Ladder V2) will support the creation of Pairs between any
          ERC721/ERC1155/ERC20 <br /> 2. Support for asset Swap routing of associated Pairs
        </Typography>

        <ExternalLink href="#" underline="always">
          More Details
        </ExternalLink>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'grid', gap: 16 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 32 }}>ladder test faucet</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 20 }}>Each IP/address can only claim once</Typography>
          </Box>
          <Button onClick={() => {}} sx={{ width: 400, height: 50 }}>
            Connect the wallet to claim your test assets
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
