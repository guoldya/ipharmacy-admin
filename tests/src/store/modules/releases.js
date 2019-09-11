import util from '@utils/util.js'
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // 应用版本
    version: setting.releases.version,
    appname:setting.releases.name
  },
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state vuex state
     */
    versionShow (state) {
      util.log.capsule(`${state.appname}`, `v${state.version}`)

    }
  }
}
