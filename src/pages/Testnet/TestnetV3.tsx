import { Box, Typography, useTheme, Button, styled, Stack, Link } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from 'hooks'
import { ClaimState, useTestnetClaim } from 'hooks/useTestnetClaim'
import ActionButton from 'components/Button/ActionButton'
import { formatMillion, isAddress, scrollToElement, shortenAddress } from 'utils'
import Collapse from 'components/Collapse'
import Input from 'components/Input'
import ClaimableItem from './ClaimableItem'
import V3TaskItem from './V3TaskItem'
import { Timer } from 'components/Timer'
import { useEffect, useMemo, useState } from 'react'
import { Token } from 'constants/token'
import { ChainId } from 'constants/chain'
import { ReactComponent as Explore } from 'assets/svg/explore.svg'
import v2_my_icon from 'assets/images/v2_my_icon.png'
import prizepool_icon from 'assets/images/prizepool.jpeg'
import Pencil from 'assets/images/pencil.png'
import bannerImg from 'assets/images/v3_test_cover.jpg'
import v3_logo from 'assets/images/v3_test_icon1.png'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useTestnetV2Status } from 'hooks/useTestnetBacked'
import { StepTitle } from '.'
import V3ActivityData from './V3ActivityData'
import V3TestnetTable from 'components/Table/V3TestnetTable'
import { useIsDarkMode } from 'state/user/hooks'
import Image from 'components/Image'
import {
  useV3AccountAssetsRankTop,
  useV3AccountLiquidityRankTop,
  useV3AccountVolumeRankTop
  // useV3PoolTop10
} from 'hooks/useTestnetV3'
// import { ShowTopPoolsCurrencyBox } from 'pages/Statistics'
// import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
// import Copy from 'components/essential/Copy'
import V3Rewards from './V3Rewards'
import { LightTooltip } from 'components/TestnetV3Mark'
import QuestionHelper from 'components/essential/QuestionHelper'
import useModal from '../../hooks/useModal'
import WinnerModal from './WinnerModal'

const BannerText = styled(Typography)(({ theme }) => ({
  fontSize: 48,
  [theme.breakpoints.down('sm')]: {
    fontSize: 30
  }
}))

const StyledButtonWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  '& button': {
    maxWidth: 400,
    width: '100%',
    height: 50,
    fontSize: 16,
    padding: 0,
    [theme.breakpoints.down('md')]: {
      height: 70,
      fontSize: 16,
      padding: '16px 40px'
    }
  }
}))

