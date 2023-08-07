import { Box, Tab, Typography, useTheme, Tabs as MuiTabs, Button } from '@mui/material'
import Card from 'components/Card'
import { SUPPORTED_NETWORKS } from 'constants/chain'
import React, { useCallback } from 'react'

import { ReactComponent as Completed } from 'assets/svg/airdrop/completed.svg'
import { useIsDarkMode } from 'state/user/hooks'
import { ReactComponent as LuckIcon } from 'assets/svg/airdrop/luck_icon.svg'
import { ReactComponent as BoxIcon } from 'assets/svg/airdrop/box_icon.svg'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

export enum TYPE {
  box,
  luck
}

interface Props {
  titles: string[] | JSX.Element[]
  contents: React.ReactNode[]
  customCurrentTab?: number
  customOnChange?: (val: number) => void
}

interface CardProp {
  title: string
  chain: number
  completed: boolean
  id: string
  claimed?: boolean
  action?: () => void
  icon?: React.ReactNode
  expired?: boolean
  route?: string
}

export interface TaskListData {
  canBeDone: CardProp[]
  completed: CardProp[]
  cannotComplete: CardProp[]
}

export default function TaskList({ type, data }: { type: TYPE; data?: TaskListData }) {
  const theme = useTheme()
  return (
    <Box
      width={'100%'}
      maxWidth={theme.width.maxContent}
      margin="0 auto"
      display="grid"
      gap={20}
      padding={24}
      // overflow="hidden"
    >
      <Typography variant="h5">{type === TYPE.box ? 'Earn Boxes' : 'Boost your Luck'}</Typography>
      <Typography whiteSpace={'break-spaces'}>
        {type === TYPE.box
          ? 'Complete these tasks to earn more boxes!'
          : 'Increase your chances of getting better rewards from Ladder Boxes by completing these tasks!'}
      </Typography>
      <Tabs
        titles={[
          `To Claim: ${data?.canBeDone?.length ?? '0'}`,
          `Claimed: ${data?.completed?.length ?? '0'}`,
          `Expired : ${data?.cannotComplete?.length ?? '0'}`
        ]}
        contents={[
          <TaskCards type={type} key={1} data={data?.canBeDone ?? []} />,
          <TaskCards type={type} key={1} data={data?.completed ?? []} />,
          <TaskCards type={type} key={1} data={data?.cannotComplete ?? []} />
        ]}
      ></Tabs>
    </Box>
  )
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <div hidden={value !== index}>{value === index && children}</div>
}

function Tabs(props: Props) {
  const { titles, contents, customCurrentTab, customOnChange } = props
  const [value, setValue] = React.useState(0)

  const onChange = useCallback(
    (e: React.ChangeEvent<any>, value: any) => {
      customOnChange ? customOnChange(value) : setValue(value)
    },
    [customOnChange]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Box maxWidth={{ xs: '80vw', sm: 'unset', overflow: 'hidden' }} mb={15}>
        <MuiTabs
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={customCurrentTab !== undefined ? customCurrentTab : value}
          onChange={onChange}
          sx={{
            mb: -1
          }}
          TabIndicatorProps={{ sx: { display: 'none' } }}
        >
          {titles.map((tab, idx) => (
            <Tab
              disableRipple
              key={idx}
              label={tab}
              sx={{
                padding: '6px 20px',
                mt: 6,
                mr: { xs: 23, md: 25 },
                textTransform: 'none',
                background: '#ffffff',
                borderRadius: '60px',
                minHeight: 'unset',
                color: theme => theme.palette.primary.contrastText,
                '&.Mui-selected, &:hover': {
                  color: theme => theme.palette.primary.contrastText,
                  background: theme => theme.palette.primary.main
                }
              }}
            />
          ))}
        </MuiTabs>
      </Box>
      {contents.map((content, idx) => (
        <TabPanel value={customCurrentTab !== undefined ? customCurrentTab : value} index={idx} key={idx}>
          <Box minHeight={150}>{content}</Box>
        </TabPanel>
      ))}
    </Box>
  )
}

function TaskCards({ data, type }: { data: CardProp[]; type: TYPE }) {
  const { account } = useActiveWeb3React()
  const isDarkMode = useIsDarkMode()
  const toggleWalletModal = useWalletModalToggle()
  if (data.length === 0)
    return (
      <Typography variant="h5" fontSize={20} textAlign={'center'} pt={60}>
        No Tasks
      </Typography>
    )

  return (
    <Box display={'grid'} gridTemplateColumns={{ xs: '100%', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap={20}>
      {data.map((data, idx) => (
        <Card key={data.title + idx} color={isDarkMode ? '#1A1C1E' : undefined} width="100%">
          <Box padding="24px" display={'flex'} flexDirection={'column'} gap={20} height="100%">
            <Box
              sx={{ color: data.expired ? '#B0B0B0' : type === TYPE.box ? '#7D74FF' : '#1F9898' }}
              display="flex"
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box display="flex" alignItems={'center'} gap={15}>
                {data.icon}
                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#747678',
                    background: isDarkMode ? '#343739' : '#F4F4F4',
                    padding: '4px 8px 6px',
                    borderRadius: 0.6,
                    fontWeight: 700
                  }}
                >
                  {SUPPORTED_NETWORKS[data.chain as keyof typeof SUPPORTED_NETWORKS]?.chainName ?? 'NETWORK'}
                </Typography>
              </Box>
            </Box>
            <Typography fontSize={18} fontWeight={700}>
              {data.title}
            </Typography>
            <br />
            <Box
              borderTop={'2px dotted'}
              borderColor={isDarkMode ? '#343739' : '#E4E4E4'}
              width="calc(100% + 48px)"
              mx="-24px"
              marginTop={'auto'}
            ></Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={10}
                sx={
                  data.expired
                    ? {
                        '& svg': {
                          opacity: 0.4
                        },
                        '& .bg': {
                          fill: isDarkMode ? '#343739' : '#34373980'
                        }
                      }
                    : undefined
                }
              >
                {type === TYPE.box ? <BoxIcon width={28} /> : <LuckIcon width={28} />}
                <Typography fontSize={16} fontWeight={700}>
                  {type === TYPE.box ? 'x 1' : '+ 10%'}
                </Typography>
              </Box>
              {!account && (
                <Button
                  sx={{ width: 'max-content', padding: '10px', minHeight: 'unset', height: '40px' }}
                  onClick={toggleWalletModal}
                >
                  Connect Wallet
                </Button>
              )}
              {account && (
                <>
                  {data.claimed ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        color: theme => theme.palette.primary.main,
                        background: theme => theme.palette.primary.main + '30',
                        height: '40px',
                        borderRadius: 1.2,
                        padding: '10px 20px'
                      }}
                      gap={5}
                    >
                      <Completed />
                      <Typography fontSize={16} fontWeight={600}>
                        Completed
                      </Typography>
                    </Box>
                  ) : data.expired ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        color: isDarkMode ? '#878D92' : '#878D92',
                        background: isDarkMode ? '#343739' : '#E4E4E4',
                        height: '40px',
                        borderRadius: 1.2,
                        padding: '10px 20px'
                      }}
                      gap={5}
                    >
                      <Typography fontSize={16} fontWeight={600}>
                        Expired
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      sx={{ width: 'max-content', padding: '10px 50px', minHeight: 'unset', height: '40px' }}
                      onClick={data.action}
                    >
                      {type === TYPE.box ? 'Get Box' : 'Boost'}
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  )
}