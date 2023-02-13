import { MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled } from '@mui/material'
import useModal from 'hooks/useModal'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Currency } from '@ladder/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import Spinner from 'components/Spinner'
import useBreakpoint from 'hooks/useBreakpoint'
import { getName, getSymbol } from 'utils/getSymbol'
import { Token721 } from 'constants/token/token721'
import TestnetV3Mark from 'components/TestnetV3Mark'

export function CurrencyListComponent({
  onSelect,
  options,
  fixedListRef,
  showETH
}: {
  onSelect?: (currency: Currency) => void
  options: Currency[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH?: boolean
}) {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')

  const key = useCallback((currency: Currency): string => {
    return currency ? currency.symbol || '' : ''
  }, [])

  const itemKey = useCallback((index: number, data: any) => key(data[index]), [key])

  const Rows = useCallback(
    ({ data, index }: any) => {
      const currency: Currency = data[index]
      const onClickCurrency = () => {
        onSelect && onSelect(currency)
        hideModal()
      }

      return <CurrencyRow currency={currency} onClick={onClickCurrency} />
    },
    [hideModal, onSelect]
  )

  const itemData: (Currency | undefined)[] = useMemo(() => {
    const formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...options] : options

    return formatted
  }, [options, showETH])

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

export function CollectionListComponent({
  onSelect,
  options,
  fixedListRef
}: {
  onSelect?: (collection: Token721) => void
  options: Token721[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}) {
  // const isDownMd = useBreakpoint('md')

  // const key = useCallback((collection: Token721): string => {
  //   return collection ? collection.tokenId?.toString() || idx + '' : ''
  // }, [])

  // const itemKey = useCallback((index: number, data: any) => key(data[index]), [key])

  const Rows = useCallback(
    ({ data, index, style }: any) => {
      const collection: Token721 = data[index]
      const onClickCollection = () => {
        onSelect && onSelect(collection)
      }

      return <CurrencyRow currency={collection} onClick={onClickCollection} style={style} />
    },
    [onSelect]
  )

  return (
    <FixedSizeList
      height={365}
      width="100%"
      itemCount={options.length}
      itemSize={56}
      itemData={options}
      // itemKey={itemKey}
      ref={fixedListRef as any}
    >
      {Rows}
    </FixedSizeList>
  )
}

const StyledBalanceText = styled(Typography)(`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`)

const ListItem = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  padding: '0 32px',
  height: '48px',
  justifyContent: 'space-between'
})

function CurrencyRow({ currency, onClick, style }: { currency: Currency; onClick: () => void; style?: any }) {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency)
  const _token: any = currency

  return (
    <ListItem onClick={onClick} style={style}>
      <Box display="flex">
        <CurrencyLogo currency={currency} style={{ width: '30px', height: '30px' }} />
        <Box display="flex" flexDirection="column" marginLeft="16px">
          <Typography variant="inherit" display="flex" alignItems="center">
            {getSymbol(currency)}
            <TestnetV3Mark addresss={[_token.address]} />
          </Typography>
          <Typography variant="caption">{getName(currency)}</Typography>
        </Box>
      </Box>
      <span style={{ fontWeight: 500 }}>
        {balance ? (
          <StyledBalanceText title={balance.toExact()} sx={{}}>
            {balance.toSignificant(6)}
          </StyledBalanceText>
        ) : account ? (
          <Spinner />
        ) : null}
      </span>
    </ListItem>
  )
}
