import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'
import BSCUrl from 'assets/svg/binance.svg'
import { ReactComponent as MATIC } from 'assets/svg/matic.svg'
import MATICUrl from 'assets/svg/matic.svg'
// import { toHex } from 'web3-utils'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC = 56,
  SEPOLIA = 11155111,
  MATIC = 137
}

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : ChainId.MAINNET

export const SUPPORT_NETWORK_CHAIN_IDS: ChainId[] = process.env.REACT_APP_CHAIN_IDS
  ? process.env.REACT_APP_CHAIN_IDS.split(',').map(v => Number(v) as ChainId)
  : [ChainId.MAINNET]

export const IS_TEST_NET = !!(NETWORK_CHAIN_ID === ChainId.SEPOLIA)

export const AllChainList = [
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Ropsten',
    name: 'Ropsten Test Network',
    id: ChainId.ROPSTEN,
    hex: '0x3'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Rinkeby',
    name: 'Rinkeby Testnet',
    id: ChainId.RINKEBY,
    hex: '0x4'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Kovan',
    name: 'Kovan Testnet',
    id: ChainId.KOVAN,
    hex: '0x2a'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'GÖRLI',
    name: 'GÖRLI Testnet',
    id: ChainId.GÖRLI,
    hex: '0x5'
  },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Sepolia',
    name: 'Sepolia',
    id: ChainId.SEPOLIA,
    hex: '0xaa36a7'
  },
  {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'BSC',
    name: 'Binance Smart Chain',
    id: ChainId.BSC,
    hex: '0x38'
  },
  {
    icon: <MATIC />,
    logo: MATICUrl,
    symbol: 'MATIC',
    name: 'Matic',
    id: ChainId.MATIC,
    hex: '0xA86A'
  }
]

export const ChainList = AllChainList.filter(v => SUPPORT_NETWORK_CHAIN_IDS.includes(v.id))

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/d49aedc5c8d04128ab366779756cfacd'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.ROPSTEN]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ropsten',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ropsten.infura.io/v3/'],
    blockExplorerUrls: ['https://ropsten.etherscan.io']
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Rinkeby',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/ab440a3a67f74b6b8a0a8e8e13a76a52'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/']
  },
  [ChainId.KOVAN]: {
    chainId: '0x2a',
    chainName: 'Kovan',
    nativeCurrency: {
      name: 'Kovan',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://kovan.infura.io/v3/'],
    blockExplorerUrls: ['https://kovan.etherscan.io/']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.GÖRLI]: {
    chainId: '0x5',
    chainName: 'GÖRLI Testnet',
    nativeCurrency: {
      name: 'Goerli',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://goerli.infura.io/v3/bf5759dec68b48629379e1d53ababd45'],
    blockExplorerUrls: ['https://goerli.etherscan.io']
  },
  [ChainId.SEPOLIA]: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/f338fa7411a945db8bed616683b2ade5'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com']
  }
}
