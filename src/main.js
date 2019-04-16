import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import config from '@/config'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
//引入Element的DataTable
import { Table, TableColumn,Dialog,Card,Tag,Collapse,CollapseItem } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// polyfill
import 'babel-polyfill'
// 核心插件
import admin from '@/plugin/admin'

import { VueAxios } from '@/utils/request' // axios 不建议引入到 Vue 原型链上
import $ from 'jquery'
// flex 布局库
import 'flex.css'
window.$ = $

//引入自定义样式
import '@/style/main.css'

import './core/use'
import bootstrap from './core/bootstrap'
import '@/permission' // permission control
import '@/utils/filter' // global filter

// [ 可选组件 ] 网格布局
import { GridLayout, GridItem } from 'vue-grid-layout'


import msgHandler from '@/comm-msg/msg-handler.js'
import Enum from '@/comm-data/enum.js'
import Searchpanel from '@/components/search-panel'
import { getFormat } from '@/utils/misc'
import util from '@utils/util'
import {asyncRouterMap, constantRouterMap} from '@/config/router.config'

// 核心插件
Vue.use(admin)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Collapse)
Vue.use(CollapseItem)
//统一错误处理
Vue.use(msgHandler)
Vue.config.productionTip = false
// 当前环境
Vue.prototype.$env = process.env.NODE_ENV

Vue.use(VueAxios, router)
//引入Axios
Vue.prototype.$axios = axios
Vue.prototype.getFormat = getFormat
Vue.prototype.$config = config
//公用枚举源
Vue.prototype.enum = Enum
Vue.prototype.$debuger = util.debuger
Vue.prototype.$notification = notification

/**
 * @description 全局注册应用配置
 */
Vue.component('Searchpanel', Searchpanel);
Vue.component('grid-layout', GridLayout);
Vue.component('grid-item', GridItem);

new Vue({
  router,
  store,
  created() {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('page/init', asyncRouterMap)
    //从Store中恢复VUEX
    bootstrap();
  },
  render: h => h(App),
  data: {
    userName:''
  },
  mounted(){
    // 展示系统信息
    this.$store.commit('releases/versionShow')
    // 获取并记录用户 UA
    this.$store.commit('ua/get')
    this.$store.commit('SET_NAME',{name:this.userName});
  }
}).$mount('#app')
