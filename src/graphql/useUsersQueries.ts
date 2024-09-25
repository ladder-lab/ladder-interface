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
interface userQueriesProps {
  pageSize: any
  timestamp: any
  currentPage: any
  orderBy: any
}

export function useUserQueries(props: userQueriesProps) {
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
