<template>
  <div ref="ganteview" class="ganteview-box">
    <div @scroll="ganteview_scroll" class="ganteview">
      <div  class="ganteview-header">
        <div class="ganteview-bottomtime">
          <div class="ganteview-headercell" :title="item.title" v-for="(item,index) in bottom_time_data"
               :style="{width:item.width+'%',left:item.left+'%',borderRight:rightBorder(index)}">{{item.title}}
          </div>
        </div>
      </div>
      <gante-gc-item :th_data="th_data" v-if="show_item"
                     class="ganteview-content-box" :gante_data="gante_data"  :bottomTimeData="bottom_time_data" @adoptMessage="updateColor">
<!--        <div v-for="item in bottom_time_data" class="ganteview-column"-->
<!--             :style="{width:item.width+'%',left:item.left+'%'}">-->

<!--        </div>-->
      </gante-gc-item>



    </div>
  </div>
</template>
<script>
  import ganteGcItem from '../ganteGraph/gante-gc-item.vue'

  export default {
    data() {
      return {
        one_px: 200,  //每个格子占的像素(默认为50)
        first_day: null, //开始的时间
        top_time_data: [],//顶部时间刻度
        bottom_time_data: [
          { date: 18, is_rest: false, left: 0, title: '2018-12-18', width: 14.28 },
          { date: 19, is_rest: false, left: 14.28, title: '2018-12-19', width: 14.28},
          { date: 20, is_rest: false, left: 28.56, title: '2018-12-20', width: 14.28 },
          { date: 21, is_rest: false, left: 42.84, title: '2018-12-21', width: 14.28 },
          { date: 22, is_rest: false, left: 57.12, title: '2018-12-22', width: 14.28 },
          { date: 23, is_rest: false, left: 71.4, title: '2018-12-23', width: 14.28 },
          { date: 24, is_rest: false, left: 85.68, title: '2018-12-24', width: 14.28 },
          ],//底部时间刻度
        header_width: 0, //时间组件的宽度
        future_time: 0,  //顶部时间的最大的时间
        time_jiange: 0,
        show_item: false
      }
    },
    props: {
      gante_data: Array,
      th_data: Object,
      start_time: {}, //开始时间
      end_time: {}
    },
    methods: {
      rightBorder(index) {
        if (index >5) {
          return "0px"
        }else{
          return "1px solid #CFCFCF"
        }
      },
      // 接收子组件
      updateColor(data) {
        this.$emit('listFunc', data)
        console.log(data, 'xxxx')
      },
      ganteview_scroll(e) {
//        让左侧表格跟随滚动
        document.getElementsByClassName('gante-tbody')[0].style.top = -(e.target.scrollTop) + 'px'
        document.getElementsByClassName('ganteview-header')[0].style.left = -(e.target.scrollLeft) + 'px'
        this.$parent.show_calendar = false
      },
//      初始化头部时间刻度
      init(time_mode) {
        this.header_width = 0
        var time = 0,
          gante_width = this.$refs.ganteview.offsetWidth,
          all_time = 0,//所有的时间总和
          start_time = new Date(this.start_time),
          mode = 1
        switch (time_mode) {
          case 1:
            time = 60 * 60 * 1 * 24 * 1000 / this.one_px
            this.first_day = start_time
            break
          case 2:
            time = 7 * 24 * 60 * 60 * 1000 / this.one_px
            this.first_day = new Date(start_time.getFullYear(), start_time.getMonth(), start_time.getDate() - ((start_time.getDay() + 7) % 7))
            break
          case 3:
            time = 30 * 24 * 60 * 60 * 1000 / this.one_px
            this.first_day = new Date(start_time.getFullYear(), start_time.getMonth(), 1)
            mode = 2
            break
          case 4:
            time = 90 * 24 * 60 * 60 * 1000 / this.one_px
            let month = 0
            if (start_time.getMonth() + 1 >= 1 && start_time <= 3) {
              month = 0
            } else if (start_time.getMonth() + 1 >= 4 && start_time <= 6) {
              month = 3
            } else if (start_time.getMonth() + 1 >= 7 && start_time <= 9) {
              month = 6
            } else if (start_time.getMonth() + 1 >= 10 && start_time <= 12) {
              month = 9
            }
            this.first_day = new Date(start_time.getFullYear(), month, 1)
            mode = 2
            break
          case 5:
            time = 183 * 24 * 60 * 60 * 1000 / this.one_px
            this.first_day = new Date(start_time.getFullYear(), 0, 1)
            mode = 2
            break
        }
        this.time_jiange = time
        this.show_item = true
        if (this.end_time) {
          all_time = new Date(this.end_time).getTime()
          if (gante_width * time >= (all_time - new Date(this.first_day).getTime())) {
            all_time = gante_width * time + new Date(this.first_day).getTime()
          }
        } else {
          all_time = gante_width * time + new Date(this.first_day).getTime()
        }
        this.get_top_time(mode, this.first_day, time, all_time, time_mode)
        return { time: time, start_time: start_time }
      },
      format(time, mode) {
        var year = time.getFullYear()
        var month = time.getMonth() + 1
        var day = time.getDate()
        if (mode == 1) {
          return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
        } else if (mode == 2) {
          return year + '-' + (month < 10 ? '0' + month : month)
        } else if (mode == 3) {
          return day < 10 ? '0' + day : day
        } else if (mode == 4) {
          return month < 10 ? '0' + month : month
        } else if (mode == 5) {
          return year
        }
      },
//      获取顶部时间
      get_top_time(mode, first_time, time, all_width, time_mode) {
        var list = []
        for (let i = 0; i <= all_width;) {
          var old_time = first_time, date = this.format(old_time, 2)
          if (mode == 1) {
            //        月的形式
            first_time = new Date(first_time.getFullYear(), first_time.getMonth() + 1, 1)
          } else if (mode == 2) {
            //         年的形式
            first_time = new Date(first_time.getFullYear() + 1, 0, 1)
            date = this.format(old_time, 5)
          }
          var width = (first_time.getTime() - old_time.getTime()) / time
          this.header_width += width
          list.push({ left: (old_time.getTime() - this.first_day.getTime()) / time, width: width, date: date })
          i = first_time.getTime()
          this.future_time = i
        }
        this.top_time_data = list
        if (this.future_time) {
          all_width = this.future_time
        }
      },
//      格式化季度或年份的上下半年
      get_date(time, mode) {
        let date = ''
        if (mode == 'month') {
          if (time <= 2 && time >= 0) {
            date = 'Q1'
          } else if (time <= 5 && time >= 3) {
            date = 'Q2'
          } else if (time <= 8 && time >= 6) {
            date = 'Q3'
          } else if (time <= 11 && time >= 9) {
            date = 'Q4'
          }
        } else if (mode == 'year') {
          if (time <= 5 && time >= 0) {
            date = 'Y1'
          } else if (time <= 11 && time >= 6) {
            date = 'Y2'
          }
        }
        return date
      }
    },
    components: {
      ganteGcItem
    }
  }
