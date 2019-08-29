import Vue from 'vue'
import router from './router'
import store from './store'
import { toDefaultPage, getRouterObjByName, openNewPage } from '@/utils/misc'
import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { ACCESS_TOKEN, IS_LOCK } from '@/store/mutation-types'
import util from '@/utils/util.js'
import { setSessionStore, getSessionStore, removeSessionStore } from '@utils/storage.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult', 'lock'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  //判断cookie是否存在access-token
  // const accessToken = Vue.ls.get(ACCESS_TOKEN)
  // const token = util.cookies.get('token')
  const token = util.cookies.get('user')
  let isLock = getSessionStore({
    name: 'isLock'
  }) || false
// next();
  if (token && token !== 'undefined') {
    if (isLock && to.path !== '/user/lock') {
      next({
        path: '/user/lock'
      })
      NProgress.done()
    } else if (to.path == '/404') {
      next()
    } else {
      if (to.path === '/user/login') {
        next({ path: '/dashboard/workplace' })
        NProgress.done()
      } else {
        let state = []
        let nextPath = ''
        let toPath = to.path
        if (localStorage.rightsMenus) {
          state = JSON.parse(localStorage.rightsMenus)
        }
        for (let key in state) {
          if (toPath.indexOf(state[key].path) > 1 || toPath == '/dashboard/workplace') {
            nextPath = to.path
            break
          } else {
            nextPath = '/404'
          }
        }
        if (nextPath == '/404') {
          next({
            path: '/404'
          })
        } else {
          next()
        }
        NProgress.done()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      console.log('eee')
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach((to) => {
  //判断是否有索引页，replace
  const curRouterObj = getRouterObjByName(asyncRouterMap[0].children, to.name)
  //如果有子节点，并且为index
  if (curRouterObj && curRouterObj.children) {
    let len = curRouterObj.children.length
    let i = 0
    //打开索引页
    while (i < len) {
      if (curRouterObj.children[i].meta && curRouterObj.children[i].meta.index) {
        router.replace({
          name: curRouterObj.children[i].name
          //path :curRouterObj.children[i].path
        })
        break
      }
      i++
    }
  }
  openNewPage(router.app, to)
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
        } else {
          el.parentNode.removeChild(el)
        }
      }, 10)

    }
  }
})

const modalDrag = Vue.directive('modalDrag', {

  bind(el, binding, vnode, oldVnode) {

    //弹框可拉伸最小宽高

    let minWidth = 400

    let minHeight = 300

    //初始非全屏

    let isFullScreen = false

    //当前宽高

    let nowWidth = 0

    let nowHight = 0

    //当前顶部高度

    let nowMarginTop = 0

    //获取弹框头部（这部分可双击全屏）

    const dialogHeaderEl = el.querySelector('.ant-modal-header')

    //弹窗

    const dragDom = el.querySelector('.ant-modal')
    console.log(dialogHeaderEl)
    console.log(dragDom)


    //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；

    dragDom.style.overflow = 'auto'

    //清除选择头部文字效果

    //dialogHeaderEl.onselectstart = new Function("return false");

    //头部加上可拖动cursor

    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);

    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    let moveDown = (e) => {

      // 鼠标按下，计算当前元素距离可视区的距离

      const disX = e.clientX - dialogHeaderEl.offsetLeft

      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换

      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px

      if (sty.left.includes('%')) {

        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)

        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)

      } else {

        styL = +sty.left.replace(/\px/g, '')

        styT = +sty.top.replace(/\px/g, '')

      }


      document.onmousemove = function(e) {

        // 通过事件委托，计算移动的距离

        const l = e.clientX - disX

        const t = e.clientY - disY

        // 移动当前元素

        dragDom.style.left = `${l + styL}px`

        dragDom.style.top = `${t + styT}px`

        //将此时的位置传出去

        //binding.value({x:e.pageX,y:e.pageY})

      }

      document.onmouseup = function(e) {

        document.onmousemove = null

        document.onmouseup = null

      }

    }

    dialogHeaderEl.onmousedown = moveDown
  }
})

export {
  action,
  modalDrag
}
