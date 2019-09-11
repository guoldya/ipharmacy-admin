<template>
  <div
    class="dw-contextmenu "
    v-show="flag"
    :style="style">
    <slot/>
  </div>
</template>

<script>
  export default {
    name: 'dw-contextmenu',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      }
    },
    computed: {
      flag: {
        get () {
          if (this.visible) {
            // 注册全局监听事件 [ 目前只考虑鼠标解除触发 ]
            window.addEventListener('mousedown', this.watchContextmenu)
          }
          return this.visible
        },
        set (newVal) {
          this.$emit('update:visible', newVal)
        }
      },
      style () {
        return {
          left: this.x + 'px',
          top: this.y + 'px',
          display: this.visible ? 'block' : 'none '
        }
      }
    },
    methods: {
      watchContextmenu (event) {
        if (!this.$el.contains(event.target) || event.button !== 0) this.flag = false
        window.removeEventListener('mousedown', this.watchContextmenu)
      }
    },
    mounted () {
      // 将菜单放置到body下
      document.querySelector('body').appendChild(this.$el)
    }
  }
</script>
<style type="less" >
  .dw-contextmenu  {
    position: absolute;  /*决对位置*/
  }
</style>