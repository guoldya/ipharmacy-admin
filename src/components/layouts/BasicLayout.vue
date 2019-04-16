<template>
  <global-layout>
    <div class="tags-nav" v-if="multipage">
      <contextmenu :itemList="curtagName === homepath ? contextmenuListIndex : contextmenuList"  :visible.sync="menuVisible" @select="onMenuSelect" />
      <a-tabs
        style="margin-top: -22px; margin-bottom: 8px"
        :active-key="current"
        hideAdd
        type="editable-card"
        @edit="editPage"
        @change="changePage"
        @contextmenu.native="e => onContextmenu(e)"
      >
        <a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="(page,index) in opened" :closable="index == 0?false:true" >
          <span slot="tab" :pagekey="page.fullPath">{{page.meta.title|| '未命名'}}</span>
        </a-tab-pane>
      </a-tabs>
      <div class="close-all-tag-con" v-if="multipage">
        <a-dropdown >
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="all">
              <a-icon type="close-circle" />
              关闭所有
            </a-menu-item>
            <a-menu-item key="other">
              <a-icon type="arrow-up" />
              关闭其他
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 2px;margin-top:6px;padding: 0px 4px">
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <transition  :name="transition ? 'page-toggle' : ''" >
      <keep-alive v-if="multipage">
        <router-view />
      </keep-alive>
      <router-view v-else />
    </transition>
  </global-layout>
</template>

<script>
    import RouteView from '@/components/layouts/RouteView'
    import GlobalLayout from '@/components/layouts/GlobalLayout'
    import { routeEqual, getRouterObjByName, getParentRouterObjByName } from '@/utils/misc'
    import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
    import Contextmenu from '@/components/menu/ContextMenu'
    import { mapState,mapMutations, mapActions } from 'vuex'
    import setting from '@/setting.js'
    export default {
        name: 'BasicLayout',
        components: {
            RouteView,
            GlobalLayout,
            Contextmenu
        },
      computed: {
        multipage () {
          return this.$store.getters.multiPage
        },
        transition() {
          return this.$store.getters.transition
        },
        ...mapState('page', [
          'opened',
          'current'
        ])
      },
      data() {
        return {
          activePage: '',
          menuVisible: false,
          contextmenuListIndex: [
            { icon: 'close-circle', title: '关闭全部', key: 'all' }
          ],
          contextmenuList: [
            { icon: 'arrow-left', title: '关闭左侧', key: 'left' },
            { icon: 'arrow-right', title: '关闭右侧', key: 'right' },
            { icon: 'close', title: '关闭其它', key: 'other' },
            { icon: 'close-circle', title: '关闭全部', key: 'all' }
          ],
          homepath :setting.page.opened[0].fullPath,
          curtagName:''
        }
      },
      mounted() {
        // console.log('opened',opened)
      },
      methods: {
        ...mapMutations('page', [
          'keepAliveRemove',
          'keepAliveClean'
        ]),
        ...mapActions( 'page',[
          'close',
          'closeLeft',
          'closeRight',
          'closeOther',
          'closeAll'
        ]),
        // 关闭当前
        handleCloseCurrent () {
          this.close({
            tagName: this.$route.name,
            vm: this
          })
        },
        // 关闭左侧
        handleCloseLeft () {
          this.closeLeft({
            tagName: this.$route.name,
            vm: this
          })
        },
        // 关闭右侧
        handleCloseRight () {
          this.closeRight({
            tagName: this.$route.name,
            vm: this
          })
        },
        // 关闭其他
        handleCloseOther () {
          this.closeOther({
            tagName: this.$route.name,
            vm: this
          })
        },
        // 关闭全部
        handleCloseAll () {
          this.closeAll(this)
        },
        // 清空当前页缓存并刷新此页面
        handleCleanCacheAndRefreshCurrent () {
          this.keepAliveRemove(this.$route.name)
          this.$nextTick(this.$router.replace('/refresh'))
        },
        // 清空所有的缓存并刷新此页面
        handleCleanCacheAndRefreshAll () {
          this.keepAliveClean()
          this.$nextTick(this.$router.replace('/refresh'))
        },
        handleMenuClick(e)
        {
          console.log('e',e)
          switch (e.key) {
            case 'other':
              this.handleCloseOther()
              break
            case 'all':
              this.handleCloseAll()
              break
            default:
              break
          }
        },
        changePage(key) {
          // 找到点击的页面在 tag 列表里是哪个
          const page = this.opened.find(page => page.fullPath === key)
          const { name, params, query } = page
          if (page) {
            this.$router.push({ name, params, query })
          }
        },
        editPage(tagName, action) {
          if (action === 'remove') {
            this.close({
              tagName,
              vm: this
            })
          }
        },
        onContextmenu(e) {
          const pagekey = this.getPageKey(e.target)
          this.curtagName = pagekey
          if (pagekey !== null) {
            e.preventDefault()
            this.menuVisible = true
          }
        },
        getPageKey(target, depth) {
          depth = depth || 0
          if (depth > 2) {
            return null
          }
          let pageKey = target.getAttribute('pagekey')
          pageKey = pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
          return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
        },
        onMenuSelect(key, target) {
          let pageKey = this.getPageKey(target)

          switch (key) {
            case 'left':
              this.handleCloseLeft()
              break
            case 'right':
              this.handleCloseRight()
              break
            case 'other':
              this.handleCloseOther()
              break
            case 'all':
              this.handleCloseAll()
              break
            default:
              break
          }
        }
      }
    }
</script>

<style lang="less">

    /*
   * The following styles are auto-applied to elements with
   * transition="page-transition" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the page transition by editing
   * these styles.
   */
    .tags-nav{
      position: relative;
    }
    .close-all-tag-con{
      position: absolute;
      right: -24px;
      top: 0;
      text-align: center;
      height:100%;
    }
    .page-transition-enter {
        opacity: 0;
    }

    .page-transition-leave-active {
        opacity: 0;
    }

    .page-transition-enter .page-transition-container,
    .page-transition-leave-active .page-transition-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>