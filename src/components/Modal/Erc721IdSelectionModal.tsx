import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { Token721 } from 'constants/token/token721'
import { useIsDarkMode } from 'state/user/hooks'
import Modal from '.'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { Loader } from 'components/AnimatedSvg/Loader'
import useBreakpoint from 'hooks/useBreakpoint'
import LogoText from 'components/LogoText'
import { ExternalLink } from 'theme/components'
import { ReactComponent as Xcircle } from 'assets/svg/xcircle.svg'
// import { ReactComponent as XcircleSm } from 'assets/svg/xcirclesm.svg'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ReactComponent as ExternalIcon } from 'assets/svg/external_arrow.svg'
import { useCallback, useEffect, useState } from 'react'
import { useToken721Balance, useToken721BalanceTokens } from 'state/wallet/hooks'
import { shortenAddress } from 'utils'
import { useERC721Tokens } from 'state/swap/useSwap721State'

export default function Erc721IdSelectionModal({
  isOpen,
  onDismiss,
  collection,
  onSelectSubTokens,
  amount
}: {
  isOpen: boolean
  onDismiss: () => void
  collection?: Token721
  onSelectSubTokens: (tokens: Token721[]) => void
  amount: number
}) {
  const isDownMd = useBreakpoint('md')

  const { onClearTokens, onRemoveToken, onAddToken, tokens } = useERC721Tokens()

  const balance = useToken721Balance(collection)
  const { loading, availableTokens } = useToken721BalanceTokens(balance)

  const [filteredAvailableTokens, setFilteredAvailableTokens] = useState(availableTokens)

  const onConfirm = useCallback(() => {
    if (!collection || tokens.length !== amount) {
      return
    }
    onSelectSubTokens && onSelectSubTokens([...tokens])
    const tokenIds = tokens.map(({ tokenId }) => tokenId)
    setFilteredAvailableTokens(prev => {
      return prev?.filter(token => !tokenIds.includes(token.tokenId))
    })
    onDismiss()
  }, [amount, collection, onDismiss, onSelectSubTokens, tokens])

  useEffect(() => {
    onClearTokens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, availableTokens, amount])

  useEffect(() => {
    setFilteredAvailableTokens(availableTokens)
  }, [availableTokens])
  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box sx={{ overflow: 'auto', height: isDownMd ? 357 : 500 }}>
        <Box margin="20px 0" display="grid" gap={20}>
          <Box>
            {tokens.length > 0 && (
              <Box width="100%" mt={28}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 12, mb: 24 }}>
                  <Typography>Collection:</Typography>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      background: theme => theme.palette.background.default,
                      padding: '11px 18px',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      height: 52
                    }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                      {collection?.name} <ExternalIcon />
                    </Typography>
                    {/* <XcircleSm onClick={onRemoveCollection} style={{ cursor: 'pointer' }} /> */}
                  </Box>
                </Box>
                {tokens.map((token, idx) => (
                  <Box
                    key={`${token.symbol}-${idx}`}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <LogoText logo={<CurrencyLogo currency={token} />} text={token.name} fontSize={12} />
                    <ExternalLink href={'#'} showIcon sx={{ fontSize: 12 }}>
                      {token.address}
                    </ExternalLink>
                    <Typography sx={{ fontSize: 12 }}>Quantity: 1</Typography>
                    <IconButton onClick={() => onRemoveToken(token)}>
                      <Xcircle />
                    </IconButton>
                  </Box>
                ))}
                <Box margin="28px 0" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button onClick={onConfirm} sx={{ height: 60, width: 300 }} disabled={tokens.length < amount}>
                    {tokens.length === amount
                      ? `${tokens.length}/${amount} Confirm`
                      : `${amount} NFTs should be chosen`}
                  </Button>
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Typography>Collection:</Typography>
              <Box
                sx={{
                  borderRadius: '8px',
                  background: theme => theme.palette.background.default,
                  padding: '11px 23px'
                }}
              >
                {collection?.name}
              </Box>
              <ExternalLink href={'#'} showIcon sx={{ fontSize: 12 }}>
                {collection ? shortenAddress(collection.address) : ''}
              </ExternalLink>
            </Box>
          </Box>
          <Box sx={{ overflow: 'auto', minHeight: 290 }} position="relative">
            {loading ? (
              <Box width={'100%'} display="flex" mt={20} alignItems="center" justifyContent="center">
                <Loader />
              </Box>
            ) : (
              <Box
                display="grid"
                gridTemplateColumns={'repeat(auto-fit, 140px)'}
                width="100%"
                gap={10}
                justifyContent="center"
              >
                {filteredAvailableTokens?.map(token => (
                  <NftCard
                    key={token.tokenId}
                    token={token}
                    onClick={() => {
                      onAddToken(token)
                    }}
                    disabled={tokens.length >= amount}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

function NftCard({ token, onClick, disabled }: { token: Token721; onClick: () => void; disabled: boolean }) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        alignItems: 'center',
        borderRadius: '8px',
        background: isDarkMode ? '#15171A' : '#F6F6F6',
        transition: '0.5s',
        cursor: 'pointer',
        opacity: disabled ? 0.8 : 1,
        '&:hover': disabled
          ? {}
          : {
              boxShadow: isDarkMode ? 'none' : '0px 3px 10px rgba(0, 0, 0, 0.15)',
              background: isDarkMode ? '#2E3133' : '#FFFFFF',
              cursor: 'pointer'
            }
      }}
    >
      <Image src={token?.uri ?? SampleNftImg} style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }} />
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: 12,
          fontWeight: 600,
          mt: 8,

          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        {token.name ?? ''}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, fontWeight: 600, mb: 8 }}>
        #{token.tokenId ?? ''}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {shortenAddress(token.address) ?? ''}
      </Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        <span style={{ color: theme.palette.text.secondary }}>balance: </span> 1
      </Typography>
    </Box>
  )
}
