import { Box, Button, styled, Typography } from '@mui/material'
import DefaultAvatar from 'assets/svg/default_avatar.svg'
import ARPIcon from 'assets/svg/MathOperations.svg'
import { useCallback, useState } from 'react'
import { CardTYPE, CenterRow } from '.'
import useModal from 'hooks/useModal'
import StakeNftSelectModal from 'components/Modal/StakeNftSelectModal'
import { Token721 } from 'constants/token/token721'
import { filter721 } from 'utils/checkIs1155'

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
  const { showModal, hideModal } = useModal()
  const [tokenIds, onSetTokenIds] = useState<any[]>()
  const handleTokenIds = useCallback(
    (tokens: Token721[]) => {
      const list = tokens.map(({ tokenId }) => tokenId)
      onSetTokenIds(list as any[])
    },
    [onSetTokenIds]
  )

  console.log('🚀 ~ file: Card.tsx:79 ~ tokenIds:', tokenIds)
  const is721 = filter721(nft721)

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
        <BetweenRow>
          <BlackText>{data?.ladEarn}</BlackText>
          <Button
            style={{
              fontSize: '14px',
              height: 'auto',
              width: 'fit-content'
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
        <Button
          style={{ fontSize: '14px', height: '44px', marginTop: '8px' }}
          onClick={() => {
            if (type === CardTYPE.nft && nft721) {
              console.log('nft721=>', 1)
              showModal(
                <StakeNftSelectModal onDismiss={hideModal} collection={is721} onSelectSubTokens={handleTokenIds} />
              )
            }
            if (type === CardTYPE.box) {
              setModalStatus && setModalStatus()
              onClick && onClick(data)
            }
          }}
        >
          Stake LP
        </Button>
      </RowBg>
    </CardBg>
  )
}
