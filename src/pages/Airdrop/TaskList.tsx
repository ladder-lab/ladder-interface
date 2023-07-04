import { Box, Tab, Typography, useTheme, Tabs as MuiTabs, Button } from '@mui/material'
import Card from 'components/Card'
import { SUPPORTED_NETWORKS } from 'constants/chain'
import React, { useCallback } from 'react'
import { ReactComponent as Chip } from 'assets/svg/airdrop/chip.svg'
import { ReactComponent as Completed } from 'assets/svg/airdrop/completed.svg'

export enum TYPE {
  box,
  task
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
}

interface TaskListData {
  canBeDone: CardProp[]
  completed: CardProp[]
  cannotComplete: CardProp[]
}

export default function TaskList({ type, data }: { type: TYPE; data?: TaskListData }) {
  const theme = useTheme()
  return (
    <Box width={'100%'} maxWidth={theme.width.maxContent} margin="0 auto" display="grid" gap={20}>
      <Typography variant="h5">{type === TYPE.box ? 'Get Box' : 'Luck task'}</Typography>
      <Typography>Complete the specified task → get Box, the number of Box is defined by the task.</Typography>
      <Tabs
        titles={[
          `Tasks that can be done : ${data?.canBeDone?.length ?? '0'}`,
          `Completed : ${data?.completed?.length ?? '0'}`,
          `impossible to complete : ${data?.cannotComplete?.length ?? '0'}`
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
      <Box>
        <MuiTabs
          value={customCurrentTab !== undefined ? customCurrentTab : value}
          onChange={onChange}
          sx={{ mb: -1 }}
          indicatorColor={'transparent' as any}
        >
          {titles.map((tab, idx) => (
            <Tab
              disableRipple
              key={idx}
              label={tab}
              sx={{
                padding: '6px 20px',
                mr: { xs: 23, md: 25 },
                textTransform: 'none',
                background: '#ffffff',
                borderRadius: '60px',
                minHeight: 'unset',
                color: theme => theme.palette.text.primary,
                '&.Mui-selected, &:hover': {
                  color: theme => theme.palette.text.primary,
                  background: theme => theme.palette.primary.main
                }
              }}
            />
          ))}
        </MuiTabs>
      </Box>
      {contents.map((content, idx) => (
        <TabPanel value={customCurrentTab !== undefined ? customCurrentTab : value} index={idx} key={idx}>
          {content}
        </TabPanel>
      ))}
    </Box>
  )
}

function TaskCards({ data, type }: { data: CardProp[]; type: TYPE }) {
  return (
    <Box display={'grid'} gridTemplateColumns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={20}>
      {data.map((data, idx) => (
        <Card key={data.title + idx}>
          <Box padding="24px" display={'grid'} gap={20}>
            <Box
              sx={{ color: type === TYPE.box ? '#4A9EEB' : '#1F9898' }}
              display="flex"
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Chip />
              <Typography
                color={theme => theme.palette.primary.main}
                sx={{ textDecoration: 'underline', fontSize: 16 }}
              >
                {SUPPORTED_NETWORKS[data.chain as keyof typeof SUPPORTED_NETWORKS]?.chainName ?? 'NETWORK'}
              </Typography>
            </Box>
            <Typography fontSize={18} fontWeight={700}>
              Add blue chip LP
            </Typography>
            <br />

            <Typography></Typography>
            <Typography fontSize={16} fontWeight={700}>
              No. of Box:1
            </Typography>
            {data.completed ? (
              <Box display="flex" alignItems="center" sx={{ color: theme => theme.palette.primary.main }} gap={5}>
                <Completed />
                <Typography fontSize={16} fontWeight={600}>
                  Completed
                </Typography>
              </Box>
            ) : (
              <Button
                variant="outlined"
                sx={{ width: 'max-content', padding: '10px 30px', minHeight: 'unset', height: '35px' }}
              >
                To Finish
              </Button>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  )
}
