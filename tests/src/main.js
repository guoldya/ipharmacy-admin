//核心引用
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import config from '@/config'
// import axios from 'axios'
import { axios } from '@/utils/request'
import notification from 'ant-design-vue/es/notification'
import './assets/iconfont/iconfont.css'

//功能相关插件  可自定义卸载
import admin from '@/plugin/admin'
import bootstrap from './core/bootstrap'
import { VueAxios } from '@/utils/request'
import util from '@/utils/util'
import './core/use'
import '@/permission' // vue 权限控制
import '@/utils/filter' // vue 全局 filter
import 'babel-polyfill' // polyfill
import '@/directives'

//组件相关
import { Table, TableColumn, Card, Tag, Collapse, CollapseItem, Scrollbar, Tooltip,Progress } from 'element-ui'
import { GridLayout, GridItem } from 'vue-grid-layout' // [ 可选组件 ] 网格布局
import vcolorpicker from 'vcolorpicker'
import chatModal from '@/components/chatModal/chatModal'

//业务相关组件
import msgHandler from '@/comm-msg/msg-handler.js'
import Searchpanel from '@/components/search-panel'
import detailHeader from '@/components/detailHeader/header'
import treeSelect from '@/components/tree-select'
import dateList from '@/components/dateList/dateList'

// import util from '@utils/util'
import { getFormat, dateFormat,checkArray,changeTime } from '@/utils/misc'
import { asyncRouterMap } from '@/config/router.config'
import Enum from '@/comm-data/enum.js'

//样式导入
import 'element-ui/lib/theme-chalk/index.css'
import 'flex.css'// flex 布局库
import '@/style/main.css'//引入自定义样式
import { Icon } from 'ant-design-vue'
import opcol from '@/my-components/opcol/opcol.vue'
import api from '@/api/index'
import gante from "@/components/gante/gante"
import ganteGraph from "@/components/ganteGraph/gante"
//proto
import protoRoot from '@/my-components/proto/proto'
import uuid from 'uuid'

Vue.use(gante)
Vue.use(ganteGraph)
//引入一个表格

// 核心插件
Vue.use(admin)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(vcolorpicker)
Vue.use(Scrollbar)
Vue.use(Tooltip)
Vue.use(Progress)
Vue.use(msgHandler)//统一错误处理
Vue.use(VueAxios, router)
Vue.use(protoRoot)
Vue.use(uuid)



Vue.config.productionTip = false
// 当前环境
Vue.prototype.$env = process.env.NODE_ENV
Vue.prototype.$axios = axios //引入Axios
Vue.prototype.$api = api //引入Axios
Vue.prototype.getFormat = getFormat
Vue.prototype.$config = config
Vue.prototype.enum = Enum//公用枚举源
Vue.prototype.$debuger = util.debuger
Vue.prototype.$notification = notification
Vue.prototype.$dateFormat = dateFormat
Vue.prototype.$changeTime = changeTime
Vue.prototype.$util = util

/**
 * @description 全局注册应用配置
 */
Vue.component('Searchpanel', Searchpanel)
Vue.component('grid-item', GridItem)
Vue.component('opcol', opcol)
Vue.component('detailHeader', detailHeader)
Vue.component('treeSelect',treeSelect)
Vue.component('dateList', dateList)
Vue.component('chatModal', chatModal)


new Vue({
    router,
    store,
    created() {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('page/init', asyncRouterMap)
        //从Store中恢复VUEX
        bootstrap()
    },
    render: h => h(App),
    data: {
        userName: ''
    },
    mounted() {
        // 展示系统信息
        this.$store.commit('releases/versionShow')
        // 获取并记录用户 UA
        this.$store.commit('ua/get')
        // this.$store.commit('SET_NAME', { name: this.userName })
        this.$store.commit('updateMenulist')
    }
}).$mount('#app')
