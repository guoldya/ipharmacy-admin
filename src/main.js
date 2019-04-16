
//核心引用
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import config from '@/config'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'

//功能相关插件  可自定义卸载
import admin from '@/plugin/admin'
import bootstrap from './core/bootstrap'
import { VueAxios } from '@/utils/request' 
import './core/use'
import '@/permission' // vue 权限控制
import '@/utils/filter' // vue 全局 filter  
import 'babel-polyfill' // polyfill

//组件相关
import { Table, TableColumn,Card,Tag,Collapse,CollapseItem } from 'element-ui'
import { GridLayout, GridItem } from 'vue-grid-layout' // [ 可选组件 ] 网格布局
import vcolorpicker from 'vcolorpicker'

//业务相关组件
import msgHandler from '@/comm-msg/msg-handler.js'
import Searchpanel from '@/components/search-panel'
import util from '@utils/util'
import { getFormat } from '@/utils/misc'
import {asyncRouterMap} from '@/config/router.config'
import Enum from '@/comm-data/enum.js'

//样式导入
import 'element-ui/lib/theme-chalk/index.css'
import 'flex.css'// flex 布局库
import '@/style/main.css'//引入自定义样式





// 核心插件
Vue.use(admin)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(vcolorpicker)
Vue.use(msgHandler)//统一错误处理
Vue.use(VueAxios, router)

Vue.config.productionTip = false
// 当前环境
Vue.prototype.$env = process.env.NODE_ENV
Vue.prototype.$axios = axios //引入Axios
Vue.prototype.getFormat = getFormat
Vue.prototype.$config = config
Vue.prototype.enum = Enum//公用枚举源
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
