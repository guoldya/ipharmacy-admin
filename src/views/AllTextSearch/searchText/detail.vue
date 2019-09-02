
<template>
  <div class="allSearch">
    <h2>{{newname}}</h2>
    <p>{{Name}}</p>
    <h5>{{toyname}}</h5>
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
      newname: 'age',
      toyname:'text/names'
    }),
   // toyname这里要根据作域来拿，mutation这些也是一样的
  },
  mounted() {
     //console.log(this.$store.state)
    this.$store.state.text.name='tony' 
    // 这里不会影响Name,反而会影响子组件的值，data并不能监听的到
  },
  methods: {}
}
</script>

<style scoped lang='less'>
</style>