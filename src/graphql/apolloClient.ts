import { ApolloClient, InMemoryCache } from '@apollo/client'
import { SUBGRAPH_URL } from '../constants'

const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache()
})

export default client
