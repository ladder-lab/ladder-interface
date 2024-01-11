import { useEffect, useRef } from 'react'
import { useRequest } from 'ahooks'
import { Token721 } from 'constants/token/token721'

export default function useInterval(callback: () => void, delay: null | number, leading = true) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const current = savedCallback.current
      current && current()
    }

    if (delay !== null) {
      if (leading) tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return undefined
  }, [delay, leading])
}

export function useIntervalGetToken721(token: Token721 | undefined): { token721: Token721 | undefined } {
  const { data: token721 } = useRequest(
    async () => {
      return token
    },
    {
      pollingInterval: 2000
    }
  )
  return { token721 }
}
