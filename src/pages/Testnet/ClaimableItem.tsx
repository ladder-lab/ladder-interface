import { Box, Link, Typography, useTheme } from '@mui/material'
// import Image from 'components/Image'
import { Token } from 'constants/token'
import useBreakpoint from 'hooks/useBreakpoint'
import { useIsDarkMode } from 'state/user/hooks'
import { addTokenToMetamask, getEtherscanLink } from 'utils'
import { ReactComponent as Explore } from 'assets/svg/explore.svg'

export default function ClaimableItem({
  token,
  nftInfo,
  amount,
  claimable
}: {
  token?: Token
  nftInfo?: { name: string }
  amount: string
  claimable: string
}) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('sm')
  const isDarkMode = useIsDarkMode()

  return (
    <>
      <Box
        display={'flex'}
        alignItems="center"
        sx={{
          justifyContent: { xs: 'space-between', sm: 'unset' }
        }}
      >
        {/* <Image src="" width={36} height={36}></Image> */}
        <Box display={'flex'} alignItems="center">
          {token ? (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill={isDarkMode ? 'rgba(31, 152, 152, 0.1)' : '#CDEAEA'} />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill={isDarkMode ? 'rgba(31, 152, 152, 0.1)' : '#CDEAEA'} />
              <path
                d="M17.9986 13.6301L13.623 18.0059L17.9992 22.3819L22.3748 18.0061L17.9986 13.6301Z"
                fill="#1F9898"
              />
              <path
                d="M23.8365 19.4609L19.46 23.8366L21.8762 26.2524H26.2533V21.8765L23.8365 19.4609Z"
                fill="#1F9898"
              />
              <path
                d="M12.1676 19.4609L9.74951 21.8784V26.2524H14.1273L16.5435 23.8366L12.1676 19.4609Z"
                fill="#1F9898"
              />
              <path d="M16.5435 12.1687L14.1255 9.75H9.74951V14.1259L12.1676 16.5446L16.5435 12.1687Z" fill="#1F9898" />
              <path d="M21.8774 9.75L19.46 12.1687L23.8356 16.5455L26.2524 14.1278V9.75H21.8774Z" fill="#1F9898" />
            </svg>
          )}

          <Typography ml={10} fontWeight={600} mr={10} color={theme.palette.text.secondary}>
            {token ? `${token.name}(${token.symbol})` : nftInfo?.name || ''}
          </Typography>
        </Box>
        {token && (
          <Link sx={{ mt: 4 }} href={getEtherscanLink(token.chainId, token.address, 'address')} target="_blank">
            <Explore />
          </Link>
        )}
      </Box>
      <Typography sx={{ mb: { xs: 15, sm: 0 } }} fontWeight={600} color={theme.palette.text.secondary}>
        Amount: <span style={{ color: theme.palette.info.main }}>{claimable}</span>/{amount} Claimable
      </Typography>
      {!isDownMd && (
        <>
          {token ? (
            <Typography
              textAlign={'right'}
              onClick={() => addTokenToMetamask(token.address, token.symbol || 'token', token.decimals)}
              sx={{ cursor: 'pointer' }}
              fontWeight={600}
              color={theme.palette.info.main}
            >
              Import Token
            </Typography>
          ) : (
            <div />
          )}
        </>
      )}
    </>
  )
}
