import { Currency, ETHER, Token } from '@ladder/sdk'
import { checkIs1155, checkIs721 } from 'utils/checkIs1155'

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
  }/${checkIs1155(currencyA) ? (currencyA as any).tokenId : checkIs721(currencyA) ? 'erc721' : ''}&${
    checkIs1155(currencyB) ? (currencyB as any).tokenId : checkIs721(currencyB) ? 'erc721' : ''
  }`
}
