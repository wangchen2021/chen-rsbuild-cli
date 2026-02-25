import type { BundlerPluginInstance } from '@rsbuild/core';
import { isRsDoctor } from '../../toolsSwitch';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
export const getPlugins = (): BundlerPluginInstance[] => {
  const plugins: BundlerPluginInstance[] = [];
  if (isRsDoctor) {
    plugins.push(new RsdoctorRspackPlugin());
  }
  return plugins;
};