</script>
<style scoped>
  .ganteview-box {
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .ganteview {
    height: 100%;
    overflow: auto;
  }

  .ganteview-header {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 45px;
    font-size: 13px;
    z-index: 2;
  }

  .ganteview-toptime, .ganteview-bottomtime {
    height: 22px;
    line-height: 22px;
    position: relative;
    /*display: flex;*/
    /*justify-content: flex-start;*/
  }

  .ganteview-toptime {
    background: #fafafa;
    color: rgba(0, 0, 0, 0.85);
  }

  .ganteview-toptime .ganteview-headercell {
    font-weight: bold;
    padding-left: 4px;
    text-align: center;
  }

  .ganteview-bottomtime .ganteview-headercell {
    color: rgba(0, 0, 0, 0.55);
    text-align: center;
  }

  .ganteview-bottomtime {
    background-color: #fafafa;
  }

  .ganteview-column {
    position: absolute;
    top: 44px;
    border-right: 1px solid #CFCFCF;
    height: calc(100% - 44px);
    z-index: 0;
    box-sizing: border-box;
  }

  .ganteview-headercell {
    box-sizing: border-box;
    border-bottom: 1px solid #CFCFCF;
    overflow: hidden;
    font-weight: bold;
    position: absolute;
    line-height: 45px;
    height: 45px;
    background-color: #E3F0FF;
  }

  .ganteview-content-box {
    padding-top: 45px;
  }
</style>
