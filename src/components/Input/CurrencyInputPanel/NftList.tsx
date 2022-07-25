import { useMemo } from 'react'
import { Grid, Box, Typography, useTheme } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { Token1155 } from 'constants/token/token1155'
import { useActiveWeb3React } from 'hooks'
import { AllTokens } from 'models/allTokens'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'

export default function NftList({ onClick }: { onClick?: (token: AllTokens) => void }) {
  const { library } = useActiveWeb3React()
  const { hideModal } = useModal()

  const dummyNfts = useMemo(() => {
    return [
      new Token1155(4, '0x75e4b5644eA842817155f960600b3cC3194D14C2', 1, library, 'Standard ERC1155 (ERC1155)'),
      new Token1155(4, '0x75e4b5644eA842817155f960600b3cC3194D14C2', 1, library, 'Standard ERC1155 (ERC1155)')
    ]
  }, [library])

  return (
    <Grid container spacing={20} sx={{ overflow: 'auto', height: 480 }}>
      {dummyNfts.map((token1155, idx) => (
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
        background: '#F6F6F6',
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.15)',
          background: '#FFFFFF',
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
