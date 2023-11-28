import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, useTheme, Button, Grid, Stack, styled } from '@mui/material'
import { Percent, Token, TokenAmount } from '@ladder/sdk'
import AppBody from 'components/AppBody'
import { liquidityParamBuilder, routes } from 'constants/routes'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { AllTokens } from 'models/allTokens'
import Tag from 'components/Tag'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Loader } from 'components/AnimatedSvg/Loader'
// import { ExternalLink } from 'theme/components'
import { toV2LiquidityToken, useIsDarkMode, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator, useTokenTotalSupplies } from 'state/wallet/hooks'
import { usePairs } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { checkIs1155, checkIs721, getTokenText } from 'utils/checkIs1155'
import { useWalletModalToggle } from 'state/application/hooks'
import { generateErc20 } from 'utils/getHashAddress'
import { trimNumberString } from 'utils/trimNumberString'
import dottedLine from 'assets/images/dotted-line.png'
import { ReactComponent as LockSvg } from 'assets/svg/lock_icon.svg'
import { ReactComponent as LockGreySvg } from 'assets/svg/lock_grey.svg'
import { ReactComponent as ClockIcon } from 'assets/svg/clockIcon.svg'
import { currencyA, currencyB } from './AddLiquidity'
import {
  LeftDateProps,
  useClaimLockLPTokenCallback,
  useIsLockLPTokenCallback,
  useLockLPToken
} from 'hooks/useLockLPTokenCallback'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { LOCK_LP_TOKEN, LOCK_LIQUIDITY_CONTRACT_ADDRESS } from '../../constants'
import { tryParseAmount } from 'utils/parseAmount'
import QuestionHelper from 'components/essential/QuestionHelper'
import Spinner from 'components/Spinner'
import { parseUnits } from 'ethers/lib/utils'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { ActivityInfo } from 'pages/Swap'

const ApprovalButton = styled(Button)(() => ({
  borderRadius: '16px',
  height: 44,
  display: 'flex',
  alignItems: 'center'
}))

const LockButton = styled(Button)(() => ({
  borderRadius: '16px',
  height: 44,
  display: 'flex',
  gap: 8,
  alignItems: 'center'
}))

