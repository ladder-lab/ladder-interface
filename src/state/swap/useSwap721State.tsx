import { Token721 } from 'constants/token/token721'
import { AllTokens } from 'models/allTokens'
import { useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import { filter721 } from 'utils/checkIs1155'
import { Field, resetSubToken, selectSubToken } from './actions'

export function useERC721Tokens() {
  const [tokens, setTokens] = useState<Token721[]>([])

  const onRemoveToken = useCallback(
    (token: Token721) => {
      const newTokens = tokens.filter(el => el != token)
      setTokens(newTokens)
    },
    [tokens]
  )

  const onAddToken = useCallback(
    (token: Token721) => {
      const list = tokens
      const index = tokens.findIndex(el => el.tokenId === token.tokenId)
      if (index !== -1) {
        return
      }

      list.push(token)
      setTokens([...list])
    },
    [tokens]
  )

  const onToggleToken = useCallback(
    (token: Token721) => {
      const newToken = tokens.find(el => el.tokenId == token.tokenId)
      if (newToken) {
        onRemoveToken(token)
      } else {
        onAddToken(token)
      }
    },
    [onAddToken, onRemoveToken, tokens]
  )

  const onClearTokens = useCallback(() => {
    setTokens([])
  }, [])

  return { tokens, setTokens, onRemoveToken, onAddToken, onClearTokens, onToggleToken }
}

export function useSwap721State(): {
  onSubTokenSelection: (field: Field, currency: AllTokens, tokenIds: Array<number | string>) => void
  resetSubTokenSelection: (field: Field) => void
  tokenIds: {
    [Field.INPUT]: undefined | Array<number | string>
    [Field.OUTPUT]: undefined | Array<number | string>
  }
} {
  const dispatch = useDispatch<AppDispatch>()
  const inputIds = useSelector((state: AppState) => state.swap[Field.INPUT].tokenIds)
  const outputIds = useSelector((state: AppState) => state.swap[Field.OUTPUT].tokenIds)

  const resetSubTokenSelection = useCallback(
    (field: Field) => {
      dispatch(
        resetSubToken({
          field
        })
      )
    },
    [dispatch]
  )

  const onSubTokenSelection = useCallback(
    (field: Field, currency: AllTokens, tokenIds = [] as Array<number | string>) => {
      const is721 = filter721(currency)
      if (!is721) return
      dispatch(
        selectSubToken({
          field,
          currencyId: is721.address,
          tokenIds
        })
      )
    },
    [dispatch]
  )
  const res = useMemo(() => {
    return {
      onSubTokenSelection,
      resetSubTokenSelection,
      tokenIds: {
        [Field.INPUT]: inputIds,
        [Field.OUTPUT]: outputIds
      }
    }
  }, [inputIds, onSubTokenSelection, outputIds, resetSubTokenSelection])

  return res
}
