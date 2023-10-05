import { Token721 } from './token/token721'
import SampleNftImg from 'assets/images/sample-nft.png'
import { ChainId } from '@ladder/sdk'

const test721List = [
  { address: '0x54C0ac6D96D7B79c2941FaA33e61188611F4d813', name: 'Mutant Ape Yacht Club', symbol: 'BAYC' },
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
  {
    address: '0x4186128305c4fF0a3FafB9126eEaf77169C2ec12',
    name: 'Mutant Ape Yacht Club',
    symbol: 'MAYC',
    uriName: 'MutantApeYachtClub'
  },
  {
    address: '0x7dc1BE8f47eE5805095c9bABa7123ED9AB2aB178',
    name: 'CRYPTO PUNKS',
    symbol: 'CRYPTOPUNKS',
    uriName: 'CryptoPunks'
  },
  {
    address: '0xb5dd2438a909C30d93184F1908733092aB618f31',
    name: 'Art Blocks',
    symbol: 'BLOCKS',
    uriName: 'ChromieSquiggle'
  },
  { address: '0xaA2Ff5d0A9E098eB9644e22208adce451bAb24a3', name: 'Cool Cats', symbol: 'COOL' },
  { address: '0x52CA73a56e50aA7973327b795959e4F2Afece1da', name: 'Doodles', symbol: 'DOODLE' },
  { address: '0xF810E14fe787c4e41B37fb9484d769Cc3e5CF227', name: 'Exosama', symbol: 'EXO' },
  { address: '0x9F8b37d69f1209FB5cE45B50dF698a1C12A42831', name: 'Pudgy Penguins ', symbol: 'PPG' },
  { address: '0x92F6Ea44eF7DC9e3293a41cEc53610F3f0a6D127', name: 'World Of Women', symbol: 'WOW' },
  { address: '0x9c111fEDD3aa778a46D0E7067D0e894D1eA0A029', name: 'RENGA', symbol: 'RENGA' },
  { address: '0xf904B6C5aBa72dD44fBc840Be139c100F291d5FA', name: 'Azuki', symbol: 'AZUKI' }

  // { name: 'LADDER-TEST-721-1', symbol: 'T-721-1', address: '0x6746e7bd4250263F7F6CedEEDa3d055749c82A9e' },
  // { name: 'LADDER-TEST-721-2', symbol: 'T-721-2', address: '0x96013A85E4B2ad0B579A8713a56225F8ed7530E9' },
  // { name: 'LADDER-TEST-721-3', symbol: 'T-721-3', address: '0x5070F6ac4B161aa3f9B48E14d4A6182752939Cfe' },
  // { name: 'LADDER-TEST-721-4', symbol: 'T-721-4', address: '0x31F2e3D0Ee3a97c0B3186eBAf5CAa92677046654' },
  // { name: 'LADDER-TEST-721-5', symbol: 'T-721-5', address: '0x3186385C1c1C20B5230723dc67C18AA63D010C7d' },
  // { name: 'LADDER-TEST-721-6', symbol: 'T-721-6', address: '0x5D0F0780c6f7d95780D50de1413919E8CdD5579d' },
  // { name: 'LADDER-TEST-721-7', symbol: 'T-721-7', address: '0xd4C70114d12b05eACE5749dF0878891570BB0BEE' },
  // { name: 'LADDER-TEST-721-8', symbol: 'T-721-8', address: '0xdB16d60B19F0de9F1702d7f5E400A38c0A35aa25' },
  // { name: 'LADDER-TEST-721-9', symbol: 'T-721-9', address: '0x21243b3C267CeB2794dc4a1eaad223CDD2e27732' },
  // { name: 'LADDER-TEST-721-10', symbol: ' T-721-10', address: '0xDE9e6C49C1E009314973A1FF37385b443d418971' }
]

