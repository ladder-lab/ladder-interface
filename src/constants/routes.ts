import { Currency, ETHER, Token } from '@ladder/sdk'
import { Token1155 } from './token/token1155'

export const routes = {
  swap: '/swap',
  pool: '/pool',
  importPool: '/import-pool',
  addLiquidity: '/add-liquidity',
  removeLiquidity: '/remove-liquidity',
  removeLiquidityParams: '/:currencyIdA/:currencyIdB/:tokenIds'
}

export function liquidityParamBuilder(currencyA: Currency | undefined, currencyB: Currency | undefined) {
  return `/${currencyA === ETHER ? 'ETH' : (currencyA as Token).address}/${
    currencyB === ETHER ? 'ETH' : (currencyB as Token).address
  }/${currencyA && 'tokenId' in currencyA ? (currencyA as Token1155).tokenId : ''}&${
    currencyB && 'tokenId' in currencyB ? (currencyB as Token1155).tokenId : ''
  }`
}
