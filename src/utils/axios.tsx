import axios, { AxiosResponse, AxiosPromise, AxiosRequestConfig } from 'axios'
import qs from 'qs'

export const StatBaseURL = 'https://dualinvest-testapi.antimatter.finance/web/'
export const baseURL = 'https://test-nftapi.antimatter.finance:8443/web/'
// export const baseURL = 'https://dualinvest-testapi.antimatter.finance/web/'
export const testURL = 'https://testapi.settle3.com/web/'
export const testAssetUrl = 'https://testapi.settle3.com'

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

const axiosToken1155Instance = axios.create({
  baseURL: 'https://bsc-mainnet.blockvision.org/v1/2EL8whf4KemeNi9Pr3b1hPshJoA',
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
  getMetadata(contractAddress: string, tokenId: string | number): AxiosPromise<NFTResponseType> {
    return axiosToken1155Instance.post('', {
      jsonrpc: '2.0',
      method: 'nft_metadata',
      params: {
        tokenId: tokenId + '',
        contractAddress: contractAddress
      }
    })
  }
}

export type AxiosResponseType<T = any, D = any> = AxiosResponse<T, D>

export interface ResponseType<T = any> {
  msg: string
  code: number
  data: T
}

export interface NFTResponseType {
  jsonrpc: string
  result: {
    contractAddress: string
    description: string
    ercStandard: string
    image: string
    metadata: {
      description: string
      id: string
      image: string
      name: string
    }
    name: string
    protocol: string
    tokenID: string
    tokenURI: string
  }
}
