import Vue from 'vue'
import Router from 'vue-router'
import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
let routers = asyncRouterMap.concat(constantRouterMap)

Vue.use(Router)

export default new Router({
    mode: 'history',
  //基路径
    base: '/',
    scrollBehavior: () => ({ y: 0 }),
    routes: routers
})