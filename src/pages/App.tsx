import { Suspense } from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
// import WarningModal from '../components/Modal/WarningModal'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import SwapTemp from './Swap/SwapNew'
import Pool from './Pool'
import AddLiquidity from './Pool/AddLiquidity'
import ImportPool from './Pool/ImportPool'
import darkBg from 'assets/images/dark_bg.png'
import swapDarkBg from 'assets/images/BannerPups.png'
import lightBg from 'assets/images/light_bg.png'
import { useIsDarkMode } from 'state/user/hooks'
import RemoveLiquidity from './Pool/RemoveLiquidity'
import Testnet from './Testnet'
import Explorer from './Explore'
import Collection from './Collection'
import Statistics from './Statistics'
import StatisticsTokens from './Statistics/Tokens'
import StatisticsPools from './Statistics/Pools'
import Feedback from './Feedback'
import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter'
import Sbt from './Earn/Sbt'
import ListOfWinners from './Testnet/ListOfWinners'
import BecomePartnerNew from './Earn/Sbt/BecomePartnerNew'
import MyAccount from './MyAccount'
import OrigAccount from './MyAccount/OrigAccount'
import Footer from '../components/Footer'
import Airdrop from './Airdrop'

const AppWrapper = styled('div', { shouldForwardProp: prop => prop !== 'isDarkMode' })<{
  isDarkMode: boolean
  isSwap: boolean
}>(({ theme, isDarkMode, isSwap }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  position: 'relative',
  minWidth: theme.width.minContent,
  '&:after': {
    content: '""',
    width: '100%',
    height: '100%',
    bottom: 0,
    top: isSwap ? 80 : 'inherit',
    zIndex: -1,
    position: isSwap ? 'fixed' : 'absolute',
    backgroundImage: `url(${isSwap ? swapDarkBg : isDarkMode ? darkBg : lightBg})`,
    // boxShadow: isSwap ? 'inset 0 -200px 200px -100px rgba(0,0,0,.9)' : 1,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: isDarkMode ? 'bottom' : 'top',
    backgroundSize: isSwap ? 'cover' : isDarkMode ? '100% auto' : '100% 100%'
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: `calc(100vh - ${theme.height.header})`,
  // padding: '54px 0 80px',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: 1,
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header})`
    // paddingTop: 20
  }
}))

const DarkShadow = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
`

export default function App() {
  const isDarkMode = useIsDarkMode()
  const { pathname } = useLocation()
  const isSwap = pathname.toLowerCase() == routes.swap.toLowerCase()
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app" isDarkMode={isDarkMode || isSwap} isSwap={isSwap}>
          {isSwap && <DarkShadow />}
          <ContentWrapper>
            <Header />
            <GoogleAnalyticsReporter />
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              {/* <WarningModal /> */}
              <Web3ReactManager>
                <Routes>
                  <Route path={routes.airdrop} element={<Airdrop />} />
                  <Route path={routes.testnet} element={<Testnet />} />
                  <Route path={routes.winners} element={<ListOfWinners />} />
                  <Route path={routes.explorer} element={<Explorer />} />
                  <Route path={routes.explorer + routes.collectionParams} element={<Collection />} />
                  <Route path={routes.swap} element={<SwapTemp />}>
                    <Route path={routes.removeLiquidityParams.slice(1)} element={<SwapTemp />} />
                  </Route>
                  <Route path={routes.pool} element={<Pool />} />
                  <Route path={routes.statistics} element={<Statistics />} />
                  <Route
                    path={routes.statisticsTokens + routes.statisticsTokensParams}
                    element={<StatisticsTokens />}
                  />
                  <Route path={routes.statisticsPools + routes.statisticsPoolsParams} element={<StatisticsPools />} />
                  <Route path={routes.importPool} element={<ImportPool />} />
                  <Route path={routes.addLiquidity} element={<AddLiquidity />}>
                    <Route path={routes.removeLiquidityParams.slice(1)} element={<AddLiquidity />} />
                  </Route>
                  <Route path={routes.removeLiquidity}>
                    <Route path={routes.removeLiquidity + routes.removeLiquidityParams} element={<RemoveLiquidity />} />
                  </Route>
                  <Route path={routes.feedback} element={<Feedback />} />
                  <Route path={routes.sbt} element={<Sbt />} />
                  <Route path={routes.becomePartner} element={<BecomePartnerNew />} />
                  <Route path={routes.myAccount} element={<MyAccount />} />
                  <Route path={routes.origAccount} element={<OrigAccount />} />
                  <Route path="/" element={<Navigate to={routes.swap} replace />} />
                  <Route path="*" element={<Navigate to={routes.swap} replace />} />
                </Routes>
              </Web3ReactManager>
            </BodyWrapper>
            <Footer />
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
