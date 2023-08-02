import { Box, Typography } from '@mui/material'
import boxBgUrl from 'assets/images/box_bg.png'
import luckBgUrl from 'assets/images/luck_bg.png'
import AirdropStepper from './AirdropStepper'
enum RecommandedType {
  luck = 'luck',
  box = 'box'
}

export default function Recommand({ type }: { type: RecommandedType }) {
  return (
    <Box
      sx={{
        background: `#ffffff url(${type === RecommandedType.box ? boxBgUrl : luckBgUrl}) no-repeat right center`,
        backgroundSize: 'auto 100%',
        maxWidth: theme => theme.width.maxContent,
        width: '100%',
        margin: '0 auto',
        padding: 28,
        borderRadius: 1.2
      }}
    >
      <Typography variant="h5">Recommend</Typography>
      <Typography fontSize={16} margin={'20px 0 40px'}>
        Complete the tasks below to receive more Ladder Boxes and increase your Luck!
      </Typography>
      <Box display="flex">
        <Box sx={{ background: '#F9F9F9', width: 136, borderRadius: 1.2, padding: '24px 10px' }}>
          <Typography textTransform={'uppercase'}>trading vol.</Typography>
          <Typography variant="h5" fontSize={18} mt={10}>
            $1,250
          </Typography>
        </Box>
        <Box flexGrow={1}>
          <AirdropStepper activeStep={1} steps={[1, 2, 3]} stepsDescription={['$500', '$1000', '$5000', '$20000']} />
        </Box>
      </Box>
    </Box>
  )
}
