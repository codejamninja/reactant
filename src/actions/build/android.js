import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { log } from 'reaction-base';
import clean from '../clean';
import configureAndroid from '../configure/android';
import createConfig from '../../createConfig';

export default async function buildAndroid(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  await configureAndroid(options, config);
  const spinner = ora('building android\n').start();
  const { paths } = config;
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  await fs.mkdirs(paths.distAndroid);
  spinner.stop();
  await easycp(
    `react-native bundle --entry-file ${path.resolve(
      paths.android,
      'index.js'
    )} --bundle-output ${path.resolve(
      paths.distAndroid,
      `${config.moduleName}.bundle`
    )}`
  );
  spinner.succeed('built android');
}