const test721TestnetV3ListSepolia = [
  // {
  //   address: '0xbef96b9354EaF451FaD72E41A1a4d4fE9D696ef4',
  //   name: 'Rh!noX',
  //   symbol: 'RNX',
  //   metaDataUri: 'https://v1-test.ladder.top/ladder/RNX/'
  // },
  // {
  //   address: '0x3e9fc47be41ef38eb97822856b9145fbe632902b',
  //   name: 'DCC',
  //   symbol: 'DCC',
  //   metaDataUri: 'https://v1-test.ladder.top/ladder/DCC/'
  // },
  {
    address: '0xbef96b9354EaF451FaD72E41A1a4d4fE9D696ef4',
    name: 'Rh!noX',
    symbol: 'RNX',
    metaDataUri: 'https://v1-test.ladder.top/ladder/RNX/'
  },
  {
    address: '0x3e9fc47be41ef38eb97822856b9145fbe632902b',
    name: 'DCC',
    symbol: 'DCC',
    metaDataUri: 'https://v1-test.ladder.top/ladder/DCC/'
  },
  {
    address: '0xAd1b8Fa357265D15a056B51c299a29843bE874DB',
    name: 'GensoKishiOnline.v2',
    symbol: 'Genso_NFT_v2',
    uriName: 'GensoKishiOnline.v2'
  },
  {
    address: '0x3ec2Bb9E04C8DB50fb77E170BF9116B330293209',
    name: 'MetaBoom',
    symbol: 'MMU',
    metaDataUri: 'https://api.fansi.me/NFT/biopunk/'
  },
  {
    address: '0x3CB855C19fEf72DFbe8d238e07Ba49F7017EF85f',
    name: 'Weirdo Ghost Gang',
    symbol: 'GHOST',
    metaDataUri: 'https://ipfs.io/ipfs/QmU61BwmB9fm3kN4EWS14YxrB1FFJcMWj9GRrf4hsEvaYE/'
  },
  {
    address: '0x67852c84F7e80fFE522cAEE29328631797ef35E8',
    name: 'Furion',
    symbol: 'FURION',
    uriName: 'Furion'
  },
  {
    address: '0xC1DFf0458508FF9c3C44b3f1aF97C6495607C05C',
    name: 'Isekai Metaverse',
    symbol: 'IGC',
    uriName: 'IGC'
  },
  {
    address: '0x2B95cc8D52e986C8cC209ef4DfBF2aA02D81fC2D',
    name: 'GrittiNFT',
    symbol: 'GNFT',
    metaDataUri: 'https://tkres.gritti.io/nftjson/56/'
  },
  {
    address: '0xdCF53E67375DaD97A273f0Ae49E5EBf2fEf44D91',
    name: 'NextType',
    symbol: 'NEXTYPE',
    uriName: 'NEXTYPE'
  },
  {
    address: '0x338b3f0Dbdf521c39e2a61e6D850e2eAdEe85c02',
    name: 'StarryNift',
    symbol: 'SNFT',
    uriName: 'StarryNift'
  },
  {
    address: '0xbCaf52f2C202C0f44Ed3404a1Acb6AE4b07E1544',
    name: 'WonderPals',
    symbol: 'WNDR',
    metaDataUri: 'https://wonderpals.mypinata.cloud/ipfs/QmSvKdz3ecY3tKT4k7bcMnwPHXRby7tSLfPCngtb1Eq9PQ/'
  },
  {
    address: '0xE9DDf46639dbaD61e4B180296AEE4e6c05562CFC',
    name: 'Cheers UP',
    symbol: 'CUP',
    uriName: 'CheersUp'
  }
]

export const getTest721uri = (name: string, uriName?: string) => {
  return `https://info.chainswap.com/${uriName ?? name.split(' ').join('')}/0.jpg`
}

export const getTest721uriWithIndex = (uri: string, idx: string | number) => {
  return uri.replace(/\/[0~9]+\.jpg/, `/${idx}.jpg`)
}

export const isTest721 = (address: string) => {
  const testAsset = [...test721ListSepolia, ...test721TestnetV3ListSepolia].find(item => item.address == address)
  return !!testAsset
}

const TEST_721_LIST = test721List.map(({ address, name, symbol }) => {
  return new Token721(ChainId.GÖRLI, address, undefined, {
    name,
    symbol,
    uri: getTest721uri(name)
  })
})

const TEST_721_LIST_SEPOLIA = test721ListSepolia.map(({ address, name, symbol, uriName }) => {
  return new Token721(ChainId.SEPOLIA, address, undefined, {
    name,
    symbol,
    uri: getTest721uri(name, uriName)
  })
})

const TEST_721_TESTNET_V3_LIST_SEPOLIA = test721TestnetV3ListSepolia.map(
  ({ address, name, symbol, metaDataUri, uriName }) => {
    return new Token721(ChainId.SEPOLIA, address, undefined, {
      name,
      symbol,
      tokenUri: metaDataUri,
      uri: metaDataUri ? metaDataUri + '1.jpg' : getTest721uri(name, uriName)
    })
  }
)

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
  [ChainId.SEPOLIA]: [...TEST_721_TESTNET_V3_LIST_SEPOLIA, ...TEST_721_LIST_SEPOLIA]
}

const v3Erc20Tokens = ['0x55979784068d1BEf37B49F41cAC8040A4b79C4a7', '0xaDefa85603c36FcE62919fd85Cf60F90cb8Dc642']
export function isTestnetV3Address(addresss: (string | undefined)[]) {
  for (const addr of addresss) {
    const len = test721TestnetV3ListSepolia.filter(item => addr && addr.toLowerCase() === item.address.toLowerCase())
    if (len.length) return true
  }
  for (const addr of addresss) {
    const len = v3Erc20Tokens.filter(item => addr && addr.toLowerCase() === item.toLowerCase())
    if (len.length) return true
  }
  return false
}
