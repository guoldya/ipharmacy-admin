
<template>
  <div class="allSearch">
    <h2>{{newname}}</h2>
    <p>{{Name}}</p>
    <h5>{{toyname}}</h5>
    <Son></Son>
    <div v-for="item in datas" class="box1">
      <div v-for="items in item" class="box" >{{items.id}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Son from './son'
export default {
  name: 'index',
  components: {
    Son
  },
  data() {
    return {
      Name: this.$store.state.text.name,
      datas: [
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
        [{ id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }],
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }]
      ]
    }
  },
  computed: {
    ...mapGetters({
      newname: 'age',
      toyname: 'text/names'
    })
    // toyname这里要根据作域来拿，mutation这些也是一样的
  },
  mounted() {
    //console.log(this.$store.state)
    this.$store.state.text.name = 'tony'
    // 这里不会影响Name,反而会影响子组件的值，data并不能监听的到
  },
  methods: {}
}
</script>

<style scoped lang='less'>
.box {
  width: 100px;
  height: 50px;
  border-bottom: 1px solid #1f1f1f;
  // float: left;
}
.box1 {
  float: left;
  border: 1px solid #1f1f1f;
  border-left: 0;
  width: 100px;
  &:nth-child(1) {
    background: red;
    border-left: 1px solid #1f1f1f !important;
  }
}
</style>