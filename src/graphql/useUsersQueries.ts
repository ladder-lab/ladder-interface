import { gql, useQuery } from '@apollo/client'

export const GET_USERS = gql`
  query UsersQuery($skip: Int, $pageSize: Int, $orderBy: String, $timestamp: String) {
    users(skip: $skip, first: $pageSize, orderBy: $orderBy, orderDirection: desc, where: { volume_gt: $timestamp }) {
      id
      liquidity
      transactions
      volume
    }
  }
`

export function useUserQueries(props) {
  const { currentPage, pageSize, orderBy, timestamp } = props
  const skip = pageSize * (currentPage - 1)

  const { loading, data } = useQuery(GET_USERS, {
    variables: {
      skip,
      pageSize,
      orderBy,
      timestamp
    }
  })
  const result = data ? data.users : []
  return {
    loading,
    result
  }
}

const GET_USERS_TOTAL = gql`
  query usersTotalQuery {
    totals {
      usersCount
    }
  }
`

export function useTransactionsTotal() {
  const { data } = useQuery(GET_USERS_TOTAL)
  const total = data ? data.totals[0].usersCount : 0
  return {
    total: +total
  }
}
