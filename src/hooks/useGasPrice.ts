import { useCallback } from 'react'
import { useWeb3Instance } from './useWeb3Instance'
import { calculateGasPriceMargin } from 'utils'
import { useUserTransactionSpeed } from 'state/user/hooks'

export function useGasPriceInfo() {
  const web3 = useWeb3Instance()
  const [speed] = useUserTransactionSpeed()

  return useCallback(async () => {
    if (!web3) throw new Error('web3 is null')

    let gasPrice: string | undefined = undefined

    try {
      gasPrice = await web3.eth.getGasPrice()
    } catch (error) {
      console.log(error)
      throw new Error('Get gas error, please try again.')
    }
    return {
      gasPrice: calculateGasPriceMargin(gasPrice || '', speed)
    }
  }, [speed, web3])
}
