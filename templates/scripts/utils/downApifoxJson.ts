import axios from 'axios';
import { APIFOX_CONFIG } from 'config';
import fs from 'fs';
import path from 'path';
import { log } from './log';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export default async function downloadOpenApiSpec() {
  const projectId = APIFOX_CONFIG.APIFOX_PROJECT_ID;
  const apiKey = APIFOX_CONFIG.APIFOX_API_KEY;

  if (!apiKey || !projectId) {
    throw new Error('请在config/apifox.ts中配置Apifox的projectId和apiKey');
  }

  log('开始从Apifox拉取OpenAPI规范...', 'info');
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.apifox.com/v1/projects/${projectId}/export-openapi?locale=zh-CN`,
      headers: {
        'X-Apifox-Api-Version': '2024-03-28',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        scope: { type: 'ALL' },
        options: { addFoldersToTags: true },
        oasVersion: '3.0',
        exportFormat: 'JSON',
      }),
    });
    const openapiTempPath = path.resolve(projectRoot, 'openapi.json');
    fs.writeFileSync(openapiTempPath, JSON.stringify(response.data, null, 2), 'utf-8');
    log('Apifox规范拉取成功', 'success');
    return openapiTempPath;
  } catch (error) {
    log(`Apifox拉取失败: ${(error as Error).message}`, 'error');
    throw error;
  }
}
