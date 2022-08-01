import { Token1155 } from './token/token1155'
import SampleNftImg from 'assets/images/sample-nft.png'
import { ChainId } from '@uniswap/sdk'

export const DEFAULT_1155_LIST: { [chainId in ChainId]?: Token1155[] } = {
  [ChainId.MAINNET]: [] as Token1155[],
  [ChainId.RINKEBY]: [
    new Token1155(4, '0x75e4b5644eA842817155f960600b3cC3194D14C2', 1, {
      name: 'Standard ERC1155',
      symbol: 'ERC1155',
      uri: SampleNftImg
    }),
    new Token1155(4, '0x75e4b5644eA842817155f960600b3cC3194D14C2', 17, {
      name: 'Standard ERC1155',
      symbol: 'ERC1155',
      uri: SampleNftImg
    }),
    ...[...Array(16).keys()].map(
      num =>
        new Token1155(4, '0x971f0b66c231a785E79EE9200E9D3479cC460604', num, {
          name: 'ERC1155',
          symbol: 'ERC1155',
          uri: SampleNftImg
        })
    )
  ]
}
