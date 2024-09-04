import { gql, useQuery } from '@apollo/client'
import { StatTransactionsType, GraphOrderType } from '../hooks/useStatBacked'
import { Mode } from '../components/Input/CurrencyInputPanel/SelectCurrencyModal'

const TOKEN_FIELDS = gql`
  fragment TokenFields on Token {
    id
    price
    symbol
    name
    type
    liquidity
    total {
      swapTxs
      removeLiquidityTxs
      addLiquidityTxs
      transactions
    }
  }
`
export const GET_TRANSACTIONS = gql`
  query TransactionsQuery(
    $skip: Int
    $pageSize: Int
    $orderBy: String
    $order: String
    $pair: String
    $tokenA: String
    $tokenB: String
    $type: String
  ) {
    transactions(
      skip: $skip
      first: $pageSize
      orderBy: $orderBy
      orderDirection: $order
      where: { pair_contains: $pair, TokenA_contains: $tokenA, TokenB_contains: $tokenB, type_contains: $type }
    ) {
      TokenA {
        ...TokenFields
      }
      TokenB {
        ...TokenFields
      }
      TokenAamount
      TokenBamount
      account
      pair
      id
      timestamp
      type
      value
    }
  }
  ${TOKEN_FIELDS}
`

interface Props {
  currentPage: number
  pageSize: number
  order: string
  orderBy: string
  token?: string
  tokenType?: Mode
  pair?: string
  type: string
}

export function useTransactionsQueries(props: Props) {
  const { currentPage, pageSize, order, orderBy, token, tokenType, pair, type } = props
  const statTransactionsTypeMap: Record<string, string> = {
    [StatTransactionsType.SWAPS]: 'Swap',
    [StatTransactionsType.ADDS]: 'addLiquidity',
    [StatTransactionsType.REMOVES]: 'Remove',
    [StatTransactionsType.ALL]: ''
  }

  const statTransactionsType = statTransactionsTypeMap[type] || ''
  const skip = pageSize * (currentPage - 1)
  const queryOrderBy = GraphOrderType[orderBy]

  const baseVariables = {
    skip,
    pageSize,
    order,
    orderBy: queryOrderBy,
    type: statTransactionsType,
    pair: pair || ''
  }
  const { loading: loadingA, data: dataA } = useQuery(GET_TRANSACTIONS, {
    variables: {
      ...baseVariables,
      tokenA: token,
      tokenB: ''
    },
    skip: !token && tokenType === Mode.ERC20
  })
  const { loading: loadingB, data: dataB } = useQuery(GET_TRANSACTIONS, {
    variables: {
      ...baseVariables,
      tokenA: '',
      tokenB: token
    },
    skip: !token && tokenType !== Mode.ERC20
  })
  const { loading: loadingDefault, data: dataDefault } = useQuery(GET_TRANSACTIONS, {
    variables: {
      ...baseVariables,
      tokenA: '',
      tokenB: ''
    },
    skip: !!token
  })

  const loading = loadingA || loadingB || loadingDefault
  return {
    loading,
    dataA,
    dataB,
    dataDefault
  }
}

const GET_TRANSACTIONS_TOTAL = gql`
  query TransactionsTotalQuery($id: String) {
    totals(where: { id: $id }) {
      transactions
      swapTxs
      removeLiquidityTxs
      addLiquidityTxs
    }
  }
`

enum TotalsType {
  All = 'transactions',
  Swaps = 'swapTxs',
  Adds = 'addLiquidityTxs',
  Removes = 'removeLiquidityTxs'
}

export function useTransactionsTotal({ type, token }: { type: StatTransactionsType; token?: string }) {
  const { data } = useQuery(GET_TRANSACTIONS_TOTAL, {
    variables: {
      id: !token ? 'total' : token
    }
  })
  const total = data ? data.totals[0][TotalsType[type]] : 0
  return {
    total: +total
  }
}
