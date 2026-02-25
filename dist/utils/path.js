"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = exports.getCliRootDir = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getCliRootDir = () => {
    if (process.env.NODE_ENV === 'development' || __filename.endsWith('.ts')) {
        return path_1.default.resolve(__dirname, '../../');
    }
    const cliEntryPath = require.main?.filename || __filename;
    let cliRootDir = path_1.default.resolve(path_1.default.dirname(cliEntryPath), '../');
    const pkgPath = path_1.default.resolve(cliRootDir, 'package.json');
    if (!fs_extra_1.default.existsSync(pkgPath)) {
        cliRootDir = path_1.default.resolve(path_1.default.dirname(cliEntryPath), '../../');
    }
    return cliRootDir;
};
exports.getCliRootDir = getCliRootDir;
const ensureDir = (dirPath) => {
    if (!fs_extra_1.default.existsSync(dirPath)) {
        fs_extra_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
exports.ensureDir = ensureDir;
