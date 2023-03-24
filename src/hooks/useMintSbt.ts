import { useSbtContract } from './useContract'
import { useCallback, useState } from 'react'
import { useActiveWeb3React } from './index'
import { Axios, testURL } from '../utils/axios'

export function useMintSign(sbt: string) {
  const { chainId } = useActiveWeb3React()
  const [result, setResult] = useState()

  const sign = useCallback(async () => {
    Axios.get(testURL + 'mintRecord', {
      sbt,
      chainId
    })
      .then(r => {
        if (r?.data.code === 200) {
          setResult(r?.data as any)
        } else {
          setResult(undefined)
          throw Error('useVerifyTwitterRetweet error')
        }
      })
      .catch(e => {
        setResult(undefined)
        console.error(e)
      })
  }, [chainId, sbt])

  return {
    result,
    sign
  }
}

export function useMintSbt() {
  const contract = useSbtContract()
  const { account } = useActiveWeb3React()
  const createTask = useCallback(
    async (inviter: string, sbt: string) => {
      console.log('useMintSbt')
      if (!contract) {
        throw 'Params error'
      }

      const args = [account, inviter, sbt]
      return await contract['BindSBT'](...args)
    },
    [account, contract]
  )
  return { createTask }
}
