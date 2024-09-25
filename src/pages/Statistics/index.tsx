import { Box, useTheme, styled, Typography, Stack } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { routes } from 'constants/routes'
import { StatTokenInfo } from 'hooks/useStatBacked'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrollToElement } from 'utils'
import { useActiveWeb3React } from 'hooks'
import RowBetween from '../../styled/RowBetween'
import { StatTransList } from './StatTransList'
import { TopPoolsList } from './TopPoolsList'
import { TopTokensList } from './TopTokensList'
import { ChainId } from '../../constants/chain'

const StyledTabText = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  cursor: 'pointer',
  ['&.active']: {
    color: theme.palette.common.white,
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#1F9898'
  }
}))

export const StyledTabButtonText = styled(Box)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.background.paper,
  padding: '6px 24px',
  borderRadius: '15px',
  textTransform: 'uppercase',
  marginRight: 8,
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

export enum PoolPairType {
  ERC20_ERC721 = 'ERC20 - ERC721',
  ERC20_ERC1155 = 'ERC20 - ERC1155',
  ERC20_ERC20 = 'ERC20 - ERC20'
}

export default function Statistics() {
  const { chainId } = useActiveWeb3React()
  const curChainId = useMemo(() => chainId || ChainId.SEPOLIA, [chainId])

  const theme = useTheme()
  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1300px',
            padding: { sm: 0, xs: '0 15px' },
            margin: 'auto'
          }}
        >
          <RowBetween padding="20px 24px">
            <RowBetween width={'100%'} flexWrap={'wrap'}>
              <Stack direction={'row'} spacing={24} alignItems="center">
                <StyledTabText className="active" onClick={() => scrollToElement('Overview')}>
                  Overview
                </StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopTokens')}>Tokens</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopPools')}>Pools</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('Transactions')}>Transactions</StyledTabText>
              </Stack>

              {/*            {open && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 1,
                    background: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'
                  }}
                ></Box>
              )}*/}
              {/*
              <Box display={'flex'} alignItems="center" sx={{ mt: { sm: 0, xs: 15 } }}>
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                  <Box ml={10}>
                    <Input
                      value={searchText}
                      height="40px"
                      placeholder="Contract Address"
                      onChange={e => setSearchText(e.target.value)}
                      aria-describedby={popperId}
                      onClick={handleClick}
                    />
                    <Popper
                      placement="bottom-end"
                      id={popperId}
                      open={open}
                      anchorEl={anchorEl}
                      sx={{
                        zIndex: theme.zIndex.tooltip,
                        width: '100%',
                        maxWidth: 400
                      }}
                    >
                      <SearchBox searchText={searchText} chainId={curChainId} />
                    </Popper>
                  </Box>
                </ClickAwayListener>
              </Box>
*/}
            </RowBetween>
          </RowBetween>
        </Box>
      </Box>

      <Stack
        spacing={28}
        sx={{
          width: '100%',
          padding: { sm: 30, xs: '20px 15px' },
          maxWidth: '1144px',
          margin: '30px auto 80px'
        }}
      >
        {/* <OverviewData chainId={curChainId} /> */}

        <TopTokensList chainId={curChainId} />

        <TopPoolsList chainId={curChainId} defaultPoolPairType={null} />

        <StatTransList chainId={curChainId} />
      </Stack>
    </Box>
  )
}

export function ShowTopPoolsCurrencyBox({
  token0Info,
  token1Info,
  fontSize,
  fontWeight,
  pair,
  color,
  chainId
}: {
  token0Info: StatTokenInfo
  token1Info: StatTokenInfo
  pair: string
  chainId: ChainId
  fontSize?: number
  fontWeight?: number
  color?: string
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box
      display={'flex'}
      alignItems="center"
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        navigate(`${routes.statisticsPools}/${chainId}/${pair}`)
      }}
    >
      <CurrencyLogo
        size={fontSize ? fontSize + 'px' : '24px'}
        logoUrl={token0Info.logo}
        currencySymbol={token0Info.symbol}
      />
      <CurrencyLogo
        size={fontSize ? fontSize + 'px' : '24px'}
        style={{ marginLeft: -8 }}
        logoUrl={token1Info.logo}
        currencySymbol={token1Info.symbol}
      />
      {token0Info.symbol.length > 4 ? (
        <Typography
          noWrap
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          {token0Info.symbol}
        </Typography>
      ) : (
        <Typography
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          {token0Info.symbol}
        </Typography>
      )}
      {token0Info.type === Mode.ERC1155 && (
        <Typography
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          #{token0Info.tokenId}
        </Typography>
      )}
      <Typography
        noWrap
        fontSize={fontSize ? fontSize : 14}
        fontWeight={fontWeight ? fontWeight : 400}
        color={color || theme.palette.text.primary}
      >
        /{token1Info.symbol}
      </Typography>
      {token1Info.type === Mode.ERC1155 && (
        <Typography
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          #{token1Info.tokenId}
        </Typography>
      )}
    </Box>
  )
}
