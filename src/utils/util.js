import log from './util.log.js'
import cookies from './util.cookies.js'
import debuger from './util.debuger.js'

let util = {
  cookies,
  log,
  debuger
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function(titleText) {
  const processTitle = process.env.VUE_APP_TITLE || '后台'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function(url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'admin-menu-link')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('admin-menu-link'))
}

function trimfy(val) {
  var demo = String(this)
  if (demo.indexOf(val) >= 0) {
    if (demo.substring(demo.indexOf(val), val.length) === val) {
      demo = demo.substring(demo.indexOf(val) + val.length)
    }
  }
  if (demo.lastIndexOf(val) >= 0) {
    if (demo.substring(demo.lastIndexOf(val)) === val) {
      demo = demo.slice(0, demo.lastIndexOf(val))
    }
  }
  if (demo.indexOf(val) == 0 || demo.lastIndexOf(val) == 0) {
    demo = demo.trimfy(val)
  }
  return demo
}

/**
 * @description 字符串去空
 * @param {String} val 入参
 */
util.trim = function(val) {
  if (val == null) {
    return null
  } else if (val == undefined) {
    return null
  } else if (val == 'null') {
    return null
  } else if (val == 'undefined') {
    return null
  } else if (typeof (val) == 'string') {
    return trimfy(val)
  } else {
    return val
  }
}


export default util
