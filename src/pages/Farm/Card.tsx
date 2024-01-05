import { Box, Button, styled, Typography } from '@mui/material'
import DefaultAvatar1 from 'assets/svg/default_pair_logo1.svg'
import DefaultAvatar2 from 'assets/svg/default_pair_logo2.svg'
import ARPIcon from 'assets/svg/MathOperations.svg'
import { useMemo } from 'react'
import { CardTYPE, CenterRow } from '.'
import useModal from 'hooks/useModal'
import StakeNftSelectModal from 'components/Modal/StakeNftSelectModal'
import { Token721 } from 'constants/token/token721'
import { filter721 } from 'utils/checkIs1155'
import { useWalletModalToggle } from 'state/application/hooks'
import { useViewRewardCallBack, useClaimRewardCallBack, useUserStakeInfoCallBack } from 'hooks/useStakeCallback'
import { useActiveWeb3React } from 'hooks'
import { BigNumber } from 'ethers'
import { MetaDataLogo } from 'components/Modal/Erc721IdSelectionModal'
import StackErc20Modal from 'components/Modal/StakeErc20Modal'
import { Token } from 'constants/token'
import { CurrencyAmount } from '@ladder/sdk'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'

const CardBg = styled(Box)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  border-radius: 12px;
`
const RowBg = styled(Box)`
  background: #f6f6f6;
  padding: 16px 12px;
  border-radius: 8px;
`
const BlackText = styled(Typography)`
  color: #333333;
  word-break: break-word;
`

const BetweenRow = styled(Box)`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const BetweenRowBg = styled(RowBg)`
  display: flex;
  justify-content: space-between;
`
const Row = styled(Box)`
  display: flex;
  gap: 4px;
  align-items: baseline;
`
const Hint = styled(Typography)`
  color: #828282;
  font-weight: 500;
  font-size: 16px;
`

export const Grid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '20px',
  marginTop: '30px',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr 1fr'
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'unset'
  }
}))

export function TestNetCard({
  type,
  currency,
  nft721,
  currencyAUrl,
  currencyBUrl
}: {
  type: number
  currency?: Token
  nft721?: Token721
  currencyAUrl?: string
  currencyBUrl?: string
}) {
  const _token: any = currency
  const { account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const toggleWalletModal = useWalletModalToggle()
  const { result: StakeInfo } = useUserStakeInfoCallBack(type === CardTYPE.nft ? nft721?.address : _token?.address)
  const { result: rewards } = useViewRewardCallBack(type === CardTYPE.nft ? nft721?.address : _token?.address)
  const { ClaimReward } = useClaimRewardCallBack(type === CardTYPE.nft ? nft721?.address : _token?.address)
  const RewardNum = useMemo(() => {
    return rewards && rewards?.div(BigNumber.from('10').pow(18)).toString()
  }, [rewards])

  const StakeNFTAmount: string | undefined = useMemo(() => {
    return StakeInfo?.amount && StakeInfo?.amount.toString()
  }, [StakeInfo?.amount])

  const StakeLPAmount: CurrencyAmount | undefined = useMemo(() => {
    return StakeInfo?.amount && CurrencyAmount.ether(StakeInfo?.amount.toString())
  }, [StakeInfo?.amount])

  const is721 = filter721(nft721)

  const bt = useMemo(() => {
    if (!account) {
      return (
        <Button
          sx={{
            padding: '10px',
            minHeight: 'unset',
            height: '40px',
            width: '100%',
            mt: 10
          }}
          onClick={toggleWalletModal}
        >
          Connect Wallet
        </Button>
      )
    }

    return (
      <Button
        style={{ fontSize: '14px', height: '44px', marginTop: '8px' }}
        onClick={() => {
          if (currency && type === CardTYPE.box) {
            showModal(<StackErc20Modal onDismiss={hideModal} currency={currency} />)
          }
          if (type === CardTYPE.nft) showModal(<StakeNftSelectModal onDismiss={hideModal} collection={is721} />)
        }}
      >
        Stake LP
      </Button>
    )
  }, [account, currency, hideModal, is721, showModal, toggleWalletModal, type])

  console.log('type=>>', type === CardTYPE.nft, StakeNFTAmount, StakeLPAmount?.toSignificant())

  return (
    <CardBg>
      <CenterRow>
        <Box
          sx={{
            position: 'relative',
            pr: 11
          }}
        >
          {type === CardTYPE.nft && is721 ? (
            <MetaDataLogo
              token={is721}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%'
              }}
            />
          ) : (
            <img
              src={currencyAUrl ?? DefaultAvatar1}
              width={48}
              height={48}
              style={{
                borderRadius: '50%'
              }}
            />
          )}

          <img
            src={currencyBUrl ?? DefaultAvatar2}
            width={26}
            height={26}
            style={{
              borderRadius: '50%',
              position: 'absolute',
              right: 3,
              bottom: 0
            }}
          />
        </Box>

        <BlackText sx={{ fontSize: '18px' }}>{nft721?.name || currency?.symbol || '--'}</BlackText>
      </CenterRow>
      <BetweenRowBg>
        <Hint>APR</Hint>
        <Box display={'flex'} alignItems={'center'} gap={'5px'}>
          <BlackText>{'1%'}</BlackText>
          <img src={ARPIcon} />
        </Box>
      </BetweenRowBg>

      <RowBg>
        <Row>
          <BlackText>AMMX</BlackText>
          <Hint>earned:</Hint>
        </Row>
        <BetweenRow
          sx={{
            '.Mui-disabled': {
              background: '#e1e1e1 !important'
            }
          }}
        >
          <BlackText>{RewardNum || 0}</BlackText>
          <Button
            style={{
              fontSize: '14px',
              height: 'auto',
              width: 'fit-content'
            }}
            disabled={!account || !rewards || rewards?.toString() === '0'}
            onClick={() => {
              ClaimReward()
            }}
          >
            Harvest
          </Button>
        </BetweenRow>
      </RowBg>
      {((StakeNFTAmount && StakeNFTAmount !== '0') || StakeLPAmount?.greaterThan('0')) && (
        <RowBg>
          <Row>
            <BlackText>Redeem principal</BlackText>
          </Row>
          <BetweenRow
            sx={{
              '.Mui-disabled': {
                background: '#e1e1e1 !important'
              }
            }}
          >
            <BlackText>{type === CardTYPE.nft ? StakeNFTAmount || 0 : StakeLPAmount?.toSignificant()}</BlackText>
            <Button
              style={{
                fontSize: '14px',
                height: 'auto',
                width: 'fit-content'
              }}
              disabled={!account || !StakeNFTAmount || StakeNFTAmount === '0'}
              onClick={() => {
                ClaimReward(StakeNFTAmount)
              }}
            >
              Withdraw
            </Button>
          </BetweenRow>
        </RowBg>
      )}

      <RowBg>
        <Row>
          <Typography>AMMX</Typography>
          <Hint>staked</Hint>
        </Row>
        {bt}
      </RowBg>
    </CardBg>
  )
}
