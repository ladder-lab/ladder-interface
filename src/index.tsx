import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from 'theme/index'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Blocklist from './components/essential/Blocklist'
import { NetworkContextName } from './constants'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import getLibrary from './utils/getLibrary'
import { Buffer } from 'buffer'
import ReactGA from 'react-ga4'

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
} else {
  ReactGA.initialize('test', { testMode: true })
}

declare global {
  interface String {
    trimTrailingZero(): string
  }
}

String.prototype.trimTrailingZero = function (this: string) {
  return this.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')
}

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}
window.Buffer = window.Buffer || Buffer

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Blocklist>
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </Provider>
        </Blocklist>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>
)

serviceWorkerRegistration.unregister()
