import { Box, Typography, useTheme, Button, styled, Stack, Link, Select, MenuItem } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from 'hooks'
import { useTestnetClaim } from 'hooks/useTestnetClaim'
import ActionButton from 'components/Button/ActionButton'
import { formatMillion, shortenAddress } from 'utils'
import { useEffect, useMemo, useState } from 'react'
import { ChainId } from 'constants/chain'
import { ReactComponent as Explore } from 'assets/svg/explore.svg'
// import prizepool_icon from 'assets/images/prizepool.jpeg'
import V4ActivityData from './V4ActivityData'
import V3TestnetTable from 'components/Table/V3TestnetTable'
import { useIsDarkMode } from 'state/user/hooks'
import {
  AccountRankValues
  // useV3PoolTop10
} from 'hooks/useTestnetV4'
// import { ShowTopPoolsCurrencyBox } from 'pages/Statistics'
// import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
// import Copy from 'components/essential/Copy'
import { LightTooltip } from 'components/TestnetV3Mark'
import QuestionHelper from 'components/essential/QuestionHelper'
import { useUserHasSubmitted } from 'state/transactions/hooks'
import V4Medal from './V4Model'
import CollapseWhite from '../../components/Collapse/CollapseWhite'
import { StyledTabButtonText } from '../Statistics'
import { Axios, axiosInstance, v4Url } from '../../utils/axios'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'
import { GreenBtn } from '../MyAccount/MintOrganModal'
import {
  useCheckMakeTwitter,
  useGetRemoteStep,
  useVerifyLadderOauth,
  useVerifyTwitter
} from '../../hooks/useVerifyTwitter'
import { useSignLogin } from '../../hooks/useSignIn'
import { useUserTokenCallback } from '../../state/userToken/hooks'

const StyledButtonWrapper = styled(Box)<{ isDownMD?: boolean }>(({ theme, isDownMD }) => ({
  maxWidth: 400,
  width: 'fit-content',
  position: isDownMD ? 'inherit' : 'absolute',
  bottom: 0,
  '& button': {
    maxWidth: 400,
    width: '100%',
    height: 50,
    fontSize: 16,
    padding: '0 60px',
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      padding: '0 40px'
    }
  }
}))

