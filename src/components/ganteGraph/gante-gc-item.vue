<template>
  <div class="ganteview-content">
    <!-- ganteview-ones是一个完整的div里面有可能有子集有可能没有 -->
    <div
      v-for="(item,index) in gante_data"
      :key="index"
    >
      <div
        class="ganteview-ones"
        :style="{width:item.width+'%'}"
      >
        <div  class="ganteview-column">
          <div v-if="item.xxx == 1"  >
            <template>
              <div id="ganteChart"   style="width: 100%;height: 100px;position: absolute;z-index: 2;" ref="ganteChart" />
            </template>
          </div>
          <div v-else  >
          </div>
        </div>
        <div  class="ganteview-column"     >
          {{item.params.title}}
        </div>
        <div  class="ganteview-column"    >
          {{item.params.startTime}}
        </div>
        <div  class="ganteview-column"   >
          {{item.params.number}}
        </div>
      </div>
    </div>



    <div style="width: 100%;height: 500px;">

    </div>
  </div>


</template>
<script>
  import echarts from 'echarts'
export default {
  name: 'ganteview-item',
  data() {
    return {
      option: {
        grid: {
          left: "20",
          right: "30",
          bottom: "20",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          boundaryGap: false, //x轴从0开始到结束显示
          data: ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"],
          splitLine: {
            show: false
          }, //去除网格线
          splitArea: {
            show: false
          }, //保留网格区域
          axisTick: {
            show: false
          },
          axisLine: {
            onZero: false,
            show: false,
            lineStyle: {
              color: "#979797",
              width: 0.6 //这里是为了突出显示加上的
            }
            // symbol: ['none', 'arrow'],
            // symbolSize: [6, 12],
            // symbolOffset: [0, 8]
          },
          axisLabel: {
            show:false,
            interval: 0, //隔几个显示
            rotate: 30,
            showMinLabel: false,
            color: "#393C40"
          }
        },
        yAxis: {
          min: function(value) {
            return value.min - 0;
          },
          splitLine: {
            show: false
          }, //去除网格线
          splitArea: {
            show: false
          }, //保留网格区域
          axisLine: {
            show: false,
            lineStyle: {
              //轴上的线样式
              color: "#979797",
              width: 0.6 //这里是为了突出显示加上的
            }
            // symbol: ['none', 'arrow'],
            // symbolSize: [6, 12],
            // symbolOffset: [0, 8]
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show:false,
            //轴上的数据样式
            color: "#393C40"
          }
        },
        series: [
          // For shadow
          {
            type: "line",
            showSymbol: false, //显示折线拐点
            itemStyle: {
              color: "#2390FF"
            }, //线条样式
            lineStyle: {
              color: "#2390FF"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: "#cae4ff" // 0% 处的颜色
                },
                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            name: "患者数",
            z: 10,
            // animation: true,
            data: [105, 102, 117, 114, 90, 100, 102]
          },
          {
            type: "line",
            showSymbol: false, //显示折线拐点
            itemStyle: {
              //点样式
              color: "#3143FE"
            }, //线条样式
            lineStyle: {
              //折线样式
              color: "#3143FE"
            },
            areaStyle: {
              //区域样式
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: "#d1d5fe" // 0% 处的颜色
                },
                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            name: "新增报告数",
            // animation: true,
            data: [100, 120, 110, 114, 112, 105, 120]
          }
        ]
      },
      gante_data:[
        {
          gunter_id:1,
          params:{title:'藿香正气液',startTime:'2018-12-19',endTime:'2019-1-4',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2018,11,19).getTime(),
          end_time:new Date(2019,0,3).getTime(),
          bg_color:'#00B1F1',
          left: 0,
          width: 14.28,
          level:1,
          xxx:1,
          items:[
            {
              gunter_id:5,
              params:{orderClass:1,title:'藿香正气液',startTime:'2018-12-19',endTime:'2019-1-1',biaoti:'[口服]  每天异常  每次3吨'},
              start_time:new Date(2018,11,19).getTime(),
              end_time:new Date(2019,0,2).getTime(),
              bg_color:'#FFC100',
              level:2
            },
            {
              gunter_id:6,
              params:{orderClass:1,title:'藿香正气液',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次4g'},
              start_time:new Date(2019,0,3).getTime(),
              end_time:new Date(2019,0,4).getTime(),
              bg_color:'#FFC100',
              level:2
            }
          ]
        },
        {
          gunter_id:2,
          params:{title:'阿莫西林',startTime:'2018-12-19',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2018,11,19).getTime(),
          end_time:new Date(2019,0,3).getTime(),
          bg_color:'#00B1F1',
          level:1,
          left: 14.28,
          width: 14.28,
        },
        {
          gunter_id:3,
          params:{orderClass:2,title:'2019-01-01 11:11',startTime:'2018-12-19',endTime:'2019-1-1',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2018,11,19).getTime(),
          end_time:new Date(2019,0,1).getTime(),
          bg_color:'#00B1F1',
          level:2,
          left: 28.56,
          width: 14.28,
        },
        {
          gunter_id:4,
          params:{orderClass:2,title:'阿里巴巴',startTime:'2018-12-19',endTime:'2019-1-1',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2018,11,19).getTime(),
          end_time:new Date(2019,0,1).getTime(),
          bg_color:'#00B1F1',
          level:2,
          left: 42.84,
          width: 14.28,
        },
        {
          gunter_id:5,
          params:{orderClass:2,title:'莫夕夕',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2019,0,2).getTime(),
          end_time:new Date(2019,0,2).getTime(),
          bg_color:'#00B1F1',
          level:2,
          left: 57.12,
          width: 14.28,
        },
        {
          gunter_id:6,
          params:{orderClass:2,title:'丙烯醯',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2019,0,2).getTime(),
          end_time:new Date(2019,0,2).getTime(),
          bg_color:'#00B1F1',
          level:2,
          left: 71.4,
          width: 14.28,
        },
        {
          gunter_id:7,
          params:{orderClass:2,title:'饿极了',startTime:'2019-1-2',endTime:'2019-1-3',biaoti:'[口服]  每天异常  每次2毫克'},
          start_time:new Date(2019,0,2).getTime(),
          end_time:new Date(2019,0,2).getTime(),
          bg_color:'#00B1F1',
          level:2,
          left: 85.68,
          width: 14.28,
        }
      ]
    }
  },
  props: {
    th_data: Object,
  },
  mounted(){
    setTimeout(()=>{
      this.initChart();
    },500);
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('ganteChart'));
      this.chart.setOption(this.option, true);
      this.chart.resize();

    },
    showToast(e) {
      let target = e.target
      if (e.target.nodeName == 'SPAN') {
        target = e.target.parentNode
      } else if (e.target.className.indexOf('ant-tag') != -1) {
        target = e.target.parentNode
      }
      let data = this.gante_data[target.dataset.toast],
        x = e.clientX + 15,
        y = e.clientY + 15
      //TODO:items 特殊情况数据处理
      if (target.dataset.itemstoast && data.items) {
        data = data.items[target.dataset.itemstoast]
      }
      // console.log(data.items, 'showToast')
      if (data.params) {
        let toast = document.createElement('div'),
          add_toast = true
        toast.setAttribute('class', 'gante-toast-liu')
        if (document.getElementsByClassName('gante-toast-liu')[0]) {
          toast = document.getElementsByClassName('gante-toast-liu')[0]
          toast.style.display = 'block'
          add_toast = false
        }
        let list = ''
        for (let i in this.th_data) {
          //TODO:显示文本控制
          if (data.params[i] != undefined && this.th_data[i].showToast) {
            list += '<p>' + this.th_data[i].value + '：' + data.params[i] + '</p>'
          }
        }
        toast.innerHTML = list
        toast.style.left = x + 'px'
        toast.style.top = y + 'px'
        if (add_toast) {
          document.getElementsByTagName('body')[0].appendChild(toast)
        }
      }
    },
    hideToast() {
      if (document.getElementsByClassName('gante-toast-liu')) {
        document.getElementsByClassName('gante-toast-liu')[0].style.display = 'none'
      }
    },
    // 点击具体服药细节
    onclick(data) {
      console.log(data)
      this.$emit('adoptMessage', data)
    },
    // 点击具体小模块
    onclicks(data) {
      console.log(data)
    }
  }
}
</script>
<style scoped>
.ant-tag {
  height: 25px;
  line-height: 25px;
  margin-right: 0;
  margin-left: 5px;
}
.ganteview-content {
  position: relative;
}
.ganteview-content-one {
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid #ebeef5;
}
.ganteview-item {
  position: absolute;
  height: 25px;
  border-radius: 12px;
  background: #00b0ff;
  margin-top: 9px;
  cursor: pointer;
  z-index: 1;
  /* 文本样式 */
  color: white;
  line-height: 25px;
  font-size: 13px;
  /* text-indent: 1em; */
  text-overflow: ellipsis;
}
.ganteview-item.has-child {
  height: 15px;
  border-radius: 3px;
}
.sanjiao-left {
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  border-top: 2px solid transparent;
  border-left: 12px solid #00b0ff;
  border-bottom: 23px solid transparent;
}
.sanjiao-right {
  position: absolute;
  display: block;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-top: 2px solid transparent;
  border-right: 12px solid #00b0ff;
  border-bottom: 23px solid transparent;
}
  .ganteview-column{
    width: 100%;
    height: 35px;
    line-height: 35px;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;

  }
  .ganteview-ones{
    float: left;
    /*box-sizing: border-box;*/
    /*border-right: 1px solid #ebeef5;*/
    /*border-bottom: 1px solid #ebeef5;*/
    /*overflow: hidden;*/
    /*font-weight: bold;*/
    /*position: absolute;*/
    /*line-height: 45px;*/
    /*height: 45px;*/
    /*background-color: #ffff;*/
    /*text-align: center;*/
    width: 100%;
    text-align: center;
    height: 35px;
  }
</style>
