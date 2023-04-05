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
    async (inviter: string, signatory: string, v: string, r: string, s: string) => {
      if (!contract || !account) {
        throw 'Params error'
      }
      const args = [
        inviter,
        {
          signatory: signatory,
          v: v,
          r: r,
          s: s
        }
      ]
      console.log('args', args)
      return await contract['bindSBT'](...args)
    },
    [account, contract]
  )
  return { createTask }
}
