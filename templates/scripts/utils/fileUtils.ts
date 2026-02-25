import fs from 'fs';
import { log } from './log';

/**
 * 清空目录（递归删除，存在则清空）
 * @param dir 目标目录路径
 */
export const cleanDir = (dir: string): void => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    log(`目录${dir}清空`, 'success');
  } else {
    log(`目录${dir}不存在，无需清空`, 'info');
  }
};

/**
 * 创建目录（递归创建，不存在则新建）
 * @param dir 目标目录路径
 */
export const createDirIfNotExist = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 创建目录：${dir}`);
  }
};
