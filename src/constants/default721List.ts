import { Token721 } from './token/token721'
import SampleNftImg from 'assets/images/sample-nft.png'
import { ChainId } from '@ladder/sdk'

const test721List = [
  { address: '0x54C0ac6D96D7B79c2941FaA33e61188611F4d813', name: 'Mutant Ape Yacht Club', synbol: 'BAYC' },
  { address: '0x9D88b325faA7b4C3E845c493fF282ed317414F6f', name: 'CryptoPunks', symbol: 'cp' },
  { address: '0x9cd61d732a7BFb6D3C1E7F1b26e5aafB3A5763cd', name: 'Chromie Squiggle ', symbol: 'CS' },
  { address: '0x0516eD436C66FC45E3353A784F64674F7DFD5940', name: 'Pudgy Penguins ', symbol: 'PPG' },
  { address: '0x1137aaCBFDDD6Ed98a1a0B98D5a67d51f157bc31', name: 'World Of Women', symbol: 'WOW' },
  { address: '0xD530d2191eBfF1b4CcC6A1f429Fdd8B965114296', name: 'RENGA', symbol: 'RNG' },
  { address: '0x12AA0C5C73A4f5de6c5C646a5279505D0a4be970', name: 'Exosama', symbol: 'ESO' },
  { address: '0x70020E84b37c54141e847b9AE540C1cA41cF2882', name: 'Cool Cats', symbol: 'COOL' },
  { address: '0xCaaB4d2107D465Ed58c2AAD6554b2dA1C3117860', name: 'Doodles', symbol: 'DOODLE' },
  { address: '0xBA1a650Abd084AbF42742AB7df5f7E65D458481B', name: 'Azuki', symbol: 'AZUKI' }
]

const test721ListSepolia = [
  { name: 'LADDER-TEST-721-1', symbol: 'T-721-1', address: '0x6746e7bd4250263F7F6CedEEDa3d055749c82A9e' },
  { name: 'LADDER-TEST-721-2', symbol: 'T-721-2', address: '0x96013A85E4B2ad0B579A8713a56225F8ed7530E9' },
  { name: 'LADDER-TEST-721-3', symbol: 'T-721-3', address: '0x5070F6ac4B161aa3f9B48E14d4A6182752939Cfe' },
  { name: 'LADDER-TEST-721-4', symbol: 'T-721-4', address: '0x31F2e3D0Ee3a97c0B3186eBAf5CAa92677046654' },
  { name: 'LADDER-TEST-721-5', symbol: 'T-721-5', address: '0x3186385C1c1C20B5230723dc67C18AA63D010C7d' },
  { name: 'LADDER-TEST-721-6', symbol: 'T-721-6', address: '0x5D0F0780c6f7d95780D50de1413919E8CdD5579d' },
  { name: 'LADDER-TEST-721-7', symbol: 'T-721-7', address: '0xd4C70114d12b05eACE5749dF0878891570BB0BEE' },
  { name: 'LADDER-TEST-721-8', symbol: 'T-721-8', address: '0xdB16d60B19F0de9F1702d7f5E400A38c0A35aa25' },
  { name: 'LADDER-TEST-721-9', symbol: 'T-721-9', address: '0x21243b3C267CeB2794dc4a1eaad223CDD2e27732' },
  { name: 'LADDER-TEST-721-10', symbol: ' T-721-10', address: '0xDE9e6C49C1E009314973A1FF37385b443d418971' }
]

export const getTest721uri = (name: string) => {
  return `https://info.chainswap.com/${name.split(' ').join('')}/0.jpg`
}

export const isTest721 = (address: string) => {
  const testAsset = test721List.find(item => item.address == address)
  return !!testAsset
}

const TEST_721_LIST = test721List.map(({ address, name, symbol }) => {
  return new Token721(ChainId.GÖRLI, address, undefined, {
    name,
    symbol,
    uri: getTest721uri(name)
  })
})

export const DEFAULT_721_LIST: { [chainId in ChainId]?: Token721[] } = {
  [ChainId.MAINNET]: [] as Token721[],
  [ChainId.RINKEBY]: [
    new Token721(4, '0x8978F929a3d85E92f5eA89613Cc4fD2B37294Db2', undefined, {
      name: 'Standard ERC721',
      symbol: 'ERC721',
      uri: SampleNftImg
    })
  ] as Token721[],
  [ChainId.GÖRLI]: TEST_721_LIST,
  [ChainId.SEPOLIA]: test721ListSepolia.map(({ address, name, symbol }) => {
    return new Token721(ChainId.SEPOLIA, address, undefined, {
      name,
      symbol
    })
  })
}
