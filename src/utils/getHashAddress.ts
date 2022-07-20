import { getAddress, keccak256, solidityPack } from 'ethers/lib/utils'

export function getHashAddress(token: string, id: number): string {
  return getAddress(`0x${keccak256(solidityPack(['address', 'uint256'], [token, id])).slice(-40)}`)
}
