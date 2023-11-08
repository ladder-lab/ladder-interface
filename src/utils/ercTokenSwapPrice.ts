import { BigNumber, ethers } from 'ethers'

export function useErc721Price(num: string | number, tokenPrice: string | undefined, toFixed: number) {
  const defaultDecimals = 18

  if (num && tokenPrice) {
    const floatNum = tokenPrice.split('.')
    const priceDecimals = floatNum.length === 2 ? Math.pow(10, floatNum[1].length) : 1

    return parseFloat(
      ethers.utils.formatUnits(
        BigNumber.from(Number(tokenPrice) * priceDecimals)
          .mul(BigNumber.from(num))
          .div(priceDecimals),
        defaultDecimals
      )
    )
      .toFixed(toFixed)
      .toString()
  }
  return '0'
}
