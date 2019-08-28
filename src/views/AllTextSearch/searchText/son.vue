
<template>
  <div class="allSearch">
    <p>哈哈</p>
    <p>{{this.$store.state.text.name}}</p>
    <a-button type="primary" @click="clic">点击</a-button>
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
      if (this.primaryColor !== '#F5222D') {
        this.$store.dispatch('preference/ToggleColor', '#F5222D')
        this.$store.dispatch('preference/save')
        updateTheme('#F5222D')
      }
    }
  }
}
</script>

<style scoped lang='less'>
</style>