export const StyledCardWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.color.color1}`,
  borderRadius: '16px',
  padding: '30px 28px',
  [theme.breakpoints.down('md')]: {
    padding: '16px'
  }
}))

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

export const StyledQATitle = styled(Box)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1.6,
  marginBottom: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

export const StyledQABody = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.75,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

const v3FaucetTokens = [
  {
    token: new Token(
      ChainId.SEPOLIA,
      '0x55979784068d1BEf37B49F41cAC8040A4b79C4a7',
      18,
      'tUSDC',
      'testUSDC-LadderV3-USDC-Testnet'
    ),
    amount: '1000'
  },
  {
    token: new Token(
      ChainId.SEPOLIA,
      '0x5069129410122A4C1F2448c77becDc5A8A784a5D',
      18,
      'tWETH',
      'testETH-LadderV3-ETH-Testnet'
    ),
    amount: '1000'
  }
]

const v3ActiveTimeStamp = [1676876400000, 1678086000000]

export default function TestnetV3() {
  const [openWinner, isOpenWinner] = useState(true)
  const { hideModal, showModal } = useModal()

  useEffect(() => {
    if (openWinner) {
      showModal(<WinnerModal hide={hideModal} />)
      isOpenWinner(false)
    }
  }, [hideModal, openWinner, showModal])

  const theme = useTheme()
  const isDownSm = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const navigate = useNavigate()
  const toggleWalletModal = useWalletModalToggle()
  const { testnetClaim, claimState } = useTestnetClaim(account || undefined)

  const [queryAddress, setQueryAddress] = useState('')
  const { claimState: queryClaimState } = useTestnetClaim(isAddress(queryAddress) ? queryAddress : undefined)
  const testnetV2Status = useTestnetV2Status(account || undefined)
  const [, setOpen] = useState(false)

  const queryNotice = useMemo(() => {
    return (
      <>
        {queryAddress && ClaimState.UNKNOWN !== queryClaimState && (
          <Box mt={10}>
            {queryClaimState === ClaimState.NOT_REGISTERED ? (
              <Typography textAlign={isDownSm ? 'center' : 'left'} color={theme.palette.error.main} fontWeight={500}>
                Oops! Unfortunately, you are not eligible for this test, but you can stay tuned for our follow-up
                activities.
              </Typography>
            ) : (
              <Typography textAlign={isDownSm ? 'center' : 'left'} color={theme.palette.info.main} fontWeight={500}>
                Congratulations! Because you are{' '}
                <Link
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.info.main,
                    textDecorationColor: theme.palette.info.main
                  }}
                >
                  the holder of Platinum GENESIS SBT
                </Link>
                , you can continue to participate in this beta event!
              </Typography>
            )}
          </Box>
        )}
      </>
    )
  }, [isDownSm, queryAddress, queryClaimState, theme.palette.error.main, theme.palette.info.main])

  // const activeTimeStatus = useMemo(() => {
  //   const curTime = new Date().getTime()
  //   if (curTime < v3ActiveTimeStamp[0]) {
  //     return 'soon'
  //   } else if (curTime >= v3ActiveTimeStamp[0] && curTime < v3ActiveTimeStamp[1]) {
  //     return 'active'
  //   }
  //   return 'end'
  // }, [])

  return (
    <Stack spacing={40}>
      <Banner setOpenTrue={() => setOpen(true)} />

      <Box padding="10px">
        <Typography lineHeight={1.5} fontSize={20} fontWeight={600} color={theme.palette.info.main} mb={-10}>
          Activity data
        </Typography>
        <V3ActivityData />
      </Box>

      <StyledCardWrapper>
        <Collapse
          defaultOpen
          title={
            <RowBetween flexWrap={'wrap'}>
              <Box display={'flex'} flexWrap={'wrap'}>
                <Typography fontSize={20} fontWeight={600} color={theme.palette.info.main} mr={12}>
                  Ladder SEPOLIA Monopoly Participate in preparation
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Stack mt="56px" spacing={56}>
            <Box>
              <RowBetween flexWrap={'wrap'}>
                <StepTitle step={1} title="Verify Eligibility" />
              </RowBetween>
              <Box
                mt={28}
                display="grid"
                sx={{
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 182px 350px' },
                  alignItems: 'center'
                }}
                gap="12px"
              >
                <Input
                  value={queryAddress}
                  onChange={e => setQueryAddress(e.target.value)}
                  onBlur={() => {
                    if (!isAddress(queryAddress)) setQueryAddress('')
                  }}
                  height="52px"
                  placeholder="Please enter your address"
                />
                {isDownSm && queryNotice}
                <Button
                  variant="outlined"
                  sx={{
                    height: 52,
                    borderColor: theme => theme.palette.info.main,
                    color: theme => theme.palette.info.main
                  }}
                >
                  Check eligibility
                </Button>
                <Link
                  target={'_blank'}
                  href="https://medium.com/@ladder_top/ladder-monopoly-rules-and-objectives-bf616d7becf7"
                  sx={{
                    textAlign: 'center',
                    color: theme.palette.text.primary,
                    textDecorationColor: theme.palette.text.primary
                  }}
                >
                  View Testnet Participant Qualification
                </Link>
              </Box>
              {!isDownSm && queryNotice}
            </Box>

            <Box>
              <RowBetween>
                <StepTitle step={2} title="Claim Test Asset" />
              </RowBetween>
              <Box>
                <Box
                  mt={28}
                  sx={{
                    display: 'none',
                    gridTemplateColumns: { xs: '1fr', sm: '5fr 5fr 1.6fr' },
                    alignItems: 'center',
                    gap: { xs: '10px', sm: '24px 10px' },
                    padding: '20px',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius + 'px'
                  }}
                >
                  {v3FaucetTokens.map((item, index) => (
                    <ClaimableItem
                      key={index}
                      token={item.token}
                      amount={item.amount}
                      claimable={claimState === ClaimState.UNCLAIMED ? item.amount : '0'}
                    />
                  ))}
                  <ClaimableItem
                    nftInfo={{ name: 'laddertest-v3-erc721' }}
                    amount={'10'}
                    claimable={claimState === ClaimState.UNCLAIMED ? '10' : '0'}
                  />
                  {/* <ClaimableItem
                    nftInfo={{ name: 'laddertest-v2-erc1155' }}
                    amount={'10'}
                    claimable={claimState === ClaimState.UNCLAIMED ? '10' : '0'}
                  /> */}
                </Box>
                <Box display={'flex'} flexWrap="wrap" mt={16} alignItems="center">
                  <StyledButtonWrapper>
                    {account ? (
                      <Box position={'relative'}>
                        <StyledButtonWrapper>
                          <ActionButton
                            pending={claimState === ClaimState.UNKNOWN}
                            onAction={testnetClaim}
                            disableAction={true || new Date() < new Date(v3ActiveTimeStamp[0])}
                            // disableAction={!isOpenClaim && activeTimeStatus !== 'active'}
                            actionText="Claim your test assets"
                            error={
                              claimState === ClaimState.UNKNOWN
                                ? 'Loading'
                                : claimState === ClaimState.UNCLAIMED
                                ? undefined
                                : claimState === ClaimState.CLAIMED
                                ? 'Test assets Claimed'
                                : 'Address not registered'
                            }
                          />
                        </StyledButtonWrapper>
                      </Box>
                    ) : (
                      <StyledButtonWrapper>
                        <Button onClick={toggleWalletModal}>Connect the wallet to claim your test assets</Button>
                      </StyledButtonWrapper>
                    )}
                  </StyledButtonWrapper>
                  <Box margin="0 15px">
                    <LightTooltip title={<FaucetsList />} arrow>
                      <Link
                        display={'flex'}
                        alignItems="center"
                        fontWeight={600}
                        href="https://web.getlaika.app/faucets"
                        target={'_blank'}
                      >
                        Sepolia Faucet
                        <Explore />
                      </Link>
                    </LightTooltip>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Collapse>
      </StyledCardWrapper>

      <StyledCardWrapper>
        <Collapse
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography fontSize={20} fontWeight={600} color={theme.palette.info.main} mr={12}>
                  Experience more novel features of ladder!
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Box>
            <Stack spacing={12} mt={28}>
              <V3TaskItem testnetStatus={testnetV2Status} />

              <RowBetween flexWrap={'wrap'}>
                <Box display={'flex'} width="100%" justifyContent="flex-end" alignItems="center" mt={5}>
                  {testnetV2Status.pairIsFin &&
                    testnetV2Status.buy721Completed &&
                    testnetV2Status.sell721Completed &&
                    testnetV2Status.buy1155Completed &&
                    testnetV2Status.sell1155Completed && (
                      <Typography fontWeight={600} mr={5} color={theme.palette.text.secondary}>
                        Thanks for completing all tasks, you will go directly to the whitelist for the follow-up event
                      </Typography>
                    )}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (!account) {
                        toggleWalletModal()
                      } else {
                        navigate(routes.feedback)
                      }
                    }}
                    sx={{
                      width: 198,
                      height: 52
                    }}
                  >
                    <Typography mr={10} color={theme.palette.info.main} fontWeight={600} fontSize={16}>
                      Submit feedback
                    </Typography>
                    <img src={Pencil} width={20} />
                  </Button>
                </Box>
              </RowBetween>
            </Stack>
          </Box>
        </Collapse>
      </StyledCardWrapper>

      <StyledCardWrapper>
        <Collapse
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography lineHeight={1.5} fontSize={20} fontWeight={600} color={theme.palette.info.main} mr={12}>
                  Leaderboard
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <LeaderBoardBox />
        </Collapse>
      </StyledCardWrapper>

      <StyledCardWrapper id="reward">
        <Collapse
          defaultOpen
          title={
            <RowBetween flexWrap="wrap">
              <Box>
                <Typography fontSize={16} fontWeight={600} color={theme.palette.info.main} mr={12}>
                  Partners
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <V3Rewards />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '35px'
            }}
          >
            <Button
              variant={'contained'}
              sx={{ width: '45%' }}
              onClick={() => {
                navigate(routes.winners)
              }}
            >
              Find Prize Winners here!
            </Button>
            <Typography fontSize={16} color={theme.palette.info.main} mt={16}>
              Mar 7th 19 PM SGT - Mar 13th 19PM SGT
            </Typography>
            <Typography fontSize={16} color={theme.palette.text.secondary} mt={12}>
              SBT Winners will be able to claim their prize over the next 7 days
            </Typography>
          </Box>
        </Collapse>
      </StyledCardWrapper>

      <StyledCardWrapper id="qa">
        <Collapse
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography lineHeight={1.5} fontSize={20} fontWeight={600} color={theme.palette.info.main} mr={12}>
                  Q&A
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Stack spacing={44}>
            <Box mt={56}>
              <StyledQATitle>1. What is Ladder?</StyledQATitle>
              {/* <Table
                  fontSize="15px"
                  header={['Qualification', 'Source', 'Number', 'Note']}
                  rows={qaTableData}
                ></Table> */}
              <StyledQABody>
                {`Ladder is a unique AMM (Automated Market Maker) that will provide instant liquidity for NFT's including ERC-20, ERC-721, ERC-1155.Unlike other NFT marketplaces which operate on an order book style of exchange, Ladder protocol takes a different approach by using Automated Market Makers and limit orders. By doing so, we aim to provide instant swaps for NFTs with low slippage and low fees!`}
                <br />
                <br />
                {`On Ladder protocol, now you can see how much certainty your NFT is backed by, or swap for any NFT in the Pool, or earn a commission for providing liquidity with your NFT.`}
                <br />
                <br />
                {`Ladder builds an infinite door for NFT!`}
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>2. Who can participate in Monopoly?</StyledQATitle>
              <StyledQABody>
                Participants for Ladder Monopoly will include:
                <ul>
                  <li>TranctorDAO SBT Holders</li>
                  <li>AMA WL Registrants</li>
                  <li>Partner Projects Activities</li>
                </ul>
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>3. Partners:</StyledQATitle>
              <StyledQABody>
                Our list of Partners for Monopoly include Starry Nift, Weirdo Ghost Gang, Gritti, Isekai Meta, Furion,
                Genso, Fansi, NEXTPE, Gamespace, and Wonderpals!
                <br />
                Thank you to all of our partners who participated, and to those that contributed to our prize pool in
                order to make Monopoly as great as possible!
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>4. Prizes:</StyledQATitle>
              <StyledQABody>
                Our prize pool contains;
                <br />5 Gritti NFT’s, 5 Genso NFT, 5 Isekai Meta WL, 10 NextType WL,10 Furion WL, 10 Starry Nift WL, 10K
                $GP, 3 Metaboom NFT, 500 Fansi WL.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>5. Prize Split:</StyledQATitle>
              <StyledQABody>
                Prizes will be split as such;
                <br />
                1st Place for each category- 1 Gritti NFT + 1 Genso NFT+ 1 Isekai WL + 1 NextType WL + 1 Furion WL + 1
                StarryNift WL + 2000 $GP + 1 Metaboom NFT + 3 FANSI WL
                <br />
                2nd Place for each category- 1 NextType WL + 1 Furion WL + 1 StarryNift WL + 1000 $GP + 2 FANSI WL
                <br />
                3rd Place for each category- 300$GP + 1 FANSI WL
                <br />
                The Top 20% of all wallet addresses for each category will be rewarded a Ladder Monopoly SBT to
                celebrate their success.
                <br />
                The remaining prizes (2 Gritti NFT, 2 Genso NFT, 2 Isekai WL, 4 NextType WL, 4 Furion WL, 4 StarryNift
                WL, 487 FANSI WL) will be rewarded to the top traders from each project.
                <ul>
                  <li>Please keep in mind that you can only win prizes once*</li>
                  <Image style={{ maxWidth: '100%' }} src={prizepool_icon} />
                </ul>
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>6. How long will Monopoly run for?</StyledQATitle>
              <StyledQABody>February 20th- March 6th</StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>7. Which Network will Monopoly be on?</StyledQATitle>
              <StyledQABody>
                Monopoly will be on the SEPOLIA TEST NETWORK, we recommend getting your Test ETH from a faucet in
                advance from: (<Link href="https://faucet-sepolia.rockx.com">https://faucet-sepolia.rockx.com</Link>).{' '}
                <br />
                More detailed instructions on how to get test ETH will be pinned in our Telegram and Discord channel.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>8. What are the trading competitions for Monopoly</StyledQATitle>
              <StyledQABody>
                The trading simulation will be available for all pools. Every user will begin the simulation with the
                same claimable amount of test assets. Claim yours now!
                <br />
                <br />
                Simulation will go through the entire round and there are three categories we will be looking at for the
                competition.
                <br />
                <br />
                The three categories we will be looking at for the competition include:
                <br />
                <ul>
                  <li>
                    Total asset value
                    <br />
                    {`Definition of asset value: test the asset value in the user's wallet after the event. USD value of NFT + USD value of Token. The top 20% wallet addresses by the end of the contest`}
                  </li>
                  <li>
                    Liquidity Provided
                    <br />
                    Calculate the Daily AVG TVL by dividing the sum of Daily AVG TVL’s divided by the number of days
                    within Ladder Monopoly Competition. The top 20% wallet addresses by the end of the contest
                  </li>
                  <li>
                    Top Volume Traded
                    <br />
                    Total amount of Volume a user has from Start date to end date of Monopoly (Easy for users who don’t
                    trade often)
                  </li>
                </ul>
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>6. What happens after Monopoly?</StyledQATitle>
              <StyledQABody>
                We can expect to have more community activities following Monopoly leading up to our Mainnet Launch!
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
        </Collapse>
      </StyledCardWrapper>
    </Stack>
  )
}

