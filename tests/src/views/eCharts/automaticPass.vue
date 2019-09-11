<template>
  <div id="myPass" :style="{width:widths, height:heights}" ref="myEchart" />
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
        default: '300px'
      }
    },
    name: 'heatMap',
    data(){
      return{
        option:{
          backgroundColor: '#404a59',
          tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              radius: '100%',
              detail: {formatter:'{value}%',color:'#ffffff',},
              title : {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: 'bolder',
                  fontSize: 20,
                  fontStyle: 'italic',
                  color: '#fff',
                  shadowColor : '#fff', //默认透明
                  shadowBlur: 10
                }
              },
              axisTick:{
                lineStyle:{
                  color:'#ccc'
                }
              },
              data: [{value: 50, name: '完成率'}]
            }
          ]
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
        this.chart = echarts.init(document.getElementById('myPass'));
        this.chart.setOption(this.option, true);
        this.chart.resize();

      },
    }
  }
</script>

<style scoped>

</style>