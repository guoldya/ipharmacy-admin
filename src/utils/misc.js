import moment from 'moment';

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function toDefaultPage(routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
}

export function getHomeRoute(routers) {
    let len = routers.length,
        i = -1,
        homeRoute = {};
    while (++i < len) {
        let item = routers[i];
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children);
            if (res.name) return res
        } else {
            if (item.name === 'home') homeRoute = item
        }
    }
    return homeRoute
}

export function getBreadCrumbList (routeMetched, homeRoute){
    let res = routeMetched.filter(item => {
        return !item.hidden
    }).map(item => {
        let obj = {
            name: item.name,
            meta:item.meta,
            path: item.path
        };
        return obj
    });
    return [homeRoute, ...res]
}

export function routeEqual(route1, route2) {
    const params1 = route1.params || {};
    const params2 = route2.params || {};
    const query1 = route1.query || {};
    const query2 = route2.query || {};
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

export function objEqual(obj1, obj2) {
    const keysArr1 = Object.keys(obj1)
    const keysArr2 = Object.keys(obj2)
    if (keysArr1.length !== keysArr2.length) return false
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true
    /* eslint-disable-next-line */
    else return !keysArr1.some(key => obj1[key] != obj2[key])
}

export function getParentRouterObjByName(routers, name, parent) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return parent;
        }
        routerObj = getParentRouterObjByName(item.children, name, item);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
}

export function getRouterObjByName(routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
}

export function openNewPage(vm,to) {
  const { name, params, query, fullPath,meta } = to
  // 多页控制 打开新的页面
  vm.$store.dispatch('page/open', { name, params, query, fullPath,meta })
   // let pageOpenedList = vm.$store.state.app.tagNavList;
   // let openedPageLen = pageOpenedList.length;
   //  let i = 0;
   //  let tagHasOpened = false;
   //  //检查已打开页面，替换原来的页面
   //  while (i < openedPageLen) {
   //      //获取父级
   //      let parentRoute = getParentRouterObjByName(vm.$store.state.app.routers, name);
   //      let parentRoute2 = getParentRouterObjByName(vm.$store.state.app.routers, pageOpenedList[i].name);
   //      let route = getRouterObjByName(vm.$store.state.app.routers, name);
   //      //如果是同一个父级则替换pageOpenedList
   //      if (parentRoute === parentRoute2 && route && route.meta && (route.meta.index || route.meta.detail)) {
   //          vm.$store.commit('pageOpenedList', {
   //              index: i,
   //              argu: argu,
   //              query: query,
   //              name: name,
   //              meta: route ? route.meta : '',
   //              path: route.path
   //          });
   //          tagHasOpened = true;
   //          break;
   //      }
   //      if (name === pageOpenedList[i].name) { //||(parentRoute&&parentRoute2&&parentRoute.name === parentRoute2.name)) { // 页面已经打开
   //          //更新详细页面
   //          vm.$store.commit('pageOpenedList', {
   //              index: i,
   //              argu: argu,
   //              query: query,
   //              name: name,
   //              meta: route ? route.meta : '',
   //              path: route.path
   //          });
   //          tagHasOpened = true;
   //          break;
   //      }
   //      i++;
   //  }
}

export function getFormat(dataField) {
    let params;
    params = [dataField[0].format('YYYY-MM-DD'),dataField[1].format('YYYY-MM-DD')];
    return params;
}

export function hasChild(route) {
  if(route.children.length){
    return true;
  }else{
    return false
  }
}
export function checkArray(data) {
    if(data!==undefined&&data!==null&&data.length>0){
      return true;
    }else{
      return false
    }
  }

/*
** 数据里的时间格式处理
* *@param data 数据
* *@param props 处理的时间字段
* *@param type 目标格式
 */
export function dateFormat(data = [],props = [],type = 'YYYY-MM-DD HH:mm') {
    data.map( i => {
        props.forEach( item => {
            i[item] = moment(i[item]).format(type)
        })
        return i;
    })
    return data;
}