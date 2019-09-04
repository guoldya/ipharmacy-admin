
<template>
  <div class="allSearch">
    <p>哈哈</p>
    <p>{{this.$store.state.text.name}}</p>
    <a-button type="primary" @click="decrement">提高</a-button>
       <a-button type="primary" @click="reduces">下降</a-button>
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
     console.log(Promise)
    //this.$store.state.text.name='tony'
  },
  methods: {
    clic() {
      this.$store.commit('text/decrement')
       this.$store.commit('text/reduces')
    },
     ...mapMutations({decrement:'text/decrement',reduces:'text/reduces'}),
  }
}
</script>

<style scoped lang='less'>
</style>