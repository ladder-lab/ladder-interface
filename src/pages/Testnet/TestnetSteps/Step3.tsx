import { useActiveWeb3React } from '../../../hooks'
import { useTestnetClaim } from '../../../hooks/useTestnetClaim'
import { useUserHasSubmitted } from '../../../state/transactions/hooks'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Box, Link, Typography } from '@mui/material'
import { LightTooltip } from '../../../components/TestnetV3Mark'
import ActionButton from '../../../components/Button/ActionButton'
import { StepDescText, StepNameText, StepText } from './Styled'
import { ReactComponent as Explore } from 'assets/svg/explore.svg'

function FaucetsList() {
  const list = [
    {
      name: 'Faucet Link',
      link: 'https://sepolia-faucet.pk910.de/'
    }
    // {
    //   name: 'Ethereum Sepolia | Coinbase Faucet',
    //   link: 'https://coinbase.com/faucets/ethereum-sepolia-faucet'
    // },
    // {
    //   name: 'Sepolia Faucet',
    //   link: 'https://sepoliafaucet.net/'
    // },
    // {
    //   name: 'All That Node | Multi-chain API & Dev-tools, Web3 Infrastructure',
    //   link: 'https://www.allthatnode.com/faucet/ethereum.dsrv'
    // },
    // {
    //   name: 'Laika',
    //   link: 'https://web.getlaika.app/faucets'
    // }
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

export default function Step3({ step }: { step: number }) {
  const { account } = useActiveWeb3React()
  const { testnetClaim } = useTestnetClaim(account || undefined)
  const { submitted, complete } = useUserHasSubmitted(`${account}_claim4`)
  const isDownMD = useBreakpoint('md')

  return (
    <Box
      flex={1}
      sx={{
        // opacity: step > 1 ? 1 : 0.4,
        opacity: step > 2 ? 1 : 0.4,
        minHeight: '200px',
        position: 'relative'
      }}
    >
      {/*<StepText>Step 3</StepText>*/}
      <StepText>Step 4</StepText>
      <StepNameText>Claim your test assets</StepNameText>
      <LightTooltip title={<FaucetsList />} arrow>
        <Link
          display={'flex'}
          alignItems="center"
          fontWeight={600}
          href="https://sepoliafaucet.com/"
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
          width={'247px'}
          // pending={claimState === ClaimState.UNKNOWN}
          onAction={testnetClaim}
          // disableAction={new Date() < new Date(v3ActiveTimeStamp[0])}
          // disableAction={!isOpenClaim && activeTimeStatus !== 'active'}
          actionText="Claim"
          error={submitted || complete ? 'Test assets Claimed' : undefined}
          // disableAction={step < 2}
          disableAction={step < 3}
        />
      </Box>
    </Box>
  )
}
