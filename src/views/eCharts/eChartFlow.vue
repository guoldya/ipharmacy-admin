<template >
    <div class="charts">
      <a-card class="puFull" >
        <a-row  :gutter="10">
        <a-col :span="6">
          <countText :countList="countText"></countText>
        </a-col>
        <a-col :span="6">
          <Dashboard></Dashboard>
        </a-col>
        <a-col :span="6">
          <automaticPass></automaticPass>
        </a-col>
        <a-col :span="6">
          <oneRank></oneRank>
        </a-col>
        </a-row>
      <a-row :gutter="10" class="margin-top-10">
        <a-col :span="6">
          <radarMap></radarMap>
        </a-col>
        <a-col :span="12">
          <HeatMap></HeatMap>
        </a-col>
        <a-col :span="6">
          <twoRank></twoRank>
        </a-col>
      </a-row>
      </a-card>
    </div> 
</template>

<script>
  import echarts from 'echarts'
  // import heatMap from './heatMap'
  // import dashboard from './dashboard'
  // import automaticPass from './automaticPass'
  // import countText from './countText'
  // import oneRank from  './rankLevel/oneRank'
  // import twoRank from  './rankLevel/twoRank'
  import radarMap from './radarMap'
  export default {
    components: {
      // 'HeatMap': heatMap,
      // 'Dashboard':dashboard,
      // 'automaticPass':automaticPass,
      // 'countText': countText,
      // 'oneRank': oneRank,
      // 'twoRank': twoRank,
      'radarMap': radarMap,
    },
    name: 'eChartFlow',

    data(){
      return{
        countText: [
          { itemCount: 2190, item: '药品数', itemColors: '#4586ff' },
          { itemCount: 3180, item: '品种数', itemColors: '#2dc89f' },
          { itemCount: 5645, item: '规则数', itemColors: '#ff6781' },
          { itemCount: 3692, item: '违规数', itemColors: '#ff6781' },
        ]
      }
    },
    mounted(){

    },
    methods:{
    }
  }
</script>

<style>
.puFull{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #232325;
}
  .charts .ant-card-bordered{
   border: 0px ;
  }
</style>