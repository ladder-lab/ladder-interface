import { MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled } from '@mui/material'
import { Mode } from './SelectCurrencyModal'
import useModal from 'hooks/useModal'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Token, Currency } from '@uniswap/sdk'

interface Props {
  selectedCurrency?: Currency | null
  mode?: Mode
  onSelectCurrency?: (currency: Currency) => void
  currencyOptions: Currency[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH?: boolean
  searchToken?: Currency | Token | null | undefined
  searchTokenIsAdded?: boolean
}

const ListItem = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  padding: '0 32px',
  height: '48px',
  justifyContent: 'space-between'
})

export function CurrencyListComponent({ onSelectCurrency, currencyOptions, fixedListRef, showETH }: Props) {
  const { hideModal } = useModal()

  const currencyKey = useCallback((currency: Currency): string => {
    return currency ? currency.symbol || '' : ''
  }, [])

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [currencyKey])

  const Row = useCallback(
    ({ data, index }: any) => {
      const currency: Currency = data[index]
      const onClickCurrency = () => {
        onSelectCurrency && onSelectCurrency(currency)
        hideModal()
      }

      return (
        <ListItem onClick={onClickCurrency}>
          <Box display="flex">
            <CurrencyLogo currency={currency} style={{ width: '30px', height: '30px' }} />
            <Box display="flex" flexDirection="column" marginLeft="16px">
              <Typography variant="inherit">{currency.symbol}</Typography>
              <Typography variant="caption">{currency.name}</Typography>
            </Box>
          </Box>
          <span style={{ fontWeight: 500 }}>{0}</span>
        </ListItem>
      )
    },
    [hideModal, onSelectCurrency]
  )

  const itemData: (Currency | undefined)[] = useMemo(() => {
    const formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencyOptions] : currencyOptions

    return formatted
  }, [currencyOptions, showETH])

  return (
    <FixedSizeList
      height={290}
      width="100%"
      itemCount={itemData.length}
      itemSize={56}
      itemData={itemData}
      itemKey={itemKey}
      ref={fixedListRef as any}
    >
      {Row}
    </FixedSizeList>
  )
}

export default function CurrencyList({ searchToken, searchTokenIsAdded, ...props }: Props) {
  const { hideModal } = useModal()

  const onClick = useCallback(() => {
    props.onSelectCurrency && searchToken && props.onSelectCurrency(searchToken)
    hideModal()
  }, [hideModal, props, searchToken])

  return (
    <Box>
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
        <CurrencyListComponent {...props} />
      ) : (
        <Box style={{ padding: '20px', height: '100%' }}>
          <Typography textAlign="center" mb="20px">
            No results found.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
