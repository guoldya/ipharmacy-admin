<template>
    <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
    <a-layout-header v-if="!headerBarFixed"
                     :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
                     :style="{ padding: '0' }">
        <div v-if="mode === 'sidemenu'" class="header">
            <a-icon
                    v-if="device==='mobile'"
                    class="trigger"
                    :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                    @click="toggle"></a-icon>
            <a-icon
                    v-else
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="toggle"/>

            <user-menu></user-menu>
            <a-breadcrumb class="breadcrumb" v-if="isSideMenu()">
              <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
                <!--<span v-if="index === 0"><a :href='homepath'>{{item.meta.title}}</a></span>-->
                  <router-link v-if="index === 0" :to="{ path: homepath }">
                      {{ item.meta.title }}
                  </router-link>
                <span v-else>{{item.meta.title}}</span>
              </a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
            <div class="header-index-wide">
                <div class="header-index-left">
                    <logo class="top-nav-header" :show-title="device !== 'mobile'" />
                    <s-menu
                            v-if="device !== 'mobile'"
                            mode="horizontal"
                            :menu="menus"
                            :theme="theme"
                    ></s-menu>
                    <a-icon
                            v-else
                            class="trigger"
                            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                            @click="toggle"></a-icon>
                </div>
                <user-menu class="header-index-right"></user-menu>
            </div>
        </div>
    </a-layout-header>
</template>

<script>
    import UserMenu from '../tools/UserMenu'
    import SMenu from '../menu/'
    import Logo from '../tools/Logo'
    import Breadcrumb from '@/components/tools/Breadcrumb'
    // 设置文件
    import setting from '@/setting.js'
    import { mixin } from '@/utils/mixin.js'

    export default {
        name: 'GlobalHeader',
        components: {
            UserMenu,
            SMenu,
            Logo,
            's-breadcrumb': Breadcrumb
        },
        mixins: [mixin],
        props: {
            mode: {
                type: String,
                // sidemenu, topmenu
                default: 'sidemenu'
            },
            breadcrumb: {
                type: Array,
                default: null,
                required: false
            },
            menus: {
                type: Array,
                required: true
            },
            theme: {
                type: String,
                required: false,
                default: 'dark'
            },
            collapsed: {
                type: Boolean,
                required: false,
                default: false
            },
            device: {
                type: String,
                required: false,
                default: 'desktop'
            }
        },
        data() {
            return {
                headerBarFixed: false,
                name:'',
                apptitle :process.env.VUE_APP_TITLE,
                homepath :setting.page.opened[0].fullPath,
                breadList:[]
            }
        },

        created() {
            this.getBreadcrumb()
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll)
        },
        methods: {
            handleScroll() {
                if (this.autoHideHeader) {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                    if (scrollTop > 100) {
                        this.headerBarFixed = true
                    } else {
                        this.headerBarFixed = false
                    }
                } else {
                    this.headerBarFixed = false
                }
            },
            toggle() {
                this.$emit('toggle')
            },
            getBreadcrumb() {

                this.breadList = []
                // this.breadList.push({name: 'index', path: '/', meta: {title: '首页'}})
                this.name = this.$route.name
                this.$route.matched.forEach((item) => {
                    if(!item.meta.index && !item.meta.detail){
                        this.breadList.push(item)
                    }
                    // item.name !== 'index' && this.breadList.push(item)
                    // this.breadList.push(item)
                })
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        }
    }
</script>

<style lang="less" scoped>
    .breadcrumb{
        height: 64px;
        line-height: 64px;
    }
</style>