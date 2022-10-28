import { Box, useTheme, styled, Typography, Stack } from '@mui/material'
import { StyledPollingDot } from 'components/essential/Polling'
import Pagination from 'components/Pagination'
import Table from 'components/Table'
import { scrollToElement } from 'utils'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

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

const StyledTabButtonText = styled(Box)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.background.paper,
  padding: '6px 16px',
  borderRadius: '15px',
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

export default function Statistics() {
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
            margin: 'auto'
          }}
        >
          <RowBetween padding="12px 0">
            <Box display={'flex'} alignItems="center">
              <Box
                display={'flex'}
                sx={{
                  padding: '6px 12px',
                  backgroundColor: theme.color.color3,
                  borderRadius: '8px',
                  mr: 12
                }}
              >
                <Typography fontSize={12} fontWeight={500} color={theme.palette.text.secondary}>
                  Latest synced block:
                </Typography>
                <Typography ml={6} fontSize={12} fontWeight={500} color="#27AE60">
                  15095147{' '}
                </Typography>
                <StyledPollingDot />
              </Box>
              <Typography ml={16}>ETH Price: $1.18k</Typography>
            </Box>
          </RowBetween>
          <RowBetween padding="20px 0">
            <RowBetween>
              <Stack direction={'row'} spacing={24} alignItems="center">
                <StyledTabText className="active" onClick={() => scrollToElement('TopTokens')}>
                  Overview
                </StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopPools')}>Pools</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopTokens')}>Tokens</StyledTabText>
              </Stack>
            </RowBetween>
          </RowBetween>
        </Box>
      </Box>

      <Stack
        spacing={28}
        sx={{
          width: '100%',
          maxWidth: '1144px',
          margin: '30px auto 80px'
        }}
      >
        <Box id="TopTokens">
          <RowBetween mb={18}>
            <Stack direction={'row'} spacing={8} alignItems="center">
              <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
                Top Tokens
              </Typography>
              <StyledTabButtonText className="active">ERC20</StyledTabButtonText>
              <StyledTabButtonText>ERC1155</StyledTabButtonText>
            </Stack>
            <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary}>
              Explore
            </Typography>
          </RowBetween>
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px'
            }}
          >
            <Table header={['#', 'Name', 'Price', 'Price Change', 'Volume 24H', 'TVL']} rows={[[1, 1, 1, 1, 1]]} />
            <Box
              sx={{
                padding: '30px 20px'
              }}
            >
              <Pagination count={2} page={1} perPage={10} total={13} />
            </Box>
          </Box>
        </Box>

        <Box id="TopPools">
          <RowBetween mb={18}>
            <Stack direction={'row'} spacing={8} alignItems="center">
              <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
                Top Pools
              </Typography>
              <StyledTabButtonText className="active">ERC20 - ERC20</StyledTabButtonText>
              <StyledTabButtonText>ERC20 - ERC1155</StyledTabButtonText>
              <StyledTabButtonText>ERC1155 - ERC1155</StyledTabButtonText>
            </Stack>
            <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary}>
              Explore
            </Typography>
          </RowBetween>
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px'
            }}
          >
            <Table header={['#', 'Name', 'Price', 'Price Change', 'Volume 24H', 'TVL']} rows={[[1, 1, 1, 1, 1]]} />
            <Box
              sx={{
                padding: '30px 20px'
              }}
            >
              <Pagination count={2} page={1} perPage={10} total={13} />
            </Box>
          </Box>
        </Box>

        <Box id="Transactions">
          <RowBetween mb={18}>
            <Stack direction={'row'} spacing={8} alignItems="center">
              <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
                Transactions
              </Typography>
            </Stack>
          </RowBetween>
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '12px'
            }}
          >
            <Table header={['#', 'Name', 'Price', 'Price Change', 'Volume 24H', 'TVL']} rows={[[1, 1, 1, 1, 1]]} />
            <Box
              sx={{
                padding: '30px 20px'
              }}
            >
              <Pagination count={2} page={1} perPage={10} total={13} />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
