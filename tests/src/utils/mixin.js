// import Vue from 'vue'
import { DEVICE_TYPE } from '@/utils/device'
import { mapState } from 'vuex'

// const mixinsComputed = Vue.config.optionMergeStrategies.computed
// const mixinsMethods = Vue.config.optionMergeStrategies.methods

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.preference.info.layout,
      navTheme: state => state.preference.info.navTheme,
      primaryColor: state => state.preference.info.primaryColor,
      colorWeak: state => state.preference.info.colorWeak,
      fixedHeader: state => state.preference.info.fixedHeader,
      fixSiderbar: state => state.preference.info.fixSiderbar,
      contentWidth: state => state.preference.info.contentWidth,
      autoHideHeader: state => state.preference.info.autoHideHeader,
      sidebarOpened: state => state.preference.info.sidebar,
      multiPage: state => state.preference.info.multiPage,
      transition: state=> state.preference.info.transition,
    })
  },
  methods: {
    isTopMenu () {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu () {
      return !this.isTopMenu()
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device:state=>state.preference.info.device,
    })
  },
  methods: {
    isMobile () {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

export { mixin, mixinDevice }