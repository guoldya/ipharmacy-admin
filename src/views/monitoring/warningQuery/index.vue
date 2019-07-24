<template>
  <div>
    <a-card>
      <div style="float: right">
        最少次数：
        <a-input-number :min="0" v-model="moreThanNum" @change="changeNum"></a-input-number>
      </div>
      <ul class="ulList">
        <li class="dataPicker">
          <a-range-picker
            @change="onChange"
            :ranges="{ '昨天': [moment().subtract(1, 'days'), moment()], '一周': [moment().subtract(1,'weeks'), moment()], '一个月':[moment().subtract(1,'months'),moment()] }"
          />
        </li>
        <li class="oneMonth" tabindex="0" v-on:click="getRangePicker('oneMonth')">一月内</li>
        <li class="oneWeek" tabindex="0" v-on:click="getRangePicker('oneWeek')">一周内</li>
        <li class="threeDay" tabindex="0" v-on:click="getRangePicker('threeDay')">三天内</li>
        <li class="twoDay" tabindex="0" v-on:click="getRangePicker('twoDay')">二天内</li>
        <li class="oneDay" tabindex="0" v-on:click="getRangePicker('oneDay')">一天内</li>
      </ul>
    </a-card>
    <a-row class="margin-top-5">
      <a-col :span="16">
        <a-spin tip="加载中..." :spinning="eSpinning">
          <a-card :bodyStyle="{width:'100%', height:'400px'}">
            <div id="myEchart" ref="myEchart"></div>
          </a-card>
        </a-spin>
      </a-col>
      <a-col :span="8" class="padding-left-5">
        <a-spin tip="加载中..." :spinning="rankSpinning">
          <a-card :bodyStyle="{width:'100%', height:'400px'}">
            <h3 class="font-bold">规则预警排名：</h3>
            <div v-for="(item,i) in listData" class="rankWarn" :key="i">
              <a-row>
                <a-col span="6" v-if="i<3" class="badgeCol">
                  <a-badge :count="i+1" :numberStyle="{backgroundColor: '#000'} "/>
                </a-col>
                <a-col span="6" v-else class="badgeCol">
                  <a-badge :count="i+1" :numberStyle="{backgroundColor: '#eee', color: '#000'}"/>
                </a-col>
                <a-col span="10" class="fontText">
                  <a style="color: #666666;">{{item.NAME}}</a>
                </a-col>
                <a-col span="6" class="fontText">
                  <a style="color: #666666;">{{item.TOTAL}}次</a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-spin>
      </a-col>
    </a-row>
    <a-card class="margin-top-5">
      <a-tabs defaultActiveKey="1" size="small" class="width-100 ">
        <a-tab-pane tab="预警规则" key="1">
          <ruleTable :moreThanNum="moreThanNum" :startDate="startDate" :endDate="endDate"></ruleTable>
        </a-tab-pane>
        <a-tab-pane tab="预警药品" key="2">
          <drugTable :moreThanNum="moreThanNum" :startDate="startDate" :endDate="endDate"></drugTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import ruleTable from './ruleTable'
  import drugTable from './drugTable'
  import moment from 'moment'
  import debounce from 'lodash/debounce'

  export default {
    components: {
      ruleTable,
      drugTable
    },
    name: 'index',
    data() {
      this.changeNum = debounce(this.changeNum, 800)
      return {
        api: {
          warningSituation: 'sys/early/selectEarlyWarningSituation',
          warningRanking: 'sys/early/selectRuleWarningRanking',
          selectParam: 'sys/early/selectParam'
        },
        eSpinning: false,
        rankSpinning: false,
        listData: [],
        dataPercent: [],
        moreThanNum: null,
        startDate: '',
        endDate: '',
        option: {
          title: {
            text: '预警情况'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            top: 20,
            right: 30,
            textStyle: {
              fontSize: 14
            },
            formatter: this.percentMatter
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '70%',
              center: ['40%', '50%'],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: []
            }
          ],
          color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa']
        }
      }
    },
    mounted() {
      let _this = this
      this.headUlList()
      this.getParams()
      setTimeout(() => {
        this.initChart()
      }, 500)
      //浏览器窗口大小改变事件
      window.onresize = function() {
        setTimeout(() => {
          _this.chart.resize()
        }, 500)
      }
    },
    methods: {
      moment,
      getParams() {
        this.$axios({
          url: this.api.selectParam,
          method: 'put',
          data: {}
        })
          .then(res => {
            if (res.code == '200') {
              if (res.rows[0].paramValue == 1) {
                $('.oneDay').css({ 'color': '#2c8df1', 'border-bottom': '2px solid #2c8df1' })
                let dateRange = this.getDatePicker('oneDay')
                this.startDate = dateRange[0]
                this.endDate = dateRange[1]
              } else if (res.rows[0].paramValue == 2) {
                $('.twoDay').css({ 'color': '#2c8df1', 'border-bottom': '2px solid #2c8df1' })
                let dateRange = this.getDatePicker('twoDay')
                this.startDate = dateRange[0]
                this.endDate = dateRange[1]
              } else if (res.rows[0].paramValue == 3) {
                $('.threeDay').css({ 'color': '#2c8df1', 'border-bottom': '2px solid #2c8df1' })
                let dateRange = this.getDatePicker('threeDay')
                this.startDate = dateRange[0]
                this.endDate = dateRange[1]
              } else if (res.rows[0].paramValue == 4) {
                $('.oneWeek').css({ 'color': '#2c8df1', 'border-bottom': '2px solid #2c8df1' })
                let dateRange = this.getDatePicker('oneWeek')
                this.startDate = dateRange[0]
                this.endDate = dateRange[1]
              } else if (res.rows[0].paramValue == 5) {
                $('.oneMonth').css({ 'color': '#2c8df1', 'border-bottom': '2px solid #2c8df1' })
                let dateRange = this.getDatePicker('oneMonth')
                this.startDate = dateRange[0]
                this.endDate = dateRange[1]
              }
              this.moreThanNum = Number(res.rows[1].paramValue)
              this.getBase({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
              this.getRank({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      getBase(params = {}) {
        this.eSpinning = true
        let _this = this
        this.option.series[0].data = []
        params.total = '' + params.total
        this.$axios({
          url: this.api.warningSituation,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              for (let key in res.rows) {
                this.option.series[0].data.push({
                  name: res.rows[key].NAME,
                  value: res.rows[key].TOTAL,
                  percent: res.rows[key].BFB
                })
              }
              this.dataPercent = this.option.series[0].data
              setTimeout(() => {
                _this.chart.resize()
              }, 500)
              this.eSpinning = false
            } else {
              this.warn(res.msg)
              this.eSpinning = false
            }
          })
          .catch(err => {
            this.error(err)
            this.eSpinning = false
          })
      },
      getRank(params = {}) {
        this.rankSpinning = true
        params.total = '' + params.total
        this.$axios({
          url: this.api.warningRanking,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.listData = res.rows
              this.rankSpinning = false
            } else {
              this.warn(res.msg)
              this.rankSpinning = false
            }
          })
          .catch(err => {
            this.error(err)
            this.rankSpinning = false
          })
      },
      headUlList: function() {
        $('.ulList li').click(function() {
          $('.ulList li').css({ 'color': '#666666', 'border-bottom': 'none' })
          $(this).css({ 'color': '#2c8df1', 'border-bottom': '2px solid #2c8df1' })
          $('.dataPicker').css({ 'color': '#666666', 'border-bottom': 'none' })
          $($('.ulList li').eq(0)).css({ 'color': '#666666', 'border-bottom': 'none' })
        })
      },
      initChart() {
        this.chart = echarts.init(document.getElementById('myEchart'))
        this.chart.setOption(this.option, true)
      },
      percentMatter(name) {
        if (this.dataPercent.length > 0) {
          for (let key in this.dataPercent) {
            if (this.dataPercent[key].name == name) {
              return this.dataPercent[key].name + '  次数：' + this.dataPercent[key].value + '    ' + this.dataPercent[key].percent
            }
          }
        }
      },
      getRangePicker(data) {
        let _this = this
        let dateRange = this.getDatePicker(data)
        this.startDate = dateRange[0]
        this.endDate = dateRange[1]
        this.getBase({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
        this.getRank({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
      },
      getDatePicker(data) {
        const end = new Date()
        const start = new Date()
        const dataRange = []

        if (data == 'oneMonth') {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        } else if (data == 'oneWeek') {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        } else if (data == 'threeDay') {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
        } else if (data == 'twoDay') {
          start.setTime(start.getTime() - 3600 * 1000 * 24)
        } else if (data == 'oneDay') {
          start.setTime(start.getTime())
        }
        let startMonth = start.getMonth() + 1
        if (startMonth < 10) {
          startMonth = '0' + startMonth
        }
        let endMonth = end.getMonth() + 1
        if (endMonth < 10) {
          endMonth = '0' + endMonth
        }
        let startDay = start.getDate()
        if (startDay < 10) {
          startDay = '0' + startDay
        }
        let endDay = end.getDate()
        if (endDay < 10) {
          endDay = '0' + endDay
        }
        dataRange[0] = start.getFullYear() + '-' + startMonth + '-' + startDay
        dataRange[1] = end.getFullYear() + '-' + endMonth + '-' + endDay
        return dataRange
      },
      onChange(date) {
        let _this = this
        this.startDate = date[0].format('YYYY-MM-DD')
        this.endDate = date[1].format('YYYY-MM-DD')
        this.getBase({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
        this.getRank({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
      },
      changeNum(value) {
        if ($.trim(value).length > 0) {
          this.getBase({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
          this.getRank({ startDate: this.startDate, endDate: this.endDate, total: this.moreThanNum })
        }
      }
    },

    watch: {
      //观察option的变化
      option: {
        handler(newVal, oldVal) {
          if (this.chart) {
            if (newVal) {
              this.chart.setOption(newVal)
            } else {
              this.chart.setOption(oldVal)
            }
          } else {
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    }
  }
</script>

<style scoped>
  .ulList {
    overflow: auto;
    zoom: 1;
    float: right;
    margin: 0 auto;
  }

  .ulList li {
    list-style-type: none;
    float: right;
    padding-right: 20px;
    padding-left: 20px;
    line-height: 32px;
  }

  .ulList li:hover {
    color: #2c8df1;
    cursor: pointer
  }

  .ulList .oneMonth {
    outline: 0
  }

  .ulList .oneWeek {
    outline: 0
  }

  .ulList .threeDay {
    outline: 0
  }

  .ulList .twoDay {
    outline: 0;

  }

  .ulList .oneDay {
    outline: 0;
  }

  .ulList .dataPicker {
    width: 250px;
  }

  #myEchart {
    height: 100%;
    width: 100%;
  }

  .rankWarn {
    line-height: 33px;
    list-style-type: none;

  }
</style>