import { ChangeEvent, useCallback, useState, KeyboardEvent, useMemo, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { isAddress } from 'utils'
import { useAddUserToken, useTrackedToken721List } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { CollectionListComponent } from './ListComponent'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'

// TOOD: Update to ERC721
import { Token721 } from 'constants/token/token721'
import Input from '..'
import { useIsUserAddedToken721, useToken721WithLoadingIndicator } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import { filterTokens } from 'utils/swap/filtering'
import { Token } from '@ladder/sdk'
import { AllTokens } from 'models/allTokens'
import useModal from 'hooks/useModal'
import { Loader } from 'components/AnimatedSvg/Loader'
import { useCurrencyModalListHeight } from 'hooks/useScreenSize'

export default function ERC721List({
  onSelectCurrency
}: {
  onSelectCurrency: ((currency: AllTokens) => void) | undefined
}) {
  const [searchQueryNFT, setSearchQueryNFT] = useState<string>('')
  const tokenOptions = useTrackedToken721List()

  const isDownMd = useBreakpoint('md')
  const { hideModal } = useModal()

  const debouncedQueryNFT = useDebounce(searchQueryNFT, 200)
  const { loading, token721: searchTokenNFT } = useToken721WithLoadingIndicator(debouncedQueryNFT)
  const searchTokenIsAddedNFT = useIsUserAddedToken721(searchTokenNFT)
  const addUserToken = useAddUserToken()

  const filteredTokens: Token[] | Token721[] = useMemo(() => {
    return filterTokens(Object.values(tokenOptions), debouncedQueryNFT)
  }, [debouncedQueryNFT, tokenOptions])

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQueryNFT(checksummedInput || input)
  }, [])

  const onSelectCollection = useCallback(
    (collection: Token721) => {
      onSelectCurrency && onSelectCurrency(collection)

      hideModal()
    },
    [hideModal, onSelectCurrency]
  )

  const handleEnter721 = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredTokens.length > 0) {
        }
      }
    },
    [filteredTokens.length]
  )

  useEffect(() => {
    if (!searchTokenIsAddedNFT && searchTokenNFT) {
      addUserToken(searchTokenNFT)
    }
  }, [addUserToken, searchTokenIsAddedNFT, searchTokenNFT])

  const listHeight = useCurrencyModalListHeight('310px')

  return (
    <>
      {/* <Typography fontSize={16} fontWeight={500} mb={16}>
        Don&apos;t see your NFT ? Search address
      </Typography>
      <Input
        value={searchQueryNFT}
        onChange={handleInput}
        placeholder="Search name or paste address"
        // outlined
        startAdornment={<SearchIcon />}
        onKeyDown={handleEnter721}
        height={isDownMd ? 48 : 60}
      /> */}

      <Box sx={{ overflow: 'auto', height: listHeight }}>
        <Box paddingTop={'24px'} position="relative">
          {loading && (
            <Box marginTop="40px" position="absolute" left="50%" sx={{ transform: 'translateX(-50%)' }}>
              <Loader />
            </Box>
          )}
          {filteredTokens.length === 0 && !searchTokenNFT && !loading ? (
            <Box width={'100%'} display="flex" alignItems="center" justifyContent="center" mt={100}>
              <Typography
                textAlign="center"
                mb="20px"
                fontSize={16}
                fontWeight={500}
                component="div"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                No results found.
              </Typography>
            </Box>
          ) : (
            <CollectionListComponent
              onSelect={onSelectCollection}
              options={filteredTokens.length ? (filteredTokens as Token721[]) : searchTokenNFT ? [searchTokenNFT] : []}
            />
          )}
        </Box>
      </Box>
    </>
  )
}
