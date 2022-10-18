import { Box, Typography, useTheme, Button, styled, Stack, Link } from '@mui/material'
import { ExternalLink } from 'theme/components'
import { useIsDarkMode } from 'state/user/hooks'
import BgLight from 'assets/images/bg_light.png'
import BgDark from 'assets/images/bg_dark.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from 'hooks'
import { ClaimState, useTestnetClaim } from 'hooks/useTestnetClaim'
import ActionButton from 'components/Button/ActionButton'
import { Socials } from 'constants/socialLinks'
import Image from 'components/Image'
import { isAddress } from 'utils'
import Collapse from 'components/Collapse'
import Input from 'components/Input'
import ClaimableItem from './ClaimableItem'
import TaskBox from './TaskItem'
import { Timer } from 'components/Timer'
import { useMemo, useState } from 'react'
import { Token } from 'constants/token'
import { ChainId } from 'constants/chain'

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

const StyledCardWrapper = styled(Box)(({ theme }) => ({
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

const faucetTokens = [
  {
    token: new Token(ChainId.GÖRLI, '0xd4C70114d12b05eACE5749dF0878891570BB0BEE', 18, 'mt', 'MTEST'),
    amount: '1,000'
  }
]

export default function Testnet() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const isDownSm = useBreakpoint('sm')
  const toggleWalletModal = useWalletModalToggle()
  const { account } = useActiveWeb3React()
  const { testnetClaim, claimState } = useTestnetClaim(account || undefined)
  const [queryAddress, setQueryAddress] = useState('')
  const { claimState: queryClaimState } = useTestnetClaim(isAddress(queryAddress) ? queryAddress : undefined)

  // const qaTableData = [
  //   [
  //     'SBT Holder (ETH Mergee)',
  //     'Merge SOUve SBT',
  //     '',
  //     <Link
  //       key={0}
  //       sx={{
  //         wordBreak: 'break-all',
  //         color: theme.palette.text.primary,
  //         textDecorationColor: theme.palette.text.primary
  //       }}
  //       target="_blank"
  //       href="https://app.quest3.xyz/event/12514312412"
  //     >
  //       https://app.quest3.xyz/event/12514312412
  //     </Link>
  //   ],
  //   ['', 'Platinum GENESIS SBT', '', ''],
  //   ['', 'Platinum FINALITY SBT', '', ''],
  //   [
  //     'SBT Holder (Ladder Testnet-MUADAO)',
  //     'Ladder Testnet SBT',
  //     '1657',
  //     <Link
  //       key={0}
  //       sx={{
  //         wordBreak: 'break-all',
  //         color: theme.palette.text.primary,
  //         textDecorationColor: theme.palette.text.primary
  //       }}
  //       target="_blank"
  //       href="https://app.quest3.xyz/event/12514312412"
  //     >
  //       https://app.quest3.xyz/event/12514312412
  //     </Link>
  //   ],
  //   ['NFT Bluechip + Hot Project Holder', 'Bluechip NFT', '', 'BAYC / MAYC / CRYPTOPUNK / MOONBIRDS / AZUKI / DOODLES'],
  //   ['', 'Top 10 ETH gas burning projects', '', ''],
  //   ['Gleam Airdrops', 'Gleam #1', '', ''],
  //   ['', 'Gleam #2', '', ''],
  //   ['Partners Whitelist', '[TBD]', '', '']
  // ]

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

  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          // width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
          // pt: theme.height.header,
          // pb: 120,
          padding: `${theme.height.header} 16px 120px`,
          pt: 120,
          backgroundImage: `url(${isDarkMode ? BgDark : BgLight})`,
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: 20,
              md: 45
            },
            fontWeight: 700,
            textAlign: 'center',
            maxWidth: 1200
          }}
        >
          Providing liquidity for your NFT swaps
        </Typography>
        <Typography
          sx={{
            fontSize: {
              xs: 16,
              md: 20
            },
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: 900
          }}
        >
          Ladder Protocol a decentralized NFT AMM,enabling instantd NFT swaps and better price discovery. In fact,
          Ladder is the first protocol that allows you to Swap an NFT as easily as swapping a Token.
        </Typography>
        <Typography mt={60}>Want to know about Ladder Testnet or Mining, Airdrop? Come and discuss</Typography>
        <Box>
          <Stack direction={'row'} spacing={31}>
            {Object.keys(Socials).map((key, idx) => {
              return (
                <ExternalLink
                  key={idx}
                  href={Socials[key as keyof typeof Socials].link}
                  sx={{
                    transform: 'rotate3d(0)',
                    '&:hover': {
                      transform: 'rotate3d(0,1,0,180deg)'
                    }
                  }}
                >
                  <Image
                    src={Socials[key as keyof typeof Socials].logo1}
                    alt={`social-media-link-${Socials[key as keyof typeof Socials].title}-bg`}
                    style={{
                      width: isDownSm ? 50 : 60
                    }}
                  />
                </ExternalLink>
              )
            })}
          </Stack>
        </Box>
      </Box>

      <Stack
        spacing={40}
        sx={{
          width: '100%',
          height: '100%',
          background: theme.palette.background.paper,
          padding: {
            xs: '42px 16px 114px',
            md: '70px 45px 40px'
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1144px',
            margin: 'auto'
          }}
        >
          <StyledCardWrapper>
            <Collapse
              defaultOpen
              title={
                <RowBetween flexWrap={'wrap'}>
                  <Box display={'flex'} flexWrap={'wrap'}>
                    <Typography fontSize={16} fontWeight={600} color={theme.palette.info.main} mr={12}>
                      Round 1
                    </Typography>
                    <Typography fontSize={16} sx={{ mt: { xs: 6, sm: 0 } }} fontWeight={600}>
                      Ladder ETH Main Testnet-Round 1
                    </Typography>
                  </Box>
                  <Typography fontSize={16} sx={{ mt: { xs: 6 } }} fontWeight={600}>
                    Distance to end: <Timer timer={1665906135000} />
                  </Typography>
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
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '5fr 5fr 1.6fr' },
                        alignItems: 'center',
                        gap: { xs: '10px', sm: '24px 10px' },
                        padding: '20px',
                        backgroundColor: theme.palette.background.default,
                        borderRadius: theme.shape.borderRadius + 'px'
                      }}
                    >
                      {faucetTokens.map((item, index) => (
                        <ClaimableItem key={index} token={item.token} amount={item.amount} />
                      ))}
                      <ClaimableItem nftInfo={{ name: 'laddertest-erc1155' }} amount={'5'} />
                      <ClaimableItem nftInfo={{ name: 'laddertest-erc721' }} amount={'20'} />
                    </Box>
                    <Box display={'flex'} flexDirection="row-reverse" mt={16}>
                      <StyledButtonWrapper>
                        {account ? (
                          <StyledButtonWrapper>
                            <ActionButton
                              pending={claimState === ClaimState.UNKNOWN}
                              onAction={testnetClaim}
                              actionText="Claim your test assets"
                              error={
                                claimState === ClaimState.UNCLAIMED
                                  ? undefined
                                  : claimState === ClaimState.CLAIMED
                                  ? 'Test assets Claimed'
                                  : 'Address not registered'
                              }
                            />
                          </StyledButtonWrapper>
                        ) : (
                          <StyledButtonWrapper>
                            <Button onClick={toggleWalletModal}>Connect the wallet to claim your test assets</Button>
                          </StyledButtonWrapper>
                        )}
                      </StyledButtonWrapper>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <StepTitle step={3} title="Complete testnet tasks" />
                  <Stack spacing={12} mt={28}>
                    <TaskBox />
                  </Stack>
                </Box>
              </Stack>
            </Collapse>
          </StyledCardWrapper>

          <StyledCardWrapper>
            <Collapse
              defaultOpen
              title={
                <RowBetween flexWrap="wrap">
                  <Box display={'flex'} flexWrap="wrap">
                    <Typography fontSize={16} fontWeight={600} color={theme.palette.info.main} mr={12}>
                      Round 2
                    </Typography>
                    <Typography fontSize={16} sx={{ mt: { xs: 6, sm: 0 } }} fontWeight={600}>
                      Ladder ETH Main Testnet-Round 2
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: { xs: 6 } }} fontSize={16} fontWeight={600}>
                    coming soon
                  </Typography>
                </RowBetween>
              }
            >
              <Typography
                fontSize={16}
                mt={38}
                textAlign="center"
                color={theme.palette.text.secondary}
                fontWeight={600}
              >
                We have more plans in the works, so stay tuned!
              </Typography>
            </Collapse>
          </StyledCardWrapper>

          <StyledCardWrapper>
            <Collapse
              defaultOpen
              title={
                <RowBetween>
                  <Box display={'flex'}>
                    <Typography fontSize={16} fontWeight={600} color={theme.palette.info.main} mr={12}>
                      Q&A
                    </Typography>
                  </Box>
                </RowBetween>
              }
            >
              <Stack spacing={44}>
                <Box mt={56}>
                  <StyledQATitle>1. Who can participate in this R1 Testnet</StyledQATitle>
                  {/* <Table
                  fontSize="15px"
                  header={['Qualification', 'Source', 'Number', 'Note']}
                  rows={qaTableData}
                ></Table> */}
                  <StyledQABody>Planning</StyledQABody>
                </Box>
                <Box>
                  <StyledQATitle>2. What happens after R1 testnet?</StyledQATitle>
                  <StyledQABody>Planning</StyledQABody>
                </Box>
                <Box>
                  <StyledQATitle>3. What is a Ladder?</StyledQATitle>
                  <StyledQABody>Slogan/Introduction</StyledQABody>
                </Box>
                <Box>
                  <StyledQATitle>4. Where can I see upcoming event updates?</StyledQATitle>
                  <StyledQABody>social link entry</StyledQABody>
                </Box>
              </Stack>
            </Collapse>
          </StyledCardWrapper>
        </Box>
      </Stack>
    </Box>
  )
}

function StepTitle({ title, step }: { step: number | string; title: string }) {
  const theme = useTheme()
  return (
    <Box display={'flex'}>
      <Typography fontSize={16} fontWeight={600} color={theme.palette.text.secondary} mr={12}>
        Step {step}
      </Typography>
      <Typography fontSize={16} fontWeight={600}>
        {title}
      </Typography>
    </Box>
  )
}
