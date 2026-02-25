import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APIFOX_API_KEY = 'APS-TK1yyRuzJIEURXfbbAeMaiUM0hL8hqqe';
const APIFOX_PROJECT_ID = '7794065';
const APIFOX_MOCK_BASE_URL = 'https://m1.apifoxmock.com/m1/7794065-7540811-default';
const APIFOX_MOCK_TOKEN = 'qnGnagnXe4sbEa8AZnH77';
const APIFOX_API_GENERATE_DIR = path.resolve(__dirname, '../src/api');

const getApiFoxMockApiUrl = (requestUrl: string): string => {
  const normalizedUrl = requestUrl.startsWith('/') ? requestUrl.slice(1) : requestUrl;
  return `${APIFOX_MOCK_BASE_URL}/${normalizedUrl}?apifoxToken=${APIFOX_MOCK_TOKEN}`;
};

export const APIFOX_CONFIG = {
  APIFOX_API_KEY,
  APIFOX_PROJECT_ID,
  APIFOX_MOCK_BASE_URL,
  APIFOX_MOCK_TOKEN,
  APIFOX_API_GENERATE_DIR,
  getApiFoxMockApiUrl,
};
