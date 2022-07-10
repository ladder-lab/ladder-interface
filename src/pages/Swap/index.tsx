import { useCallback, useState, ChangeEvent } from 'react'
import { Typography, Box, IconButton, SxProps, styled, useTheme } from '@mui/material'
import AppBody from 'components/AppBody'
import SelectButton from 'components/Button/SelectButton'
import NumericalInput from 'components/Input/InputNumerical'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as SettingIcon } from 'assets/svg/setting.svg'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import Accordion from 'components/Accordion'
import { Currency, ETHER } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function Swap() {
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')
  const [fromAccordionExpanded, setFromAccordionExpanded] = useState(false)
  const [toAccordionExpanded, setToAccordionExpanded] = useState(false)

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  const onToVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToVal(e.target.value)
  }, [])

  return (
    <>
      <AppBody width={'680px'} maxWidth={'680px'}>
        <Box
          sx={{
            padding: '33px 32px 30px',
            position: 'relative'
          }}
        >
          <Typography fontSize={28} mb={45}>
            SWAP
          </Typography>
          <SettingButton sx={{ position: 'absolute', right: 32, top: 24 }} />
          <Box display="flex" gap={16} mb={12}>
            <SelectButton width={'346px'}>DAI</SelectButton>
            <NumericalInput
              value={fromVal}
              onChange={onFromVal}
              maxWidth={254}
              subStr="~$568.23"
              subStr2="Balence: 2.35512345 DAI"
            />
          </Box>
          <CurrencyAccordion
            currency={ETHER}
            name="DAI"
            contract="123"
            tokenId="123"
            tokenType="ERC20"
            onChange={() => setFromAccordionExpanded(!fromAccordionExpanded)}
            expanded={fromAccordionExpanded}
          />
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowCircle />
          </Box>

          <Box display="flex" gap={16} mb={12}>
            <SelectButton width={'346px'}>DAI</SelectButton>
            <NumericalInput
              value={toVal}
              onChange={onToVal}
              maxWidth={254}
              subStr="~$568.23"
              subStr2="Balence: 2.35512345 DAI"
            />
          </Box>
          <CurrencyAccordion
            currency={ETHER}
            name="DAI"
            contract="123"
            tokenId="123"
            tokenType="ERC20"
            onChange={() => setToAccordionExpanded(!toAccordionExpanded)}
            expanded={toAccordionExpanded}
          />
          <ActionButton onAction={() => {}} actionText="Swap" error="Select a Token" />
        </Box>
      </AppBody>
    </>
  )
}

function SettingButton({ sx }: { sx: SxProps }) {
  return (
    <IconButton sx={{ backgroundColor: '#F7F7F7', borderRadius: '8px', width: 52, height: 52, ...sx }}>
      <SettingIcon />
    </IconButton>
  )
}

function CurrencyAccordion({
  currency,
  name,
  contract,
  tokenId,
  tokenType,
  expanded,
  onChange
}: {
  currency: Currency
  name: string
  contract: string
  tokenId?: string
  tokenType?: string
  expanded: boolean
  onChange: () => void
}) {
  const theme = useTheme()

  const Tag = styled(Box)({
    borderRadius: '10px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.15 )',
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 12,
    padding: '4px 12px'
  })

  const summary = (
    <Box sx={{ display: 'flex', gap: 19, alignItems: 'center' }}>
      <CurrencyLogo currency={currency} />
      <Box display="grid" gap={8}>
        <Typography color={theme.palette.text.secondary}>Name: {name}</Typography>
        <Typography color={theme.palette.text.secondary}>Contract: {contract}</Typography>
        <Typography color={theme.palette.text.secondary}>Token Id: {tokenId || 'none'}</Typography>
      </Box>

      <Tag>{tokenType}</Tag>
    </Box>
  )

  const details = (
    <Box pt={12}>
      <Typography color={theme.palette.text.secondary}>Supply/Holder: 20000/500</Typography>
      {/* Graph */}
      {/* View accrued fees and analytics or NFTscan */}
    </Box>
  )

  return (
    <Accordion
      summary={summary}
      details={details}
      expanded={expanded}
      onChange={onChange}
      iconCssOverride={{ right: 0, bottom: 0, position: 'absolute' }}
    />
  )
}
