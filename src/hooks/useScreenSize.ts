import { useCallback, useEffect, useState } from 'react'
import { theme } from 'theme'
import useBreakpoint from './useBreakpoint'

function currencyModalHeight(height: string) {
  return [`calc(100vh - ${theme.height.header} - ${height})`, `calc(100vh - ${theme.height.mobileHeader} - ${height})`]
}

function useScreenSizeChange(func: () => void) {
  useEffect(() => {
    func()
    window.addEventListener('resize', func)

    return () => {
      window.removeEventListener('resize', func)
    }
  }, [func])
}

export function useCurrencyModalListHeight(height: string) {
  const [listHeight, setListHeight] = useState('300px')
  const isDownSm = useBreakpoint('sm')

  const onSizeFunc = useCallback(() => {
    setListHeight(currencyModalHeight(height)[isDownSm ? 1 : 0])
  }, [height, isDownSm])
  useScreenSizeChange(onSizeFunc)

  return listHeight
}
