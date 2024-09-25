import { useIsDarkMode } from '../../state/user/hooks'
import { ChainId } from '../../constants/chain'
import {
  convertWeiToEther,
  formatMillion,
  getUTC0MondayMidnightTimestamp,
  isAddress,
  shortenAddress
} from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AccountRankValues } from '../../hooks/useTestnetV4'
import { Box, MenuItem, Select, Typography, useTheme } from '@mui/material'
import { Axios } from '../../utils/axios'
// import { StyledTabButtonText } from '../Statistics'
import { LeaderBoardRank } from './LeaderBoardRank'
import { useUserQueries } from '../../graphql/useUsersQueries'

function MyRankItem({ num }: { num?: string | number }) {
  const theme = useTheme()
  return (
    <Typography textAlign="center" sx={{ width: 40, top: 10, fontSize: 16, color: theme.palette.text.primary }}>
      <span style={{ color: theme.palette.text.secondary }}>You </span>#{num}
    </Typography>
  )
}
enum UserOrderBy {
  'Liquidity' = 'liquidity',
  'Volume' = 'volume'
}

export function LeaderBoardBox() {
  const isDarkMode = useIsDarkMode()
  const chainId = ChainId.SEPOLIA
  const curWeekTime = getUTC0MondayMidnightTimestamp()
  const prevWeekTime = curWeekTime - 86400 * 7
  const { account } = useActiveWeb3React()

  const [currentType, setType] = useState('Total')
  const [timestamp, setTimestamp] = useState<string>('0')
  const [assetsPage, setAssetsPage] = useState(1)
  const [liquidityPage, setLiquidityPage] = useState(1)
  const [volumePage, setVolumePage] = useState(1)

  const [accountAssetsRank, setAccountAssetsRank] = useState<AccountRankValues>()
  const [accountLiquidityRank, setAccountLiquidityRank] = useState<AccountRankValues>()
  const [accountVolumeRank, setAccountVolumeRank] = useState<AccountRankValues>()

  const [accountAssetsRankList, setAccountAssetsRankList] = useState<AccountRankValues[]>([])
  const [accountLiquidityRankList, setAccountLiquidityRankList] = useState<AccountRankValues[]>([])
  const [accountVolumeRankList, setAccountVolumeRankList] = useState<AccountRankValues[]>([])

  const [assetsTotalPage, setAssetsTotalPage] = useState(1)
  const [liquidityTotalPage, setLiquidityTotalPage] = useState(1)
  const [volumeTotalPage, setVolumeTotalPage] = useState(1)

  const theme = useTheme()

  const { result: liquidityResult } = useUserQueries({
    pageSize: 10,
    timestamp,
    currentPage: liquidityPage,
    orderBy: UserOrderBy.Liquidity
  })
  const prevLiquidityResultRef = useRef()

  useEffect(() => {
    const liquidityList: any = liquidityResult.map((item: any, index: number) => ({
      value: convertWeiToEther(item.liquidity),
      rank: accountLiquidityRankList.length === 0 ? index + 1 : accountLiquidityRankList.length + index,
      account: item.id
    }))
    setAccountLiquidityRankList(liquidityList)
    const accountRank = liquidityResult.findIndex((item: any) => isAddress(item.id) === account)
    setAccountLiquidityRank({
      account: account || '',
      rank: accountRank === -1 ? '-' : accountRank + 1,
      value: convertWeiToEther(liquidityResult.find((item: any) => isAddress(item.id) === account)?.liquidity || 0)
    })
    // setLiquidityTotalPage(liquidityList.length)
    prevLiquidityResultRef.current = liquidityResult
  }, [liquidityResult, account, accountLiquidityRankList])

  const { result: volumeResult } = useUserQueries({
    pageSize: 10,
    timestamp,
    currentPage: volumePage,
    orderBy: UserOrderBy.Volume
  })
  const prevVolumeResultRef = useRef()
  useEffect(() => {
    const volumeList: any = volumeResult.map((item: any, index: number) => ({
      value: convertWeiToEther(item.volume),
      rank: accountVolumeRankList.length === 0 ? index + 1 : accountVolumeRankList.length + index,
      account: item.id
    }))
    setAccountVolumeRankList(volumeList)
    const accountRank = volumeResult.findIndex((item: any) => isAddress(item.id) === account)
    setAccountVolumeRank({
      account: account || '',
      rank: accountRank === -1 ? '-' : accountRank + 1,
      value: convertWeiToEther(volumeResult.find((item: any) => isAddress(item.id) === account)?.volume || 0)
    })
    // setVolumeTotalPage(volumeList.length)
    prevVolumeResultRef.current = volumeResult
  }, [volumeResult, account, accountVolumeRankList])

  const getAssetValue = async () => {
    if (!chainId) return setAccountAssetsRankList([])
    try {
      const { data } = await Axios.get('/getAssetValue', {
        walletAddress: account || '',
        page: 1
      })

      if (data.users) {
        setAccountAssetsRankList(
          data.users.map((item: any) => {
            return {
              value: convertWeiToEther(item.assetValue.replace('.00', '')),
              rank: item.rank,
              account: item.walletAddress
            }
          })
        )
        const index = data.users.findIndex(i => i.walletAddress === account)
        setAccountAssetsRank({
          account: account || '',
          rank: index > -1 ? data.requestedUser.rank : '-',
          value: convertWeiToEther(data.requestedUser.assetValue.replace('.00', ''))
        })
      }
    } catch (error) {
      console.error('fetchRankData', error)
      setAccountAssetsRankList([])
      setAccountAssetsRank({})
    }
  }

  useEffect(() => {
    getAssetValue()
  }, [account, assetsPage, chainId])

  const createRankData = (rankList: AccountRankValues[], accountRankData?: AccountRankValues) => {
    const ret = rankList.map(item => [
      item.rank,
      shortenAddress(item.account),
      formatMillion(Number(item.value) || 0, '$ ', 2)
    ])
    if (account) {
      ret.unshift([
        <MyRankItem num={accountRankData?.rank || '-'} key={1} />,
        shortenAddress(account),
        accountRankData ? formatMillion(Number(accountRankData.value), '$ ', 2) : '-'
      ])
    }
    return ret
  }

  const topAssetsValue = useMemo(
    () => createRankData(accountAssetsRankList, accountAssetsRank),
    [account, accountAssetsRank, accountAssetsRankList]
  )
  const topLiquidityValue = useMemo(
    () => createRankData(accountLiquidityRankList, accountLiquidityRank),
    [account, accountLiquidityRank, accountLiquidityRankList]
  )
  const topVolumeTraded = useMemo(
    () => createRankData(accountVolumeRankList, accountVolumeRank),
    [account, accountVolumeRank, accountVolumeRankList]
  )

  const bgcolors = useMemo(() => {
    const baseColors = [
      'linear-gradient(96.44deg, #D8FF2033 5.94%, #99F7F433 97.57%)',
      'linear-gradient(96.44deg, #D8FF2026 5.94%, #99F7F426 97.57%)',
      'linear-gradient(96.44deg, #D8FF2017 5.94%, #99F7F417 97.57%)'
    ]
    if (isDarkMode) {
      baseColors.forEach((color, index) => (baseColors[index] = color.replace('88', '33')))
    }
    if (account) baseColors.unshift('rgba(31, 152, 152, 0.1)')
    return baseColors
  }, [account, isDarkMode])
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
        {/*
        <Box display={'flex'} gap={20}>
          {['Total', 'Weekly'].map(item => (
            <StyledTabButtonText
              key={item}
              className={item === currentType ? 'active' : ''}
              onClick={() => {
                setType(item)
                setTimestamp(item === 'Total' ? '0' : prevWeekTime.toString())
                setAssetsPage(1)
                setLiquidityPage(1)
                setVolumePage(1)
              }}
              sx={{
                height: '33px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {item}
            </StyledTabButtonText>
          ))}
        </Box>
*/}
        {currentType == 'Weekly' && (
          <Select
            sx={{
              height: '33px',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '6px 24px'
            }}
            onChange={event => {
              setTimestamp(event.target.value)
            }}
            value={timestamp}
          >
            {/* <MenuItem value={curWeekTime.toString()}>This Week</MenuItem> */}
            <MenuItem value={prevWeekTime.toString()}>Last Week</MenuItem>
            <MenuItem value={'1679241600'}>Mar 20 - Mar 26, 2023</MenuItem>
            <MenuItem value={'1678636800'}>Mar 13 - Mar 19, 2023</MenuItem>
          </Select>
        )}
      </Box>
      <Box
        sx={{
          mt: 10,
          gap: 20,
          display: 'grid',
          gridTemplateColumns: {
            lg: '1fr 1fr 1fr',
            md: '1fr 1fr',
            xs: '1fr'
          }
        }}
      >
        <LeaderBoardRank
          rows={topAssetsValue}
          bgcolors={bgcolors}
          title="Top Asset Value"
          helper={currentType == 'Weekly' ? 'Update every Monday' : 'Update daily'}
          page={assetsPage}
          setPage={setAssetsPage}
          totalPage={assetsTotalPage}
        />
        <LeaderBoardRank
          rows={topLiquidityValue}
          bgcolors={bgcolors}
          title="Top Liquidity Provided"
          // helper="Update once an hour"
          helper={currentType == 'Weekly' ? 'Update every Monday' : 'Update once an hour'}
          page={liquidityPage}
          setPage={setLiquidityPage}
          totalPage={liquidityTotalPage}
        />
        <LeaderBoardRank
          rows={topVolumeTraded}
          bgcolors={bgcolors}
          title="Top Volume Traded"
          // helper={currentType == 'Weekly' ? 'Update every Monday' : 'Update once an hour'}
          page={volumePage}
          setPage={setVolumePage}
          totalPage={volumeTotalPage}
        />
      </Box>
    </Box>
  )
}
