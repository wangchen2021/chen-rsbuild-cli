import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import downloadOpenApiSpec from './utils/downApifoxJson';
import { APIFOX_CONFIG } from '../config';
import { cleanDir, createDirIfNotExist } from './utils/fileUtils';

// 初始化配置
const initConfig = async () =>
  ({
    openapiPath: await downloadOpenApiSpec(),
    outputDir: APIFOX_CONFIG.APIFOX_API_GENERATE_DIR,
    requestImportPath: '@/utils/request',
    commonResponseName: 'HttpResponse',
    getApiFoxMockApiUrl: APIFOX_CONFIG.getApiFoxMockApiUrl,
    requestApiMap: {
      GET: 'getRequest',
      POST: 'postRequest',
      PUT: 'putRequest',
      DELETE: 'deleteRequest',
      PATCH: 'patchRequest',
    },
    prettierOptions: {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
    },
  }) as const;

// ========== 基础TS接口定义 ==========
interface OpenAPISchema {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null';
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  items?: OpenAPISchema;
  oneOf?: OpenAPISchema[];
  nullable?: boolean;
  description?: string;
  $ref?: string;
}

interface OpenAPIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  schema?: OpenAPISchema;
  description?: string;
}

interface OpenAPIRequestBody {
  content: Record<string, { schema?: OpenAPISchema }>;
  required?: boolean;
}

interface OpenAPIResponse {
  description: string;
  content?: Record<string, { schema?: OpenAPISchema }>;
}

interface OpenAPIApiInfo {
  summary: string;
  deprecated: boolean;
  tags: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
  operationId?: string;
}

interface OpenAPIData {
  openapi: string;
  info: { title: string; version: string; description?: string };
  tags: { name: string }[];
  paths: Record<string, Record<'get' | 'post' | 'put' | 'delete', OpenAPIApiInfo>>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
  servers?: any[];
  security?: any[];
}

interface TagApiItem extends Omit<OpenAPIApiInfo, 'tags'> {
  apiPath: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  schemaKey: string;
  fileName: string; // 小驼峰文件名
  funcName: string; // 小驼峰函数名
  isRoot?: boolean;
  hasPathParams: boolean; // 标记是否包含路径参数
}

// ========== 核心工具：解析$ref引用 ==========
const resolveSchemaRef = (
  ref: string,
  components: OpenAPIData['components'],
): OpenAPISchema | undefined => {
  if (!ref || !components?.schemas) return undefined;
  const schemaName = ref.split('/').at(-1);
  return schemaName ? components.schemas[schemaName] : undefined;
};

// ========== 工具：Schema转TS类型 ==========
const convertSchemaToTsType = (schema?: OpenAPISchema): string => {
  if (!schema) return 'string';
  const baseTypeMap: Record<OpenAPISchema['type'], string> = {
    string: 'string',
    number: 'number',
    integer: 'number',
    boolean: 'boolean',
    array: 'Array<any>',
    object: 'object',
    null: 'null',
  };
  let tsType = baseTypeMap[schema.type] || 'string';

  if (schema.type === 'array' && schema.items)
    tsType = `Array<${convertSchemaToTsType(schema.items)}>`;
  if (schema.oneOf && schema.oneOf.length)
    tsType = schema.oneOf.map(convertSchemaToTsType).filter(Boolean).join(' | ');
  if (schema.nullable && !tsType.includes('null')) tsType = `${tsType} | null`;
  return tsType;
};

// ========== 工具：生成带注释的TS接口 ==========
const generateInterfaceCode = (interfaceName: string, schema?: OpenAPISchema): string => {
  if (!schema || !schema.properties) return `export interface ${interfaceName} {}\n`;
  let interfaceCode = `export interface ${interfaceName} {\n`;
  Object.entries(schema.properties).forEach(([key, prop]) => {
    if (prop.description) interfaceCode += `  /** ${prop.description} */\n`;
    const isRequired = schema.required?.includes(key);
    interfaceCode += `  ${key}${isRequired ? '' : '?'}: ${convertSchemaToTsType(prop)};\n`;
  });
  interfaceCode += `}\n`;
  return interfaceCode;
};

// ========== 工具：代码格式化 ==========
const formatCode = async (
  code: string,
  CONFIG: Awaited<ReturnType<typeof initConfig>>,
): Promise<string> => {
  try {
    return await prettier.format(code, CONFIG.prettierOptions);
  } catch (err) {
    console.warn('⚠️ 代码格式化失败：', (err as Error).message);
    return code;
  }
};

