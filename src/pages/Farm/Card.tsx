import { Box, Button, styled, Typography } from '@mui/material'
import DefaultAvatar from 'assets/svg/default_avatar.svg'
import ARPIcon from 'assets/svg/MathOperations.svg'
import { useMemo } from 'react'
import { CardTYPE, CenterRow } from '.'
import useModal from 'hooks/useModal'
import StakeNftSelectModal from 'components/Modal/StakeNftSelectModal'
import { Token721 } from 'constants/token/token721'
import { filter721 } from 'utils/checkIs1155'
import { useWalletModalToggle } from 'state/application/hooks'
import { useViewRewardCallBack, useClaimRewardCallBack } from 'hooks/useStakeCallback'
import { useActiveWeb3React } from 'hooks'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'

export interface TestNetData {
  avatar?: string
  name?: string
  state?: string
  apr?: string
  earn?: string
  ladEarn?: string
}

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

export const Grid = styled(Box)`
  display: grid;
  gap: 20px;
  margin-top: 30px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`

export function TestNetCard({
  data,
  onClick,
  setModalStatus,
  type,
  nft721
}: {
  data: TestNetData
  type: number
  onClick?: (arg: TestNetData) => void
  setModalStatus?: () => void
  nft721?: Token721
}) {
  const { account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const toggleWalletModal = useWalletModalToggle()
  const { result: rewards } = useViewRewardCallBack()
  const { ClaimReward } = useClaimRewardCallBack()
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
    if (type === CardTYPE.nft) {
      return (
        <Button
          style={{ fontSize: '14px', height: '44px', marginTop: '8px' }}
          onClick={() => {
            showModal(<StakeNftSelectModal onDismiss={hideModal} collection={is721} />)
          }}
        >
          Stake LP
        </Button>
      )
    }
    if (type === CardTYPE.box) {
      return (
        <Button
          style={{ fontSize: '14px', height: '44px', marginTop: '8px' }}
          onClick={() => {
            setModalStatus && setModalStatus()
            onClick && onClick(data)
          }}
        >
          Stake LP
        </Button>
      )
    }
    return <Button>Stake</Button>
  }, [account, data, hideModal, is721, onClick, setModalStatus, showModal, toggleWalletModal, type])

  return (
    <CardBg>
      <CenterRow>
        <img src={data?.avatar || DefaultAvatar} />
        <BlackText sx={{ fontSize: '18px' }}>{data.name}</BlackText>
      </CenterRow>
      <BetweenRowBg>
        <Hint>APR</Hint>
        <Box display={'flex'} alignItems={'center'} gap={'5px'}>
          <BlackText>{data?.apr}</BlackText>
          <img src={ARPIcon} />
        </Box>
      </BetweenRowBg>
      <BetweenRowBg>
        <Hint>Earn</Hint>
        <BlackText>{data?.earn} AMMX</BlackText>
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
          <BlackText>{rewards ? rewards?.toString() : 0}</BlackText>
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
