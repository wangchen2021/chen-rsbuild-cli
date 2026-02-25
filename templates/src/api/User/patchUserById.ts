/* 该文件由OpenAPI TS脚本自动生成，请勿手动修改！ */
import { patchRequest } from '@/utils/request';
import type { AxiosRequestConfig } from 'axios';

export interface PatchUserByIdRequest {}

export interface PatchUserByIdDto {}

export type PatchUserByIdResponse = HttpResponse<PatchUserByIdDto>;

// 当前接口mock地址（基于云端ApiFox，仅内部使用）
const MOCK_URL =
  'https://m1.apifoxmock.com/m1/7794065-7540811-default/user/{id}?apifoxToken=qnGnagnXe4sbEa8AZnH77';

/**
 * UserController_update
 * @description 接口路径：PATCH /user/{id}
 * @param params - 请求参数（必填，含路径参数）
 * @param config - axios请求配置，扩展mock字段控制是否启用mock模式
 */
export const patchUserById = (
  params: PatchUserByIdRequest,
  config?: AxiosRequestConfig & {
    mock?: boolean;
  },
) => {
  // 必传参数校验：禁止传入undefined/null
  if (!params) {
    throw new Error('【patchUserById】请求参数为必填项，禁止传入undefined/null！');
  }

  // 路径参数处理：替换URL中的{xxx}占位符为实际参数值
  const replacePlaceholder = (url: string, params: any) => {
    return url.replace(/\{(\w+)\}/g, (_, key) => {
      if (params[key] === undefined || params[key] === null) {
        throw new Error(`【patchUserById】路径参数${key}未传入，请检查params！`);
      }
      return encodeURIComponent(params[key]); // 编码防止特殊字符问题
    });
  };
  const targetUrl = config?.mock
    ? replacePlaceholder(MOCK_URL, params)
    : replacePlaceholder('/user/{id}', params);
  // mock模式覆盖baseURL，其余config透传
  const requestConfig = config?.mock ? { ...config, baseURL: undefined } : config;
  return patchRequest<PatchUserByIdDto>(targetUrl, params, requestConfig);
};
