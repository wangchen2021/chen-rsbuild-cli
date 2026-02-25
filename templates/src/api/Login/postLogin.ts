/* 该文件由OpenAPI TS脚本自动生成，请勿手动修改！ */
import { postRequest } from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

export interface PostLoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}

export interface PostLoginDto {}

export type PostLoginResponse = HttpResponse<PostLoginDto>;

// 当前接口mock地址（基于云端ApiFox，仅内部使用）
const MOCK_URL =
  'https://m1.apifoxmock.com/m1/7794065-7540811-default/login?apifoxToken=qnGnagnXe4sbEa8AZnH77';

/**
 * LoginController_create
 * @description 接口路径：POST /login
 * @param params - 请求参数（必填）
 * @param config - axios请求配置，扩展mock字段控制是否启用mock模式
 */
export const postLogin = (
  params: PostLoginRequest,
  config?: AxiosRequestConfig & {
    mock?: boolean;
  },
) => {
  // 必传参数校验：禁止传入undefined/null
  if (!params) {
    throw new Error('【postLogin】请求参数为必填项，禁止传入undefined/null！');
  }
  const targetUrl = config?.mock ? MOCK_URL : '/login';
  // mock模式覆盖baseURL，其余config透传
  const requestConfig = config?.mock ? { ...config, baseURL: undefined } : config;
  return postRequest<PostLoginDto>(targetUrl, params, requestConfig);
};
