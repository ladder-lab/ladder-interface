import { gql, useQuery } from '@apollo/client'
import { useActiveWeb3React } from '../hooks'

export const GET_BADGE = gql`
  query getBadge($id: String!) {
    badge(id: $id) {
      fl
      id
      le
      lp
      tr
    }
  }
`

export function useBadgeQueries() {
  const { account } = useActiveWeb3React()
  const { loading, data, error } = useQuery(GET_BADGE, {
    variables: {
      id: account && account.toLowerCase()
    },
    skip: !account
  })
  const result = data ? data.badge : {}
  return {
    loading,
    result,
    error
  }
}
