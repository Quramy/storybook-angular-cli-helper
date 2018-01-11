import * as path from 'path';
import * as fs from 'fs';
import { CliConfig } from '@angular/cli/lib/config/schema';
import { WebpackConfigOptions } from '@angular/cli/models/webpack-config';
import { getStylesConfig, getCommonConfig } from '@angular/cli/models/webpack-configs';

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
  const cliCommonConfig = getAngularCliCommonConfig();
  const cliStyleConfig = getAngularCliStylesConfig();

  // don't use storybooks .css rules because we use .css rules created by @angualr/cli
  const styleRules = config.module.rules.filter((rule: any) => !rule.test || rule.test.toString() !== '/\\.css$/');

  // resolve confilict rules created by @storybook/angular. see https://github.com/storybooks/storybook/pull/2703
  const hit = config.module.rules.find((rule: any) => rule.test && rule.test.toString() === '/\\.(html|css)$/');
  if (hit) {
    hit.test = /\.html$/;
  }

  config.entry = {
    ...config.entry,
    ...cliStyleConfig.entry,
  };

  config.module.rules = [
    ...cliStyleConfig.module.rules,
    ...styleRules,
  ];

  config.plugins = [
    ...cliStyleConfig.plugins,
    ...cliCommonConfig.plugins.filter((p: any) => !!p.copyWebpackPluginPatterns), // for assets
    ...config.plugins,
  ];

  return config;
}

export function getAngularCliStylesConfig() {
  const appConfig = getFirstAppConfig();

  // FIXME dummy value
  const config = { 
    projectRoot: "",
    appConfig,
    buildOptions: {
      outputPath: "outputPath",
    },
    supportES2015: false,
  } as WebpackConfigOptions;

  return getStylesConfig(config);
}

export function getAngularCliCommonConfig() {
  const appConfig = getFirstAppConfig();

  // FIXME dummy value
  const config = { 
    projectRoot: "",
    appConfig,
    buildOptions: {
      outputPath: "outputPath",
    },
    supportES2015: false,
  } as WebpackConfigOptions;

  return getCommonConfig(config);
}

export default applyAngularCliConfig;
