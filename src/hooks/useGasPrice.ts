import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { useWeb3Instance } from './useWeb3Instance'
import { calculateGasPriceMargin } from 'utils'
import { useUserTransactionSpeed } from 'state/user/hooks'

export function useGasPriceInfo() {
  const web3 = useWeb3Instance()
  const [speed] = useUserTransactionSpeed()

  return useCallback(async () => {
    if (!web3) throw new Error('web3 is null')

    const getGasPriceWithRetry = async (retries: number): Promise<string> => {
      let gasPrice: string | undefined = undefined
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          gasPrice = await web3.eth.getGasPrice()
          break
        } catch (error) {
          console.log(`Attempt ${attempt + 1} failed:`, error)
          if (attempt === retries - 1) {
            throw new Error('Get gas error, please try again.')
          }
        }
      }
      return gasPrice || ''
    }
    const gasPrice = await getGasPriceWithRetry(3)

    return {
      gasPrice: calculateGasPriceMargin(gasPrice || '', speed)
    }
  }, [speed, web3])
}

export function useGasFee() {
  const { account, chainId } = useActiveWeb3React()
  const [gasFeeState, setGasFeeState] = useState<{
    gasFeeGwei: string
    gasFeeEth: string
  }>({
    gasFeeGwei: '--',
    gasFeeEth: '--'
  })

  const web3 = useWeb3Instance()
  const [speed] = useUserTransactionSpeed()

  const cb = useCallback(async () => {
    if (!web3) return

    if (!account || !chainId) return

    let gasPrice: string | undefined = undefined
    try {
      gasPrice = await web3.eth.getGasPrice()
    } catch (error) {
      console.log(error)
      return
    }
    gasPrice = calculateGasPriceMargin(gasPrice || '', speed)

    let gasLimit: number | undefined = undefined
    try {
      gasLimit = await web3.eth.estimateGas({})
    } catch (error) {
      console.log(error)
      return
    }

    const gasBN = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasLimit))
    const gasFeeEth = web3.utils.fromWei(gasBN, 'ether')

    setGasFeeState({
      gasFeeGwei: gasBN.toString(),
      gasFeeEth: gasFeeEth
    })
  }, [account, chainId, speed, web3])

  useEffect(() => {
    cb()
  }, [cb])

  return { gasFeeState }
}
