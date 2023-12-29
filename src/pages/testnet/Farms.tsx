import { Box, styled, Typography } from '@mui/material'
import { FakeData, TestNetCardList } from './TestNetCard'

export const Container = styled(Box)`
  width: 100%;
  max-width: 1440px;
  padding: 26px 45px;
`
export const Title = styled(Typography)`
  font-size: 24px;
  line-height: 36px;
  font-family: 'Monument Extended';
`
export default function Farms() {
  return (
    <Container>
      <Title>Farms</Title>
      <Typography>Stake ERC20 and NFT Liquidity Pool (LP) tokens to earn LAD.</Typography>
      <TestNetCardList list={FakeData} />
    </Container>
  )
}