export default function Pool() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  const [lpTokenAddress, setLpTokenAddress] = useState<string>('')
  const { leftDate, isLock } = useIsLockLPTokenCallback()
  console.log('🚀 ~ lpTokenAddress:', lpTokenAddress)
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const [tokenPairsWithLiquidityTokens, trackedTokenPairMap] = useMemo(() => {
    const tokensMap: { [key: string]: Token[] } = {}
    const lpTokens = trackedTokenPairs
      .filter(
        ([token0, token1]) =>
          (token0.address.toLocaleLowerCase() === currencyA?.address?.toLocaleLowerCase() &&
            token1.address.toLocaleLowerCase() === currencyB.address.toLocaleLowerCase()) ||
          (token1.address.toLocaleLowerCase() === currencyA?.address?.toLocaleLowerCase() &&
            token0.address.toLocaleLowerCase() === currencyB.address.toLocaleLowerCase())
      )
      .map(tokens => {
        const lpToken = toV2LiquidityToken(tokens)
        setLpTokenAddress(lpToken.address)
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
        console.log('liquidityTokensWithBalances=>', v2PairsBalances[liquidityToken.address]?.greaterThan('0'))

        // if (v2PairsBalances[liquidityToken.address]?.greaterThan('0')) {
        acc.push({ liquidityToken: liquidityToken, tokens: trackedTokenPairs[idx] })
        // }
        return acc
      }, [] as { liquidityToken: Token; tokens: [Token, Token] }[]),
    [tokenPairsWithLiquidityTokens, trackedTokenPairs, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  return (
    <>
      <Box
        sx={{
          display: { xs: 'grid', md: 'flex' },
          gap: { xs: 20, md: 54 },
          padding: { xs: 16, md: 0 }
        }}
      >
        <AppBody width={'100%'} maxWidth={'680px'}>
          <Box sx={{ padding: { xs: '20px', md: '30px 32px' } }}>
            <Box sx={{ padding: '16px 20px', background: theme.palette.background.default, borderRadius: '8px' }}>
              <Typography sx={{ fontSize: { xs: 18, md: 28 }, fontWeight: 500, mb: 12 }}>
                Liquid provider rewards
              </Typography>
              <Typography sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 500, color: theme.palette.text.secondary }}>
                Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are
                added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. Read more about
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
              <Typography sx={{ fontSize: { xs: 16, md: 24 } }}>Your Liquidity</Typography>
              <Box display={'flex'} gap={20} sx={{ width: { xs: '100%', md: 'fit-content' } }}>
                {/* <Button
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
              </Button> */}
                {!isLock && (
                  <Button
                    onClick={() => navigate(routes.addLiquidity)}
                    sx={{ fontSize: 12, height: 44, width: { xs: 138 }, whiteSpace: 'nowrap', minWidth: 'auto' }}
                  >
                    Add Liquidity
                  </Button>
                )}
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
                    <Typography
                      textAlign={'center'}
                      paddingTop={100}
                      color={theme.palette.text.secondary}
                      fontSize={16}
                    >
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

                  // const hashedToken0 = generateErc20(token0)
                  // const hashedToken1 = generateErc20(token1)

                  // const reserveA =
                  //   totalSupply && balance && hashedToken0
                  //     ? new TokenAmount(token0, pair.getLiquidityValue(hashedToken0, totalSupply, balance, false).raw)
                  //     : new TokenAmount(token0, '0')

                  // const reserveB =
                  //   totalSupply && balance && hashedToken1
                  //     ? new TokenAmount(token1, pair.getLiquidityValue(hashedToken1, totalSupply, balance, false).raw)
                  //     : new TokenAmount(token1, '0')

                  const [reserveA, reserveB] = [
                    new TokenAmount(token0, pair.reserve0.raw),
                    new TokenAmount(token1, pair.reserve1.raw)
                  ]

                  const [amountA, amountB] =
                    checkIs1155(token0) || checkIs721(token0) || token0.symbol === 'WETH' || token0.symbol === 'ETH'
                      ? [reserveB, reserveA]
                      : [reserveA, reserveB]
                  const { token1Text, token2Text } = getTokenText(amountA.token, amountB.token)

                  return (
                    // <Grid item xs={4} md={6} lg={8} key={pair.liquidityToken.address}>
                    <Grid item lg={8} key={pair.liquidityToken.address}>
                      <PoolCard
                        currency0={amountA.token}
                        currency1={amountB.token}
                        title={`${token1Text} / ${token2Text}
                      `}
                        reserve0={amountA.toFixed(6, undefined, 2).trimTrailingZero()}
                        reserve1={amountB.toFixed(6, undefined, 2).trimTrailingZero()}
                        shareAmount={poolTokenPercentage}
                        tokenAmount={balance ? balance?.toExact() : '-'}
                        onAdd={() => {
                          navigate(routes.addLiquidity)
                          // navigate(routes.addLiquidity + liquidityParamBuilder(amountA.token, amountB.token))
                        }}
                        onRemove={() =>
                          navigate(routes.removeLiquidity + liquidityParamBuilder(amountA.token, amountB.token))
                        }
                        leftDate={leftDate}
                        isLock={isLock}
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
        <ActivityInfo />
      </Box>

      {/* <Box
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
      </Box> */}
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
  onRemove,
  leftDate,
  isLock
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
  leftDate: LeftDateProps
  isLock: boolean
}) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const has721 = checkIs721(currency0) || checkIs721(currency1)
  const has1155 = checkIs1155(currency0) || checkIs1155(currency1)

  return (
    <Card
      gray
      padding="32px 0"
      style={{ borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box padding="0 24px 24px">
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
        {/* <ExternalLink href="#" showIcon style={{ marginBottom: 28, display: 'block' }}>
        View accrued fees and analytics
      </ExternalLink> */}
        {!isLock && (
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
              disabled={!Number(tokenAmount)}
              onClick={onRemove}
            >
              Remove
            </Button>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          background: `url(${dottedLine})`,
          padding: '1px 0'
        }}
      />
      {!isLock ? <LockToken tokenAmount={tokenAmount} /> : <WithdrawLockLPToken leftDate={leftDate} />}
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
        <CurrencyLogo currency={currency} size={'36px'} style={{ flexShrink: 0 }} />
      </Box>
    </Card>
  )
}

function LockToken({ tokenAmount }: { tokenAmount: string }) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const { LockLPCallback, loading: lockLoading } = useLockLPToken()
  const amount = tryParseAmount(tokenAmount, LOCK_LP_TOKEN)
  const [approval, approveCallback] = useApproveCallback(amount, LOCK_LIQUIDITY_CONTRACT_ADDRESS)

  const { claimSubmitted: isLockLPing } = useUserHasSubmittedClaim(`${account}_lock_lp`)

  const LockAmount = useMemo(() => +parseUnits(tokenAmount, LOCK_LP_TOKEN.decimals).toString(), [tokenAmount])
  const isApproval = useMemo(() => {
    if (approval === ApprovalState.APPROVED) return true
    if (approval === ApprovalState.NOT_APPROVED) return false
    return false
  }, [approval])
  console.log('🚀 ~ isLockLPing:', isLockLPing)
  console.log('LockAmount=>', LockAmount, tokenAmount)
  console.log('🚀 ~ approval:', approval)

  return (
    <Stack
      spacing={20}
      sx={{
        padding: '16px 24px 0',
        position: 'relative',
        '.Mui-disabled': {
          background: '#282B2E !important',
          color: '#878D92 !important'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-20px) translateY(-36px)'
        }}
      >
        <LockGreySvg />
      </Box>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16 }}>
        Adipisicing quis consequat non enim duis voluptate ex sint. Dolor officia labore cu
      </Typography>

      {approval === ApprovalState.PENDING ? (
        <ApprovalButton disabled>
          <Spinner marginRight={16} />
          Approve
        </ApprovalButton>
      ) : (
        !isApproval && (
          <ApprovalButton
            disabled={!LockAmount}
            onClick={() => {
              approveCallback()
            }}
          >
            Approve
          </ApprovalButton>
        )
      )}

      <LockButton
        disabled={!isApproval || lockLoading || isLockLPing}
        onClick={() => {
          LockLPCallback(LockAmount)
        }}
      >
        {lockLoading || isLockLPing ? <Spinner marginRight={16} /> : <LockSvg />} 7-Day Lock
      </LockButton>
    </Stack>
  )
}

