import { Box, Button, Link, Tab, Tabs, Typography, useTheme } from '@mui/material'
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
  const bgcolors = useMemo(() => {
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

  function formatMonoList() {
    const list: (string | number | JSX.Element)[][] = []
    MonopolyPrizeWinners.forEach((value, index) => {
      const temp = [...value]
      temp[1] = (
        <Link target={'_blank'} mr={4} href={getEtherscanLink(ChainId.SEPOLIA, String(value[1]), 'address')}>
          {shortenAddress(String(value[1]))}
        </Link>
      )
      temp[2] = formatMillion(Number(value[2]), '$', 4)
      temp[3] = formatMillion(Number(value[3]), '$', 4)
      temp[4] = formatMillion(Number(value[4]), '$', 4)
      list.push([...temp, <ClaimBtn key={index} />])
    })
    return list
  }

  // console.log('AssetList', AssetList)
  // console.log('AssetListSBTAssetWinners', SBTAssetWinners)
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
              <V3TestnetTable
                fontSize={isSmDown ? '12px' : '16px'}
                bgcolors={bgcolors}
                rows={formatMonoList()}
                header={['#', 'Winner', 'TVL daily avg', 'Asset Value', 'Total Transaction']}
              />
            </GradiantBg>
          )}
          {currentType == TabType.SBT && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Asset" {...a11yProps(0)} />
                  <Tab label="Liquidity" {...a11yProps(1)} />
                  <Tab label="Volume" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <GradiantBg>
                  <V3TestnetTable
                    fontSize={isSmDown ? '12px' : '16px'}
                    bgcolors={bgcolors}
                    rows={addClaim(SBTType.ASSET)}
                    header={['Address', 'Asset Volume', '']}
                  />
                </GradiantBg>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <GradiantBg>
                  <V3TestnetTable
                    fontSize={isSmDown ? '12px' : '16px'}
                    bgcolors={bgcolors}
                    rows={addClaim(SBTType.LIQUIDITY)}
                    header={['Address', 'TVL Volume', '']}
                  />
                </GradiantBg>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <GradiantBg>
                  <V3TestnetTable
                    fontSize={isSmDown ? '12px' : '16px'}
                    bgcolors={bgcolors}
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
