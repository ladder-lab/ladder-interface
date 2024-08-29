import { useIsDarkMode } from '../../state/user/hooks'
import { ChainId } from '../../constants/chain'
import { formatMillion, getUTC0MondayMidnightTimestamp, shortenAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { useEffect, useMemo, useState } from 'react'
import { AccountRankValues } from '../../hooks/useTestnetV4'
import { Box, MenuItem, Select, Typography, useTheme } from '@mui/material'
import { Axios, v4Url } from '../../utils/axios'
import { StyledTabButtonText } from '../Statistics'
import { LeaderBoardRank } from './LeaderBoardRank'

function MyRankItem({ num }: { num: string | number }) {
  const theme = useTheme()
  return (
    <Typography
      textAlign={'center'}
      sx={{
        width: 40,
        top: 10,
        fontSize: 16,
        color: theme.palette.text.primary
      }}
    >
      <span style={{ color: theme.palette.text.secondary }}>You </span>#{num}
    </Typography>
  )
}

export function LeaderBoardBox() {
  const isDarkMode = useIsDarkMode()
  const chainId = ChainId.SEPOLIA
  const curWeekTime = getUTC0MondayMidnightTimestamp()
  const prevWeekTime = curWeekTime - 86400 * 7
  const { account } = useActiveWeb3React()
  const [currentType, setType] = useState('Total')
  const [timestamp, setTimestamp] = useState<string>('0')
  const [accountAssetsRankList, setAccountAssetsRankList] = useState<AccountRankValues[]>()
  const [accountAssetsRank, setAccountAssetsRank] = useState<AccountRankValues>()
  const [assetsTotalPage, setAssetsTotalPage] = useState<number>(5)
  const [accountLiquidityRankList, setAccountLiquidityRankList] = useState<AccountRankValues[]>()
  const [accountLiquidityRank, setAccountLiquidityRank] = useState<AccountRankValues>()
  const [liquidityTotalPage, setLiquidityTotalPage] = useState<number>(5)
  const [accountVolumeRankList, setAccountVolumeRankList] = useState<AccountRankValues[]>()
  const [accountVolumeRank, setAccountVolumeRank] = useState<AccountRankValues>()
  const [volumeTotalPage, setVolumeTotalPage] = useState<number>(5)
  const [assetsPage, setAssetsPage] = useState(1)
  const [liquidityPage, setLiquidityPage] = useState(1)
  const [volumePage, setVolumePage] = useState(1)
  const theme = useTheme()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setAccountAssetsRankList(undefined)
        setAccountAssetsRank(undefined)
        return
      }
      try {
        const url = timestamp === '0' ? 'getAccountAssetRank' : 'getAccountAssetWeekRank'
        const res = await Axios.get(v4Url + url, {
          chainId,
          address: account || '',
          pageSize: 10,
          timestamp,
          pageNum: assetsPage
        })
        const data = res.data.data as any
        if (!data) {
          setAccountAssetsRankList(undefined)
          setAccountAssetsRank(undefined)
          return
        }
        setAccountAssetsRankList(
          data.ranks.list.map((item: any) => ({
            value: item.asset,
            rank: item.rank,
            account: item.account
          }))
        )
        setAssetsTotalPage(data.ranks.lastPage)
        account &&
          setAccountAssetsRank({
            account: account || '',
            rank: data.accountRank === -1 ? '-' : data.accountRank,
            value: data.accountAsset
          })
      } catch (error) {
        setAccountAssetsRankList(undefined)
        setAccountAssetsRank(undefined)
        console.error('useV4AccountAssetsRankTop', error)
      }
    })()
  }, [account, assetsPage, chainId, timestamp])

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setAccountLiquidityRankList(undefined)
        setAccountLiquidityRank(undefined)
        return
      }
      try {
        const url = timestamp === '0' ? 'getAccountTvlRank' : 'getAccountTvlWeekRank'
        const res = await Axios.get(v4Url + url, {
          chainId,
          address: account || '',
          timestamp,
          pageSize: 10,
          pageNum: liquidityPage
        })
        const data = res.data.data as any
        if (!data) {
          setAccountLiquidityRankList(undefined)
          setAccountLiquidityRank(undefined)
          return
        }
        setAccountLiquidityRankList(
          data.ranks.list.map((item: any) => ({
            value: item.tvl,
            rank: item.rank,
            account: item.account
          }))
        )
        setLiquidityTotalPage(data.ranks.lastPage)
        account &&
          setAccountLiquidityRank({
            account: account || '',
            rank: data.accountRank === -1 ? '-' : data.accountRank,
            value: data.accountTvl
          })
      } catch (error) {
        setAccountLiquidityRankList(undefined)
        setAccountLiquidityRank(undefined)
        console.error('useV3AccountLiquidityRankTop', error)
      }
    })()
  }, [account, chainId, liquidityPage, timestamp])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await Axios.get(v4Url + 'getAccountVolumeRank', {
          chainId,
          address: account || '',
          pageSize: 10,
          timestamp,
          pageNum: volumePage
        })
        const data = res.data.data as any
        console.log('timestamp-data', data)
        if (!data) {
          setAccountVolumeRankList(undefined)
          setAccountVolumeRank(undefined)
          return
        }
        setAccountVolumeRankList(
          data.ranks.list.map((item: any) => ({
            value: item.volumes,
            rank: item.rank,
            account: item.account
          }))
        )
        setVolumeTotalPage(data.ranks.lastPage)
        account &&
          setAccountVolumeRank({
            account: account || '',
            rank: data.volumesRank === -1 ? '-' : data.volumesRank,
            value: data.accountVolumes
          })
      } catch (error) {
        setAccountVolumeRankList(undefined)
        setAccountVolumeRank(undefined)
        console.error('useV3AccountAssetsRankTop', error)
      }
    })()
  }, [account, chainId, timestamp, volumePage])

  const topVolumeTraded = useMemo(() => {
    const ret: (JSX.Element | string | number)[][] =
      accountVolumeRankList?.map(item => [
        item.rank,
        shortenAddress(item.account),
        formatMillion(Number(item.value) || 0, '$ ', 2)
      ]) || []
    if (account) {
      ret.unshift([
        <MyRankItem num={accountVolumeRank?.rank || '-'} key={1} />,
        shortenAddress(account),
        accountVolumeRank ? formatMillion(Number(accountVolumeRank.value), '$ ', 2) : '-'
      ])
    }
    console.log('timestamp-ret', ret)
    return ret
  }, [account, accountVolumeRank, accountVolumeRankList])

  const topAssetsValue = useMemo(() => {
    const ret: (JSX.Element | string | number)[][] =
      accountAssetsRankList?.map(item => [
        item.rank,
        shortenAddress(item.account),
        formatMillion(Number(item.value) || 0, '$ ', 2)
      ]) || []
    if (account) {
      ret.unshift([
        <MyRankItem num={accountAssetsRank?.rank || '-'} key={1} />,
        shortenAddress(account),
        accountAssetsRank ? formatMillion(Number(accountAssetsRank.value), '$ ', 2) : '-'
      ])
    }
    return ret
  }, [account, accountAssetsRank, accountAssetsRankList])

  const topLiquidityValue = useMemo(() => {
    const ret: (JSX.Element | string | number)[][] =
      accountLiquidityRankList?.map(item => [
        item.rank,
        shortenAddress(item.account),
        formatMillion(Number(item.value) || 0, '$ ', 2)
      ]) || []
    if (account) {
      ret.unshift([
        <MyRankItem num={accountLiquidityRank?.rank || '-'} key={1} />,
        shortenAddress(account),
        accountLiquidityRank ? formatMillion(Number(accountLiquidityRank.value), '$ ', 2) : '-'
      ])
    }
    return ret
  }, [account, accountLiquidityRank, accountLiquidityRankList])

  const bgcolors = useMemo(() => {
    const _bgcolors = [
      isDarkMode
        ? 'linear-gradient(96.44deg, #D8FF2033 5.94%, #99F7F433 97.57%)'
        : 'linear-gradient(96.44deg, #D8FF2088 5.94%, #99F7F488 97.57%)',
      isDarkMode
        ? 'linear-gradient(96.44deg, #D8FF2026 5.94%, #99F7F426 97.57%)'
        : 'linear-gradient(96.44deg, #D8FF204D 5.94%, #99F7F44D 97.57%)',
      isDarkMode
        ? 'linear-gradient(96.44deg, #D8FF2017 5.94%, #99F7F417 97.57%)'
        : 'linear-gradient(96.44deg, #D8FF201A 5.94%, #99F7F41A 97.57%)'
    ]
    if (account) _bgcolors.unshift('rgba(31, 152, 152, 0.1)')
    return _bgcolors
  }, [account, isDarkMode])

  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
        <Box display={'flex'} gap={20}>
          {['Total', 'Weekly'].map(item => (
            <StyledTabButtonText
              key={item}
              className={item === currentType ? 'active' : ''}
              onClick={() => {
                setType(item)
                if (item == 'Total') {
                  setTimestamp('0')
                } else {
                  setTimestamp(prevWeekTime.toString())
                }
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
          helper={currentType == 'Weekly' ? 'Update every Monday' : 'Update once an hour'}
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

      {/* <Box mt={30}>
        <LeaderBoardRank
          rows={topPairRows}
          minHeight={400}
          title="Top Pair"
          headers={['#', 'Name', 'TVL↓', 'Volume 24H', 'Floor price', 'NFT contract']}
        />
      </Box> */}
    </Box>
  )
}
