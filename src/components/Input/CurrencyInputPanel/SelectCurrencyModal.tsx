import { useState, ChangeEvent, useCallback } from 'react'
import { Box, Typography, ButtonBase } from '@mui/material'
import Modal from 'components/Modal'
import CurrencyList from './CurrencyList'
import Divider from 'components/Divider'
import Input from 'components/Input'
import { Currency } from 'constants/token'
import QuestionHelper from 'components/essential/QuestionHelper'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import LogoText from 'components/LogoText'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ETHER } from 'constants/token/'

export enum Mode {
  TOKEN = 'token',
  NFT = 'nft'
}

export default function SelectCurrencyModal({ onSelectCurrency }: { onSelectCurrency?: (currency: Currency) => void }) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState(Mode.TOKEN)

  // const onManage = useCallback(() => {}, [])

  const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  // useEffect(() => {
  //   if (input !== '') {
  //     return SetMode(Mode.IMPORT)
  //   }

  //   SetMode(Mode.SELECT)
  // }, [input])

  return (
    <>
      <Modal width={'680px'} closeIcon padding="32px">
        <Box width="100%" display="flex" gap={14} alignItems="center">
          <Typography fontSize={24}>Select a token</Typography>
          <QuestionHelper text="..." size={22} />
        </Box>
        <Box display="flex" gap={20} padding="31px 0 30px" alignItems="center">
          <ModeButton selected={mode === Mode.TOKEN} onClick={() => setMode(Mode.TOKEN)}>
            ERC20
          </ModeButton>
          <ModeButton selected={mode === Mode.NFT} onClick={() => setMode(Mode.NFT)}>
            ERC1155
          </ModeButton>
        </Box>

        <Input
          value={input}
          onChange={onInput}
          placeholder="Search by name or paste address"
          outlined
          startAdornment={<SearchIcon />}
        />
        <CommonOptions options={[ETHER]} />
        <Divider />
        <Box paddingTop={'24px'}>
          <CurrencyList mode={mode} currencyOptions={[]} onSelectCurrency={onSelectCurrency} />
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
  onClick
}: {
  children?: React.ReactNode
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        padding: '7px 20px',
        borderRadius: selected ? '10px' : '18px',
        color: selected ? '#1F9898' : ' #9E9E9E',
        boxShadow: selected ? '0px 4px 6px rgba(0, 0, 0, 0.05)' : 'inset 0px 2px 12px rgba(0, 0, 0, 0.1)',
        background: selected ? '#FFFFFF' : '#F8F8F8',
        fontSize: 16
      }}
    >
      {children}
    </ButtonBase>
  )
}

function CommonOptions({ options }: { options: Currency[] }) {
  return (
    <Box display="flex" gap={20} margin="20px 0">
      {options.map(option => (
        <Box
          key={option.symbol}
          sx={{ borderRadius: '8px', background: theme => theme.palette.background.default, padding: '11px 23px' }}
        >
          <LogoText logo={<CurrencyLogo currency={option} />} text={option.symbol} />
        </Box>
      ))}
    </Box>
  )
}
