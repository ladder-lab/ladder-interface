import { Token1155 } from './token/token1155'
import SampleNftImg from 'assets/images/sample-nft.png'
import { ChainId } from '@ladder/sdk'

const test1155List = [
  '0x322dE6C57eAEDbc01ab9695Ad37E0d1541014CA0',
  '0x1F25b15E58fE4B3E3866eed0263203D6318059D8',
  '0x11Da20BE3C3C14dAAFfBbe21743BF38D8567c7D5',
  '0x4afd442Ffb1Db26F647C09cFEd1046141C694043',
  '0x8Ff71Db9cBDae961b1f3bF092E815408968e2c38',
  '0xF57b4Cd37FdF1503D3233aA498A0eE86C4b73c58',
  '0xB6281d059A011982f46B885AaBA52dA608933757',
  '0x3AD70F216c0be1DFB6761C957D33dE1291ca1B79',
  '0x33d26866424F7791eB46A274F43344F6c9981A3b',
  '0x27b1940Ebc0C54A7cEF7ebc3b5A23133582A9feF'
]
const TEST_1155_LIST = test1155List.map((address, idx) => {
  return new Token1155(ChainId.GÖRLI, address, '1', {
    name: `Test NFT-ERC1155-${idx + 1}`,
    symbol: `TNT-${idx + 1}`,
    uri: ` https://info.chainswap.com/file/tnt-${idx + 1}.jpg`
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
