<template>
  <div id="oneRank" :style="{width:widths, height:heights}" ref="oneRank" />
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
    name: 'oneRank',
    data(){
      return{
        option:{
          backgroundColor: '#404a59',
          color: ['#ffffff'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (objs, index) {
              let obj = objs[0];
              return `${obj.name}<br/>${obj.marker}${obj.seriesName} : ${obj.value} 个`;
            },
          },
          grid: {
            top: '3%',
            left: '3%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            data: [0, 20, 40, 60, 80, 100],
            interval: 20,
            min: 0,
            max: 100,
            splitLine: {
              show:false,
              lineStyle: {
                type: 'solid'
              }
            },
            axisLine: {
              show: false,
              // lineStyle: {
              //   color: '#999',
              // }
            },
            axisLabel: {
              show:false,
              formatter: function (value, index) {
                return value;
              },
              color: '#ffffff'
            },
            axisTick: {
              show: false,
            }
          },
          yAxis: {
            type: 'category',
            boundaryGap: false,
            splitArea: {
              areaStyle: {
                opacity: 0
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ffffff',
              }
            },
            data: ['张三三', '李四四', '王五五','赵六六','张三','李四','王五','赵六','张三三','李四四'
            ]
          },
          series: [
            {
              name: '销售量',
              barMaxWidth: '40%',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}',
                  textStyle: {
                    color: '#ffffff'
                  }
                }
              },
              data: [
                {
                  value: 10,
                  itemStyle: {
                    color: '#cf9ef1',
                  }
                },
                {
                  value: 20,
                  itemStyle: {
                    color: '#57e7ec',
                  }
                },
                {
                  value: 40,
                  itemStyle: {
                    color: '#fdb301',
                  }
                },
                {
                  value: 30,
                  itemStyle: {
                    color: '#f59a8f',
                  }
                },
                {
                  value: 40,
                  itemStyle: {
                    color: '#fca4bb',
                  }
                },
                {
                  value: 50,
                  itemStyle: {
                    color: '#2b908f',
                  }
                },
                {
                  value: 60,
                  itemStyle: {
                    color: '#90ed7d',
                  }
                },
                {
                  value: 70,
                  itemStyle: {
                    color: '#e75fc3',
                  }
                },
                {
                  value: 80,
                  itemStyle: {
                    color: '#5085f2',
                  }
                },
                {
                  value: 90,
                  itemStyle: {
                    color: '#8d7fec',
                  }
                },
              ]
            },

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
        this.chart = echarts.init(document.getElementById('oneRank'));
        this.chart.setOption(this.option, true);
        this.chart.resize();

      },
    }
  }
</script>

<style scoped>

</style>