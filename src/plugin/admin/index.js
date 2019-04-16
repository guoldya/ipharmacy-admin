// flex 布局库
import 'flex.css'

// 功能插件
import pluginError from '@/plugin/error'
import pluginExport from '@/plugin/export'
import pluginImport from '@/plugin/import'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示。https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // Element
    // 插件
    Vue.use(pluginError)
    Vue.use(pluginExport)
    Vue.use(pluginImport)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)
  }
}
