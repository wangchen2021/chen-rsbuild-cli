/* 该文件由OpenAPI TS脚本自动生成，请勿手动修改！ */
import { getRequest } from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

export interface GetHealthRequest {}

export interface GetHealthDto {}

export type GetHealthResponse = HttpResponse<GetHealthDto>;

// 当前接口mock地址（基于云端ApiFox，仅内部使用）
const MOCK_URL =
  'https://m1.apifoxmock.com/m1/7794065-7540811-default/health?apifoxToken=qnGnagnXe4sbEa8AZnH77';

/**
 * AppController_getHealth
 * @description 接口路径：GET /health
 * @param params - 请求参数（可选）
 * @param config - axios请求配置，扩展mock字段控制是否启用mock模式
 */
export const getHealth = (
  config?: AxiosRequestConfig & {
    mock?: boolean;
  },
) => {
  const targetUrl = config?.mock ? MOCK_URL : '/health';
  const requestConfig = config?.mock ? { ...config, baseURL: undefined } : config;
  return getRequest<GetHealthDto>(targetUrl, requestConfig);
};
