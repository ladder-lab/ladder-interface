import { useCallback, useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ETHER, JSBI, Percent, TokenAmount } from '@uniswap/sdk'
import { Box, Button, Typography } from '@mui/material'
import AppBody from 'components/AppBody'
import { routes } from 'constants/routes'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import { AssetAccordion } from '../Swap/AssetAccordion'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import { AllTokens } from 'models/allTokens'
import { useTokenPairAdder } from 'state/user/hooks'
import { PairState, usePair } from 'data/Reserves'
import PositionCard from './PositionCard'
import { useActiveWeb3React } from 'hooks'
import { useTokenBalance, useTokenTotalSupply } from 'state/wallet/hooks'
import { wrappedCurrency } from 'utils/wrappedCurrency'

export default function ImportPool() {
  const navigate = useNavigate()
  const { account, chainId } = useActiveWeb3React()

  const [assetA, setAssetA] = useState<AllTokens | null>(ETHER)
  const [assetB, setAssetB] = useState<AllTokens | null>(null)

  const [pairState, pair] = usePair(assetA ?? undefined, assetB ?? undefined)
  const addPair = useTokenPairAdder()

  useEffect(() => {
    if (pair) {
      const wrappedA = wrappedCurrency(assetA ?? undefined, chainId)
      const wrappedB = wrappedCurrency(assetB ?? undefined, chainId)
      const [token0, token1] =
        wrappedA && wrappedB && wrappedA.sortsBefore(wrappedB) ? [wrappedA, wrappedB] : [wrappedB, wrappedA]
      addPair(token0, token1)
    }
  }, [pair, addPair, assetA, chainId, assetB])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))
  const totalSupply = useTokenTotalSupply(pair?.liquidityToken)
  const poolTokenPercentage = totalSupply && position ? new Percent(position.raw, totalSupply.raw).toFixed() + '%' : '-'

  const handleAssetA = useCallback((currency: AllTokens) => {
    setAssetA(currency)
  }, [])

  const handleAssetB = useCallback((currency: AllTokens) => {
    setAssetB(currency)
  }, [])

  const error = useMemo(() => {
    if (!account) {
      return 'Connect to a wallet to find pools'
    }
    if (!assetA || !assetB) {
      return 'Select a token to find your liquidity'
    }

    if (pairState === PairState.INVALID) {
      return 'Invalid pair'
    }

    if (validPairNoLiquidity) {
      return (
        <>
          No pool found <br />
          <Button
            color="primary"
            variant="text"
            sx={{ padding: 0, height: 'auto' }}
            onClick={() => navigate(routes.addLiquidity)}
          >
            Create Pool
          </Button>
        </>
      )
    }

    if (!hasPosition) {
      return (
        <>
          You don’t have liquidity in this pool yet <br />
          <Button color="primary" variant="text" sx={{ padding: 0, height: 'auto' }}>
            Add liquidity
          </Button>
        </>
      )
    }

    return undefined
  }, [account, assetA, assetB, hasPosition, navigate, pairState, validPairNoLiquidity])

  const assets = useMemo(() => {
    return pair?.token0.address === ((assetA as any)?.address ?? '') ? [assetA, assetB] : [assetB, assetA]
  }, [assetA, assetB, pair?.token0.address])

  return (
    <>
      <AppBody
        width={'100%'}
        maxWidth={'680px'}
        onReturnClick={() => navigate(routes.pool)}
        title="Import Pool"
        sx={{ padding: { xs: '20px', md: '24px 32px' } }}
      >
        <Box mt={35}>
          <Box mb={assetA ? 16 : 0}>
            <CurrencyInputPanel
              selectedTokenType={assetB ? ('tokenId' in assetB ? 'erc1155' : 'erc20') : undefined}
              value={'0'}
              onChange={() => {}}
              onSelectCurrency={handleAssetA}
              currency={assetA}
              disableInput
            />
          </Box>
          {assetA && <AssetAccordion token={assetA} />}
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowCircle />
          </Box>

          <Box mb={assetB ? 16 : 0}>
            <CurrencyInputPanel
              selectedTokenType={assetA ? ('tokenId' in assetA ? 'erc1155' : 'erc20') : undefined}
              value={'0'}
              onChange={() => {}}
              onSelectCurrency={handleAssetB}
              currency={assetB}
              disableInput
            />
          </Box>
          {assetB && <AssetAccordion token={assetB} />}
          {!error && (
            <Typography sx={{ textAlign: 'center', mt: 20, mb: 8 }} color="primary" fontWeight={500}>
              Pool Found!
            </Typography>
          )}
          <Box mt={error ? 40 : 0}>
            <PositionCard
              assetA={assets[0]}
              assetB={assets[1]}
              lpBalance={position?.toExact()}
              error={error}
              liquidityA={pair?.reserve0.toExact()}
              liquidityB={pair?.reserve1.toExact()}
              poolShare={poolTokenPercentage}
            />
          </Box>
        </Box>
      </AppBody>
    </>
  )
}