// ========== 核心工具：生成 文件名/函数名/SchemaKey + 标记路径参数 ==========
const generateApiNamesAndCheckPathParams = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  apiPath: string,
) => {
  let hasPathParams = false;
  if (apiPath === '/') {
    return { fileName: 'root', funcName: 'root', schemaKey: 'Root', hasPathParams };
  }

  // 检测并处理路径参数 {id}
  const paramReg = /\{(\w+)\}/g;
  const params: string[] = [];
  const purePath = apiPath.replace(paramReg, (_, param) => {
    hasPathParams = true;
    params.push(param.charAt(0).toUpperCase() + param.slice(1));
    return '';
  });

  // 路径转小驼峰
  const pathSegments = purePath
    .replace(/^\//, '')
    .split('/')
    .filter((seg) => seg);
  const camelPath = pathSegments.reduce(
    (pre, cur) => pre + cur.charAt(0).toUpperCase() + cur.slice(1),
    '',
  );
  const methodLower = method.toLowerCase();
  const paramSuffix = params.length > 0 ? `By${params.join('By')}` : '';

  const baseName = `${methodLower}${camelPath}`;
  const fileName = `${baseName}${paramSuffix}`;
  const funcName = fileName;
  const schemaKey = baseName.charAt(0).toUpperCase() + baseName.slice(1) + paramSuffix;

  return { fileName, funcName, schemaKey, hasPathParams };
};

// ========== 核心：生成单个接口文件（完全贴合用户给出的代码逻辑） ==========
const generateSingleApiFileCode = (
  api: TagApiItem,
  components: OpenAPIData['components'],
  CONFIG: Awaited<ReturnType<typeof initConfig>>,
): string => {
  const {
    apiPath,
    method,
    summary,
    requestBody,
    parameters,
    responses,
    schemaKey,
    funcName,
    hasPathParams,
  } = api;
  const reqInterfaceName = `${schemaKey}Request`;
  const dtoInterfaceName = `${schemaKey}Dto`;
  const resTypeAliasName = `${schemaKey}Response`;
  let reqTypeCode = '';
  let dtoTypeCode = '';
  let resTypeCode = '';
  let requestMethodCode = '';
  let hasRequestParams = false;
  let isParamsRequired = false;

  // 初始化参数Schema
  const mergeParamSchema: OpenAPISchema = { type: 'object', properties: {}, required: [] };

  // 解析路径/Query参数
  if (parameters && parameters.length > 0) {
    parameters.forEach((param) => {
      if (param.in === 'path' && param.schema) {
        mergeParamSchema.properties![param.name] = param.schema;
        mergeParamSchema.required!.push(param.name);
        hasRequestParams = true;
        isParamsRequired = true;
      } else if (param.in === 'query' && param.schema) {
        mergeParamSchema.properties![param.name] = param.schema;
        if (param.required) mergeParamSchema.required!.push(param.name);
        hasRequestParams = true;
        isParamsRequired = isParamsRequired || !!param.required;
      }
    });
  }

  // 解析Body参数
  let bodySchema: OpenAPISchema | undefined;
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && requestBody) {
    const jsonContent = requestBody.content['application/json'];
    if (jsonContent?.schema) {
      bodySchema = jsonContent.schema.$ref
        ? resolveSchemaRef(jsonContent.schema.$ref, components)
        : jsonContent.schema;
    }
    const isBodyRequired =
      !!requestBody.required || (bodySchema?.required && bodySchema.required.length > 0);
    hasRequestParams = isBodyRequired || !!bodySchema;
    if (hasRequestParams && bodySchema) {
      mergeParamSchema.properties = bodySchema.properties || {};
      mergeParamSchema.required = bodySchema.required || [];
    }
    if (isBodyRequired) isParamsRequired = true;
  }

  // 生成Request接口（无参数则生成空接口）
  reqTypeCode = generateInterfaceCode(
    reqInterfaceName,
    hasRequestParams ? mergeParamSchema : undefined,
  );
  // 生成Dto接口（统一空接口，贴合用户范式）
  dtoTypeCode = `export interface ${dtoInterfaceName} {}\n`;
  // 生成Response类型
  resTypeCode = `export type ${resTypeAliasName} = ${CONFIG.commonResponseName}<${dtoInterfaceName}>;\n`;

  // 生成Mock地址
  const MOCK_URL = CONFIG.getApiFoxMockApiUrl(apiPath);
  const mockCode = `
// 当前接口mock地址（基于云端ApiFox，仅内部使用）
const MOCK_URL = "${MOCK_URL}";
`;

  // 拼接基础代码：导入request + AxiosRequestConfig type
  let fileCode = `/* 该文件由OpenAPI TS脚本自动生成，请勿手动修改！ */\n`;
  fileCode += `import { ${CONFIG.requestApiMap[method]} } from '${CONFIG.requestImportPath}';\n`;
  fileCode += `import type { AxiosRequestConfig } from 'axios';\n\n`;
  fileCode += reqTypeCode + '\n';
  fileCode += dtoTypeCode + '\n';
  fileCode += resTypeCode;
  fileCode += mockCode;

  // 接口注释：根据是否有路径参数动态标注
  const paramCommentSuffix = hasPathParams ? '（必填，含路径参数）' : '（必填）';
  const paramComment = isParamsRequired ? paramCommentSuffix : '（可选）';
  fileCode += `\n/**
 * ${summary || apiPath}
 * @description 接口路径：${method} ${apiPath}
 * @param params - 请求参数${paramComment}
 * @param config - axios请求配置，扩展mock字段控制是否启用mock模式
 */\n`;

  // ========== 核心逻辑：对齐用户的config入参 + mock判断 + 透传 ==========
  const requestTool = CONFIG.requestApiMap[method];
  if (hasRequestParams) {
    const paramsOptionalFlag = isParamsRequired ? '' : '?';
    // 必传参数校验
    const paramsCheckCode = isParamsRequired
      ? `
  // 必传参数校验：禁止传入undefined/null
  if (!params) {
    throw new Error('【${funcName}】请求参数为必填项，禁止传入undefined/null！');
  }
`
      : '';
    // 路径参数替换函数（有路径参数才生成，无则跳过）
    const pathReplaceCode = hasPathParams
      ? `
  // 路径参数处理：替换URL中的{xxx}占位符为实际参数值
  const replacePlaceholder = (url: string, params: any) => {
    return url.replace(/\\{(\\w+)\\}/g, (_, key) => {
      if (params[key] === undefined || params[key] === null) {
        throw new Error(\`【${funcName}】路径参数\${key}未传入，请检查params！\`);
      }
      return encodeURIComponent(params[key]); // 编码防止特殊字符问题
    });
  };
`
      : '';
    // 生成目标URL（区分mock，无路径参数则直接使用原URL）
    const targetUrlCode = hasPathParams
      ? `const targetUrl = config?.mock ? replacePlaceholder(MOCK_URL, params) : replacePlaceholder('${apiPath}', params);`
      : `const targetUrl = config?.mock ? MOCK_URL : '${apiPath}';`;

    // 生成接口函数：config透传，mock从config取，保持原有判断逻辑
    requestMethodCode = `export const ${funcName} = (params${paramsOptionalFlag}: ${reqInterfaceName}, config?: AxiosRequestConfig & {
    mock?: boolean;
}) => {
  ${paramsCheckCode}  ${pathReplaceCode}  ${targetUrlCode}
  // mock模式覆盖baseURL，其余config透传
  const requestConfig = config?.mock ? { ...config, baseURL: undefined } : config;
  return ${requestTool}<${dtoInterfaceName}>(targetUrl, params, requestConfig);
};\n`;
  } else {
    // 无参接口
    requestMethodCode = `export const ${funcName} = (config?: AxiosRequestConfig & {
    mock?: boolean;
}) => {
  const targetUrl = config?.mock ? MOCK_URL : '${apiPath}';
  const requestConfig = config?.mock ? { ...config, baseURL: undefined } : config;
  return ${requestTool}<${dtoInterfaceName}>(targetUrl, requestConfig);
};\n`;
  }

  fileCode += requestMethodCode;
  return fileCode;
};

