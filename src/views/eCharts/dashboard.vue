<template>
    <div id="myDash" :style="{width:widths, height:heights}" ref="myDash" />
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
              detail: {formatter:'{value}%',color:'#ffffff'},
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
              radius: '100%',
              data: [{value: 50, name: '完成率',color:'#ffffff'}],
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
        this.chart = echarts.init(document.getElementById('myDash'));
        this.chart.setOption(this.option, true);
        this.chart.resize();

      },
    }
  }
</script>

<style scoped>

</style>