import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, useTheme, Button, ButtonBase, Grid } from '@mui/material'
import { Percent, Token, TokenAmount } from '@ladder/sdk'
import AppBody from 'components/AppBody'
import { liquidityParamBuilder, routes } from 'constants/routes'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { AllTokens } from 'models/allTokens'
import Tag from 'components/Tag'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Loader } from 'components/AnimatedSvg/Loader'
import { ExternalLink } from 'theme/components'
import { toV2LiquidityToken, useIsDarkMode, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator, useTokenTotalSupplies } from 'state/wallet/hooks'
import { usePairs } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { checkIs1155, checkIs721, getTokenText } from 'utils/checkIs1155'
import { useWalletModalToggle } from 'state/application/hooks'
import { generateErc20 } from 'utils/getHashAddress'
import { trimNumberString } from 'utils/trimNumberString'

export default function Pool() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const [tokenPairsWithLiquidityTokens, trackedTokenPairMap] = useMemo(() => {
    const tokensMap: { [key: string]: Token[] } = {}
    const lpTokens = trackedTokenPairs.map(tokens => {
      const lpToken = toV2LiquidityToken(tokens)
      tokensMap[lpToken.address] = tokens
      return { liquidityToken: lpToken, tokens }
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
        <Box sx={{ padding: { xs: '20px', md: '30px 32px' } }}>
          <Box sx={{ padding: '16px 20px', background: theme.palette.background.default, borderRadius: '8px' }}>
            <Typography sx={{ fontSize: { xs: 18, md: 28 }, fontWeight: 500, mb: 12 }}>
              Liquid provider rewards
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 500, color: theme.palette.text.secondary }}>
              Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added
              to the pool, accrue in real time and can be claimed by withdrawing your liquidity. Read more about
              providing liquidity
            </Typography>
          </Box>
          <Box
            mt={40}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: {
                xs: 'column',
                md: 'row'
              },
              gap: 24
            }}
          >
            <Typography sx={{ fontSize: { xs: 14, md: 24 } }}>Your Liquidity</Typography>
            <Box display={'flex'} gap={20} sx={{ width: { xs: '100%', md: 'fit-content' } }}>
              <Button
                onClick={() => navigate(routes.addLiquidity)}
                sx={{
                  fontSize: 12,
                  height: 44,
                  background: theme.palette.background.default,
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  color: theme.palette.text.secondary
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
              <Loader size={90} />
            </Box>
          ) : account ? (
            <Grid container mt={20} spacing={20} alignItems="stretch" minHeight={332}>
              {v2Pairs.length === 0 && (
                <Grid item xs={12} justifyContent="center" alignItems={'center'}>
                  <Typography textAlign={'center'} paddingTop={100} color={theme.palette.text.secondary} fontSize={16}>
                    No Liquidity found
                  </Typography>
                </Grid>
              )}
              {v2Pairs.map(([, pair], idx) => {
                if (!pair) return null

                const tokens = trackedTokenPairMap[liquidityTokensWithBalances[idx].liquidityToken.address]

                const [token0, token1] =
                  pair?.token0.address === ((generateErc20(tokens[0]) as any)?.address ?? '')
                    ? [tokens[0], tokens[1]]
                    : [tokens[1], tokens[0]]

                const balance = v2PairsBalances?.[liquidityTokensWithBalances[idx].liquidityToken.address]
                const totalSupply = totalSupplies?.[liquidityTokensWithBalances[idx].liquidityToken.address]
                pair.reserveOf
                const poolTokenPercentage =
                  totalSupply && balance
                    ? new Percent(balance.raw, totalSupply.raw).toFixed(2, undefined, 2).trimTrailingZero() + '%'
                    : '-'

                const reserveA =
                  totalSupply && balance
                    ? new TokenAmount(token0, pair.getLiquidityValue(token0, totalSupply, balance, false).raw)
                    : new TokenAmount(token0, '0')

                const reserveB =
                  totalSupply && balance
                    ? new TokenAmount(token1, pair.getLiquidityValue(token1, totalSupply, balance, false).raw)
                    : new TokenAmount(token0, '0')

                const [amountA, amountB] =
                  checkIs1155(token0) || checkIs721(token0) || token0.symbol === 'WETH' || token0.symbol === 'ETH'
                    ? [reserveB, reserveA]
                    : [reserveA, reserveB]
                const { token1Text, token2Text } = getTokenText(amountA.token, amountB.token)

                return (
                  <Grid item xs={12} md={6} lg={4} key={pair.liquidityToken.address}>
                    <PoolCard
                      currency0={amountA.token}
                      currency1={amountB.token}
                      title={`${token1Text} / ${token2Text}
                      `}
                      reserve0={amountA.toFixed(6, undefined, 2).trimTrailingZero()}
                      reserve1={amountB.toFixed(6, undefined, 2).trimTrailingZero()}
                      shareAmount={poolTokenPercentage}
                      tokenAmount={balance ? balance?.toExact() : '-'}
                      onAdd={() => navigate(routes.addLiquidity + liquidityParamBuilder(amountA.token, amountB.token))}
                      onRemove={() =>
                        navigate(routes.removeLiquidity + liquidityParamBuilder(amountA.token, amountB.token))
                      }
                    />
                  </Grid>
                )
              })}
            </Grid>
          ) : (
            <Box minHeight={332} display="flex" alignItems="center" justifyContent="center">
              <Button
                onClick={() => toggleWallet()}
                style={{
                  maxWidth: '400px'
                }}
              >
                Connect Wallet
              </Button>
            </Box>
          )}
        </Box>
      </AppBody>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mt: 50,
          pb: 80
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
  const isDarkMode = useIsDarkMode()
  const has721 = checkIs721(currency0) || checkIs721(currency1)
  const has1155 = checkIs1155(currency0) || checkIs1155(currency1)

  return (
    <Card
      gray
      padding="32px 24px 24px"
      style={{ borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box display="flex" justifyContent="space-between">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={28} />
        <Box display="flex" gap={16}>
          <Tag>ERC20</Tag>
          {!has721 && !has1155 && <Tag>ERC20</Tag>}
          {has721 && <Tag>ERC721</Tag>}
          {has1155 && <Tag>ERC1155</Tag>}
        </Box>
      </Box>
      <Typography fontSize={18} fontWeight={600} mt={16} mb={16}>
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" gap={8}>
        <PoolAssetCard currency={currency0} value={reserve0} />
        <PoolAssetCard currency={currency1} value={reserve1} />
      </Box>
      <Box display="grid" gap={12} mt={16} mb={16}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16, mr: 5 }} whiteSpace="nowrap">
            Your LP
          </Typography>
          <Typography
            fontSize={16}
            style={{
              textAlign: 'right',
              whiteSpace: 'normal',
              wordBreak: 'break-all'
            }}
          >
            {tokenAmount}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16 }}>Your share</Typography>
          <Typography fontSize={16}>{shareAmount}</Typography>
        </Box>
      </Box>
      <ExternalLink href="#" showIcon style={{ marginBottom: 28, display: 'block' }}>
        View accrued fees and analytics
      </ExternalLink>
      <Box display="flex" gap={8} mt={'auto'}>
        <Button sx={{ borderRadius: '16px', height: 44 }} onClick={onAdd}>
          Add
        </Button>
        <Button
          sx={{
            borderRadius: '16px',
            height: 44,
            background: isDarkMode ? '#282B2E' : '#DADADA',
            color: '#828282',
            '&:hover': {
              background: isDarkMode ? '#25282B' : '#CACACA'
            }
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
    <Card color={theme.palette.background.paper} padding="16px 20px 16px 16px" width="100%">
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box display="flex" flexDirection="column" gap={8} width="100%">
          <Typography fontSize={12} fontWeight={400} color={theme.palette.text.secondary}>
            Pooled {currency.symbol}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            {trimNumberString(value, 12)}
          </Typography>
        </Box>
        <CurrencyLogo currency={currency} size={'36px'} />
      </Box>
    </Card>
  )
}