// ========== 工具：生成index.ts导出代码 ==========
const generateIndexCode = (fileNames: string[]): string => {
  let indexCode = `/* 该文件由OpenAPI TS脚本自动生成，统一导出所有接口 */\n`;
  fileNames.sort().forEach((fileName) => {
    indexCode += `export * from './${fileName}';\n`;
  });
  return indexCode;
};

// ========== 主生成逻辑 ==========
const generateApiCode = async (
  openapiData: OpenAPIData,
  CONFIG: Awaited<ReturnType<typeof initConfig>>,
): Promise<void> => {
  const { paths = {}, tags = [], components } = openapiData;
  const { outputDir } = CONFIG;

  cleanDir(outputDir);
  createDirIfNotExist(outputDir);

  const tagApiMap: Record<string, TagApiItem[]> = {};
  tags.forEach((tag) => (tagApiMap[tag.name] = []));
  let rootApi: TagApiItem | null = null;

  // 遍历所有接口，生成名称并标记路径参数
  Object.entries(paths).forEach(([apiPath, methodMap]) => {
    Object.entries(methodMap).forEach(([method, apiInfo]) => {
      if (apiInfo.deprecated) return;
      const upperMethod = method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE';
      const { fileName, funcName, schemaKey, hasPathParams } = generateApiNamesAndCheckPathParams(
        upperMethod,
        apiPath,
      );

      const tagItem: TagApiItem = {
        apiPath,
        method: upperMethod,
        schemaKey,
        fileName,
        funcName,
        hasPathParams,
        ...apiInfo,
      };

      if (apiPath === '/') {
        rootApi = tagItem;
        return;
      }

      const tagName = apiInfo.tags[0] || 'common';
      if (!tagApiMap[tagName]) tagApiMap[tagName] = [];
      tagApiMap[tagName].push(tagItem);
    });
  });

  // 生成根接口文件
  if (rootApi) {
    rootApi = rootApi as TagApiItem;
    const rootFilePath = path.join(outputDir, `${rootApi.fileName}.ts`);
    const rootFileCode = await formatCode(
      generateSingleApiFileCode(rootApi, components, CONFIG),
      CONFIG,
    );
    fs.writeFileSync(rootFilePath, rootFileCode);
    console.log(`📦 生成根接口：${rootFilePath}`);
  }

  // 生成各tag接口文件和index
  const validTagNames = Object.keys(tagApiMap).filter((tag) => tagApiMap[tag].length > 0);
  for (const tagName of validTagNames) {
    const tagDir = path.join(outputDir, tagName);
    createDirIfNotExist(tagDir);
    const apiList = tagApiMap[tagName];
    const tagFileNames: string[] = [];

    for (const api of apiList) {
      const apiFilePath = path.join(tagDir, `${api.fileName}.ts`);
      const apiFileCode = await formatCode(
        generateSingleApiFileCode(api, components, CONFIG),
        CONFIG,
      );
      fs.writeFileSync(apiFilePath, apiFileCode);
      tagFileNames.push(api.fileName);
      console.log(`📦 生成${tagName}模块接口：${apiFilePath}`);
    }

    // 生成tag内index.ts
    const tagIndexPath = path.join(tagDir, 'index.ts');
    const tagIndexCode = await formatCode(generateIndexCode(tagFileNames), CONFIG);
    fs.writeFileSync(tagIndexPath, tagIndexCode);
    console.log(`📦 生成${tagName}模块入口：${tagIndexPath}`);
  }

  // 生成根目录index.ts
  const rootIndexFileNames: string[] = [];
  if (rootApi) rootIndexFileNames.push(rootApi.fileName);
  validTagNames.forEach((tagName) => rootIndexFileNames.push(tagName));

  if (rootIndexFileNames.length > 0) {
    const rootIndexPath = path.join(outputDir, 'index.ts');
    const rootIndexCode = await formatCode(generateIndexCode(rootIndexFileNames), CONFIG);
    fs.writeFileSync(rootIndexPath, rootIndexCode);
    console.log(`📦 生成总入口：${rootIndexPath}`);
  }

  console.log('\n🎉 所有接口生成完成');
};

// ========== 入口函数 ==========
const run = async (): Promise<void> => {
  try {
    const CONFIG = await initConfig();
    if (!fs.existsSync(CONFIG.openapiPath))
      throw new Error(`未找到OpenAPI文件：${CONFIG.openapiPath}`);
    const openapiData = JSON.parse(fs.readFileSync(CONFIG.openapiPath, 'utf8')) as OpenAPIData;
    if (!openapiData.openapi?.startsWith('3.')) throw new Error('仅支持OpenAPI 3.0+版本');
    await generateApiCode(openapiData, CONFIG);
  } catch (error) {
    console.error('❌ 接口生成失败：', (error as Error).message);
    process.exit(1);
  }
};

run();
