import { useMemo } from 'react'
import { Grid, Box, Typography, useTheme, Button } from '@mui/material'
import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { Currency } from '@ladder/sdk'
import { useToken1155Balance, useToken1155Balances } from 'state/wallet/hooks'
import { Loader } from 'components/AnimatedSvg/Loader'
import LogoBase from 'components/essential/CurrencyLogo/LogoBase'

interface Props {
  selectedCurrency?: Currency | null
  onSelectCurrency?: (currency: Currency) => void
  currencyOptions: Token1155[]
  searchToken?: Token1155 | null | undefined
  searchTokenIsAdded?: boolean
  onClick?: (token: AllTokens) => void
  children?: React.ReactNode
}

export default function NftList({ onClick, searchToken, searchTokenIsAdded, currencyOptions, children }: Props) {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')
  const { balances, loading } = useToken1155Balances(currencyOptions)
  const sortedList = useMemo(() => {
    return balances?.sort((amount1, amount2) => {
      return amount1.greaterThan(amount2) ? -1 : 1
    })
  }, [balances])

  return (
    <>
      {children}

      <Grid
        container
        spacing={20}
        sx={{ overflow: 'auto', height: isDownMd ? 357 : 517, pb: 100 }}
        paddingTop={'24px'}
        position="relative"
      >
        {searchToken && !searchTokenIsAdded ? (
          <NftCard
            token={searchToken}
            onClick={() => {
              onClick && onClick(searchToken)
              hideModal()
            }}
          />
        ) : currencyOptions.length === 0 ? (
          <Box width={'100%'} display="flex" alignItems="center" justifyContent="center">
            <Typography
              textAlign="center"
              mb="20px"
              fontSize={16}
              fontWeight={500}
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              No results found. &nbsp;
              <Button variant="text" sx={{ display: 'inline', width: 'unset', padding: 0, height: 'max-content' }}>
                Import token
              </Button>
            </Typography>
          </Box>
        ) : (
          <>
            {loading && (
              <Box width={'100%'} display="flex" alignItems="center" justifyContent="center">
                <Loader />
              </Box>
            )}
            {!loading &&
              sortedList?.map(({ token }, idx) => (
                <Grid item xs={6} sm={4} md={3} key={idx}>
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
          </>
        )}
      </Grid>
    </>
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
      <Box sx={{ width: '100%', height: 123, overflow: 'hidden' }}>
        <LogoBase
          srcs={token?.uri ? [token.uri] : []}
          alt={token.name ?? ''}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
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
        <span style={{ color: theme.palette.text.secondary }}>balance: </span>
        {balance?.toFixed(0)}
        {/* /<span style={{ color: theme.palette.text.secondary }}>1 M</span> */}
      </Typography>
    </Box>
  )
}
