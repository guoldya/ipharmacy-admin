<template>
  <div id="radarMap" :style="{width:widths, height:heights}" ref="radarMap" />
</template>

<script>
  import echarts from 'echarts'
  export default {
    props: {
      widths: {
        type: String,
        default: '100%'
      },
      heights: {
        type: String,
        default: '400px'
      }
    },
    name: 'heatMap',
    data(){
      return{
        option:{
          backgroundColor: '#404a59',
          title: {
            text: '基础雷达图',
            textStyle:{color:'#ffffff'}
          },
          tooltip: {},
          radar: {
            center: ['50%', '50%'],
            radius: '50%',
            name: {
              textStyle: {
                color: '#ffffff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: '销售', max: 6500},
              { name: '管理', max: 16000},
              { name: '信息技术', max: 30000},
              { name: '客服', max: 38000},
              { name: '研发', max: 52000},
              { name: '市场', max: 25000}
            ]
          },
          series: [{
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [4300, 10000, 28000, 35000, 50000, 19000],
                name : '预算分配（Allocated Budget）'
              },
              {
                value : [5000, 14000, 28000, 31000, 42000, 21000],
                name : '实际开销（Actual Spending）'
              }
            ]
          }]
        },
      }
    },
    mounted(){
      setTimeout(()=>{
        this.initChart();
      },500);

    },
    methods:{
      initChart() {
        this.chart = echarts.init(document.getElementById('radarMap'));
        this.chart.setOption(this.option, true);
        this.chart.resize();

      },
    }
  }
</script>

<style scoped>

</style>