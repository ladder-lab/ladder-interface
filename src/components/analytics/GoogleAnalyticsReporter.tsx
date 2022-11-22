import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useParams } from 'react-router-dom'

// fires a GA pageview every time the route changes
export default function GoogleAnalyticsReporter(): null {
  const { pathname, search } = useParams()
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `${pathname}${search}` })
  }, [pathname, search])
  return null
}