export const StyledCardWrapper = styled(Box)(({}) => ({}))

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const StyledQATitle = styled(Box)(({ theme }) => ({
  fontSize: 20,
  marginBottom: 16,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

const StyledQABody = styled(Box)(({ theme }) => ({
  fontSize: 20,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

export default function TestnetV4() {
  const theme = useTheme()
  const isDownMD = useBreakpoint('md')
  const [step, setStep] = useState(0)
  const { token } = useUserTokenCallback()

  useEffect(() => {
    axiosInstance.defaults.headers.common['token'] = token
  }, [token])

  return (
    <Stack spacing={40}>
      <Box>
        <Typography fontSize={16} fontWeight={600} mb={-10}>
          Activity data
        </Typography>
        <V4ActivityData />
      </Box>
      <StyledCardWrapper>
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween flexWrap={'wrap'}>
              <Box display={'flex'} flexWrap={'wrap'}>
                <Typography fontSize={16} fontWeight={600} mr={12}>
                  Join Ladder Spring Training for Free
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Box
            flexDirection={isDownMD ? 'column' : 'row'}
            display={'flex'}
            gap={isDownMD ? 32 : 20}
            sx={{
              background: theme.palette.background.paper,
              padding: '24px 24px 32px',
              borderRadius: '12px'
            }}
          >
            <Step0 step={step} setStep={setStep} />
            {/*<Step1 step={step} setStep={setStep} />*/}
            {/*<Step2 step={step} setStep={setStep} />*/}
            <Step3 step={step} />
          </Box>
        </CollapseWhite>
      </StyledCardWrapper>
      <StyledCardWrapper>
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography fontSize={16} fontWeight={600} color={theme.palette.text.primary} mr={12}>
                  Experience more novel features of ladder!
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Box
            sx={{
              background: theme.palette.background.paper,
              borderRadius: '12px',
              padding: isDownMD ? '24px 20px' : '24px 24px 64px'
            }}
          >
            <V4Medal />
          </Box>
        </CollapseWhite>
      </StyledCardWrapper>
      <StyledCardWrapper>
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography fontSize={16} fontWeight={600} color={theme.palette.text.primary} mr={12}>
                  Leaderboard
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <LeaderBoardBox />
        </CollapseWhite>
      </StyledCardWrapper>
      <StyledCardWrapper id="qa">
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography fontSize={16} fontWeight={600} color={theme.palette.text.primary} mr={12}>
                  Q&A
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Stack
            spacing={44}
            sx={{
              background: theme.palette.background.paper,
              borderRadius: '12px',
              padding: '32px 24px'
            }}
          >
            <Box>
              <StyledQATitle>1. What is Ladder?</StyledQATitle>
              {/* <Table
                  fontSize="15px"
                  header={['Qualification', 'Source', 'Number', 'Note']}
                  rows={qaTableData}
                ></Table> */}
              <StyledQABody>
                {`Ladder is a unique AMM (Automated Market Maker) that will provide instant liquidity for NFT's including ERC-20, ERC-721, ERC-1155. `}
                <br />
                <br />
                {`Unlike other NFT marketplaces which operate on an order book style of exchange, Ladder protocol takes a different approach by using Automated Market Makers and limit orders. By doing so, we aim to provide instant swaps for NFTs with low slippage and low fees!`}
                <br />
                <br />
                {`On Ladder protocol, now you can see how much certainty your NFT is backed by, or swap for any NFT in the Pool, or earn a commission for providing liquidity with your NFT. `}
                <br />
                <br />
                {`Ladder builds an infinite door for NFT!`}
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>2. What are the trading simulations for Spring Training?</StyledQATitle>
              <StyledQABody>
                The trading simulation will be available for all pools. Every user will begin the simulation with the
                same claimable amount of test assets. Claim yours now!
                <br />
                Training will stretch through the entire Spring season and will feature achievements for the user to
                accomplish within the simulation. Accomplishing achievements will reward points to the users allowing
                them to rank up through achievement tiers.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>3. How long will Spring Training run for?</StyledQATitle>
              <StyledQABody>
                Spring Training is an on-going seasonal event at Ladder that will continue throughout the spring season.{' '}
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>4. Which Network will Spring Training be on?</StyledQATitle>
              <StyledQABody>
                This time Spring Training will be on the SEPOLIA TEST NETWORK, we recommend getting your Test ETH from a
                faucet in advance from:
                <Link target={'_blank'} href="https://sepoliafaucet.net/">
                  https://sepoliafaucet.net/
                </Link>
                <br />
                <br />
                More detailed instructions on how to get test ETH will be pinned in our Telegram and Discord channel.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>5. How will Achievements/Rankings and Rewards work?</StyledQATitle>
              <StyledQABody>
                Completing the achievements will reward points that level you up through the achievement tiers.
                Achievement tiers make the ranking system easier for users to indicate their progress.
                <br />
                <b>Rewards will be tracked weekly and seasonally</b>
                <br />
                With rewards being tracked weekly and seasonally this means we will also be distributing rewards in
                those intervals.
                <br />
                Weekly rewards will be distributed among top ranked users based upon availability of offered reward.
                <br />
                Seasonal rewards will distribute the long awaited Ladder airdrop
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>6. What happens after Spring Training?</StyledQATitle>
              <StyledQABody>
                There will be more to expect, as in community events.
                <br />
                Stay tuned with us and don’t miss out on those incoming opportunities to win future community rewards.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>7. Where can I see upcoming events?</StyledQATitle>
              <StyledQABody>
                <Box>
                  Twitter:{' '}
                  <Link target={'_blank'} href="https://twitter.com/Laddertop_NFT">
                    https://twitter.com/Laddertop_NFT
                  </Link>
                </Box>
                <Box>
                  Link3:{' '}
                  <Link target={'_blank'} href="https://link3.to/ladder">
                    https://link3.to/ladder
                  </Link>
                </Box>
                <Box>
                  Discord:{' '}
                  <Link target={'_blank'} href="https://discord.gg/sabGRPhwUM">
                    https://discord.gg/sabGRPhwUM
                  </Link>
                </Box>
              </StyledQABody>
            </Box>
          </Stack>
        </CollapseWhite>
      </StyledCardWrapper>
    </Stack>
  )
}

const StepText = styled(Typography)`
  font-weight: 800;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.03em;
`
const StepNameText = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  line-height: 170%;
  margin-top: 9px;
  text-transform: capitalize;
`
const StepDescText = styled(Typography)`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  margin-top: 11px;
  color: #747678;
`
const StepBtn = styled(GreenBtn)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 144px;
  gap: 9px;
  padding: 12px 28px;
  font-weight: 600;
  '&:disabled': {
    pointer-events: none;
  }
`

function Step0({ step, setStep }: { step: number; setStep: (step: number) => void }) {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { verifyAll, remoteStep } = useGetRemoteStep()
  const { sign, token } = useSignLogin(verifyAll)
  const isDownMD = useBreakpoint('md')

  useEffect(() => {
    if (account && token) {
      verifyAll()
    }
  }, [account, token, verifyAll])

  useEffect(() => {
    setStep(remoteStep)
  }, [remoteStep, setStep])

  return (
    <>
      {account ? (
        <Box width={'100%'} flex={1} position={'relative'}>
          <StepText>Step 1</StepText>
          <StepNameText>Sign</StepNameText>
          <StepDescText>Please click this button to sign.</StepDescText>
          <StyledButtonWrapper mt={46} isDownMD={isDownMD}>
            <Button onClick={sign} disabled={step > 0}>
              Sign to get token
            </Button>
          </StyledButtonWrapper>
        </Box>
      ) : (
        <Box width={'100%'} flex={1} position={'relative'}>
          <StepText>Step 1</StepText>
          <StepNameText>Connect Wallet</StepNameText>
          <StepDescText>Please connect your wallet to claim test assets</StepDescText>
          <StyledButtonWrapper mt={46} isDownMD={isDownMD}>
            <Button style={{ width: '144px' }} onClick={toggleWalletModal} disabled={step > 0}>
              <span style={{ fontSize: 14 }}>Connect</span>
            </Button>
          </StyledButtonWrapper>
        </Box>
      )}
    </>
  )
}

export function Step1({ step, setStep }: { step: number; setStep: (step: number) => void }) {
  const { openVerify } = useVerifyTwitter(true)
  const { verifyOauth, oauth } = useVerifyLadderOauth()
  const isDownMD = useBreakpoint('md')
  useEffect(() => {
    if (oauth && step < 2) {
      setStep(2)
    }
  }, [oauth, setStep, step])

  useEffect(() => {
    verifyOauth()
  }, [verifyOauth])

  return (
    <Box
      flex={1}
      sx={{
        opacity: step > 0 ? 1 : 0.4
      }}
    >
      <StepText>Step 2</StepText>
      <StepNameText>Connect Twitter</StepNameText>
      <StepDescText>Please connect and verify your twitter account</StepDescText>
      <Box display={'flex'} mt={23} gap={isDownMD ? 12 : 20} flexDirection={isDownMD ? 'column' : 'row'}>
        <StepBtn
          sx={{
            pointerEvents: step < 1 ? 'none' : 'auto',
            '& svg': {
              fill: 'white',
              opacity: 1
            }
          }}
          onClick={() => {
            if (step < 1) return
            openVerify()
            setTimeout(() => {
              if (step < 2) {
                setStep(2)
              }
            }, 5000)
            // let counter = 0
            // const intervalId = setInterval(() => {
            //   counter++
            //   if (counter > 20 || oauth) {
            //     clearInterval(intervalId)
            //     return
            //   }
            //   verifyOauth()
            // }, 1000)
          }}
        >
          <Twitter />
          {oauth ? 'Connected' : 'Connect'}
        </StepBtn>
        {/*{!oauth && (*/}
        {false && (
          <StepBtn
            sx={{
              pointerEvents: step < 1 ? 'none' : 'auto',
              border: '1px solid #1F9898',
              backgroundColor: 'transparent',
              color: '#1F9898'
            }}
            onClick={() => {
              if (step < 1) return
              if (!oauth) {
                verifyOauth()
              }
            }}
          >
            Verify
          </StepBtn>
        )}
      </Box>
    </Box>
  )
}

export function Step2({ step, setStep }: { step: number; setStep: (step: number) => void }) {
  const { makeTwitter, checkMakeTwitter } = useCheckMakeTwitter()
  const isDownMD = useBreakpoint('md')

  useEffect(() => {
    if (makeTwitter) {
      setStep(3)
    }
  }, [makeTwitter, setStep])

  useEffect(() => {
    checkMakeTwitter()
  }, [checkMakeTwitter])

  return (
    <Box
      flex={1}
      sx={{
        opacity: step > 1 ? 1 : 0.4
      }}
    >
      <StepText>Step 3</StepText>
      <StepNameText>Make a tweet</StepNameText>
      <StepDescText>Please tweet to receive free Ladder test assets</StepDescText>
      <Box display={'flex'} mt={23} gap={isDownMD ? 12 : 20} flexDirection={isDownMD ? 'column' : 'row'}>
        <StepBtn
          sx={{
            pointerEvents: step < 2 ? 'none' : 'auto',
            '& svg': {
              fill: 'white',
              opacity: 1
            }
          }}
          onClick={() => {
            if (step < 2) return
            window.open(
              "https://twitter.com/intent/tweet?text=✅Secured%20my%20place%20in%20the@Laddertop_NFT%20community\n\n✅Traded%20NFT's%20in%20their%20ongoing%20Testnet\n\n✅Ready%20for%20what%20comes%20next😎",
              'intent',
              'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
            )
            setTimeout(() => {
              if (step < 3) {
                setStep(3)
              }
            }, 5000)
          }}
        >
          <Twitter />
          {makeTwitter ? 'Tweeted' : 'Tweet'}
        </StepBtn>
        {/*{!makeTwitter && (*/}
        {false && (
          <StepBtn
            sx={{
              border: '1px solid #1F9898',
              backgroundColor: 'transparent',
              color: '#1F9898',
              pointerEvents: step < 2 ? 'none' : 'auto'
            }}
            onClick={checkMakeTwitter}
          >
            Verify
          </StepBtn>
        )}
      </Box>
    </Box>
  )
}

function Step3({ step }: { step: number }) {
  const { account } = useActiveWeb3React()
  const { testnetClaim } = useTestnetClaim(account || undefined)
  const { submitted, complete } = useUserHasSubmitted(`${account}_claim4`)
  const isDownMD = useBreakpoint('md')

  return (
    <Box
      flex={1}
      sx={{
        opacity: step > 0 ? 1 : 0.4,
        minHeight: '200px',
        // opacity: step > 2 ? 1 : 0.4,
        position: 'relative'
      }}
    >
      <StepText>Step 2</StepText>
      {/*<StepText>Step 4</StepText>*/}
      <StepNameText>Claim your test assets</StepNameText>
      <LightTooltip title={<FaucetsList />} arrow>
        <Link
          display={'flex'}
          alignItems="center"
          fontWeight={600}
          href="https://web.getlaika.app/faucets"
          target={'_blank'}
          style={{ textDecoration: 'none' }}
        >
          <Box>
            <StepDescText>Claim your Ladder test assets on</StepDescText>
            <span style={{ textDecoration: 'underline' }}>
              Sepolia Faucet <Explore />
            </span>
          </Box>
        </Link>
      </LightTooltip>
      <Box
        sx={{
          position: isDownMD ? 'inherit' : 'absolute',
          marginTop: isDownMD ? '23px' : '0',
          bottom: 0
        }}
      >
        <ActionButton
          width={'144px'}
          // pending={claimState === ClaimState.UNKNOWN}
          onAction={testnetClaim}
          // disableAction={new Date() < new Date(v3ActiveTimeStamp[0])}
          // disableAction={!isOpenClaim && activeTimeStatus !== 'active'}
          actionText="Claim"
          error={submitted || complete ? 'Test assets Claimed' : undefined}
          disableAction={step < 1}
          // disableAction={step < 3}
        />
      </Box>
    </Box>
  )
}

function LeaderBoardBox() {
  const isDarkMode = useIsDarkMode()
  const chainId = ChainId.SEPOLIA
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
                  setTimestamp('1680451200')
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
            <MenuItem value={'1680451200'}>This Week</MenuItem>
            <MenuItem value={'1679846400'}>Last Week</MenuItem>
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
          helper="Update once an hour"
          page={assetsPage}
          setPage={setAssetsPage}
          totalPage={assetsTotalPage}
        />
        <LeaderBoardRank
          rows={topLiquidityValue}
          bgcolors={bgcolors}
          title="Top Liquidity Provided"
          helper="Update once an hour"
          page={liquidityPage}
          setPage={setLiquidityPage}
          totalPage={liquidityTotalPage}
        />
        <LeaderBoardRank
          rows={topVolumeTraded}
          bgcolors={bgcolors}
          title="Top Volume Traded"
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

function LeaderBoardRank({
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

function FaucetsList() {
  const list = [
    {
      name: 'Faucet Link',
      link: 'https://faucetlink.to/sepolia'
    },
    {
      name: 'Ethereum Sepolia | Coinbase Faucet',
      link: 'https://coinbase.com/faucets/ethereum-sepolia-faucet'
    },
    {
      name: 'Sepolia Faucet',
      link: 'https://sepoliafaucet.net/'
    },
    {
      name: 'All That Node | Multi-chain API & Dev-tools, Web3 Infrastructure',
      link: 'https://www.allthatnode.com/faucet/ethereum.dsrv'
    },
    {
      name: 'Laika',
      link: 'https://web.getlaika.app/faucets'
    }
  ]
  return (
    <Box>
      <Typography>More:</Typography>
      <ul>
        {list.map(item => (
          <li key={item.name}>
            <Link href={item.link} target="_blank">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  )
}
