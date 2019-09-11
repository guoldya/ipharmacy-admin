<template>
  <Coming title="敬请期待" :value="Date.now()+ 1000 * 60 * 60 * 24 * 2"></Coming>
</template>

<script>
  import Coming from '@/my-components/coming'

  export default {
    components: {
      Coming
    }
  }
</script>

<style scoped>

</style>