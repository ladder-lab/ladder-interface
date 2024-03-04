import { Box, Button, Link, Stack, styled, Tab, Tabs, Typography, useTheme } from '@mui/material'
import Collapse from '../../components/Collapse'
import { StyledCardWrapper } from './TestnetV3'
import useBreakpoint from '../../hooks/useBreakpoint'
import React, { useMemo, useState } from 'react'
import V3TestnetTable from '../../components/Table/V3TestnetTable'
import { useIsDarkMode } from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks'
import { MonopolyPrizeWinners, SBTAssetWinners, SBTLiquidity, SBTVolume } from '../../constants/WinnerData'
import { formatMillion, getEtherscanLink, shortenAddress } from '../../utils'
import { ChainId } from '../../constants/chain'
import FirstPrize from 'assets/images/first_prize.png'
import SecondPrize from 'assets/images/secend_prize.png'
import ThirdPrize from 'assets/images/third_prize.png'
import useModal from '../../hooks/useModal'
import FirstPrizeModal from './FirstPrizeModal'
import SecondPrizeModal from './SecondPrizeModal'
import ThirdPrizeModal from './ThirdPrizeModal'

enum TabType {
  Monopoly,
  SBT
}

function GradiantBg({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        padding: '1.4px',
        backgroundSize: '105% 105%',
        borderRadius: '12px',
        backgroundImage: `linear-gradient(to right , #1F9898 ,#fdd000, #ff00ac, #1F9898)`
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
          padding: '10px',
          maxWidth: '100%',
          overflowX: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

enum SBTType {
  ASSET,
  LIQUIDITY,
  VOLUME
}

const MonCardBg = styled(Box)`
  width: 100%;
  border-radius: 16px;
  padding: 25px;
  border: 1px solid #bbbaba;
`

const MonPrizeBg = styled(Box)`
  border-radius: 16px;
  padding: 16px;
  display: flex;
  border: 1px solid #bbbaba;
`

const MonPrizeTitle = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Avatar = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 16px;
  background: linear-gradient(143.27deg, #cc00ff -15.62%, #00ff66 120.14%);
`

function MonoCard({ rank, addressList }: { rank: number; addressList: string[] }) {
  let rankImg = FirstPrize
  let rankTitle = 'First Prize'
  let rankNum = ''
  const { hideModal, showModal } = useModal()

  switch (rank) {
    case 1:
      rankImg = FirstPrize
      rankTitle = 'First Prize'
      rankNum = ' #1'
      break
    case 2:
      rankImg = SecondPrize
      rankTitle = 'Second Prize'
      rankNum = ' #2'
      break
    case 3:
      rankImg = ThirdPrize
      rankTitle = 'Third Prize'
      rankNum = ' #3'
      break
  }

  function handleShowModal() {
    switch (rank) {
      case 1:
        showModal(<SecondPrizeModal hide={hideModal} />)
        break
      case 2:
        showModal(<FirstPrizeModal hide={hideModal} />)
        break
      case 3:
        showModal(<ThirdPrizeModal hide={hideModal} />)
        break
    }
  }

  return (
    <MonCardBg>
      <MonPrizeTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={rankImg} alt="" />
          <Typography fontWeight={600}>{rankTitle}</Typography>
        </Box>
        <Button variant={'text'} style={{ width: 'fit-content' }} onClick={handleShowModal}>
          How to claim
        </Button>
      </MonPrizeTitle>
      <Stack spacing={24}>
        {addressList.map((addr, index) => {
          let prizeHint = ''
          if (index == 0) {
            prizeHint = `Top asset value${rankNum}`
          }
          if (index == 1) {
            prizeHint = `Top liquidity provided${rankNum}`
          }
          if (index == 2) {
            prizeHint = `top volume traded${rankNum}`
          }
          return (
            <MonPrizeBg key={index}>
              <Avatar />
              <Box>
                <Typography color={'#27272E'} fontSize={14} fontWeight={600}>
                  {shortenAddress(addr)}
                </Typography>
                <Typography color={'#425466'} fontSize={14} mt={5}>
                  {prizeHint}
                </Typography>
              </Box>
            </MonPrizeBg>
          )
        })}
      </Stack>
    </MonCardBg>
  )
}

function MonoRank() {
  const FirstList: string[] = []
  MonopolyPrizeWinners.filter(data => data[0] == 1).forEach(data => FirstList.push(String(data[1])))
  const SecondList: string[] = []
  MonopolyPrizeWinners.filter(data => data[0] == 2).forEach(data => SecondList.push(String(data[1])))
  const ThirdList: string[] = []
  MonopolyPrizeWinners.filter(data => data[0] == 3).forEach(data => ThirdList.push(String(data[1])))
  const isSmDown = useBreakpoint('sm')

  const prizeRank = [FirstList, SecondList, ThirdList]
  return (
    <>
      {isSmDown && (
        <Stack spacing={10}>
          {prizeRank.map((addrList, index) => {
            return <MonoCard rank={index + 1} key={index} addressList={addrList} />
          })}
        </Stack>
      )}
      {!isSmDown && (
        <Box display={'flex'} justifyContent={'space-between'} gap={24} margin={16}>
          {prizeRank.map((addrList, index) => {
            return <MonoCard rank={index + 1} key={index} addressList={addrList} />
          })}
        </Box>
      )}
    </>
  )
}

export default function ListOfWinners() {
  const theme = useTheme()
  const isDownMD = useBreakpoint('md')
  const isSmDown = useBreakpoint('sm')
  const isDarkMode = useIsDarkMode()
  const [currentType, setType] = useState<TabType>(TabType.Monopoly)
  const { account } = useActiveWeb3React()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  useMemo(() => {
    const _bgcolors = [
      isDarkMode ? '#d8ff2029' : '#FDF1BE',
      isDarkMode ? '#ffffff4d' : '#F6F6F6',
      'rgba(209, 89, 57, 0.2)'
    ]
    if (account) _bgcolors.unshift('rgba(31, 152, 152, 0.1)')
    return _bgcolors
  }, [account, isDarkMode])

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  function ClaimBtn({ type }: { type?: SBTType }) {
    let url = ''
    switch (type) {
      case SBTType.ASSET:
        url = 'https://trantor.xyz/campaign/450971566109'
        break
      case SBTType.LIQUIDITY:
        url = 'https://trantor.xyz/campaign/450971566110'
        break
      case SBTType.VOLUME:
        url = 'https://trantor.xyz/campaign/450971566111'
        break
    }
    return (
      <Box width={'100%'} display={'flex'} justifyContent={'end'}>
        <Button
          onClick={() => {
            if (url) {
              window.open(url, '_blank', 'noreferrer')
            }
          }}
          sx={{
            background: theme => theme.palette.primary.main,
            width: '90px',
            height: 44,
            color: isDarkMode ? '#000' : '#fff'
          }}
        >
          Claim
        </Button>
      </Box>
    )
  }

  function addClaim(type: SBTType) {
    function format(value: (string | number | JSX.Element)[]) {
      const temp = [...value]
      temp[0] = (
        <Link target={'_blank'} mr={4} href={getEtherscanLink(ChainId.SEPOLIA, String(value[0]), 'address')}>
          {shortenAddress(String(value[0]))}
        </Link>
      )
      temp[1] = formatMillion(Number(value[1]), '$', 4)
      return temp
    }

    const list: (string | number | JSX.Element)[][] = []
    let source
    switch (type) {
      case SBTType.ASSET:
        source = SBTAssetWinners
        break
      case SBTType.LIQUIDITY:
        source = SBTLiquidity
        break
      case SBTType.VOLUME:
        source = SBTVolume
        break
    }
    source.forEach((value, index) => {
      list.push([...format(value), <ClaimBtn type={type} key={index} />])
    })
    return list
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
        minHeight: `calc(100vh - ${isDownMD ? theme.height.mobileHeader : theme.height.header})`,
        padding: {
          xs: '20px 16px 114px',
          md: '20px 45px 40px'
        }
      }}
    >
      <StyledCardWrapper>
        <Collapse
          defaultOpen
          title={
            <Box display={'flex'} mr={12}>
              <Typography fontSize={16} fontWeight={600} color={theme.palette.info.main} sx={{ opacity: '50%' }}>
                Partners
              </Typography>
              <Typography fontSize={16} fontWeight={600} color={theme.palette.info.main}>
                / List Of Winners
              </Typography>
            </Box>
          }
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isSmDown ? 'column' : 'row',
              width: '100%',
              marginTop: '50px',
              marginBottom: '23px',
              justifyContent: 'space-between'
            }}
          >
            <Box display={'flex'}>
              <Button
                variant="outlined"
                sx={
                  currentType == TabType.Monopoly
                    ? {
                        background: 'rgba(31, 152, 152, 0.1)',
                        width: 'inherit',
                        border: '0px'
                      }
                    : {
                        width: 'inherit'
                      }
                }
                onClick={() => {
                  setType(TabType.Monopoly)
                }}
              >
                <Typography
                  fontSize={isSmDown ? '10px' : '16px'}
                  color={isDarkMode ? '#000' : theme.palette.primary.main}
                >
                  Monopoly Prize Winners
                </Typography>
              </Button>
              <Button
                variant="outlined"
                sx={
                  currentType == TabType.SBT
                    ? {
                        marginLeft: '10px',
                        background: 'rgba(31, 152, 152, 0.1)',
                        border: '0px',
                        width: 'inherit'
                      }
                    : {
                        marginLeft: '10px',
                        width: 'inherit'
                      }
                }
                onClick={() => {
                  setType(TabType.SBT)
                }}
              >
                <Typography
                  fontSize={isSmDown ? '10px' : '16px'}
                  color={isDarkMode ? '#000' : theme.palette.primary.main}
                >
                  SBT Prize Winners
                </Typography>
              </Button>
            </Box>
            {currentType == TabType.SBT && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isSmDown ? 'column' : 'row',
                  marginTop: isSmDown ? '10px' : '0'
                }}
              >
                <Typography fontSize={isSmDown ? '9px' : '16px'} color={theme.palette.info.main}>
                  Available time
                </Typography>
                <Typography
                  ml={isSmDown ? 0 : 10}
                  fontSize={isSmDown ? '9px' : '16px'}
                  color={theme.palette.text.secondary}
                >
                  Mar 7th 19 PM SGT - Mar 13th 19PM SGT
                </Typography>
              </Box>
            )}
          </Box>
          {currentType == TabType.Monopoly && (
            <GradiantBg>
              <MonoRank />
            </GradiantBg>
          )}
          {currentType == TabType.SBT && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Assets" {...a11yProps(0)} />
                  <Tab label="Liquidity" {...a11yProps(1)} />
                  <Tab label="Volume" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <GradiantBg>
                  <V3TestnetTable
                    cellPadding="5px 10px"
                    height="44px"
                    fontSize={isSmDown ? '12px' : '16px'}
                    rows={addClaim(SBTType.ASSET)}
                    header={['Address', 'Asset Volume', '']}
                  />
                </GradiantBg>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <GradiantBg>
                  <V3TestnetTable
                    cellPadding="5px 10px"
                    height="44px"
                    fontSize={isSmDown ? '12px' : '16px'}
                    rows={addClaim(SBTType.LIQUIDITY)}
                    header={['Address', 'TVL Volume', '']}
                  />
                </GradiantBg>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <GradiantBg>
                  <V3TestnetTable
                    cellPadding="5px 10px"
                    height="44px"
                    fontSize={isSmDown ? '12px' : '16px'}
                    rows={addClaim(SBTType.VOLUME)}
                    header={['Address', 'volume', '']}
                  />
                </GradiantBg>
              </TabPanel>
            </Box>
          )}
        </Collapse>
      </StyledCardWrapper>
    </Box>
  )
}
