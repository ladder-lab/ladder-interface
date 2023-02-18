import { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
// import WarningModal from '../components/Modal/WarningModal'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import Swap from './Swap'
import Pool from './Pool'
import AddLiquidity from './Pool/AddLiquidity'
import ImportPool from './Pool/ImportPool'
import darkBg from 'assets/images/dark_bg.png'
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

const AppWrapper = styled('div', { shouldForwardProp: prop => prop !== 'isDarkMode' })<{ isDarkMode: boolean }>(
  ({ theme, isDarkMode }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    minWidth: theme.width.minContent,
    '&:after': {
      content: '""',
      width: '100%',
      height: '100%',
      bottom: 0,
      zIndex: -1,
      position: 'absolute',
      backgroundImage: `url(${isDarkMode ? darkBg : lightBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: isDarkMode ? 'bottom' : 'top',
      backgroundSize: isDarkMode ? '100% auto' : '100% 100%'
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  })
)

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

export default function App() {
  const isDarkMode = useIsDarkMode()
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <AppWrapper id="app" isDarkMode={isDarkMode}>
          <ContentWrapper>
            <Header />
            <GoogleAnalyticsReporter />
            <BodyWrapper id="body">
              <Popups />
              <Polling />
              {/* <WarningModal /> */}
              <Web3ReactManager>
                <Routes>
                  <Route path={routes.testnet} element={<Testnet />} />
                  <Route path={routes.explorer} element={<Explorer />} />
                  <Route path={routes.explorer + routes.collectionParams} element={<Collection />} />
                  <Route path={routes.swap} element={<Swap />}>
                    <Route path={routes.removeLiquidityParams.slice(1)} element={<Swap />} />
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
                  <Route path="*" element={<Navigate to={routes.testnet} replace />} />
                </Routes>
              </Web3ReactManager>
            </BodyWrapper>
          </ContentWrapper>
        </AppWrapper>
      </ModalProvider>
    </Suspense>
  )
}
