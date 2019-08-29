
<template>
  <div class="allSearch">
    <p>哈哈</p>
    <p>{{this.$store.state.text.name}}</p>
    <a-button type="primary" @click="decrement">点击</a-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { updateTheme, updateColorWeak, colorList } from '@/components/tools/setting'
export default {
  name: 'son',
  data() {
    return {}
  },
  computed: {},
  mounted() {
    //this.$store.state.text.name='tony'
  },
  methods: {
    clic() {
      this.$store.commit('text/decrement')
       this.$store.commit('text/reduces')
    },
     ...mapMutations({decrement:'text/decrement'}),
  }
}
</script>

<style scoped lang='less'>
</style>