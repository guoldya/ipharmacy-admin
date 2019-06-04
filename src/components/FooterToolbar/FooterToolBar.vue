<template>
  <div :class="prefixCls">
    <div style="float: left">
      <slot name="extra" v-if="extra">
        <a-button @click="clickOne">{{oneText}}</a-button>
        <a-button class="margin-left-5" @click="clickTwo">{{twoText}}</a-button>
      </slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FooterToolBar',
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-footer-toolbar'
      },
      extra: {
        type: Boolean,
        default: false
      },
      clickOne:{
        type: Function,
      },
      oneText:{
        type: String,
      },
      twoText:{
        type: String,
      },
      clickTwo:{
        type: Function,
      },
    }
  }
</script>

<style lang="less" scoped>

</style>