import { Box, Tab, Typography, useTheme, Tabs as MuiTabs, Button, SxProps, CircularProgress } from '@mui/material'
import Card from 'components/Card'
import { SUPPORTED_NETWORKS } from 'constants/chain'
import React, { useCallback } from 'react'
import { ReactComponent as SwapPlus1 } from 'assets/svg/airdrop/swap-plus-1.svg'
import { ReactComponent as SwapPlus1Color } from 'assets/svg/airdrop/swap-plus-1-color.svg'
import { ReactComponent as Completed } from 'assets/svg/airdrop/completed.svg'
import { ReactComponent as CompletedColor } from 'assets/svg/airdrop/completed-color.svg'
import { useIsDarkMode } from 'state/user/hooks'
import { ReactComponent as LuckIcon } from 'assets/svg/airdrop/luck_icon.svg'
import { ReactComponent as BoxIcon } from 'assets/svg/airdrop/box_icon.svg'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import QuestionHelper from 'components/essential/QuestionHelper'
import { ActivityProps } from './Activity'

const disabledBtn = false

export enum TYPE {
  box,
  luck,
  swap,
  activity
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
  tooltip?: string
  desc?: string | JSX.Element
  plus1Icon?: React.ReactNode
  chainTag?: React.ReactNode
  count?: number
  statusText?: string | undefined
  isLoading?: boolean
  buttonText?: string
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

export function TaskCards({ data, type, sx }: { data: CardProp[]; type: TYPE; sx?: SxProps }) {
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
    <Box
      display={{ md: 'grid', lg: type === TYPE.activity ? 'flex' : 'grid' }}
      gridTemplateColumns={{ xs: '100%', md: '1fr 1fr 1fr', lg: type === TYPE.activity ? 'unset' : '1fr 1fr 1fr 1fr' }}
      gap={20}
      sx={sx}
    >
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
                    fontSize: 12,
                    color: '#747678',
                    background: isDarkMode ? '#343739' : '#F4F4F4',
                    padding: '4px 8px 6px',
                    borderRadius: 0.6,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  {data.chainTag ? (
                    data.chainTag
                  ) : (
                    <>{SUPPORTED_NETWORKS[data.chain as keyof typeof SUPPORTED_NETWORKS]?.chainName ?? 'NETWORK'}</>
                  )}
                </Typography>
              </Box>
              {data.tooltip && <QuestionHelper text={data.tooltip} />}
            </Box>
            <Typography fontSize={18} fontWeight={700} component="div">
              {data.title}
            </Typography>

            {data.desc ? <Typography color="#747678"> {data.desc}</Typography> : <br />}

            <Box
              borderTop={'2px dotted'}
              borderColor={isDarkMode ? '#343739' : '#E4E4E4'}
              width="calc(100% + 48px)"
              mx="-24px"
              marginTop={'auto'}
            ></Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              {data.plus1Icon ? (
                <Box display={'flex'} alignItems={'center'}>
                  {data.plus1Icon}
                </Box>
              ) : type == TYPE.swap ? (
                <Box display={'flex'} alignItems={'center'}>
                  {!!data.count ? (
                    <SwapPlus1Color />
                  ) : (
                    <SwapPlus1 style={{ color: isDarkMode ? '#343739' : '#B0B0B0' }} />
                  )}

                  {data.count !== undefined && (
                    <>
                      <Typography
                        fontSize={18}
                        fontWeight={600}
                        color={
                          data.count > 0 ? (isDarkMode ? '#ffffff' : '#333333') : isDarkMode ? '#747678' : '#B0B0B0'
                        }
                        marginLeft={-5}
                      >
                        {data.count > 0 ? `X ${data.count}` : '+ 0'}
                      </Typography>
                    </>
                  )}
                </Box>
              ) : (
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
              )}
              {!account && (
                <Button
                  sx={{
                    width: 'max-content',
                    padding: '10px',
                    minHeight: 'unset',
                    height: '40px',
                    background:
                      type === TYPE.swap ? 'linear-gradient(90deg, #FFB3F3 0%, #D7C6FF 106.67%)!important' : undefined,
                    '&.MuiButton-root.MuiButton-contained.MuiButtonBase-root:hover': {
                      background:
                        type === TYPE.swap ? 'linear-gradient(90deg, #D7C6FF 0%, #FFB3F3 106.67%)!important' : undefined
                    }
                  }}
                  disabled={disabledBtn}
                  onClick={toggleWalletModal}
                >
                  Connect Wallet
                </Button>
              )}
              {account && type !== TYPE.swap && (
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
                  ) : data.id === 'googleOauth' || data.id === 'twitterOauth' ? (
                    data.isLoading ? (
                      <Button
                        sx={{
                          maxWidth: '130px',
                          padding: '10px 50px',
                          minHeight: 'unset',
                          height: '40px',
                          whiteSpace: 'nowrap'
                        }}
                        disabled
                      >
                        <CircularProgress size={24} color="inherit" />
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          maxWidth: '130px',
                          padding: '10px 50px',
                          minHeight: 'unset',
                          height: '40px',
                          whiteSpace: 'nowrap'
                        }}
                        disabled={disabledBtn}
                        onClick={data.action}
                      >
                        {data.statusText}
                      </Button>
                    )
                  ) : (
                    <Button
                      sx={{
                        maxWidth: '130px',
                        padding: '10px 50px',
                        minHeight: 'unset',
                        height: '40px',
                        whiteSpace: 'nowrap'
                      }}
                      disabled={disabledBtn}
                      onClick={() => {
                        if (
                          type === TYPE.activity &&
                          (data.id === ActivityProps.MintNow || data.id === ActivityProps.GoToGalxe)
                        ) {
                          window.open(data.route, '_blank')
                          return
                        }
                        data?.action && data?.action()
                      }}
                    >
                      {type === TYPE.box
                        ? 'Get Box'
                        : type === TYPE.activity
                        ? data.id === ActivityProps.Mint
                          ? 'Get Box'
                          : data.buttonText || 'Boost'
                        : 'Boost'}
                    </Button>
                  )}
                </>
              )}
              {account && type === TYPE.swap && !data.plus1Icon && (
                <Button
                  sx={{
                    width: '150px',
                    padding: '10px',
                    minHeight: 'unset',
                    height: '40px',
                    background: type === TYPE.swap ? 'linear-gradient(90deg, #FFB3F3 0%, #D7C6FF 106.67%)' : undefined,
                    '&.MuiButton-root.MuiButton-contained.MuiButtonBase-root:hover': {
                      background:
                        type === TYPE.swap ? 'linear-gradient(90deg, #D7C6FF 0%, #FFB3F3 106.67%)!important' : undefined
                    }
                  }}
                  disabled={disabledBtn}
                  onClick={data.action}
                >
                  Swap Now
                </Button>
              )}
              {account && type === TYPE.swap && !!data.plus1Icon && (
                <>
                  {data.completed ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        color: '#333333',
                        background: 'transparent',
                        height: '40px',
                        borderRadius: 1.2,
                        padding: '10px 20px',
                        border: '1px solid #FFB3F3'
                      }}
                      gap={5}
                    >
                      <CompletedColor />
                      <Typography fontSize={16} fontWeight={600}>
                        Completed
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      sx={{
                        width: '150px',
                        padding: '10px',
                        minHeight: 'unset',
                        height: '40px',
                        background:
                          type === TYPE.swap ? 'linear-gradient(90deg, #FFB3F3 0%, #D7C6FF 106.67%)' : undefined,
                        '&.MuiButton-root.MuiButton-contained.MuiButtonBase-root:hover': {
                          background:
                            type === TYPE.swap
                              ? 'linear-gradient(90deg, #D7C6FF 0%, #FFB3F3 106.67%)!important'
                              : undefined
                        }
                      }}
                      disabled={disabledBtn}
                      onClick={data.action}
                    >
                      Finish Now
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
