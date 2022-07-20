import { useState, useCallback, useMemo, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react'
import { Box, Typography, ButtonBase } from '@mui/material'
import { FixedSizeList } from 'react-window'
import Modal from 'components/Modal'
import CurrencyList from './CurrencyList'
import Divider from 'components/Divider'
import Input from 'components/Input'
import QuestionHelper from 'components/essential/QuestionHelper'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import LogoText from 'components/LogoText'
import NftList from './NftList'
import { COMMON_CURRENCIES } from 'constants/currencies'
import { useAllTokens, useIsUserAddedToken, useToken } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils'
import { ETHER, Token } from '@uniswap/sdk'
import { filterTokens, useSortedTokensByQuery } from 'utils/swap/filtering'
import { useTokenComparator } from 'utils/swap/sorting'
import { AllTokens, TokenType } from 'models/allTokens'
import useModal from 'hooks/useModal'
import ImportModal from 'components/Modal/ImportModal'
import { HelperText } from 'constants/helperText'
import { theme } from 'theme'
import useBreakpoint from 'hooks/useBreakpoint'

export enum Mode {
  TOKEN = 'token',
  NFT = 'nft'
}

export default function SelectCurrencyModal({
  onSelectCurrency,
  selectedTokenType
}: {
  onSelectCurrency?: (currency: AllTokens) => void
  selectedTokenType?: TokenType
}) {
  const isDownMd = useBreakpoint('md')
  const [mode, setMode] = useState(selectedTokenType === 'erc20' ? Mode.NFT : Mode.TOKEN)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const fixedList = useRef<FixedSizeList>()
  const { showModal } = useModal()

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  // manage focus on modal show
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
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
    },
    [filteredSortedTokens, onSelectCurrency, debouncedQuery]
  )

  // const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  //   setInput(e.target.value)
  // }, [])
  useEffect(() => {
    if (selectedTokenType === 'erc20') {
      setMode(Mode.NFT)
    } else {
      setMode(Mode.TOKEN)
    }
  }, [selectedTokenType])

  const onImport = useCallback(() => {
    showModal(<ImportModal />)
  }, [showModal])

  return (
    <>
      <Modal width="100%" maxWidth="680px" closeIcon padding={isDownMd ? '16px 28px' : '32px 32px'}>
        <Box width="100%" display="flex" gap={14} alignItems="center">
          <Typography
            sx={{
              fontSize: {
                xs: 14,
                md: 24
              }
            }}
          >
            {mode === Mode.TOKEN ? 'Select a Token' : 'Select a NFT'}
          </Typography>
          <QuestionHelper
            text={mode === Mode.TOKEN ? HelperText.selectToken : HelperText.selectNft}
            size={isDownMd ? 18.33 : 22}
            style={{ color: theme.palette.text.primary }}
          />
        </Box>
        <Box display="flex" gap={20} padding="31px 0 30px" alignItems="center">
          <ModeButton
            selected={mode === Mode.TOKEN}
            onClick={() => setMode(Mode.TOKEN)}
            disabled={selectedTokenType === 'erc20'}
          >
            ERC20
          </ModeButton>
          <ModeButton
            selected={mode === Mode.NFT}
            onClick={() => setMode(Mode.NFT)}
            disabled={selectedTokenType === 'erc1155'}
          >
            ERC1155
          </ModeButton>
        </Box>

        {mode === Mode.NFT && (
          <Box display="flex" alignItems="center" gap={3} mb={16}>
            <Typography fontSize={16} fontWeight={500}>
              Don&apos;t see your NFT ?
            </Typography>
            <ButtonBase sx={{ color: theme => theme.palette.text.secondary, fontSize: 16 }} onClick={onImport}>
              Import it
            </ButtonBase>
          </Box>
        )}

        <Input
          value={searchQuery}
          onChange={handleInput}
          placeholder="Search name or paste address"
          outlined
          startAdornment={<SearchIcon />}
          onKeyDown={handleEnter}
          height={isDownMd ? 48 : 60}
        />

        {mode === Mode.TOKEN && (
          <>
            <Box display="flex" gap={20} margin="20px 0">
              {COMMON_CURRENCIES.map((currency: { symbol: string; logo: string }) => (
                <ButtonBase
                  onClick={() => {}}
                  key={currency.symbol}
                  sx={{
                    borderRadius: '8px',
                    background: theme => theme.palette.background.default,
                    padding: '11px 23px'
                  }}
                >
                  <LogoText logo={currency.logo} text={currency.symbol} />
                </ButtonBase>
              ))}
            </Box>
            <Divider />
          </>
        )}

        <Box paddingTop={'24px'}>
          {mode === Mode.TOKEN ? (
            <CurrencyList
              mode={mode}
              currencyOptions={filteredSortedTokens}
              onSelectCurrency={onSelectCurrency}
              fixedListRef={fixedList}
              showETH={showETH}
              searchToken={searchToken}
              searchTokenIsAdded={searchTokenIsAdded}
            />
          ) : (
            <NftList onClick={onSelectCurrency} />
          )}
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
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        padding: {
          xs: '4px 12px',
          md: '7px 20px'
        },
        borderRadius: selected ? '10px' : '18px',
        color: selected ? '#1F9898' : ' #9E9E9E',
        boxShadow: selected ? '0px 4px 6px rgba(0, 0, 0, 0.05)' : 'inset 0px 2px 12px rgba(0, 0, 0, 0.1)',
        background: selected ? '#FFFFFF' : '#F8F8F8',
        fontSize: {
          xs: 14,
          md: 16
        }
      }}
    >
      {children}
    </ButtonBase>
  )
}
