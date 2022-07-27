import { Token } from '@uniswap/sdk'
import { getAddress, keccak256, solidityPack } from 'ethers/lib/utils'
import { AllTokens } from 'models/allTokens'
import { filter1155 } from './checkIs1155'

export function getHashAddress(token: string, id: number): string {
  return getAddress(`0x${keccak256(solidityPack(['address', 'uint256'], [token, id])).slice(-40)}`)
}

export function generateErc20(token: AllTokens | undefined) {
  if (!token) return undefined
  const token1155 = filter1155(token)

  return token1155
    ? new Token(
        token1155.chainId,
        getHashAddress(token1155.address, +token1155.tokenId),
        0,
        token1155.symbol,
        token1155.name
      )
    : token
}
