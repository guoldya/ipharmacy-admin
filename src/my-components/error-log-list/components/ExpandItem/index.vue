<template>
  <div
    class="error-log-list__expand"
    :class="className">
    <p class="error-log-list__expand-title">{{title}}</p>
    <p class="error-log-list__expand-value">{{value === '' ? '无数据' : value}}</p>
    <slot/>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        default: 'log'
      },
      title: {
        default: ''
      },
      value: {
        default: ''
      }
    },
    computed: {
      className () {
        return this.type === 'log' ? 'error-log-list__expand--log' : 'error-log-list__expand--error'
      }
    }
  }
</script>
