// 设置文件
import config from '@/config/defaultSettings'
export default {
  namespaced: true,
  state: {
    info:config
  },
  mutations: {
    //主色调
    SET_COLOR: (state, data) => {
      state.info.primaryColor = data
      //preference.color
    },
    //导航菜单主题
    SET_THEME: (state, data) => {
      //preference.theme
      state.info.navTheme = data
    },
    // 导航菜单位置：sidemenu或topmenu
    SET_LAYOUT_MODE: (state, data) => {
      //preference.layout
      state.info.layout = data
    },
    // sticky header
    SET_FIXED_HEADER: (state, data) => {
      //preference.fixedHeader
      state.info.fixedHeader = data
    },
    // sticky siderbar
    SET_FIXED_SIDERBAR: (state, data) => {
      //preference.fixSiderbar
      state.info.fixSiderbar = data
    },
    //内容布局：流动或固定，仅当布局为TopMenu时才有效
    SET_CONTENT_WIDTH: (state, data) => {
      //preference.contentWidth
      state.info.contentWidth = data
    },
    //  自动隐藏标题
    SET_FIXED_HEADER_HIDDEN: (state, data) => {
      //preference.autoHideHeader
      state.info.autoHideHeader = data
    },
    SET_WEAK: (state, data) => {
      //preference.colorWeak
      state.info.colorWeak = data
    },
    SET_PAGETRANSITION: (state, data) => {
      //preference.transition
      state.info.transition = data
    },
    SET_MULTIPAGE: (state, data) => {
      //preference.transition
      state.info.multiPage = data
    },
    SET_SIDEBAR_TYPE: (state, data) => {
      state.info.sidebar = data
    },
    CLOSE_SIDEBAR: (state) => {
      state.info.sidebar = false
    },
    TOGGLE_DEVICE: (state, device) => {
      state.info.device = device
    },
    SET_TRANSITION: (state, transition) => {
      state.info.transition = transition
    },
    // 设置锁定密码
    SET_LOCK_PASSWD:(state,dispatch,info)=>
    {
      state.info.lockPasswd = info
    },
    SET_CLEAR_LCK_PASSWD:(state,dispatch)=>
    {
      state.info.lockPasswd = ''
    },
  },
  actions: {
    clearLockPass({ commit ,dispatch})
    {
      commit('SET_CLEAR_LCK_PASSWD')
      dispatch('SetLockPass','')
    },
    SetLockPass({ state, dispatch },info)
    {
      return new Promise(async resolve => {
        await dispatch('db/set', {
          dbName: 'sys',
          path: 'user.preference.lockPasswd',
          value: info,
          user: true
        }, { root: true })
        resolve()
      })
    },
    setSidebar({ commit }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    },
    CloseSidebar({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    },
    ToggleLayoutMode({ commit }, mode) {
      commit('SET_LAYOUT_MODE', mode)
    },
    ToggleFixedHeader({ commit }, fixedHeader) {
      if (!fixedHeader) {
        commit('SET_FIXED_HEADER_HIDDEN', false)
      }
      commit('SET_FIXED_HEADER', fixedHeader)
    },
    ToggleFixSiderbar({ commit }, fixSiderbar) {
      commit('SET_FIXED_SIDERBAR', fixSiderbar)
    },
    ToggleFixedHeaderHidden({ commit }, show) {
      commit('SET_FIXED_HEADER_HIDDEN', show)
    },
    ToggleContentWidth({ commit }, type) {
      commit('SET_CONTENT_WIDTH', type)
    },
    ToggleColor({ commit }, color) {
      commit('SET_COLOR', color)
    },
    ToggleWeak({ commit }, weakFlag) {
      commit('SET_WEAK', weakFlag)
    },
    ToggleMultipage({ commit }, multipage) {
      commit('SET_MULTIPAGE', multipage)
    },
    ToggleTransition({ commit }, transition)
    {
      commit('SET_TRANSITION', transition)
    },
    /**
     * @description 按用户保存
     * @param {Object} state vuex state
     * @param {String} value
     */
    save ({ state, commit, dispatch }) {
      console.log('保存用户个性化设置',state.info)
      return new Promise(async resolve => {
        // 持久化
        await dispatch('db/set', {
          dbName: 'sys',
          path: 'user.preference',
          value: state.info,
          user: true
        }, { root: true })
        resolve()
      })
    },
    load ({ state, commit, dispatch })
    {
      return new Promise(async resolve => {
        // store 赋值
        state.info =  await  dispatch('db/get', {
          dbName: 'sys',
          path:  'user.preference',
          defaultValue:config ,
          user: true
        }, { root: true })
        console.log('读取用户个性化设置',state.info)
        // end
        resolve()
      })
    },
  }
}