function LeaderBoardBox() {
  const isDarkMode = useIsDarkMode()
  const curChainId = ChainId.SEPOLIA
  const { account } = useActiveWeb3React()

  // const v3PoolTop10 = useV3PoolTop10(curChainId)
  // const topPairRows = useMemo(
  //   () =>
  //     v3PoolTop10?.map((item, index) => {
  //       const nftInfo =
  //         item.token0.type === Mode.ERC721 || item.token0.type === Mode.ERC1155
  //           ? item.token0
  //           : item.token1.type === Mode.ERC721 || item.token1.type === Mode.ERC1155
  //           ? item.token1
  //           : undefined
  //       return [
  //         index + 1,
  //         <ShowTopPoolsCurrencyBox
  //           key={index}
  //           chainId={curChainId}
  //           pair={item.pair}
  //           token0Info={item.token0}
  //           token1Info={item.token1}
  //         />,
  //         formatMillion(Number(item.tvl) || 0, '$ ', 2),
  //         formatMillion(Number(item.Volume) || 0, '$ ', 2),
  //         nftInfo ? formatMillion(Number(nftInfo.price) || 0, '$ ', 2) : '-',
  //         nftInfo ? (
  //           <Box display={'flex'} alignItems="center">
  //             {shortenAddress(nftInfo.address)}
  //             <Copy toCopy={nftInfo.address} />
  //           </Box>
  //         ) : (
  //           '-'
  //         )
  //       ]
  //     }) || [],
  //   [curChainId, v3PoolTop10]
  // )

  const { rankList: accountVolumeRankList, accountRank: accountVolumeRank } = useV3AccountVolumeRankTop(curChainId)
  const { rankList: accountAssetsRankList, accountRank: accountAssetsRank } = useV3AccountAssetsRankTop(curChainId)

  const { rankList: accountLiquidityRankList, accountRank: accountLiquidityRank } =
    useV3AccountLiquidityRankTop(curChainId)

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
      isDarkMode ? '#d8ff2029' : '#FDF1BE',
      isDarkMode ? '#ffffff4d' : '#F6F6F6',
      'rgba(209, 89, 57, 0.2)'
    ]
    if (account) _bgcolors.unshift('rgba(31, 152, 152, 0.1)')
    return _bgcolors
  }, [account, isDarkMode])

  return (
    <Box>
      <Box
        sx={{
          mt: 20,
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
        />
        <LeaderBoardRank
          rows={topLiquidityValue}
          bgcolors={bgcolors}
          title="Top Liquidity Provided"
          helper="Update once an hour"
        />
        <LeaderBoardRank rows={topVolumeTraded} bgcolors={bgcolors} title="Top Volume Traded" />
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
  minHeight
}: {
  headers?: string[]
  title: string
  rows: (string | number | JSX.Element)[][]
  bgcolors?: string[]
  minHeight?: number
  helper?: string
}) {
  const theme = useTheme()
  const isSmDown = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  return (
    <Box>
      <Box>
        <Box
          sx={{
            marginLeft: 20,
            padding: '10px 28px',
            color: theme => theme.palette.primary.main,
            backgroundColor: 'rgba(31, 152, 152, 0.1)',
            borderRadius: '12px 12px 0px 0px',
            display: 'inline-block'
          }}
        >
          <Typography display={'flex'} alignItems="center" fontWeight={600}>
            {title}
            {helper && <QuestionHelper style={{ marginLeft: 5 }} text={helper} />}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          padding: '1.4px',
          backgroundSize: '105% 105%',
          borderRadius: '12px',
          backgroundImage: `linear-gradient(to bottom , #1F9898 ,#fdd000, #ff00ac, #1F9898)`
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '12px',
            padding: '10px',
            minHeight: minHeight || {
              md: account ? 850 : 776,
              xs: 'unset'
            },
            maxWidth: '100%',
            overflowX: 'auto'
          }}
        >
          <V3TestnetTable
            fontSize={isSmDown ? '12px' : '16px'}
            bgcolors={bgcolors}
            rows={rows}
            header={headers || ['#', 'User', 'Value']}
          ></V3TestnetTable>
        </Box>
      </Box>
    </Box>
  )
}

