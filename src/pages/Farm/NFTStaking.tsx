import { Box, Typography } from '@mui/material'
import { CardTYPE, Container, Title } from '.'
import { useTrackedToken721List } from 'state/user/hooks'
import { Grid, TestNetCard } from './Card'
import { Loader } from 'components/AnimatedSvg/Loader'
import { erc721contract } from 'hooks/useStakeCallback'
import { useState, useEffect } from 'react'

export default function NFTStaking() {
  const { loading, data } = useTrackedToken721List()
  const [defaultLoading, setDefaultLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => {
      setDefaultLoading(false)
    }, 500)
  }, [])
  return (
    <Container>
      <Title>NFT Staking</Title>
      <Typography>Stake Token To Get LAD Rewards</Typography>
      <>
        {loading || defaultLoading ? (
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
