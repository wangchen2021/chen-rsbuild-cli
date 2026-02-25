"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI_CONFIG = void 0;
const path_1 = require("../utils/path");
const pkg = require('../../package.json');
exports.CLI_CONFIG = {
    name: pkg.name,
    version: pkg.version,
    localTemplateDir: `${(0, path_1.getCliRootDir)()}/templates`,
    remoteTemplateRepo: 'git@github.com:your-org/react-rsbuild-template.git',
    templateVersion: 'v1.0.0',
};