function WithdrawLockLPToken({ leftDate }: { leftDate: LeftDateProps }) {
  const { account } = useActiveWeb3React()

  const { ClaimLockLPCallback, loading: claimLoading } = useClaimLockLPTokenCallback()
  console.log('🚀 ~ file: index.tsx:510 ~ WithdrawLockLPToken ~ claimLoading:', claimLoading)

  const { claimSubmitted: isClaiming } = useUserHasSubmittedClaim(`${account}_withdraw_lp`)

  const isEndTime = useMemo(() => {
    if (leftDate.seconds <= 0) return true
    return false
  }, [leftDate.seconds])

  const DateTxt = useMemo(() => {
    if (leftDate.days > 0) return leftDate.days + ' Day left'
    if (leftDate.hours > 0) return leftDate.hours + ' Hours left'
    if (leftDate.minutes >= 0) return leftDate.minutes + ' Minutes left'
    return '--'
  }, [leftDate.days, leftDate.hours, leftDate.minutes])

  console.log('🚀 ~ leftDate:', leftDate)
  console.log('🚀 ~ isClaiming:', isClaiming)

  return (
    <Box
      sx={{
        padding: '30px 24px 0',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-20px) translateY(-50px)'
        }}
      >
        <LockGreySvg />
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography
          sx={{
            fontFamily: 'Lato',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            background: 'linear-gradient(90deg, #D6FF2A 5.08%, #A1F9DD 104.8%)',
            backgroundClip: 'text',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent'
          }}
        >
          {!isEndTime && (
            <>
              <ClockIcon /> {DateTxt}
            </>
          )}
        </Typography>

        {!isEndTime ? (
          <Typography
            sx={{
              width: '145px',
              height: 44,
              background: '#060606',
              color: '#fff',
              fontFamily: 'Lato',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '16px',
              userSelect: 'none',
              gap: 8
            }}
          >
            Claim <QuestionHelper text="It is not yet claim time" />
          </Typography>
        ) : (
          <Button
            disabled={!isEndTime || claimLoading || isClaiming}
            sx={{
              borderRadius: '16px',
              width: 145,
              height: 44,
              padding: 1,
              ':hover': {
                opacity: 0.7
              }
            }}
            onClick={ClaimLockLPCallback}
          >
            <Typography
              sx={{
                width: '145px',
                height: '100%',
                background: '#060606',
                color: '#fff',
                fontFamily: 'Lato',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px',
                gap: 8
              }}
            >
              {(claimLoading || isClaiming) && <Spinner />} Claim
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  )
}
