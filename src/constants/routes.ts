import { Currency, ETHER, Token } from '@ladder/sdk'
import { checkIs1155, checkIs721 } from 'utils/checkIs1155'

export const routes = {
  swap: '/swap',
  pool: '/pool',
  importPool: '/import-pool',
  addLiquidity: '/add-liquidity',
  removeLiquidity: '/remove-liquidity',
  removeLiquidityParams: '/:currencyIdA/:currencyIdB/:tokenIds',
  testnet: '/monopoly',
  explorer: '/explorer',
  collectionParams: '/:type/:chainId/:address/:token1155Id',
  statistics: '/statistics',
  statisticsTokens: '/statistics/tokens',
  statisticsTokensParams: '/:type/:chainId/:address/:token1155Id',
  statisticsPools: '/statistics/pair_pools',
  statisticsPoolsParams: '/:chainId/:pair',
  sbt: '/earn/sbt',
  feedback: '/feedback'
}

export function liquidityParamBuilder(currencyA: Currency | undefined, currencyB: Currency | undefined) {
  return `/${currencyA === ETHER ? 'ETH' : (currencyA as Token)?.address ?? 'undefined'}/${
    currencyB === ETHER ? 'ETH' : (currencyB as Token)?.address ?? 'undefined'
  }/${
    checkIs1155(currencyA) ? (currencyA as any).tokenId : checkIs721(currencyA) ? 'erc721' : ''
  }${liquidityParamSplitter}${
    checkIs1155(currencyB) ? (currencyB as any).tokenId : checkIs721(currencyB) ? 'erc721' : ''
  }`
}

export const liquidityParamSplitter = '&'
