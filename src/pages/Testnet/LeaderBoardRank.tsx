import { Box, Typography, useTheme } from '@mui/material'
import useBreakpoint from '../../hooks/useBreakpoint'
import { useActiveWeb3React } from '../../hooks'
import QuestionHelper from '../../components/essential/QuestionHelper'
import V3TestnetTable from '../../components/Table/V3TestnetTable'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export function LeaderBoardRank({
  headers,
  rows,
  bgcolors,
  title,
  helper,
  minHeight,
  page,
  setPage,
  totalPage
}: {
  headers?: string[]
  title: string
  rows: (string | number | JSX.Element)[][]
  bgcolors?: string[]
  minHeight?: number
  helper?: string
  page: number
  setPage: (page: number) => void
  totalPage: number
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const arrowBtnSx = {
    width: '24px',
    height: '24px',
    padding: '6px',
    ':hover': {
      cursor: 'pointer'
    }
  }
  return (
    <Box>
      <Box
        sx={{
          padding: '1.4px',
          borderRadius: '12px'
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '12px',
            minHeight: minHeight || {
              md: account ? 850 : 776,
              xs: 'unset'
            },
            maxWidth: '100%',
            overflowX: 'auto'
          }}
        >
          <Typography display={'flex'} alignItems="center" fontWeight={700} fontSize={18} padding={'15px 24px'}>
            {title}
            {helper && <QuestionHelper style={{ marginLeft: 5 }} text={helper} />}
          </Typography>
          <V3TestnetTable
            fontSize={isSmDown ? '12px' : '16px'}
            bgcolors={bgcolors}
            rows={rows}
            header={headers || ['#', 'User', 'Value']}
          ></V3TestnetTable>
          <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'} mt={30}>
            <ArrowBackIosIcon
              sx={{
                ...arrowBtnSx,
                color: page > 1 ? '#1F9898' : 'inherit',
                opacity: page > 1 ? 1 : 0.3
              }}
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1)
                }
              }}
            />
            <Typography>
              Page {page} of {totalPage}
            </Typography>
            <ArrowForwardIosIcon
              sx={{
                ...arrowBtnSx,
                color: page < totalPage ? '#1F9898' : 'inherit',
                opacity: page < totalPage ? 1 : 0.3
              }}
              onClick={() => {
                if (page < totalPage) {
                  setPage(page + 1)
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
