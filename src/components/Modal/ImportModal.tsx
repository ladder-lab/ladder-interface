import { useState } from 'react'
import Modal from 'components/Modal'
import { Box, Typography, Button, useTheme } from '@mui/material'
import Input from 'components/Input'

export default function ImportModal() {
  const [address, setAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const theme = useTheme()
  return (
    <Modal maxWidth="680px" width="100%" closeIcon onBack={() => {}}>
      <Box padding="24px 32px">
        <Typography fontSize={24} ml={72} mt={12} mb={40}>
          Import
        </Typography>
        <Box display="grid" gap={30} mb={40}>
          <Input
            label="Token Contract address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            helperText="..."
          />
          <Input label="Token ID" value={tokenId} onChange={e => setTokenId(e.target.value)} helperText="..." />
        </Box>
        <Button sx={{ background: theme.gradient.gradient1 }} onClick={() => {}}>
          Import
        </Button>
      </Box>
    </Modal>
  )
}
