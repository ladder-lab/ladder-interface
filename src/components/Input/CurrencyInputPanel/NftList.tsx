import { Grid, Box, Typography, useTheme } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'

const dummyNfts = [
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' },
  { title: 'Tickets for the community #56', image: SampleNftImg, address: '0xKos3...r87ujv' }
]

export default function NftList() {
  return (
    <Grid container spacing={20}>
      {dummyNfts.map(({ title, image, address }, idx) => (
        <Grid item xs={12} md={3} key={idx}>
          <NftCard key={idx} title={title} image={image} address={address} />
        </Grid>
      ))}
    </Grid>
  )
}

function NftCard({ title, image, address }: { title: string; image: string; address: string }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        alignItems: 'center',
        borderRadius: '8px',
        background: '#F6F6F6',
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.15)',
          background: '#FFFFFF'
        }
      }}
    >
      <Image src={image} style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }} />
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, fontWeight: 600, mt: 8, mb: 8 }}>
        {title}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {address}
      </Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        12 /<span style={{ color: theme.palette.text.secondary }}>1 M</span>
      </Typography>
    </Box>
  )
}
