
<template>
  <div class="allSearch">
    <p>哈哈</p>
    <p>{{this.$store.state.text.name}}</p>
     <a-button type="primary" @click="clic">点击</a-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'son',
  data() {
    return {}
  },
  computed: {
   
  },
  mounted() {
    //this.$store.state.text.name='tony' 
   
  },
  methods: {
      clic(){
          this.$store.state.text.name='james'
          this.$store.state.text.age='29' 
      }
  }
}
</script>

<style scoped lang='less'>
</style>