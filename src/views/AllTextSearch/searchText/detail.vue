
<template>
  <div class="allSearch">
    <h2>{{newname}}</h2>
    <p>{{Name}}</p>
    <h5></h5>
    <Son></Son>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Son from './son'
export default {
  name: 'index',
  components:{
   Son
  },
  data() {
    return {
        Name:this.$store.state.text.name
    }
  },
  computed: {
    ...mapGetters({
      newname: 'names'
    }),
    // 这是提供的两块语法糖，可以直接$store.getters.
    // mapState({
       
    // })
  },
  mounted() {
    this.$store.state.text.name='tony' 
  },
  methods: {}
}
</script>

<style scoped lang='less'>
</style>