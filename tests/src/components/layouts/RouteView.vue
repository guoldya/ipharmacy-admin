<template>
  <transition name="page-toggle">
    <keep-alive v-if="multipage&&$route.meta.keepAlive">
      <router-view />
    </keep-alive>
    <router-view v-else />
  </transition>
</template>

<script>
  export default {
    name: 'RouteView',
    data () {
      return {}
    },
    computed: {
      multipage () {
        return this.$store.getters.multiPage
      }
    }
  }
</script>