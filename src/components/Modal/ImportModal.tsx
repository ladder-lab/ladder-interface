import { useCallback, useEffect, useState } from 'react'
import Modal from 'components/Modal'
import { Box, Typography } from '@mui/material'
import Input from 'components/Input'
import { NFT } from 'models/allTokens'
import { useAddUserToken } from 'state/user/hooks'
import { useActiveWeb3React } from 'hooks'
import { useNFTDataCb } from 'hooks/useNFTDataCb'
import { isAddress } from 'utils'
import ActionButton from 'components/Button/ActionButton'
import useModal from 'hooks/useModal'

export default function ImportModal({
  onImport,
  isOpen,
  onDismiss
}: {
  onImport: (nft: NFT) => void
  isOpen?: boolean
  onDismiss?: () => void
}) {
  const [tokenId, setTokenId] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [error, setError] = useState('')

  const { hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const addToken = useAddUserToken()

  const nftRes = useNFTDataCb(contractAddress, tokenId)

  const handleImport = useCallback(() => {
    if (!nftRes) return
    /*  if (nftRes.error) {
      showModal(<ImportFailedModal />)
      return
    } */
    if (nftRes.nft) {
      addToken(nftRes.nft)
      onImport(nftRes.nft)
    }
  }, [addToken, nftRes, onImport])

  useEffect(() => {
    if (!account) return setError('Please connect to wallet first')
    if (contractAddress === '') return setError('Enter token contract address')
    if (!isAddress(contractAddress)) return setError('Invalid contract address')
    if (tokenId === '') return setError('Enter token ID')
    if (nftRes?.nft?.name === undefined) return setError(`Token doesnt exist`)

    setError('')
  }, [account, contractAddress, nftRes?.nft?.name, tokenId])

  return (
    <Modal maxWidth="680px" width="100%" closeIcon onBack={hideModal} customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="24px 32px">
        <Typography fontSize={24} ml={72} mt={12} mb={40}>
          Import
        </Typography>
        <Box display="grid" gap={30} mb={40}>
          <Input
            label="Token Contract Address"
            value={contractAddress}
            onChange={e => setContractAddress(e.target.value)}
            helperText="..."
          />
          <Input label="Token ID" value={tokenId} onChange={e => setTokenId(e.target.value)} helperText="..." />
        </Box>
        <ActionButton
          pending={nftRes.loading}
          pendingText={'Importing'}
          actionText={'Import'}
          onAction={handleImport}
          error={error || nftRes.error || undefined}
          disableAction={!nftRes.nft || !account}
        />
      </Box>
    </Modal>
  )
}
