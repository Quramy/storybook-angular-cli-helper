import * as path from 'path';
import * as fs from 'fs';
import { CliConfig } from '@angular/cli/lib/config/schema';
import { WebpackConfigOptions } from '@angular/cli/models/webpack-config';
import { getStylesConfig } from '@angular/cli/models/webpack-configs';

function readConfigFromJson() {
  const fname = path.join(process.cwd(), '.angular-cli.json');
  return JSON.parse(fs.readFileSync(fname, 'utf8')) as CliConfig;
}

function getFirstAppConfig() {
  const cliConfig = readConfigFromJson();
  if (!cliConfig.apps || !cliConfig.apps.length) {
    throw new Error('.angular-cli.json must have apps entry.');
  }
  const appConfig = cliConfig.apps[0];
  return appConfig;
}

export function applyAngularCliConfig(config: any) {
  const cliConfig = getAngularCliStylesConfig();

  // console.log(cliConfig.entry);
  const styleRules = config.module.rules.filter((rule: any) => !rule.test || rule.test.toString() !== '/\\.css$/');

  const hit = config.module.rules.find((rule: any) => rule.test && rule.test.toString() === '/\\.(html|css)$/');
  if (hit) {
    hit.test = /\.html$/;
  }

  config.entry = {
    ...config.entry,
    ...cliConfig.entry,
  };

  config.module.rules = [
    ...cliConfig.module.rules,
    ...styleRules,
  ];

  config.plugins = [
    ...cliConfig.plugins,
    ...config.plugins,
  ];

  return config;
}

export function getAngularCliStylesConfig() {
  const appConfig = getFirstAppConfig();
  const config = { 
    projectRoot: "",
    appConfig,
    buildOptions: {
      outputPath: "outputPath",
    },
    supportES2015: false,
  } as WebpackConfigOptions;
  const wc = getStylesConfig(config);
  return wc;
}

export default applyAngularCliConfig;
