const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
    /*
      Vue-cli3:
      Crashed when using Webpack `import()` #2463
      https://github.com/vuejs/vue-cli/issues/2463

     */
    /*
    pages: {
      index: {
        entry: 'src/main.js',
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }
    },
    */
    configureWebpack: {
        plugins: [
            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ]
    },

    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@layout', resolve('src/layout'))
            .set('@static', resolve('src/static'))
            .set('@utils', resolve('src/utils'))
      // babel-polyfill 加入 entry，ES6的特性兼容方案
      const entry = config.entry('app')
      // 判断环境加入模拟数据
      if (process.env.VUE_APP_BUILD_MODE !== 'nomock') {
        entry
          .add('@/mock')
          .end()
      }
    },

    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */

                    /*
                    'primary-color': '#F5222D',
                    'link-color': '#F5222D',
                    'border-radius-base': '4px',
                    */
                },
                javascriptEnabled: true
            }
        }
    },

    devServer: {
        proxy: {
          // '/api': {
          //   // target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
          //   target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
          //   ws: false,
          //   changeOrigin: true
          // },
          // '/gateway': {
          //   target: 'https://www.easy-mock.com/mock/5b7bce071f130e5b7fe8cd7d/antd-pro',
          //   ws: false,
          //   changeOrigin: true,
          //   pathRewrite: {
          //     '^/gateway': '/api'
          //   }
          // },
          '/api/sys/': {
            //target: 'http://192.168.0.150:38080/sysweb/',
            //target: 'http://192.168.0.104:8088/',
            target: 'http://192.168.0.205:8088/',
            changeOrigin: true, // 允许跨域
            pathRewrite: {
              '^/api/sys/': '/'
            }
          },
          '/api/biz/': {
            // target: 'http://192.168.0.150:38080/bizweb/',
            target: 'http://192.168.0.104:8088',
            // target: 'http://192.168.0.205:8088',
            changeOrigin: true, // 允许跨域
            pathRewrite: {
              '^/api/biz/': '/'
            }
          }
        },
    },
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: false
}