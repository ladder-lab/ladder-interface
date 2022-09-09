import { Token721 } from './token/token721'
import SampleNftImg from 'assets/images/sample-nft.png'
import { ChainId } from '@ladder/sdk'

export const DEFAULT_721_LIST: { [chainId in ChainId]?: Token721[] } = {
  [ChainId.MAINNET]: [] as Token721[],
  [ChainId.RINKEBY]: [
    new Token721(4, '0x8978F929a3d85E92f5eA89613Cc4fD2B37294Db2', undefined, {
      name: 'Standard ERC721',
      symbol: 'ERC721',
      uri: SampleNftImg
    })
  ] as Token721[]
}
