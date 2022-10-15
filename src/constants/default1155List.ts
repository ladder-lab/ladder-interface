import { Token1155 } from './token/token1155'
import SampleNftImg from 'assets/images/sample-nft.png'
import { ChainId } from '@ladder/sdk'

const testUriNames = ['asset', 'StarTownies', 'parallel', 'Satche', 'LarisWar']

const test1155List = [
  '0x58dCF8B3Ee8C9D8255a6d8615e73e2AE1CFc4D2E',
  '0xCcF4c4Cf1103DCBE69BDD85e50189bdc2AC21dC1',
  '0x73a0934bbe35dC203B656e497080416b3C9F812a',
  '0x0309CE2e95796e4eB6D3a0f5708b8980fBA10732',
  '0x52ABc0c05d81E67B7781752e9e49DC169C43e965'
]
const TEST_1155_LIST = test1155List.map((address, idx) => {
  const name: string = testUriNames[idx]
  return new Token1155(ChainId.GÖRLI, address, 1, {
    uri: `https://info.chainswap.com/${name}/${name}.jpg`
  })
})

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
    })
  ],
  [ChainId.BSC]: [
    new Token1155(56, '0x26cA871A864f85A3673F7240D72daE54d1FcFd63', 4),
    new Token1155(56, '0x26cA871A864f85A3673F7240D72daE54d1FcFd63', 2)
  ],
  [ChainId.GÖRLI]: TEST_1155_LIST
}
