import React, { MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled, ButtonBase } from '@mui/material'
import useModal from 'hooks/useModal'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Token, Currency } from '@ladder/sdk'
import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
import { CurrencyListComponent } from './ListComponent'
import { useCurrencyModalListHeight } from 'hooks/useScreenSize'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'

interface Props {
  selectedCurrency?: Currency | null
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

export default function CurrencyList({
  searchToken,
  searchTokenIsAdded,
  commonCurlist,
  onSelectCurrency,
  children,
  currencyOptions,
  fixedListRef,
  showETH
}: Props) {
  const { hideModal } = useModal()
  const { chainId } = useActiveWeb3React()
  const onClick = useCallback(() => {
    onSelectCurrency && searchToken && onSelectCurrency(searchToken)
    hideModal()
  }, [hideModal, onSelectCurrency, searchToken])

  const listHeight = useCurrencyModalListHeight('360px')

  function filterByProperty<T extends Currency>(arr: T[]): T[] {
    const uniqueArr: T[] = []

    for (const item of arr) {
      if (!uniqueArr.includes(item)) {
        uniqueArr.push(item)
      }
    }

    return uniqueArr
  }
  const filteredOptions = filterByProperty(currencyOptions)

  return (
    <>
      {children}
      <Box display="flex" gap={20} margin="20px 0" flexWrap={'wrap'}>
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
                currency.symbol?.toUpperCase() === 'ETH'
                  ? SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID]?.nativeCurrency.symbol
                  : currency.symbol
              }
            />
          </ButtonBase>
        ))}
      </Box>
      <Divider />
      <Box height={listHeight} overflow="auto" paddingTop={'24px'} position="relative">
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
        ) : filteredOptions?.length > 0 || filteredOptions?.length > 0 ? (
          <CurrencyListComponent
            onSelect={onSelectCurrency}
            options={filteredOptions}
            fixedListRef={fixedListRef}
            showETH={showETH}
          />
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
