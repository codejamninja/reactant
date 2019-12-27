import path from 'path';
import util from 'util';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CracoConfig, CracoBabel } from '@craco/craco';
import { Paths } from '@reactant/platform';
import { getContext, merge } from '@reactant/context';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Configuration as WebpackConfig,
  ResolvePlugin,
  RuleSetRule
} from 'webpack';

interface ModuleScopePlugin {
  appSrcs: string[];
}

function updatePaths(paths: Paths, webPath: string, buildPath: string | null) {
  if (buildPath) paths.appBuild = buildPath;
  paths.appIndexJs = path.resolve(webPath, 'index.tsx');
  paths.appSrc = webPath;
  paths.appTypeDeclarations = path.resolve(webPath, 'react-app-env.d.ts');
  paths.proxySetup = path.resolve(webPath, 'setupProxy.js');
  paths.testsSetup = path.resolve(webPath, 'setupTests.js');
}

function findJSRules(rules: RuleSetRule[]): RuleSetRule[] {
  return rules.reduce((rules: RuleSetRule[], rule: RuleSetRule) => {
    if (rule.test && rule.test.toString().indexOf('js|mjs|jsx|ts|tsx')) {
      rules.push(rule);
    } else if (rule.oneOf) {
      rules = [...rules, ...findJSRules(rule.oneOf)];
    }
    return rules;
  }, []);
}

function overrideCracoConfig({
  cracoConfig
}: {
  cracoConfig: CracoConfig;
}): CracoConfig {
  const context = getContext();
  if (!cracoConfig.webpack) cracoConfig.webpack = {};
  cracoConfig.webpack.configure = (
    webpackConfig: WebpackConfig,
    { paths }: { paths: Paths }
  ): WebpackConfig => {
    console.log(1);
    const webPath = path.resolve(context.paths.root, context.platformName);
    const srcPath = path.resolve(context.paths.root, 'src');
    let buildPath = null;
    console.log(2);
    if (context.action === 'build') {
      buildPath = path.resolve(context.paths.root, context.paths.build);
      if (!webpackConfig.output) webpackConfig.output = {};
      webpackConfig.output.path = buildPath;
      if (!webpackConfig.plugins) webpackConfig.plugins = [];
      if (context.options.analyze) {
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
      }
    }
    console.log(3);
    updatePaths(paths, webPath, buildPath);
    webpackConfig.entry = [path.resolve(webPath, 'index.tsx')];
    findJSRules(webpackConfig.module ? webpackConfig.module.rules : []).forEach(
      (rule: RuleSetRule) => {
        rule.include = [webPath, srcPath];
      }
    );
    console.log(
      '\n\n======== START CONTEXT ========\n',
      util.inspect(context, {
        colors: true,
        showHidden: true,
        depth: null
      }),
      '\n========= END CONTEXT =========\n\n'
    );
    console.log(4);
    if (!webpackConfig.resolve) webpackConfig.resolve = {};
    (webpackConfig.resolve.plugins || []).forEach((plugin: ResolvePlugin) => {
      const moduleScopePlugin = (plugin as unknown) as ModuleScopePlugin;
      if (
        moduleScopePlugin.appSrcs &&
        moduleScopePlugin.appSrcs.includes(srcPath)
      ) {
        moduleScopePlugin.appSrcs = [webPath, srcPath];
      }
    });
    console.log(5);
    // if (context.debug) {
    // eslint-disable-next-line no-console
    console.log(
      '\n\n======== START WEBPACK ========\n',
      util.inspect(webpackConfig, {
        colors: true,
        showHidden: true,
        depth: null
      }),
      '\n========= END WEBPACK =========\n\n'
    );
    // }
    console.log(6);
    webpackConfig = merge<WebpackConfig>(
      webpackConfig,
      // eslint-disable-next-line no-undef
      context.config?.webpack || {}
    );
    return webpackConfig;
  };
  cracoConfig.babel = merge<CracoBabel>(
    cracoConfig.babel || {},
    // eslint-disable-next-line no-undef
    context.config?.babel
  );
  // eslint-ignore-next-line
  return cracoConfig;
}

module.exports = {
  plugins: [
    {
      plugin: {
        overrideCracoConfig
      }
    }
  ]
} as CracoConfig;
