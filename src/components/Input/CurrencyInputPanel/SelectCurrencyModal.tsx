import { useState, useCallback, useMemo, KeyboardEvent, useRef, ChangeEvent, useEffect } from 'react'
import { Box, Typography, ButtonBase, useTheme } from '@mui/material'
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
import { Currency, ETHER, Token } from '@uniswap/sdk'
import { filterTokens, useSortedTokensByQuery } from 'utils/swap/filtering'
import { useTokenComparator } from 'utils/swap/sorting'
import { AllTokens, TokenType } from 'models/allTokens'
import useModal from 'hooks/useModal'
import ImportModal from 'components/Modal/ImportModal'
import { HelperText } from 'constants/helperText'
import { theme } from 'theme'
import useBreakpoint from 'hooks/useBreakpoint'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useIsDarkMode } from 'state/user/hooks'

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
  const { showModal, hideModal } = useModal()

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

  const commonCur = useMemo(() => {
    const curList: Currency[] = [ETHER]
    Object.keys(allTokens).map(key => {
      const token = allTokens[key as keyof typeof allTokens]
      if (token?.symbol && COMMON_CURRENCIES.includes(token.symbol)) {
        curList.push(token)
      }
    })
    return curList
  }, [allTokens])

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
      <Modal
        width="100%"
        maxWidth="680px"
        closeIcon
        closeVariant="button"
        padding={isDownMd ? '16px 28px' : '32px 32px'}
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
          // outlined
          startAdornment={<SearchIcon />}
          onKeyDown={handleEnter}
          height={isDownMd ? 48 : 60}
        />

        {mode === Mode.TOKEN && (
          <>
            <Box display="flex" gap={20} margin="20px 0">
              {commonCur.map((currency: Currency) => (
                <ButtonBase
                  onClick={() => {
                    onSelectCurrency && onSelectCurrency(currency)
                    hideModal()
                  }}
                  key={currency.symbol}
                  sx={{
                    borderRadius: '8px',
                    background: theme => theme.palette.background.default,
                    padding: '11px 23px'
                  }}
                >
                  <LogoText logo={<CurrencyLogo currency={currency} />} text={currency.symbol} />
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
          : 'inset 0px 2px 12px rgba(0, 0, 0, 0.1)'
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
