import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import permission from './modules/permission'
import log from './modules/log'
import releases from './modules/releases'
import page from './modules/page'
import db from './modules/db'
import preference from './modules/preference'
import ua from './modules/ua'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    db,
    ua,
    preference,
    page,
    user,
    permission,
    releases,
    log
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