function Banner({ setOpenTrue }: { setOpenTrue: () => void }) {
  const isDarkMode = useIsDarkMode()

  const activeTimeStatus = useMemo(() => {
    const curTime = new Date().getTime()
    if (curTime < v3ActiveTimeStamp[0]) {
      return 'soon'
    } else if (curTime >= v3ActiveTimeStamp[0] && curTime < v3ActiveTimeStamp[1]) {
      return 'active'
    }
    return 'end'
  }, [])
  return (
    <Box
      sx={{
        mt: 0,
        backgroundColor: 'white',
        backgroundImage: isDarkMode ? '' : `url(${bannerImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto 100%',
        backgroundPosition: {
          lg: 'right',
          xs: 'left'
        },
        minHeight: '200px'
      }}
    >
      <Box
        sx={{
          width: 370,
          maxWidth: '100%',
          padding: {
            md: '120px 10px 60px 60px',
            xs: '20px 10px'
          }
        }}
      >
        <Image src={v3_logo} alt="" width={'100%'} />
        <Box mt={10}>
          <BannerText>Monopoly {activeTimeStatus === 'soon' ? 'start' : 'end'} in</BannerText>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto auto',
              gap: '0 10px',
              maxWidth: { xs: '60%', sm: 'unset' },
              '& span': {
                fontSize: { sm: 48, xs: 30 }
              }
            }}
          >
            <Timer
              onZero={() => setOpenTrue()}
              timer={activeTimeStatus === 'soon' ? v3ActiveTimeStamp[0] : v3ActiveTimeStamp[1]}
              getNumber
            />
            <Typography fontWeight={500}>Day</Typography>
            <Typography fontWeight={500}>Hours</Typography>
            <Typography fontWeight={500}>Minutes</Typography>
          </Box>
        </Box>
        <RowBetween mt={40}>
          <Button
            sx={{
              background: theme => theme.palette.primary.main,
              color: isDarkMode ? '#000' : '#fff',
              mr: 10
            }}
            onClick={() => scrollToElement('qa')}
          >
            View rules
          </Button>
          <Button onClick={() => scrollToElement('reward')} variant="outlined">
            View Rewards
          </Button>
        </RowBetween>
      </Box>
    </Box>
  )
}

function MyRankItem({ num }: { num: string | number }) {
  return (
    <Box key={1} sx={{ marginLeft: -13, position: 'relative' }}>
      <Image width={40} src={v2_my_icon} />
      <Typography
        textAlign={'center'}
        sx={{
          position: 'absolute',
          width: 40,
          top: 10
        }}
      >
        {num}
      </Typography>
    </Box>
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
