import { Plugin } from '@reactant/plugin';
import createConfig from './createConfig';
import defaultOptions from './defaultOptions';

const plugin: Plugin = {
  config: createConfig,
  defaultOptions,
  name: 'rebass',
  supportedPlatforms: ['web', 'ios', 'android', 'expo']
};

export default plugin;
