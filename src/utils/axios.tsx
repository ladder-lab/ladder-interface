import axios, { AxiosResponse, AxiosPromise, AxiosRequestConfig } from 'axios'
import qs from 'qs'

// export const StatBaseURL = 'https://dualinvest-testapi.antimatter.finance/web/'
export const StatBaseURL = 'https://v1-test.ladder.top/web/'
export const baseURL = 'https://test-nftapi.antimatter.finance:8443/web/'
// export const baseURL = 'https://dualinvest-testapi.antimatter.finance/web/'
export const testURL = 'https://testapi.settle3.com/web/'
export const testAssetUrl = 'https://testapi.settle3.com'
export const v4Url = 'https://v1-test.ladder.top/web/'
export const testAirdropUrl = 'https://v1-test.ladder.top/'

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})
export const axiosTestInstance = axios.create({
  baseURL: testURL,
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

export const axiosNftScanInstance = axios.create({
  baseURL: 'https://polygonapi.nftscan.com/api/v2/',
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json', 'X-API-KEY': 'lz5gWLaiA8ZXOHlyFK854hRg' }
})

export const axiosAirdropInstance = axios.create({
  baseURL: testAirdropUrl,
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

export const Axios = {
  get<T = any>(url: string, params: { [key: string]: any } = {}): AxiosPromise<ResponseType<T>> {
    return axiosInstance.get(url, { params })
  },
  post<T = any>(
    url: string,
    data: { [key: string]: any },
    params = {},
    config?: AxiosRequestConfig,
    isFormData?: boolean
  ): AxiosPromise<ResponseType<T>> {
    return axiosInstance.post(url, isFormData ? qs.stringify(data) : data, { params, ...config })
  },
  getMetadata(contractAddress: string, tokenId: string | number): AxiosPromise<ResponseType<NFTResponseType>> {
    return axiosNftScanInstance.get(`assets/${contractAddress}/${tokenId}`)
  }
}

export type AxiosResponseType<T = any, D = any> = AxiosResponse<T, D>

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}

export interface NFTResponseType {
  contract_address: string
  contract_name: string
  contract_token_id: string
  token_id: string
  erc_type: string
  amount: string
  minter: string
  token_uri: null | string
  metadata_json: null | any
  name: null | string
  description: null | string
  image_uri: null | string
}

export interface erc721CollectionResponseType {
  total: number
  next: null
  content: NFTResponseType[]
}
