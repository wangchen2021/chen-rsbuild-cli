import fs from 'fs-extra';
import path from 'path';
export const getCliRootDir = () => {
    if (process.env.NODE_ENV === 'development' || __filename.endsWith('.ts')) {
        return path.resolve(__dirname, '../../');
    }
    const cliEntryPath = require.main?.filename || __filename;
    let cliRootDir = path.resolve(path.dirname(cliEntryPath), '../');
    const pkgPath = path.resolve(cliRootDir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
        cliRootDir = path.resolve(path.dirname(cliEntryPath), '../../');
    }
    return cliRootDir;
};
export const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
