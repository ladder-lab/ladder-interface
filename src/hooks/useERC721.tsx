import { Token721 } from 'constants/token/token721'
import { useState, useCallback, useMemo } from 'react'
import { useTrackedToken721List } from 'state/user/hooks'

// import { useContext } from 'react'
// import { ERC721TokenContext } from '../context/ERC721Context'

// export default function useERC721Tokens() {
//   const context = useContext(ERC721TokenContext)
//   if (context === undefined) {
//     throw new Error('Must be used within a provider')
//   }
//   return context
// }

export default function useERC721Tokens({ collection }: { collection?: Token721 | null }) {
  const [tokens, setTokens] = useState<Token721[]>([])

  // TODO: Need to update. TEMP use 1155 list. Can accept collection as parameters
  console.log(collection, 'collection as search key')
  const tokenOptions = useTrackedToken721List()

  // Todo: Define common options in constants
  const commonCollections = useMemo(() => {
    return tokenOptions.slice(0, 3)
  }, [tokenOptions])

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

  const onClearTokens = useCallback(() => {
    setTokens([])
  }, [])

  return { tokens, tokenOptions, commonCollections, setTokens, onRemoveToken, onAddToken, onClearTokens }
}
