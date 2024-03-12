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

const test1155Sepolia = [
  '0x5606aab6E54B967a8b0649d1Dd2C3C0EA9e4A561',
  '0x6bc3d7742b0aF00d3A42d8E8cF21f867e13EEc41',
  '0xE31fC5Cfe8618f599cF50B954E46CdAd82E9FE01',
  '0xCCf87A582e130F6D935f458B6c0374f6D1D8ce25',
  '0xcE91542149d287d8dE749af9281a52AFFAbca4a4',
  '0x76dc8F3B7062D457a6402E4DD4CAD01840C58adE',
  '0x1e37327550EA0260fB8CdCe5DD812DB27569D8b4',
  '0xDF864010DD1aCC604aD21DA777Bcc23B51DA5359',
  '0xAc0409e5580b25D235a3494aDA17C23c9f07C57f',
  '0xE61C62b18687DD3B2871A11142FdD3Ca4BE5c819'
  // '0xC0Bd9b7F1508D2CE63D20789D50E84e8c92ec5CE',
  // '0x252192e4DE982fB255f5263A3062B0E8bce6922b',
  // '0xC7f387cAe7F1aD95E0F4454377275afcBef1C006',
  // '0x45b0Bc415fA105B554D8E0832eAa77C5Fefe2Fe0',
  // '0x434bEC95FEC15041ADF240c91FBa7A3Ef51c03CA',
  // '0x4F9D8Cf796104C29dcf0E7df1Fa4225527DD7235',
  // '0x41aa9fC2A343Aa9e699d87D2B8963C5dB1A58D12',
  // '0x43f1138F109cAD8322754F97a46aF480A8F71A66',
  // '0xF120b1be9Ab77c3cE13806016e647633F7Ca75D9'
]

const TEST_1155_LIST = test1155List.map((address, idx) => {
  return new Token1155(ChainId.GÖRLI, address, '1', {
    name: `Test NFT-ERC1155-${idx + 1}`,
    symbol: `TNT-${idx + 1}`,
    // uri: ` https://info.chainswap.com/file/tnt-${idx + 1}.jpg`
    uri: `https://libdatas.s3.ap-southeast-1.amazonaws.com/ladder/logo/LTTNT.png`
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
  [ChainId.GÖRLI]: TEST_1155_LIST,
  [ChainId.SEPOLIA]: [
    new Token1155(11155111, '0x59865Bc13A66091eD7d55F5ea064E7e2ac8503A2', 1, {
      name: 'Color Lines  ColorLines',
      symbol: 'ColorLines',
      uri: `https://v1-test.ladder.top/ladder/ColorLines/1.jpg`
    }),
    new Token1155(11155111, '0x7e590B1e6d2C79107eA7752bA1e9E260255a2FCe', 1, {
      name: '10KTF Stockroom',
      symbol: 'Long Ass Tape Measure',
      uri: `https://v1-test.ladder.top/ladder/LATM/1.jpg`
    }),
    new Token1155(11155111, '0x428d0B7CA1B798f7854183599EFf962fF028b0CF', 1, {
      name: 'Proceed w/ Caution Defy',
      symbol: 'Defy',
      uri: `https://v1-test.ladder.top/ladder/Defy/1.jpg`
    }),
    new Token1155(11155111, '0x4C5C83aE03b25fBc4a02AD8Df9bD3c13c4274C97', 1, {
      name: 'Parallel Alpha  Recon [SE] - Artigraph',
      symbol: 'Recon [SE] - Artigraph',
      uri: `https://v1-test.ladder.top/ladder/ReconArtigraph/1.jpg`
    }),
    new Token1155(11155111, '0xF147304398B5c03A09D576208300E3E1ae52Ae7B', 1, {
      name: 'Nakameebto',
      symbol: 'Nakameebto',
      uri: `https://v1-test.ladder.top/ladder/Nakameebto/1.jpg`
    }),
    new Token1155(11155111, '0x2dFC4FF9591f39aD2327b4ea92B2f32387812291', 1, {
      name: 'Town Star',
      symbol: 'Legendary Bitrue Wheat',
      uri: `https://v1-test.ladder.top/ladder/LegendaryBitrueWheat/1.jpg`
    }),
    new Token1155(11155111, '0xEd226f9Ada7B93c7401d6CA4a7be7fD9AAc289C7', 1, {
      name: 'Memo Angeles Presents: The Killa Chronicles',
      symbol: 'Volume 3: The Rescue',
      uri: `https://v1-test.ladder.top/ladder/Volume3/1.jpg`
    }),
    new Token1155(11155111, '0x35da36ae500092102e889fF73282c8D140b2Fcf5', 1, {
      name: 'ikehaya Pass',
      symbol: 'ikehaya Pass Genesis',
      uri: `https://v1-test.ladder.top/ladder/ikehayaPassGenesis/1.jpg`
    }),
    new Token1155(11155111, '0x939b9a830d736d483C9511CD3849C2d21E5bB3d6', 1, {
      name: 'Genesis Oath',
      symbol: 'VIP',
      uri: `https://v1-test.ladder.top/ladder/VIP/1.jpg`
    }),
    new Token1155(11155111, '0x27AB6D927Fa84D933bf0e5493Dd20f3a6270CBe8', 1, {
      name: 'Nyan Balloon',
      symbol: 'Multi-Nyan Balloons',
      uri: `https://v1-test.ladder.top/ladder/Multi-NyanBalloons/1.webp`
    }),
    ...test1155Sepolia.map((address, idx) => {
      return new Token1155(ChainId.SEPOLIA, address, '1', {
        name: `Test NFT-ERC1155-${idx + 1}`,
        symbol: `TNT-${idx + 1}`,
        // uri: ` https://info.chainswap.com/file/tnt-${idx + 1}.jpg`
        uri: `https://libdatas.s3.ap-southeast-1.amazonaws.com/ladder/logo/LTTNT.png`
      })
    })
  ]
}
