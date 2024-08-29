import { gql, useQuery } from '@apollo/client'

export const GET_TRANSACTIONS = gql`
  query MyQuery($pageNum: Int, $pageSize: Int, $pair: String) {
    transactions(skip: $pageNum, first: $pageSize, where: { pair: $pair }) {
      id
      type
      value
      timestamp
      pair
      account
      TokenB
      TokenA
      TokenAamount
      TokenBamount
    }
  }
`

export const GET_TRANSACTIONS_A = gql`
  query MyQuery($pageNum: Int, $pageSize: Int, $token: String) {
    transactions(skip: $pageNum, first: $pageSize, where: { TokenA: $token }) {
      id
      type
      value
      timestamp
      pair
      account
      TokenB
      TokenA
      TokenAamount
      TokenBamount
    }
  }
`

export const GET_TRANSACTIONS_B = gql`
  query MyQuery($pageNum: Int, $pageSize: Int, $token: String) {
    transactions(skip: $pageNum, first: $pageSize, where: { TokenB: $token }) {
      id
      type
      value
      timestamp
      pair
      account
      TokenB
      TokenA
      TokenAamount
      TokenBamount
    }
  }
`

export function useTransactionsQueries(
  currentPage: number,
  pageSize: number,
  token: string | undefined,
  pair: string | undefined
) {
  const { loading: loadingA, data: dataA } = useQuery(GET_TRANSACTIONS_A, {
    variables: {
      pageNum: currentPage - 1,
      pageSize,
      token: token
    },
    skip: !token
  })

  const { loading: loadingB, data: dataB } = useQuery(GET_TRANSACTIONS_B, {
    variables: {
      pageNum: currentPage - 1,
      pageSize,
      token: token
    },
    skip: !token
  })

  const { loading: loadingDefault, data: dataDefault } = useQuery(GET_TRANSACTIONS, {
    variables: {
      pageNum: currentPage - 1,
      pageSize,
      pair: pair
    },
    skip: !!token || !pair
  })
  const loading = loadingA || loadingB || loadingDefault
  return {
    loading,
    dataA,
    dataB,
    dataDefault
  }
}
