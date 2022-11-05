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
  [ChainId.GÖRLI]: TEST_721_LIST
}
