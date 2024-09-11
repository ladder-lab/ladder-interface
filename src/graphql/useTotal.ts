import { gql, useQuery } from '@apollo/client'

const GET_ACTIVITY_DATA = gql`
  query MyQuery {
    total(id: "total") {
      liquidity
      transactions
      volume
      usersCount
    }
  }
`

export function useTotal() {
  const { data, loading, error } = useQuery(GET_ACTIVITY_DATA)
  return {
    data: data?.total || {},
    loading,
    error
  }
}
