import path from 'path';
import { Configuration, WebpackPluginInstance } from 'webpack';
import WebpackBar from 'webpackbar';
import buildConfig from './config';
import webpackConfigBase from './webpack.config.base';
import nodeExternals from 'webpack-node-externals';

const { dist, mainSource: appPath } = buildConfig;

const webpackConfig: Configuration = {
  ...webpackConfigBase,
  target: 'electron-main',
  externals: [
    nodeExternals({
      allowlist: ['electron-log'],
      // allowlist: [/^((?!iohook).)*$/],
      // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
    }),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    // function (
    //   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    //   context: any,
    //   request: string,
    //   callback: (arg0?: null | undefined, arg1?: string | undefined) => any
    // ) {
    //   if (/\.node$/.test(request)) {
    //     return callback(null, `commonjs ${request}`);
    //   }

    //   return callback();
    // },
  ] as unknown as Configuration['externals'],

  entry: {
    main: path.join(appPath, 'index.ts'),
  },

  output: {
    path: path.join(dist, 'main'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /(?<!\.d)\.ts$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
      // {
      //   test: /\.js$/,
      //   loader: 'bindings-loader',
      // },
      // {
      //   test: /\.node$/,
      //   loader: 'node-loader',
      // },
    ],
  },
  plugins: [
    ...(webpackConfigBase?.plugins ?? []),
    new WebpackBar({ name: 'Main    ', color: '#799AFE' }),
  ] as WebpackPluginInstance[],
};

export default webpackConfig;
