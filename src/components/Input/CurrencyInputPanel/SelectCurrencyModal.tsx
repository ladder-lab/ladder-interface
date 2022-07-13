import { useState, ChangeEvent, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import Modal from 'components/Modal'
import CurrencyList from './CurrencyList'
import Divider from 'components/Divider'
import Input from 'components/Input'
import { Currency } from 'constants/token'
import QuestionHelper from 'components/essential/QuestionHelper'

export enum Mode {
  TOKEN = 'token',
  NFT = 'nft'
}

export default function SelectCurrencyModal({ onSelectCurrency }: { onSelectCurrency?: (currency: Currency) => void }) {
  const [input, setInput] = useState('')
  const [mode] = useState(Mode.TOKEN)

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
      <Modal width={'680px'} closeIcon>
        <Box width="100%" display="flex" padding="32px" gap={14} alignItems="center">
          <Typography fontSize={24}>Select a token</Typography>
          <QuestionHelper text="..." size={22} />
        </Box>
        <Box padding="0 32px 23px 32px">
          <Input value={input} onChange={onInput} placeholder="Search by name or paste address" outlined />
        </Box>
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
