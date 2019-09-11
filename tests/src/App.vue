<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
  export default {
    data () {
      return {
        locale: zhCN
      }
    },
    mounted () {
      const { $store } = this
      deviceEnquire(deviceType => {

        switch (deviceType) {
          case DEVICE_TYPE.DESKTOP:
            $store.commit('preference/TOGGLE_DEVICE', 'desktop')
            $store.dispatch('preference/setSidebar', true)
            break
          case DEVICE_TYPE.TABLET:
            $store.commit('preference/TOGGLE_DEVICE', 'tablet')
            $store.dispatch('preference/setSidebar', false)
            break
          case DEVICE_TYPE.MOBILE:
          default:
            $store.commit('preference/TOGGLE_DEVICE', 'mobile')
            $store.dispatch('preference/setSidebar', true)
            break
        }
         console.log('deviceType', deviceType)
      })
    }
  }
</script>
<style lang="less">
  :global{
    //拖拽控件全局样式
    .dragable-ghost{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-chose{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    .dragable-drag{
      border: 1px dashed #aaaaaa;
      opacity: 0.65;
    }
    //页面切换动画
    .page-toggle-enter-active{
      transition: all 0.2s ease-in 0.25s;
    }
    .page-toggle-leave-active{
      transition: all 0.2s ease-out 0s;
    }
    .page-toggle-enter, .page-toggle-leave-to{
      opacity: 0;
      padding: 0px;
    }

    .iconfont.icon{
      font-size: 20px;
    }
  }
  #app {
    height: 100%;
  }
</style>