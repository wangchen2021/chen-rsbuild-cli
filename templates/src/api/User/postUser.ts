/* 该文件由OpenAPI TS脚本自动生成，请勿手动修改！ */
import { postRequest } from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

export interface PostUserRequest {}

export interface PostUserDto {}

export type PostUserResponse = HttpResponse<PostUserDto>;

// 当前接口mock地址（基于云端ApiFox，仅内部使用）
const MOCK_URL =
  'https://m1.apifoxmock.com/m1/7794065-7540811-default/user?apifoxToken=qnGnagnXe4sbEa8AZnH77';

/**
 * UserController_create
 * @description 接口路径：POST /user
 * @param params - 请求参数（必填）
 * @param config - axios请求配置，扩展mock字段控制是否启用mock模式
 */
export const postUser = (
  params: PostUserRequest,
  config?: AxiosRequestConfig & {
    mock?: boolean;
  },
) => {
  // 必传参数校验：禁止传入undefined/null
  if (!params) {
    throw new Error('【postUser】请求参数为必填项，禁止传入undefined/null！');
  }
  const targetUrl = config?.mock ? MOCK_URL : '/user';
  // mock模式覆盖baseURL，其余config透传
  const requestConfig = config?.mock ? { ...config, baseURL: undefined } : config;
  return postRequest<PostUserDto>(targetUrl, params, requestConfig);
};
