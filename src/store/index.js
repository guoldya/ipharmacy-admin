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
import text from './modules/text'
import getters from './getters'
Vue.use(Vuex)
const state = {routerData:{},drugList:[],drugId:'',proslist:[],status:'2',sessiondata:null,prescNumStr:''}
export default new Vuex.Store({
  modules: {
    db,
    ua,
    preference,
    page,
    user,
    permission,
    releases,
    log,
    text
  },
  state,
  mutations: {

  },
  actions: {

  },
  getters
})
