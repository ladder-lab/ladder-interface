import { Box, styled, Typography } from '@mui/material'
// import Close from 'assets/svg/close.svg'
import LinkIcon from 'assets/svg/open_new_link.svg'
import { CenterBetweenRow, CenterRow } from 'pages/Farm'
import Modal from '.'
import { AllTokens } from 'models/allTokens'

const RoiGrid = styled(Box)`
  margin-top: 15px;
  display: grid;
  grid-template-columns: 150px 122px 171px;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
`

const RoiGridTitle = styled(Typography)`
  background: #f6f6f6;
  color: #828282;
  padding: 9px 20px;
`

const FakeRoiData = [
  {
    timeframe: '1d',
    roi: '0.16%',
    ladPerK: '0.04'
  },
  {
    timeframe: '7d',
    roi: '1.20%',
    ladPerK: '0.3'
  },
  {
    timeframe: '30d',
    roi: '5.30%',
    ladPerK: '1.32'
  },
  {
    timeframe: '365d (APY)',
    roi: '87.64%',
    ladPerK: '21.82'
  }
]
const RoiText = styled(Typography)`
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  margin-left: 20px;
`

export default function RoiModal({ onDismiss, currency }: { onDismiss: () => void; currency?: AllTokens }) {
  console.log('🚀 ~ file: StakeErc20RoiModal.tsx:52 ~ RoiModal ~ currency:', currency)

  return (
    <Modal customOnDismiss={onDismiss} width="100%" maxWidth="550px" closeIcon closeVariant="button" height="350px">
      <CenterBetweenRow justifyContent="space-between">
        <Typography lineHeight={'28px'} fontSize={'24px'} fontWeight={600}>
          ROI
        </Typography>
      </CenterBetweenRow>
      <RoiGrid>
        <RoiGridTitle>TIMEFRAME</RoiGridTitle>
        <RoiGridTitle>ROI</RoiGridTitle>
        <RoiGridTitle>LAD PER: $1000</RoiGridTitle>
        {FakeRoiData.map(frd => {
          return (
            <>
              <RoiText>{frd.timeframe}</RoiText>
              <RoiText>{frd.roi}</RoiText>
              <RoiText>{frd.ladPerK}</RoiText>
            </>
          )
        })}
      </RoiGrid>
      <Typography
        sx={{
          color: '#828282',
          fontSize: '14px',
          lineHeight: '20px',
          marginTop: '22px'
        }}
      >
        Calculated based on current rates. Compounding 1x daily. Rates are
        <br /> estimates provided for your convenience only, and by no means represent
        <br /> guaranteed returns.
      </Typography>
      <CenterRow justifyContent={'center'} mt={28}>
        <a style={{ color: '#1F9898' }}>Get LAD-ASD LP</a>
        <img src={LinkIcon} />
      </CenterRow>
    </Modal>
  )
}
