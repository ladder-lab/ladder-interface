import { Percent, JSBI, WETH, ChainId, Token, FACTORY_ADDRESS as sdkFactory } from '@ladder/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import { NETWORK_CHAIN_ID } from './chain'
import { DEFAULT_1155_LIST } from './default1155List'
console.log('1155 FACTORY', sdkFactory(5, false))
console.log('721 FACTORY', sdkFactory(5, true))

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const ROUTER_ADDRESS_721: string =
  (
    {
      [5]: '0xB2d06a54f2DBC5a2b608358c034be6aA88646Df4',
      [4]: '0xC61d146BB1965ba0e387aA2Ad94c500a17dfe65F',
      [56]: '',
      [1]: ''
    } as any
  )[NETWORK_CHAIN_ID] ?? ''

export const FACTORY_ADDRESS_721: string =
  (
    {
      [5]: '0xfE354EA7a06f6dBDEF06F087C4Be5A6d4E021442',
      [4]: '0x50A180230A11734FFD1A9A55e80c442387d42931',
      [56]: '',
      [1]: ''
    } as any
  )[NETWORK_CHAIN_ID] ?? ''

export const ROUTER_ADDRESS: string =
  (
    {
      [4]: '0x2cB34c38f7FFF789fab70AB69DAA9f7F05a4ecc8',
      [56]: '0x54F0d8485e931c22D542D7b95dbbf5ecdE9C91E8',
      [1]: '',
      [5]: '0x6ECBC55F9087b86aF9AADF553F086EfdAC5c1458'
    } as any
  )[NETWORK_CHAIN_ID] ?? ''

export const FACTORY_ADDRESS =
  (
    {
      [4]: '0xB4AA7ce0558A8EbfC943928d6F3E5ceCc1650a46',
      [56]: '0xa1bf45AF7cDe8c105054611383E8ae3dA65615a3',
      [1]: '',
      [5]: '0x075333bF761555D28D78E40232ABdC548083C3D7'
    } as any
  )[NETWORK_CHAIN_ID] ?? ''

export const MERKLE_TREE_ADDRESS = '0x8BD5cd2E57f15183bF169ef185B38240982DedF7'
export const TEST_NFT_URI_ADDRESS = '0x5D0F0780c6f7d95780D50de1413919E8CdD5579d'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  // [ChainId.RINKEBY]: [],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC]: [WETH[ChainId.BSC]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.RINKEBY]: [
    ...WETH_ONLY[ChainId.RINKEBY],
    new Token(ChainId.RINKEBY, '0xD64b11169B87030EB5647Add8265d2F1D30cF2e6', 18, 'TEST', 'Test Coin')
  ],
  [ChainId.GÖRLI]: [...WETH_ONLY[ChainId.GÖRLI]]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.RINKEBY]: [
    ...WETH_ONLY[ChainId.RINKEBY],
    new Token(ChainId.RINKEBY, '0xD64b11169B87030EB5647Add8265d2F1D30cF2e6', 18, 'TEST', 'Test Coin')
  ],
  [ChainId.GÖRLI]: [...WETH_ONLY[ChainId.GÖRLI]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.RINKEBY]: [
    [
      new Token(ChainId.RINKEBY, '0xD64b11169B87030EB5647Add8265d2F1D30cF2e6', 18, 'TEST', 'Test Coin'),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      DEFAULT_1155_LIST[4]![0]!
    ]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]
