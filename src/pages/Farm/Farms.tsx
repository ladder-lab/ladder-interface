import { Grid, TestNetCard } from './Card'
import { CardTYPE, Container, Title } from '.'
import { Typography, Box } from '@mui/material'
import tUSDCImg from 'assets/images/tUSDC.jpg'
import { Token } from 'constants/token'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { Loader } from 'components/AnimatedSvg/Loader'
import { useEffect, useState } from 'react'

export const LIQUIDITY_ADDRESS = '0x7817131122358f04f387D002185779d7333737a4'

const LPTokens: {
  [chainId in ChainId]?: {
    LpToken: Token
    currencyAUrl: string
    currencyBUrl: string
  }[]
} = {
  [ChainId.SEPOLIA]: [
    {
      LpToken: new Token(11155111, LIQUIDITY_ADDRESS, 18, 'Ladder LP', 'LAD-LP'),
      currencyAUrl: tUSDCImg,
      currencyBUrl: 'https://fansi-static.s3.ap-southeast-1.amazonaws.com/MetaBoom/NFT/GENI/MetaBoom-KEE91AGA7C.png'
    }
  ]
}

export default function Farms() {
  const { chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(true)
  const tokens = LPTokens[chainId || ChainId.SEPOLIA]
  console.log('tokens=>', tokens)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <>
      <Container>
        <Title>Farms</Title>
        <Typography>Stake ERC20 and NFT Liquidity Pool (LP) tokens to earn LAD.</Typography>

        <>
          {loading ? (
            <Box minHeight={332} display="flex" justifyContent="center" alignItems="center">
              <Loader size={90} />
            </Box>
          ) : (
            <>
              {tokens && !!tokens.length ? (
                <Grid>
                  {tokens?.map((item, index) => (
                    <TestNetCard
                      key={index.toString()}
                      type={CardTYPE.box}
                      currency={item.LpToken}
                      currencyAUrl={item.currencyAUrl}
                      currencyBUrl={item.currencyBUrl}
                    />
                  ))}
                </Grid>
              ) : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={50}>
                  <Typography
                    sx={{
                      fontSize: 18,
                      color: '#999'
                    }}
                  >
                    No Data
                  </Typography>
                </Box>
              )}
            </>
          )}
        </>
      </Container>
    </>
  )
}
