<template>
  <div ref="gante_table" @mousewheel="gun" @DOMMouseScroll="gun" class="gante-table">
    <div class="gante-thead">
      <div
        class="gante-th"
        :data-key="key"
        @mousedown="th_down"
        @mousemove="th_move"
        @mouseout="th_out"
        :key="index"
        v-for="(th,key,index) in th_data"
      >
        <div
          v-if="th.isTableShow==true"
          class="cell"
          :style="{width:th.width ? th.width+'px' : '80px'}"
        >{{th.value}}</div>
      </div>
    </div>
    <div class="gante-tbody">
      <gante-tr
        @change-calendar="change_calendar"
        @on-click="onclick"
        @change="change"
        :all_data="data"
        :data="data"
        :th_data="th_data"
        :lowDatal="lowData"
      ></gante-tr>
    </div>
    <div v-show="show_proxy" :style="{left:proxy_left+'px'}" id="gante-table__column-resize-proxy"></div>
  </div>
</template>
<script>
import ganteTr from '../gante/gante-table-tr.vue'
export default {
  data() {
    return {
      oldx: 0, //记录鼠标按下的位置
      old_width: 0, //记录鼠标按下的初始宽度
      tTD: {
        current_index: null,
        mouseDown: false
      },
      proxy_left: 0,
      show_proxy: false,
      mark: 0 //限制滚轴触发的次数
    }
  },
  props: {
    th_data: Object,
    data: Array,
    lowData: Object
  },
  watch: {
    lowData: function() {
     // console.log(this.lowData.bg_color)
    }
  },
  methods: {
    change(data) {
      this.$emit('change', data)
    },
    onclick(data) {
      this.$emit('on-click', data)
    },
    change_calendar(data) {
      this.$emit('change-calendar', data)
    },
    //      获取元素距离浏览器的距离
    getPos(ele) {
      var p = ele.offsetParent
      var left = ele.offsetLeft
      var top = ele.offsetTop
      while (p) {
        if (window.navigator.userAgent.indexOf('MSIE 8') > -1) {
          left += p.offsetLeft
          top += p.offsetTop
        } else {
          left += p.offsetLeft + p.clientLeft
          top += p.offsetTop + p.clientTop
        }
        p = p.offsetParent
      }
      var obj = {}
      obj.x = left
      obj.y = top
      return obj
    },
    //      监听表格的鼠标滚轴事件,从而让甘特图上下滚动
    gun(e) {
      let speed = -200,
        Time = new Date().getTime()
      //        判断触发滚轴的次数
      if (Time - this.mark > 200) {
        let scrollTop = document.getElementsByClassName('ganteview')[0].scrollTop,
          ganteview = document.getElementsByClassName('ganteview')[0]
        if (e.wheelDelta < 0) {
          //兼容IE,Opera,Chrome
          speed = 200
        } else if (e.detail < 0) {
          speed = 200
        }
        this.mark = Time
        this.ScrollTop(ganteview, scrollTop + speed, 200)
      }
    },
    //      让滚动条加上滚动动画效果
    ScrollTop(doc, number = 0, time) {
      if (!time) {
        doc.scrollTop = number
        return number
      }
      const spacingTime = 10 // 设置循环的间隔时间 值越小消耗性能越高
      let spacingInex = time / spacingTime // 计算循环的次数
      let nowTop = doc.scrollTop // 获取当前滚动条位置
      let everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离
      let self = this
      let scrollTimer = setInterval(function() {
        if (spacingInex > 0) {
          spacingInex--
          self.ScrollTop(doc, (nowTop += everTop))
        } else {
          clearInterval(scrollTimer) // 清除计时器
        }
      }, spacingTime)
    },
    //      让表头可以拉动,改变宽度
    doc_move(e) {
      var _body = document.getElementsByTagName('body')[0]
      if (this.tTD.mouseDown) {
        var gante_left = this.getPos(this.$refs.gante_table).x,
          cel = e.clientX,
          gante_table_box = document.getElementsByClassName('gante-table-box')[0]
        if (gante_table_box.scrollLeft) {
          cel = cel + gante_table_box.scrollLeft
        }
        this.proxy_left = cel - gante_left + 3
        _body.style.cursor = 'col-resize'
      }
    },
    th_down(e) {
      var table_width = this.getPos(this.$refs.gante_table).x,
        target = e.target,
        client_x = e.clientX,
        gante_table_box = document.getElementsByClassName('gante-table-box')[0]

      if (target.classList.contains('cell')) {
        target = target.parentNode
      }
      if (gante_table_box.scrollLeft) {
        client_x = client_x + gante_table_box.scrollLeft
      }
      this.oldx = client_x - table_width
      if (
        client_x > this.getPos(target).x + target.offsetWidth - 10 &&
        client_x <= this.getPos(this.$refs.gante_table).x + this.$refs.gante_table.offsetWidth
      ) {
        this.old_width = target.offsetWidth
        this.show_proxy = true
        this.tTD.current_index = target.dataset.key //记录拖动的是哪个th
        this.proxy_left = this.oldx + 3 //必须要加上3像素,不然拖动会有问题
        this.tTD.mouseDown = true
        //          给document绑定事件

        document.addEventListener('mousemove', this.doc_move, false)
        document.addEventListener('mouseup', this.doc_up, false)
      }
    },
    doc_up() {
      document.getElementsByTagName('body')[0].style.cursor = null
      if (this.tTD.mouseDown && this.oldx && this.tTD.current_index) {
        //          设置拖动后的宽度
        this.th_data[this.tTD.current_index].width = this.old_width + (this.proxy_left - this.oldx)

        //        初始化所有的值
        this.tTD.mouseDown = false
        this.show_proxy = false
        this.oldx = 0
        this.old_width = 0
        this.tTD.current_index = null
        //          给document移除绑定事件
        document.removeEventListener('mousemove', this.doc_move, false)
        document.removeEventListener('mouseup', this.doc_up, false)
      }
    },
    //      给表格头部加上鼠标悬浮可以拉动效果
    th_move(e) {
      var target = e.target,
        _body = document.getElementsByTagName('body')[0],
        client_x = e.clientX,
        gante_table_box = document.getElementsByClassName('gante-table-box')[0]
      if (target.classList.contains('cell')) {
        target = e.target.parentNode
      }
      if (gante_table_box.scrollLeft) {
        client_x = client_x + gante_table_box.scrollLeft
      }
      if (
        client_x > this.getPos(target).x + target.offsetWidth - 10 &&
        client_x <= this.getPos(this.$refs.gante_table).x + this.$refs.gante_table.offsetWidth
      ) {
        _body.style.cursor = 'col-resize'
      } else {
        _body.style.cursor = null
      }
    },
    th_out() {
      document.getElementsByTagName('body')[0].style.cursor = null
    }
  },
  components: {
    ganteTr
  }
}
</script>
<style>
.gante-table {
  font-size: 14px;
  display: table;
  table-layout: fixed;
  word-break: break-all;
  position: relative;
}
.gante-thead {
  position: absolute;
  top: 0;
  left: 0;
  background: #fafafa;
  width: 100%;
  z-index: 2;
}
.gante-tbody {
  position: relative;
  padding-top: 44px;
}
.gante-th {
  display: table-cell;
  white-space: nowrap;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
}
.gante-tr {
  display: table-row;
}
.gante-tr:hover {
  background: #f5f7fa;
}
.gante-td {
  display: table-cell;
  position: relative;
}
.gante-th,
.gante-td {
  word-break: keep-all;
  padding: 11px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.cell {
  position: relative;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  min-height: 16px;
}
#gante-table__column-resize-proxy {
  position: absolute;
  top: 0;
  left: 0;
  border-left: 1px solid #ebeef5;
  width: 0;
  bottom: 0;
  z-index: 5;
}
</style>
