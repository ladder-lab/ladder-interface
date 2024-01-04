import { Box, Typography } from '@mui/material'
import { CardTYPE, Container, Title } from '.'
import { useTrackedToken721List } from 'state/user/hooks'
import { Grid, TestNetCard } from './Card'
import { Loader } from 'components/AnimatedSvg/Loader'
import { erc721contract } from 'hooks/useStakeCallback'

export default function NFTStaking() {
  const { loading, data } = useTrackedToken721List()

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
          <>
            {!!data.length ? (
              <Grid>
                {data
                  .filter(v => v.address === erc721contract)
                  .map((item, idx) => {
                    return <TestNetCard type={CardTYPE.nft} key={idx} nft721={item} />
                  })}
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
  )
}
