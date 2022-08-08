import { Grid, Box, Typography, useTheme } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { Mode } from './SelectCurrencyModal'
import { Currency } from '@uniswap/sdk'

interface Props {
  selectedCurrency?: Currency | null
  mode?: Mode
  onSelectCurrency?: (currency: Currency) => void
  currencyOptions: Token1155[]
  searchToken?: Token1155 | null | undefined
  searchTokenIsAdded?: boolean
  onClick?: (token: AllTokens) => void
}

export default function NftList({ onClick, searchToken, searchTokenIsAdded, ...props }: Props) {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')

  return (
    <Box>
      {searchToken && !searchTokenIsAdded ? (
        <Grid container spacing={20} sx={{ overflow: 'auto', height: isDownMd ? 357 : 517, pb: 100 }}>
          <Grid item xs={6} md={3}>
            <NftCard
              token={searchToken}
              onClick={() => {
                onClick && onClick(searchToken)
                hideModal()
              }}
            />
          </Grid>
        </Grid>
      ) : props.currencyOptions?.length > 0 ? (
        <Grid container spacing={20} sx={{ overflow: 'auto', height: isDownMd ? 357 : 517, pb: 100 }}>
          {props.currencyOptions.map((token1155, idx) => (
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
      ) : (
        <Box style={{ padding: '20px', height: '100%' }}>
          <Typography textAlign="center" mb="20px">
            No results found.
          </Typography>
        </Box>
      )}
    </Box>
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
