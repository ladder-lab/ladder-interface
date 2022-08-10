import { useMemo } from 'react'
import { Grid, Box, Typography, useTheme } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import { useIsDarkMode, useTrackedToken1155List } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { useToken1155Balance, useToken1155Balances } from 'state/wallet/hooks'
import { Loader } from 'components/AnimatedSvg/Loader'

export default function NftList({ onClick }: { onClick?: (token: AllTokens) => void }) {
  const { hideModal } = useModal()
  const list = useTrackedToken1155List()
  const isDownMd = useBreakpoint('md')
  const { balances, loading } = useToken1155Balances(list)
  const sortedList = useMemo(() => {
    return balances?.sort((amount1, amount2) => {
      return amount1.greaterThan(amount2) ? -1 : 1
    })
  }, [balances])

  return (
    <Grid container spacing={20} sx={{ overflow: 'auto', height: isDownMd ? 357 : 517, pb: 100 }}>
      {loading && (
        <Box width={'100%'} display="flex" alignItems="center" justifyContent="center">
          <Loader />
        </Box>
      )}
      {!loading &&
        sortedList?.map(({ token }, idx) => (
          <Grid item xs={6} md={3} key={idx}>
            <NftCard
              key={idx}
              token={token as Token1155}
              onClick={() => {
                onClick && onClick(token)
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
  const balance = useToken1155Balance(token)

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
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: 12,
          fontWeight: 600,
          mt: 8,

          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        {token.name}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, fontWeight: 600, mb: 8 }}>
        #{token.tokenId}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {shortenAddress(token.address)}
      </Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        {balance?.toFixed(0)} /<span style={{ color: theme.palette.text.secondary }}>1 M</span>
      </Typography>
    </Box>
  )
}
