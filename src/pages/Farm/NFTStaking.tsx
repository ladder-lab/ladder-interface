import { Box, Typography } from '@mui/material'
import { CardTYPE, Container, Title } from '.'
import { useTrackedToken721List } from 'state/user/hooks'
import { Grid, TestNetCard, TestNetData } from './Card'
import { Loader } from 'components/AnimatedSvg/Loader'

export default function NFTStaking() {
  const { loading, data } = useTrackedToken721List()
  console.log('🚀 ~ file: NFTStaking.tsx:8 ~ NFTStaking ~ data:', data, loading)
  return (
    <Container>
      <Title>NFT Staking</Title>
      <Typography>Stake Token To Get LAD Rewards</Typography>
      <>
        {loading ? (
          <Box minHeight={332} display="flex" justifyContent="center" alignItems="center">
            <Loader size={90} />
          </Box>
        ) : (
          <Grid>
            {data.map((item, idx) => {
              const showData: TestNetData = {
                avatar: '',
                name: item.name,
                state: '123',
                apr: '1',
                earn: '2',
                ladEarn: '4'
              }

              return <TestNetCard type={CardTYPE.nft} key={idx} data={showData} nft721={item} />
            })}
          </Grid>
        )}
      </>
    </Container>
  )
}
