<template>
  <div>
      <div v-if="index===0">dos000</div>
      <div v-if="index===1">dos111</div>
      <div v-if="index===2">
          <el-table
      class="margin-top-10"
      style="width: 700px"
      :data="data"
      highlight-current-row >
      <el-table-column :header-align="index===1?'center':'left'"
        :prop="item.prop"
        :label="item.title"
        :key="index"
        v-for="(item,index) in columnsTwo"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter"
        :show-overflow-tooltip="true"
      >
      <el-table-column v-for="(col,i) in item.column" :key="i"
        :prop="col.title"
        :label="col.title" >
      </el-table-column>
        <template slot-scope="props">
          <span v-if="item.prop == 'drugName'">
          </span>
          <span v-else>
            {{props.row[item.prop]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
      </div>
      <div v-if="index===3">dos333</div>

  </div>
</template>

<script>
  export default {
    name: 'evaluationTooltip',
    props:{
      index:{
        type:Number,
      },
    },
    data () {
      return {
          data:[],
          columnsTwo: [
            { title: '心功能分级', prop: 'seqNum', width: 100, align: 'right' },
            { title: '判断指标', prop: 'mark', align: 'left' ,column:[
                { title: '心脏储备能力', prop: 'spec', width: 60 },
                { title: '体力活动表现', prop: 'dosageStr', width: 60 },
                { title: '心脏病及心功能不全体征', prop: 'amountStr', width: 120 },
            ]},
            { title: '心衰（心功能不全）分度', prop: 'drugName' },
        ]
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="css">
  
</style>