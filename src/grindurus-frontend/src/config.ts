import logoArbitrum from '@/assets/tokens/logoArbitrum.png'
import logoBase from '@/assets/tokens/logoBase.png'
import logoOptimism from '@/assets/tokens/logoOptimism.png'
import logoPolygon from '@/assets/tokens/logoPolygon.png'
import logoUSDC from '@/assets/tokens/logoUSDC.png'
import logoUSDT from '@/assets/tokens/logoUSDT.png'
import logoWETH from '@/assets/tokens/logoWETH.png'

export interface Token {
  symbol: string
  address: string
  decimals: number
  logo: string
}

export interface Strategy {
  id: number
  description: string
}

export interface ChainConfig {
  name: string
  chainId: string
  logo: string
  poolsNFT: string
  registry: string
  grETH?: string
  grAI?: string
  grinderAI?: string
  agentsNFT?: string
  strategies: Strategy[]
  quoteTokens: Token[]
  baseTokens: Token[]
}

type SupportedChains = 'arbitrum' | 'base' | 'polygon' | 'optimism'

const config: Record<SupportedChains, ChainConfig> = {
  arbitrum: {
    name: 'Arbitrum',
    chainId: '0xa4b1',
    logo: logoArbitrum,
    poolsNFT: '0x09747f48F5e5DE619AB85834864582dF5bb85F36',
    registry: '0x81C99B5Efc990cACF9bf90FB40EE515E50A5c9E5',
    grETH: '0x546F924093dE4cA9e2290A3Ac40B204bdD6c7f48',
    grAI: '0xcd2718b463a3e7Dd82e5F2734DbA0870053D9539',
    grinderAI: '0x61B8EAA534C64F585705aF61FB382870bbc59cdd',
    agentsNFT: '0x8e9df68bB7E08dAdff45CB32d1F51e8Ab896a512',
    strategies: [
      {
        id: 1,
        description: 'AAVEV3 + UniswapV3 with URUS',
      },
      {
        id: 0,
        description: 'UniswapV3 with URUS',
      },
    ],
    quoteTokens: [
      {
        symbol: 'WETH',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
        logo: logoWETH,
      },
      {
        symbol: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimals: 6,
        logo: logoUSDT,
      },
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
        logo: logoUSDC,
      },
    ],
    baseTokens: [
      {
        symbol: 'WETH',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
        logo: logoWETH,
      },
      {
        symbol: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimals: 6,
        logo: logoUSDT,
      },
      {
        symbol: 'USDC',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
        logo: logoUSDC,
      },
    ],
  },
  base: {
    name: 'Base',
    chainId: '0x2105',
    logo: logoBase,
    poolsNFT: '0x09747f48F5e5DE619AB85834864582dF5bb85F36',
    registry: '0x81C99B5Efc990cACF9bf90FB40EE515E50A5c9E5',
    grETH: '0x546F924093dE4cA9e2290A3Ac40B204bdD6c7f48',
    grAI: '0xcd2718b463a3e7Dd82e5F2734DbA0870053D9539',
    grinderAI: '0x61B8EAA534C64F585705aF61FB382870bbc59cdd',
    agentsNFT: '0x8e9df68bB7E08dAdff45CB32d1F51e8Ab896a512',
    strategies: [
      {
        id: 1,
        description: 'AAVEV3 + UniswapV3 with URUS',
      },
      {
        id: 0,
        description: 'UniswapV3 with URUS',
      },
    ],
    quoteTokens: [
      {
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        logo: logoWETH,
      },
      {
        symbol: 'USDC',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        logo: logoUSDC,
      },
    ],
    baseTokens: [
      {
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        logo: logoWETH,
      },
      {
        symbol: 'USDC',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        logo: logoUSDC,
      },
    ],
  },
  polygon: {
    name: 'Polygon',
    chainId: '0x89',
    logo: logoPolygon,
    poolsNFT: '',
    registry: '',
    strategies: [],
    quoteTokens: [],
    baseTokens: [],
  },
  optimism: {
    name: 'Optimism',
    chainId: '0xa',
    logo: logoOptimism,
    poolsNFT: '',
    registry: '',
    strategies: [],
    quoteTokens: [],
    baseTokens: [],
  },
}

export default config
