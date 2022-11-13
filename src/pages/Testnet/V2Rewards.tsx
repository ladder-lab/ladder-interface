import { Box, useTheme, styled, Typography, Link, linearProgressClasses, LinearProgress } from '@mui/material'
import RankingImg from 'assets/images/testv2_user_ranking.png'
import Copy from 'components/essential/Copy'
import QuestionHelper from 'components/essential/QuestionHelper'
import Modal from 'components/Modal'
import { Timer } from 'components/Timer'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useAccountTestInfo, useRankingAssetsList, useRankingTransferList, useRankingTVLList } from 'hooks/useTestnetV2'
import StatTable, { TableHeadCellsProp, TableRowCellsProp } from 'pages/Statistics/StatTable'
import { useMemo } from 'react'
import { useIsDarkMode } from 'state/user/hooks'
import { formatMillion, getEtherscanLink, shortenAddress } from 'utils'
import { v2ActiveTimeStamp } from '.'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const BorderLinearProgress = styled(LinearProgress)(({ dark }: { dark: boolean }) => ({
  height: 6,
  borderRadius: 12,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: dark ? '#3F4B4B' : '#E6F2F2'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1F9898'
  }
}))

export default function V2Rewards() {
  const curChainId = ChainId.SEPOLIA
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const accountTestInfo = useAccountTestInfo(curChainId, account || undefined)
  const data = useMemo(
    () => [
      {
        name: 'TVL',
        helperText: 'Data updated daily',
        value: accountTestInfo ? formatMillion(accountTestInfo.tvl, '$ ', 2) : '-'
      },
      {
        name: 'Assets',
        helperText: 'Data is updated hourly',
        value: accountTestInfo ? formatMillion(accountTestInfo.assets, '$ ', 2) : '-'
      },
      {
        name: 'Transitions',
        helperText: 'Data is updated hourly',
        value: accountTestInfo ? accountTestInfo.transfers : '-'
      }
    ],
    [accountTestInfo]
  )

  function makeHeaders(threeTitle: string): TableHeadCellsProp[] {
    return [
      {
        label: (
          <Typography color={'#1F9898'} fontSize={16}>
            #
          </Typography>
        )
      },
      {
        label: (
          <Typography color={'#1F9898'} fontSize={16}>
            Address
          </Typography>
        ),
        align: 'left'
      },
      {
        label: (
          <Typography color={'#1F9898'} fontSize={16}>
            {threeTitle}
          </Typography>
        )
      }
    ]
  }

  const rankingTVLList = useRankingTVLList(curChainId, account || undefined)
  const rankingTVLListHeaders = useMemo(() => makeHeaders('TVL'), [])
  const rankingTVLListRows: TableRowCellsProp[][] = useMemo(() => {
    return rankingTVLList.result.list.map(item => [
      { label: item.rank },
      {
        label: (
          <Box display={'flex'} alignItems="center" key={1}>
            <Link target={'_blank'} href={getEtherscanLink(curChainId, item.account, 'address')}>
              {shortenAddress(item.account)}
            </Link>
            <Copy toCopy={item.account} />
          </Box>
        )
      },
      {
        label: <Typography key={2}>{formatMillion(Number(item.tvl), '$ ', 2)}</Typography>
      }
    ])
  }, [curChainId, rankingTVLList.result.list])

  const rankingAssetsList = useRankingAssetsList(curChainId, '0x794e949aaa0ac04e7ffa1d66a59052486aee2a5f')
  const rankingAssetsListHeaders = useMemo(() => makeHeaders('Asset Number'), [])
  const rankingAssetsListRows: TableRowCellsProp[][] = useMemo(() => {
    return rankingAssetsList.result.list.map(item => [
      { label: item.rank },
      {
        label: (
          <Box display={'flex'} alignItems="center" key={1}>
            <Link target={'_blank'} href={getEtherscanLink(curChainId, item.account, 'address')}>
              {shortenAddress(item.account)}
            </Link>
            <Copy toCopy={item.account} />
          </Box>
        )
      },
      {
        label: <Typography key={2}>{formatMillion(Number(item.asset), '$ ', 2)}</Typography>
      }
    ])
  }, [curChainId, rankingAssetsList.result.list])

  const rankingTransferList = useRankingTransferList(curChainId, account || undefined)
  const rankingTransferListHeaders = useMemo(() => makeHeaders('Transfer Number'), [])
  const rankingTransferListRows: TableRowCellsProp[][] = useMemo(() => {
    return rankingTransferList.result.list.map(item => [
      { label: item.rank },
      {
        label: (
          <Box display={'flex'} alignItems="center" key={1}>
            <Link target={'_blank'} href={getEtherscanLink(curChainId, item.account, 'address')}>
              {shortenAddress(item.account)}
            </Link>
            <Copy toCopy={item.account} />
          </Box>
        )
      },
      {
        label: <Typography key={2}>{item.transfers}</Typography>
      }
    ])
  }, [curChainId, rankingTransferList.result.list])

  return (
    <Box>
      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
          mt: { md: 40, xs: 20 },
          gap: { md: '30px', xs: '20px' }
        }}
      >
        {data.map(item => (
          <Box
            key={item.name}
            sx={{
              background: `url(${RankingImg}) no-repeat`,
              padding: '6px',
              backgroundSize: '100% 100%'
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '30px 20px',
                borderRadius: '16px'
              }}
            >
              <RowBetween>
                <Typography color={theme.palette.text.secondary} fontSize={16}>
                  <RowBetween>
                    {item.name} <QuestionHelper style={{ marginLeft: 5 }} text={item.helperText} />
                  </RowBetween>
                </Typography>
                <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
                  {item.value}
                </Typography>
              </RowBetween>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: { lg: '1fr 1fr 1fr', md: '1fr 1fr', xs: '1fr' },
          mt: { md: 40, xs: 20 },
          gap: { md: '30px', xs: '20px' }
        }}
      >
        <RankingItem
          index="01"
          lte50={rankingTVLList.result.lte50}
          toggleOpenModal={rankingTVLList.modal.toggleOpenModal}
          title="TVL daily avg top 50% will get LP Provider Winner-Ladder Testnet R2-NFT "
        />
        <RankingItem
          index="02"
          lte50={rankingAssetsList.result.lte50}
          toggleOpenModal={rankingAssetsList.modal.toggleOpenModal}
          title="Top 30% Asset Number will get Trade Winner-NFT "
        />
        <RankingItem
          index="03"
          lte50={rankingTransferList.result.lte50}
          toggleOpenModal={rankingTransferList.modal.toggleOpenModal}
          title="Top 50% Total interaction will get Trade Click Winner-Ladder Testnet R2-NFT"
        />

        <RankingModal
          headers={rankingTVLListHeaders}
          rows={rankingTVLListRows}
          openModal={rankingTVLList.modal.openModal}
          toggleOpenModal={rankingTVLList.modal.toggleOpenModal}
          myRanking={rankingTVLList.result.ranking}
          loading={rankingTVLList.loading}
          page={rankingTVLList.page}
        />
        <RankingModal
          headers={rankingAssetsListHeaders}
          rows={rankingAssetsListRows}
          openModal={rankingAssetsList.modal.openModal}
          toggleOpenModal={rankingAssetsList.modal.toggleOpenModal}
          myRanking={rankingAssetsList.result.ranking}
          loading={rankingAssetsList.loading}
          page={rankingAssetsList.page}
        />
        <RankingModal
          headers={rankingTransferListHeaders}
          rows={rankingTransferListRows}
          openModal={rankingTransferList.modal.openModal}
          toggleOpenModal={rankingTransferList.modal.toggleOpenModal}
          myRanking={rankingTransferList.result.ranking}
          loading={rankingTransferList.loading}
          page={rankingTransferList.page}
        />
      </Box>
    </Box>
  )
}

