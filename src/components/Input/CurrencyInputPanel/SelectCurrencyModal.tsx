import React, { useState, useCallback, useMemo, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react'
import { Box, Typography, ButtonBase, useTheme } from '@mui/material'
import { FixedSizeList } from 'react-window'
import Modal from 'components/Modal'
import CurrencyList from './CurrencyList'
import Input from 'components/Input'
// import QuestionHelper from 'components/essential/QuestionHelper'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import NftList from './ERC1155List'
import { COMMON_CURRENCIES } from 'constants/currencies'
import { useAllTokens, useIsUserAddedToken, useIsUserAddedToken1155, useToken, useToken1155 } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils'
import { Currency, ETHER, Token } from '@ladder/sdk'
import { filterTokens, useSortedTokensByQuery } from 'utils/swap/filtering'
import { useTokenComparator } from 'utils/swap/sorting'
import { AllTokens, NFT, TokenType } from 'models/allTokens'
import useModal from 'hooks/useModal'
import ImportModal from 'components/Modal/ImportModal'
// import { HelperText } from 'constants/helperText'
import useBreakpoint from 'hooks/useBreakpoint'
import { useAddUserToken, useIsDarkMode, useTrackedToken1155List } from 'state/user/hooks'
import { Token1155 } from 'constants/token/token1155'
import ERC721List from './ERC721List'
import { useCurrencyModalListHeight } from 'hooks/useScreenSize'
import { useIsTokenTypeCallback } from 'hooks/useTokenType'

export enum Mode {
  ERC20 = 'erc20',
  ERC1155 = 'erc1155',
  ERC721 = 'erc721'
}
interface SwapContextType {
  selectedToken: NFT | undefined
  setSelectedToken: (nft: NFT | undefined) => void
}

export const SwapContext = React.createContext<SwapContextType>({
  selectedToken: undefined,
  setSelectedToken: () => {}
})

export default function SelectCurrencyModal({
  onSelectCurrency,
  selectedTokenType
}: // onSelectSubTokens
{
  onSelectCurrency?: (currency: AllTokens) => void
  selectedTokenType?: TokenType
  // onSelectSubTokens?: (tokens: Token721[]) => void
}) {
  const isDownMd = useBreakpoint('md')
  const [isImportOpen, setIsInportOpen] = useState(false)
  const theme = useTheme()
  const [mode, setMode] = useState<'erc20' | 'erc721' | 'erc1155'>(Mode.ERC721)
  const [searchQuery, setSearchQuery] = useState<string>('')
  // const [searchQueryNFT, setSearchQueryNFT] = useState<string>('')
  const [invertSearchOrder] = useState<boolean>(false)
  const tokenType = useIsTokenTypeCallback(searchQuery)

  const fixedList = useRef<FixedSizeList>()

  const debouncedQuery = useDebounce(searchQuery, 200)
  const debouncedQueryNFT1155 = useDebounce(searchQuery, 200)

  const { hideModal } = useModal()

  const allTokens = useAllTokens()

  const allToken1155 = useTrackedToken1155List()

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)
  const addUserToken = useAddUserToken()
  const searchTokenNFT1155 = useToken1155(debouncedQuery)
  const searchTokenIsAddedNFT1155 = useIsUserAddedToken1155(searchTokenNFT1155)

  const handleImport = useCallback(
    (nft: NFT) => {
      onSelectCurrency?.(nft)
      hideModal()
      setIsInportOpen(false)
    },
    [hideModal, onSelectCurrency]
  )

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const filteredTokens1155: Token[] | Token1155[] = useMemo(() => {
    return filterTokens(Object.values(allToken1155), debouncedQueryNFT1155)
  }, [allToken1155, debouncedQueryNFT1155])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)
  //const filteredSortedTokensNFT = useSortedTokensByQuery(sortedTokens, debouncedQueryNFT)

  const commonCur = useMemo(() => {
    const curList: Currency[] = [ETHER]
    Object.keys(allTokens)
      .map(key => {
        const token = allTokens[key as keyof typeof allTokens]
        if (token?.symbol && COMMON_CURRENCIES.includes(token.symbol)) {
          curList.push(token)
        }
      })
      .slice(0, 4)
    return curList
  }, [allTokens])

  // manage focus on modal show
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  // const handleNFTInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
  //   const input = event.target.value
  //   const checksummedInput = isAddress(input)
  //   setSearchQueryNFT(checksummedInput || input)
  //   fixedList.current?.scrollTo(0)
  // }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (mode === Mode.ERC20) {
          const s = debouncedQuery.toLowerCase().trim()
          if (s === 'eth') {
            onSelectCurrency && onSelectCurrency(ETHER)
          } else if (filteredSortedTokens.length > 0) {
            if (
              filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
              filteredSortedTokens.length === 1
            ) {
              onSelectCurrency && onSelectCurrency(filteredSortedTokens[0])
            }
          }
        }

        if (mode === Mode.ERC1155) {
          if (filteredSortedTokens.length > 0) {
            if (
              filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
              filteredSortedTokens.length === 1
            ) {
              onSelectCurrency && onSelectCurrency(filteredSortedTokens[0])
            }
          }
        }

        if (mode === Mode.ERC721) {
          setMode(Mode.ERC721)
        }
      }
    },
    [mode, debouncedQuery, filteredSortedTokens, onSelectCurrency]
  )

  // const handleEnter1155 = useCallback(
  //   (e: KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key === 'Enter') {
  //       if (filteredSortedTokens.length > 0) {
  //         if (
  //           filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
  //           filteredSortedTokens.length === 1
  //         ) {
  //           onSelectCurrency && onSelectCurrency(filteredSortedTokens[0])
  //         }
  //       }
  //     }
  //   },
  //   [filteredSortedTokens, onSelectCurrency, debouncedQuery]
  // )

  // const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  //   setInput(e.target.value)
  // }, [])
  useEffect(() => {
    if (selectedTokenType === 'erc20') {
      setMode(Mode.ERC1155)
    } else {
      // setMode(Mode.ERC20)
      setMode(Mode.ERC721)
    }
  }, [selectedTokenType])

  useEffect(() => {
    if (tokenType === Mode.ERC1155) {
      setMode(Mode.ERC1155)
    }
    if (tokenType === Mode.ERC20) {
      setMode(Mode.ERC20)
    }
    if (tokenType === Mode.ERC721) {
      setMode(Mode.ERC721)
    }
  }, [tokenType])

  const onImport = useCallback(() => {
    setIsInportOpen(true)
  }, [])

  useEffect(() => {
    if (!searchTokenIsAdded && searchToken) {
      addUserToken(searchToken)
    }
  }, [addUserToken, searchToken, searchTokenIsAdded])
  const modalHeight = useCurrencyModalListHeight('0px')

  return (
    <>
      <ImportModal isOpen={isImportOpen} onImport={handleImport} onDismiss={() => setIsInportOpen(false)} />
      <Modal
        width="100%"
        maxWidth="680px"
        height={modalHeight}
        closeIcon
        closeVariant="button"
        padding={isDownMd ? '28px 16px' : '32px 32px'}
      >
        <Box width="100%" display="flex" gap={14} alignItems="center">
          <Typography
            variant="h5"
            sx={{
              fontSize: {
                xs: 14,
                md: 24
              }
            }}
          >
            {mode === Mode.ERC20 ? 'Select a Token' : 'Select a NFT'}
          </Typography>
          {/* <QuestionHelper
            text={mode === Mode.ERC20 ? HelperText.selectToken : HelperText.selectNft}
            size={isDownMd ? 18.33 : 22}
            style={{ color: theme.palette.text.secondary }}
          /> */}
        </Box>
        <Box paddingTop={'30px'}>
          <Input
            value={searchQuery}
            onChange={handleInput}
            placeholder="Search name or paste address"
            startAdornment={<SearchIcon />}
            onKeyDown={handleEnter}
            height={isDownMd ? 48 : 60}
          />
        </Box>

        {!searchQuery && (
          <Box display="flex" gap={20} paddingTop="10px" alignItems="center">
            <ModeButton
              selected={mode === Mode.ERC721}
              onClick={() => {
                setMode(Mode.ERC721)
                setSearchQuery('')
                // setSearchQueryNFT('')
              }}
              disabled={selectedTokenType === 'erc721'}
            >
              ERC721
            </ModeButton>
            <ModeButton
              selected={mode === Mode.ERC1155}
              onClick={() => {
                setMode(Mode.ERC1155)
                setSearchQuery('')
                // setSearchQueryNFT('')
              }}
              disabled={selectedTokenType === 'erc1155'}
            >
              ERC1155
            </ModeButton>
            <ModeButton
              selected={mode === Mode.ERC20}
              onClick={() => {
                setMode(Mode.ERC20)
                setSearchQuery('')
                // setSearchQueryNFT('')
              }}
              disabled={selectedTokenType === 'erc20'}
            >
              ERC20
            </ModeButton>
          </Box>
        )}

        <Box paddingTop={'24px'} position="relative">
          {mode === Mode.ERC20 && (
            <CurrencyList
              currencyOptions={filteredSortedTokens}
              onSelectCurrency={onSelectCurrency}
              fixedListRef={fixedList}
              showETH={showETH}
              searchToken={searchToken}
              searchTokenIsAdded={searchTokenIsAdded}
              commonCurlist={commonCur}
            >
              {/* <Input
                value={searchQuery}
                onChange={handleInput}
                placeholder="Search name or paste address"
                startAdornment={<SearchIcon />}
                onKeyDown={handleEnter}
                height={isDownMd ? 48 : 60}
              /> */}
            </CurrencyList>
          )}

          {mode === Mode.ERC1155 && (
            <NftList
              currencyOptions={filteredTokens1155 as Token1155[]}
              onSelectCurrency={onSelectCurrency}
              searchToken={searchTokenNFT1155}
              searchTokenIsAdded={searchTokenIsAddedNFT1155}
              onClick={onSelectCurrency}
              importToken={onImport}
            >
              <>
                <Box display="flex" alignItems="center" gap={3} mb={16}>
                  <Typography fontSize={16} fontWeight={500}>
                    Don&apos;t see your NFT ?
                  </Typography>
                  <ButtonBase
                    sx={{
                      color: theme => theme.palette.primary.main,
                      fontSize: 16,
                      fontWeight: 500,
                      ml: 10,
                      '&:hover': {
                        color: theme => theme.palette.primary.dark
                      }
                    }}
                    onClick={onImport}
                  >
                    Import it
                  </ButtonBase>
                </Box>

                {/* <Input
                  value={searchQueryNFT}
                  onChange={handleNFTInput}
                  placeholder="Search name or paste address"
                  // outlined
                  startAdornment={<SearchIcon />}
                  onKeyDown={handleEnter1155}
                  height={isDownMd ? 48 : 60}
                /> */}
              </>
            </NftList>
          )}

          {mode === Mode.ERC721 && (
            <ERC721List
              searchQueryNFT={searchQuery}
              // searchToken={searchTokenNFT}
              // searchTokenIsAdded={searchTokenIsAddedNFT}
              onSelectCurrency={onSelectCurrency}
              // onSelectSubTokens={onSelectSubTokens}
              // commonCollectionList={commonCollectionList}
              // collectionOptions={commonCollectionList}
              // selectedCollection={collection}
              // onSelectCollection={setCollection}
              // selectedCurrencies={filteredTokens1155}
            />
          )}

          <Box
            sx={{
              pointerEvents: 'none',
              position: 'absolute',
              bottom: 0,
              height: 50,
              width: '100%',
              background: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.palette.background.paper} 100%);`
            }}
          ></Box>
        </Box>
        {/* <Divider />
        <Box height="55px" justifyContent="center" display="flex">
          <Button variant="text" onClick={onManage}>
            Manage
          </Button>
        </Box> */}
      </Modal>
    </>
  )
}

function ModeButton({
  children,
  selected,
  onClick,
  disabled
}: {
  children?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  const background = useMemo(() => {
    if (isDarkMode && selected) {
      return '#484D50'
    }
    if (isDarkMode && !selected) {
      return '#25282B'
    }
    if (selected) {
      return '#FFFFFF'
    }
    return '#F8F8F8'
  }, [isDarkMode, selected])

  const textColor = useMemo(() => {
    if (isDarkMode && selected) {
      return theme.gradient.gradient1
    }
    if (isDarkMode && !selected) {
      return theme.palette.text.primary
    }
    if (selected) {
      return '#1F9898'
    }
    return '#9E9E9E'
  }, [isDarkMode, selected, theme])

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        padding: {
          xs: '4px 12px',
          md: '7px 20px'
        },
        borderRadius: '18px',
        background,
        boxShadow: isDarkMode
          ? 'none'
          : selected
          ? '0px 3px 10px rgba(0, 0, 0, 0.15)'
          : 'inset 0px 2px 12px rgba(0, 0, 0, 0.1)',

        '&:hover': {
          opacity: 0.8
        }
      }}
    >
      <Typography
        sx={{
          color: selected ? theme.palette.text.primary : 'transparent',
          fontSize: {
            xs: 14,
            md: 16
          },
          background: textColor,
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {children}
      </Typography>
    </ButtonBase>
  )
}
