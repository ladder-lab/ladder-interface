import { Grid, Box, Typography, useTheme } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import { DEFAULT_1155_LIST } from 'constants/default1155List'
import { useActiveWeb3React } from 'hooks'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useIsDarkMode } from 'state/user/hooks'

export default function NftList({ onClick }: { onClick?: (token: AllTokens) => void }) {
  const { hideModal } = useModal()
  const { chainId } = useActiveWeb3React()

  return (
    <Grid container spacing={20} sx={{ overflow: 'auto', height: 480 }}>
      {DEFAULT_1155_LIST[(chainId ?? NETWORK_CHAIN_ID) as keyof typeof DEFAULT_1155_LIST]?.map((token1155, idx) => (
        <Grid item xs={6} md={3} key={idx}>
          <NftCard
            key={idx}
            token={token1155}
            onClick={() => {
              onClick && onClick(token1155)
              hideModal()
            }}
          />
        </Grid>
      ))}
    </Grid>
  )
}

function NftCard({ token, onClick }: { token: Token1155; onClick: () => void }) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        alignItems: 'center',
        borderRadius: '8px',
        background: isDarkMode ? '#15171A' : '#F6F6F6',
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: isDarkMode ? 'none' : '0px 3px 10px rgba(0, 0, 0, 0.15)',
          background: isDarkMode ? '#2E3133' : '#FFFFFF',
          cursor: 'pointer'
        }
      }}
    >
      <Image src={token?.uri ?? SampleNftImg} style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }} />
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, fontWeight: 600, mt: 8, mb: 8 }}>
        {token.name} #{token.tokenId}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {shortenAddress(token.address)}
      </Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        12 /<span style={{ color: theme.palette.text.secondary }}>1 M</span>
      </Typography>
    </Box>
  )
}