function RankingModal({
  headers,
  loading,
  rows,
  myRanking,
  openModal,
  toggleOpenModal,
  page
}: {
  rows: TableRowCellsProp[][]
  loading: boolean
  headers: TableHeadCellsProp[]
  myRanking: number | undefined
  openModal: boolean
  toggleOpenModal: () => void
  page: {
    setCurrentPage: (page: number) => void
    currentPage: number
    count: number
    totalPage: number
    pageSize: number
  }
}) {
  const theme = useTheme()
  return (
    <Modal maxWidth="744px" width="100%" customIsOpen={openModal} customOnDismiss={toggleOpenModal}>
      <Box sx={{ padding: { sm: '25px 65px', xs: '20px' } }}>
        <RowBetween>
          <Typography color={'#1F9898'} fontSize={16}>
            Total address:{page.count}
          </Typography>
          <Typography color={'#1F9898'} fontSize={16}>
            My ranking:{myRanking || '--'}
          </Typography>
        </RowBetween>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '12px',
            mt: 30
          }}
        >
          <StatTable
            headers={headers}
            minWidth={400}
            loading={loading}
            rows={rows}
            page={page.currentPage}
            setPage={page.setCurrentPage}
            count={page.count}
            pageSize={page.pageSize}
          />
        </Box>
      </Box>
    </Modal>
  )
}

function RankingItem({
  index,
  title,
  lte50,
  toggleOpenModal
}: {
  toggleOpenModal?: () => void
  index: string
  title: string
  lte50?: boolean
}) {
  const isDark = useIsDarkMode()
  const progress = useMemo(() => {
    const curTime = new Date().getTime()
    const total = v2ActiveTimeStamp[1] - v2ActiveTimeStamp[0]
    const pass = curTime - v2ActiveTimeStamp[0]
    if (pass <= 0) return 0
    return (pass / total) * 100
  }, [])
  return (
    <Box
      sx={{
        backgroundColor: isDark ? '#343739' : '#F0F9F9',
        padding: { sm: '20px 30px', xs: '16px' },
        borderRadius: '12px'
      }}
    >
      <Typography color={isDark ? '#565D62' : '#C3D7D7'} fontSize={28} fontWeight={500}>
        {index}
      </Typography>
      <Typography height={56} color={isDark ? '#E6EAEE' : '#000'} fontSize={16} fontWeight={500} mt={8}>
        {title}
      </Typography>
      <RowBetween mt={10}>
        <RowBetween>
          <Box
            sx={{ width: 8, height: 8, mr: 5, borderRadius: '50%', backgroundColor: lte50 ? '#31B047' : '#FF526F' }}
          />
          <Typography color={'#9AA7A7'} fontWeight={600}>
            {lte50 ? 'My ranking ≤50%' : 'My ranking >50%'}
          </Typography>
        </RowBetween>
        <Link
          color={'#1F9898'}
          onClick={toggleOpenModal}
          fontWeight={600}
          underline="always"
          sx={{ cursor: 'pointer' }}
        >
          Ranking detail
        </Link>
      </RowBetween>
      <Box height={54} mt={20} display="grid" alignItems={'center'}>
        <BorderLinearProgress dark={isDark} variant="determinate" value={progress} />
        <Typography textAlign={'center'} color={'#1F9898'} fontWeight={600}>
          Distance to end: <Timer timer={v2ActiveTimeStamp[1]} />
        </Typography>
      </Box>
    </Box>
  )
}
