import React, { MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled, ButtonBase } from '@mui/material'
import { Mode } from './SelectCurrencyModal'
import useModal from 'hooks/useModal'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Token, Currency } from '@ladder/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import Spinner from 'components/Spinner'
import useBreakpoint from 'hooks/useBreakpoint'
import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'

const StyledBalanceText = styled(Typography)(`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`)

interface Props {
  selectedCurrency?: Currency | null
  mode?: Mode
  onSelectCurrency?: (currency: Currency) => void
  currencyOptions: Currency[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH?: boolean
  searchToken?: Currency | Token | null | undefined
  searchTokenIsAdded?: boolean
  commonCurlist?: Currency[]
  children?: React.ReactNode
}

const ListItem = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  padding: '0 32px',
  height: '48px',
  justifyContent: 'space-between'
})

function Row({ currency, onClick }: { currency: Currency; onClick: () => void }) {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency)

  return (
    <ListItem onClick={onClick}>
      <Box display="flex">
        <CurrencyLogo currency={currency} style={{ width: '30px', height: '30px' }} />
        <Box display="flex" flexDirection="column" marginLeft="16px">
          <Typography variant="inherit">{currency.symbol}</Typography>
          <Typography variant="caption">{currency.name}</Typography>
        </Box>
      </Box>
      <span style={{ fontWeight: 500 }}>
        {balance ? (
          <StyledBalanceText title={balance.toExact()} sx={{}}>
            {balance.toSignificant(4)}
          </StyledBalanceText>
        ) : account ? (
          <Spinner />
        ) : null}
      </span>
    </ListItem>
  )
}

export function CurrencyListComponent({ onSelectCurrency, currencyOptions, fixedListRef, showETH }: Props) {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')

  const currencyKey = useCallback((currency: Currency): string => {
    return currency ? currency.symbol || '' : ''
  }, [])

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [currencyKey])

  const Rows = useCallback(
    ({ data, index }: any) => {
      const currency: Currency = data[index]
      const onClickCurrency = () => {
        onSelectCurrency && onSelectCurrency(currency)
        hideModal()
      }

      return <Row currency={currency} onClick={onClickCurrency} />
    },
    [hideModal, onSelectCurrency]
  )

  const itemData: (Currency | undefined)[] = useMemo(() => {
    const formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencyOptions] : currencyOptions

    return formatted
  }, [currencyOptions, showETH])

  return (
    <FixedSizeList
      height={isDownMd ? 290 : 450}
      width="100%"
      itemCount={itemData.length}
      itemSize={56}
      itemData={itemData}
      itemKey={itemKey}
      ref={fixedListRef as any}
    >
      {Rows}
    </FixedSizeList>
  )
}

export default function CurrencyList({
  searchToken,
  searchTokenIsAdded,
  commonCurlist,
  onSelectCurrency,
  children,
  ...props
}: Props) {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')
  const { chainId } = useActiveWeb3React()

  const onClick = useCallback(() => {
    onSelectCurrency && searchToken && onSelectCurrency(searchToken)
    hideModal()
  }, [hideModal, onSelectCurrency, searchToken])

  return (
    <>
      {children}
      <Box display="flex" gap={20} margin="20px 0">
        {commonCurlist?.map((currency: Currency) => (
          <ButtonBase
            onClick={() => {
              onSelectCurrency && onSelectCurrency(currency)
              hideModal()
            }}
            key={currency.symbol}
            sx={{
              borderRadius: '8px',
              background: theme => theme.palette.background.default,
              padding: '11px 23px',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <LogoText
              logo={<CurrencyLogo currency={currency} />}
              text={
                currency.symbol === 'ETH'
                  ? SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID]?.nativeCurrency.symbol
                  : currency.symbol
              }
            />
          </ButtonBase>
        ))}
      </Box>
      <Divider />

      <Box height={isDownMd ? 290 : 450} paddingTop={'24px'} position="relative">
        {searchToken && !searchTokenIsAdded ? (
          <ListItem onClick={onClick}>
            <Box display="flex">
              <CurrencyLogo currency={searchToken} style={{ width: '30px', height: '30px' }} />
              <Box display="flex" flexDirection="column" marginLeft="16px">
                <Typography variant="inherit">{searchToken?.symbol}</Typography>
                <Typography variant="caption">{searchToken?.name}</Typography>
              </Box>
            </Box>
            <span style={{ fontWeight: 500 }}>{0}</span>
          </ListItem>
        ) : props.currencyOptions?.length > 0 || props.currencyOptions?.length > 0 ? (
          <CurrencyListComponent {...props} onSelectCurrency={onSelectCurrency} />
        ) : (
          <Box width={'100%'} display="flex" alignItems="center" justifyContent="center" height="60%">
            <Typography textAlign="center" mb="20px" fontSize={16} fontWeight={500}>
              No results found
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}
