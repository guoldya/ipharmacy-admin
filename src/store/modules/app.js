import Vue from 'vue'
import {
    SIDEBAR_TYPE,
    DEFAULT_THEME,
    DEFAULT_MULTIPAGE,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR,
    DEFAULT_COLOR_WEAK,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_CONTENT_WIDTH_TYPE
} from '@/store/mutation-types'
import { asyncRouterMap } from '@/config/router.config'
import { message } from 'ant-design-vue';
import { hasChild } from '@/utils/misc'
import Config from '@/config/index'


const app = {
    state: {
        sidebar: true,
        routers: hasChild(asyncRouterMap) ? asyncRouterMap[0].children : {},
        device: 'desktop',
        theme: '',
        layout: '',
        contentWidth: '',
        fixedHeader: false,
        fixSiderbar: false,
        autoHideHeader: false,
        color: null,
        weak: false,
        multiPage: true,
        transition: true,
        rightsMenus:[],
        menuList: [],
    },
    mutations: {
        TOGGLE_MULTIPAGE: (state, mulitpage) => {
            state.multiPage = mulitpage
            Vue.ls.set(DEFAULT_MULTIPAGE, mulitpage)
        },
        SET_SIDEBAR_TYPE: (state, type) => {
            state.sidebar = type
            Vue.ls.set(SIDEBAR_TYPE, type)
        },
        CLOSE_SIDEBAR: (state) => {
            Vue.ls.set(SIDEBAR_TYPE, true)
            state.sidebar = false
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        TOGGLE_THEME: (state, theme) => {
            // setStore('_DEFAULT_THEME', theme)
            Vue.ls.set(DEFAULT_THEME, theme)
            state.theme = theme
        },
        TOGGLE_LAYOUT_MODE: (state, layout) => {
            Vue.ls.set(DEFAULT_LAYOUT_MODE, layout)
            state.layout = layout
        },
        TOGGLE_FIXED_HEADER: (state, fixed) => {
            Vue.ls.set(DEFAULT_FIXED_HEADER, fixed)
            state.fixedHeader = fixed
        },
        TOGGLE_FIXED_SIDERBAR: (state, fixed) => {
            Vue.ls.set(DEFAULT_FIXED_SIDEMENU, fixed)
            state.fixSiderbar = fixed
        },
        TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => {
            Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show)
            state.autoHideHeader = show
        },
        TOGGLE_CONTENT_WIDTH: (state, type) => {
            Vue.ls.set(DEFAULT_CONTENT_WIDTH_TYPE, type)
            state.contentWidth = type
        },
        TOGGLE_COLOR: (state, color) => {
            Vue.ls.set(DEFAULT_COLOR, color)
            state.color = color
        },
        TOGGLE_WEAK: (state, flag) => {
            Vue.ls.set(DEFAULT_COLOR_WEAK, flag)
            state.weak = flag
        },
        // 获取服务器权限菜单
        setUserModuleList(state) {
            // 获取权限
            put('/sys/func/list').then(res => {
                if (res.code == '200') {
                    // 获取菜单权限，并放入store
                    // 保存到store.app下的Menus属性
                    state.rightsMenus = res.rows;
                    localStorage.rightsMenus = JSON.stringify(state.rightsMenus);
                    this.commit('updateMenulist');
                }
                else {
                    message.warn(res.data.msg);
                }
            }).catch(err => {
                message.error(err.data.msg);
            });
        },
        updateMenulist(state) {
            if (localStorage.rightsMenus) {
                state.rightsMenus = JSON.parse(localStorage.rightsMenus);
            }
            let menuList = [];
            // 临时全取,不校验权限
            if (!Config.checkPermission) {
                state.menuList = state.routers
            }
            else {
                routers.forEach((router,index)=>{
                    let item1 = router;
                    let ret1 = state.rightsMenus.find((value, index, arr) => {
                        return value.path == item1.name;
                    });
                    if(ret1){
                        let routerMenu = Object.assign( {}, item1);
                        routerMenu.children = [];
                        routerMenu.icon = routerMenu.meta.icon;
                        if(item1.children){
                            for (let ii in item1.children){
                                let item2 = item1.children[ii];
                                let ret2 = state.rightsMenus.find((value, index, arr) => {
                                    return value.path == item2.name;
                                });
                                if (ret2) {
                                    let sonMenu = Object.assign({}, item2);
                                    // sonMenu.children = [];
                                    sonMenu.icon = sonMenu.meta.icon;
                                    routerMenu.children.push(sonMenu);
                                }
                            }
                        }
                        menuList.push(routerMenu);
                    }
                });
                state.menuList = menuList;
            }
        },
    },
    actions: {
        setSidebar({ commit }, type) {
            commit('SET_SIDEBAR_TYPE', type)
        },
        CloseSidebar({ commit }) {
            commit('CLOSE_SIDEBAR')
        },
        ToggleDevice({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
        ToggleTheme({ commit }, theme) {
            commit('TOGGLE_THEME', theme)
        },
        ToggleLayoutMode({ commit }, mode) {
            commit('TOGGLE_LAYOUT_MODE', mode)
        },
        ToggleFixedHeader({ commit }, fixedHeader) {
            if (!fixedHeader) {
                commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
            }
            commit('TOGGLE_FIXED_HEADER', fixedHeader)
        },
        ToggleFixSiderbar({ commit }, fixSiderbar) {
            commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
        },
        ToggleFixedHeaderHidden({ commit }, show) {
            commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
        },
        ToggleContentWidth({ commit }, type) {
            commit('TOGGLE_CONTENT_WIDTH', type)
        },
        ToggleColor({ commit }, color) {
            commit('TOGGLE_COLOR', color)
        },
        ToggleWeak({ commit }, weakFlag) {
            commit('TOGGLE_WEAK', weakFlag)
        },
        ToggleMultipage({ commit }, multipage) {
            commit('TOGGLE_MULTIPAGE', multipage)
        }
    }
}

export default app