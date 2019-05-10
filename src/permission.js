import Vue from 'vue'
import router from './router'
import store from './store'
import {toDefaultPage, getRouterObjByName, openNewPage} from '@/utils/misc'
import {asyncRouterMap, constantRouterMap} from '@/config/router.config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { ACCESS_TOKEN,IS_LOCK } from '@/store/mutation-types'
import util from '@/utils/util.js'
import {setSessionStore,getSessionStore,removeSessionStore} from  '@utils/storage.js'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult','lock'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  //判断cookie是否存在access-token
  const accessToken = Vue.ls.get(ACCESS_TOKEN)
  const token = util.cookies.get('token')
  let isLock = getSessionStore({
    name: 'isLock'
  }) || false
next();
  // if (token && token !== 'undefined' && accessToken) {
  //   if (isLock && to.path !== '/user/lock') {
  //     next({
  //       path: '/user/lock'
  //     })
  //     NProgress.done()
  //   } else {
  //     if (to.path === '/user/login') {
  //       next({ path: '/dashboard/workplace' })
  //       NProgress.done()
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   if (whiteList.includes(to.name)) {
  //     // 在免登录白名单，直接进入
  //     next()
  //   } else {
  //     next({ path: '/user/login', query: { redirect: to.fullPath } })
  //     NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  //   }
  // }
})

router.afterEach((to) => {
    //判断是否有索引页，replace
    const curRouterObj = getRouterObjByName(asyncRouterMap[0].children, to.name);
    //如果有子节点，并且为index
    if (curRouterObj && curRouterObj.children) {
        let len = curRouterObj.children.length;
        let i = 0;
        //打开索引页
        while (i < len) {
            if (curRouterObj.children[i].meta && curRouterObj.children[i].meta.index) {
                router.replace({
                    name: curRouterObj.children[i].name,
                    //path :curRouterObj.children[i].path
                });
                break;
            }
            i++;
        }
    }
    openNewPage(router.app, to);
    NProgress.done() // finish progress bar
    util.title(to.meta.title)
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <a-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
    bind: function(el, binding, vnode) {
        const actionName = binding.arg
        const roles = store.getters.roles
        const permissionId = vnode.context.$route.meta.permission
        let actions = []
        roles.permissions.forEach(p => {
            if (p.permissionId != permissionId) {
                return
            }
            actions = p.actionList
        })
        if (actions.indexOf(actionName) < 0) {
            setTimeout(() => {
                if (el.parentNode == null) {
                    el.style.display = 'none'
                }
                else {
                    el.parentNode.removeChild(el)
                }
            }, 10)

        }
    }
})

export {
    action
}
