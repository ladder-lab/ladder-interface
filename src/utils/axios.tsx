import axios, { AxiosResponse, AxiosPromise, AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: { 'content-type': 'application/json', accept: 'application/json' }
})

const axiosToken1155Instance = axios.create({
  baseURL: 'https://eth-mainnet.blockvision.org/v1/2CW5NcBtEvzDeRMhB5BwUTe70lE',
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
    config?: AxiosRequestConfig
  ): AxiosPromise<ResponseType<T>> {
    return axiosInstance.post(url, data, { params, ...config })
  },
  getMetadata<T = any>(contractAddress: string, tokenId: string | number): AxiosPromise<ResponseType<T>> {
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
