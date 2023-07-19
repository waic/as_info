const isProd = process.env.NODE_ENV === 'production'
const assetPrefix = isProd ? '/docs/as/info/' : ''

const yaml = require('js-yaml')
const fs = require('fs')
module.exports = {
  distDir: 'build_dir',

  assetPrefix,

  env: {
    ASSET_PREFIX: assetPrefix,
  },

  webpack: config => {
    config.devtool = 'source-map';
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|svg)$/,
      use: {
        loader: 'file-loader',
        options: {},
      }
    });
    config.module.rules.push({ test: /\.(ya?ml)$/, loader: "js-yaml-loader" });
    for (const r of config.module.rules) {
      if (r.loader === 'babel-loader') {
        r.options.sourceMaps = true
      }
    }
    return config
  },

  exportPathMap: async function(
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    const criteria = Object.keys(
      yaml.load(fs.readFileSync('./data/criteria.yaml', 'utf8'))
    ).reduce(
      (pages, key) =>
        Object.assign({}, pages, {
          [`/criteria/${key}`]: {
            page: `/criteria/[id]`,
            query: { id: key }
          }
        }),
      {}
    )
    const results = Object.keys(
      yaml.load(fs.readFileSync('./data/tests.yaml', 'utf8'))
    ).reduce(
      (pages, key) =>
        Object.assign({}, pages, {
          [`/results/${key}`]: {
            page: `/results/[id]`,
            query: { id: key }
          }
        }),
      {}
    )
    const techs = Object.keys(
      yaml.load(fs.readFileSync('./data/techs.yaml', 'utf8'))
    ).reduce(
      (pages, key) =>
        Object.assign({}, pages, {
          [`/techs/${key}`]: {
            page: `/techs/[id]`,
            query: { id: key }
          }
        }),
      {}
    )
    const exportMap = Object.assign({}, criteria, results, techs, {
      '/': { page: '/' },
    })
    return exportMap
  },
  images: {
    domains: ['waic.jp', 'mirrors.creativecommons.org'],
    unoptimized: true
  },
}
