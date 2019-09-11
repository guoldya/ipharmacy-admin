import store from '@/store/'
import { removeLoadingAnimate } from '@/utils/misc'
import notification from 'ant-design-vue/es/notification'


//初始化，恢复VUEX
export default function Initializer () {
  // 用户登录后从数据库加载一系列的设置
  store.dispatch('LoadAccountInfo')
  store.dispatch('LoadPerfenence')
  store.dispatch('page/openedLoad')
  // last step
  removeLoadingAnimate('preloadingWrapper', 1500)
}