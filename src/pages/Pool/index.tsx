import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, useTheme, Button, ButtonBase, Grid } from '@mui/material'
import { Percent, Token } from '@uniswap/sdk'
import AppBody from 'components/AppBody'
import { routes } from 'constants/routes'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { AllTokens } from 'models/allTokens'
import Tag from 'components/Tag'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Dots } from 'theme/components'
import { Loader } from 'components/AnimatedSvg/Loader'
import { ExternalLink } from 'theme/components'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator, useTokenTotalSupplies } from 'state/wallet/hooks'
import { usePairs } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { getTokenText } from 'utils/checkIs1155'

export default function Pool() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const [tokenPairsWithLiquidityTokens, trackedTokenPairMap] = useMemo(() => {
    const tokensMap: { [key: string]: Token[] } = {}
    const lpTokens = trackedTokenPairs.map(tokens => {
      const lpToken = toV2LiquidityToken(tokens)
      tokensMap[lpToken.address] = tokens
      return { liquidityToken: toV2LiquidityToken(tokens), tokens }
    })

    return [lpTokens, tokensMap]
  }, [trackedTokenPairs])

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const totalSupplies = useTokenTotalSupplies(liquidityTokens)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.reduce((acc, { liquidityToken }, idx) => {
        if (v2PairsBalances[liquidityToken.address]?.greaterThan('0')) {
          acc.push({ liquidityToken: liquidityToken, tokens: trackedTokenPairs[idx] })
        }
        return acc
      }, [] as { liquidityToken: Token; tokens: [Token, Token] }[]),
    [tokenPairsWithLiquidityTokens, trackedTokenPairs, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  return (
    <>
      <AppBody width={'100%'} maxWidth={'1140px'}>
        <Box sx={{ padding: '30px 32px' }}>
          <Box sx={{ padding: '16px 20px', background: theme.palette.background.default, borderRadius: '8px' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 500, mb: 12 }}>Liquid provider rewards</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: theme.palette.text.secondary }}>
              Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added
              to the pool, accrue in real time and can be claimed by withdrawing your liquidity. Read more about
              providing liquidity
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={40}>
            <Typography sx={{ fontSize: 24 }}>Your Liquidity</Typography>
            <Box display={'flex'} gap={20}>
              <Button
                sx={{
                  fontSize: 12,
                  height: 44,
                  background: theme.palette.background.default,
                  whiteSpace: 'nowrap',
                  minWidth: 'auto'
                }}
              >
                Create a pair
              </Button>
              <Button
                onClick={() => navigate(routes.addLiquidity)}
                sx={{ fontSize: 12, height: 44, whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                Add Liquidity
              </Button>
            </Box>
          </Box>

          {v2IsLoading ? (
            <Box minHeight={332} display="flex" justifyContent="center" alignItems="center">
              <Box display="grid" gap={19}>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: 20 }}>
                  Loading
                  <Dots />
                </Typography>
                <Loader size={90} />
              </Box>
            </Box>
          ) : (
            <Grid container mt={20} spacing={20} alignItems="stretch">
              {v2Pairs.map(([, pair], idx) => {
                if (!pair) return null

                const [token0, token1] = trackedTokenPairMap[liquidityTokensWithBalances[idx].liquidityToken.address]

                const { token1Text, token2Text, token1Id, token2Id } = getTokenText(token0, token1)

                const balance = v2PairsBalances?.[liquidityTokensWithBalances[idx].liquidityToken.address]
                const totalSupply = totalSupplies?.[liquidityTokensWithBalances[idx].liquidityToken.address]
                pair.reserveOf
                const poolTokenPercentage =
                  totalSupply && balance ? new Percent(balance.raw, totalSupply.raw).toFixed() + '%' : '-'

                return (
                  <Grid item xs={12} md={4} key={pair.liquidityToken.address}>
                    <PoolCard
                      currency0={token0}
                      currency1={token1}
                      title={`${token1Text} / ${token2Text}
                      `}
                      reserve0={pair.reserve0.toExact()}
                      reserve1={pair.reserve1.toExact()}
                      shareAmount={poolTokenPercentage}
                      tokenAmount={balance?.toExact() ?? '-'}
                      onAdd={() => navigate(routes.addLiquidity)}
                      onRemove={() =>
                        navigate(
                          routes.removeLiquidity +
                            `/${token0.address}/${token1.address}/${token1Id ?? ''}&${token2Id ?? ''}`
                        )
                      }
                    />
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Box>
      </AppBody>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mt: 50
        }}
      >
        <Typography>Don’t see a pool you joined?</Typography>
        <ButtonBase
          sx={{ color: theme => theme.palette.text.secondary, fontSize: 16, textDecoration: 'underline' }}
          onClick={() => navigate(routes.importPool)}
        >
          Import it
        </ButtonBase>
      </Box>
    </>
  )
}

function PoolCard({
  currency0,
  currency1,
  title,
  reserve0,
  reserve1,
  shareAmount,
  tokenAmount,
  onAdd,
  onRemove
}: {
  currency0: AllTokens
  currency1: AllTokens
  title: string
  reserve0: string
  reserve1: string
  shareAmount: string
  tokenAmount: string
  onAdd: () => void
  onRemove: () => void
}) {
  const theme = useTheme()

  return (
    <Card gray padding="32px 24px 24px" style={{ borderRadius: '20px', height: '100%' }}>
      <Box display="flex" justifyContent="space-between">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={28} />
        <Box display="flex" gap={16}>
          <Tag>ERC20</Tag>
          <Tag>ERC1155</Tag>
        </Box>
      </Box>
      <Typography fontSize={18} fontWeight={600} mt={16} mb={16}>
        {title}
      </Typography>
      <Box display="grid" gap={8}>
        <PoolAssetCard currency={currency0} value={reserve0} />
        <PoolAssetCard currency={currency1} value={reserve1} />
      </Box>
      <Box display="grid" gap={12} mt={16} mb={16}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16 }} whiteSpace="nowrap">
            Your pool tokens
          </Typography>
          <Typography
            fontSize={16}
            style={{
              textAlign: 'right',
              whiteSpace: 'pre',
              wordBreak: 'break-all'
            }}
          >
            {tokenAmount}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16 }}>Your pool share</Typography>
          <Typography fontSize={16}>{shareAmount}</Typography>
        </Box>
      </Box>
      <ExternalLink href="#" showIcon>
        View accrued fees and analytics
      </ExternalLink>
      <Box display="flex" gap={8} mt={28}>
        <Button sx={{ borderRadius: '16px', height: 44 }} onClick={onAdd}>
          Add
        </Button>
        <Button
          sx={{
            borderRadius: '16px',
            height: 44,
            background: theme.palette.action.disabledBackground,
            color: theme.palette.text.secondary
          }}
          onClick={onRemove}
        >
          Remove
        </Button>
      </Box>
    </Card>
  )
}

function PoolAssetCard({ currency, value }: { currency: AllTokens; value: string }) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.paper} padding="16px 20px 16px 16px">
      <Box display="flex" justifyContent="space-between">
        <Box display="grid" gap={8}>
          <Typography fontSize={12} fontWeight={400} color={theme.palette.text.secondary}>
            Pooled {currency.symbol}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            {value}
          </Typography>
        </Box>
        <CurrencyLogo currency={currency} size={'36px'} />
      </Box>
    </Card>
  )
}
