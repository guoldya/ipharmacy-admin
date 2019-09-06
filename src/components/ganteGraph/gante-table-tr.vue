<template>
  <div class="gante-tr-box">
    <!-- <div class="gante-tr-one" v-for="(tr,index) in data"> -->
    <div  v-for="(tr,index) in data" :id="chkclass(index)">
      <div class="gante-tr" :class="tr.bg">
        <div class="gante-td" v-for="(th,key) in th_data">
          <td-cell
            v-if="th.isTableShow==true"
            @change-calendar="change_calendar"
            @on-click="onclick"
            @change="change"
            :td_data="tr"
            :index="index"
            :key_value="key"
            :th="th"
          ></td-cell>
        </div>
      </div>
      <gante-tr
        v-if="tr.children && tr.open"
        @change-calendar="change_calendar"
        @on-click="onclick"
        @change="change"
        :all_data="all_data"
        :data="tr.children"
        :th_data="th_data"
      ></gante-tr>
    </div>
  </div>
</template>
<script>
import tdCell from './gante-table-td.vue'
export default {
  name: 'gante-tr',
  data() {
    return {
      isbool: 'items'
    }
  },
  props: {
    all_data: Array,
    data: Array,
    th_data: Object,
    lowDatal: Object
  },
  watch: {
    lowDatal: function() {
      console.log(this.lowDatal,'ppppppp')
      for (let key in this.data) {
        let item = this.data[key]
        if (item.gunter_id == this.lowDatal.gunter_id) {
          item.bg = 'sort'
        } else {
          item.bg = null
        }
      }
      this.data.push()
    }
  },
  computed: {},
  mounted() {},
  components: {
    tdCell
  },
  methods: {
    chkclass(index) {
      return 'td' + index
    },
    change(data) {
      this.$emit('change', data)
    },
    onclick(data) {
      this.$emit('on-click', data)
    },
    change_calendar(data) {
      this.$emit('change-calendar', data)
    }
  }
}
</script>
<style scoped lang='less'>
.sort {
  border: 1px solid rgb(123, 111, 222);
  background:gainsboro;
}
</style>

