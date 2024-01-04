import { Grid, TestNetCard } from './Card'
import { CardTYPE, Container, Title } from '.'
import { Typography } from '@mui/material'
import tUSDCImg from 'assets/images/tUSDC.jpg'
import { Token } from 'constants/token'

export const LIQUIDITY_ADDRESS = '0x7817131122358f04f387D002185779d7333737a4'
export const LP_TOKEN = new Token(11155111, LIQUIDITY_ADDRESS, 18, 'Ladder LP', 'LAD-LP')

const currencyAUrl = tUSDCImg
const currencyBUrl = 'https://fansi-static.s3.ap-southeast-1.amazonaws.com/MetaBoom/NFT/GENI/MetaBoom-KEE91AGA7C.png'

export default function Farms() {
  return (
    <>
      <Container>
        <Title>Farms</Title>
        <Typography>Stake ERC20 and NFT Liquidity Pool (LP) tokens to earn LAD.</Typography>
        <Grid>
          <TestNetCard
            type={CardTYPE.box}
            currency={LP_TOKEN}
            currencyAUrl={currencyAUrl}
            currencyBUrl={currencyBUrl}
          />
        </Grid>
      </Container>
    </>
  )
}
