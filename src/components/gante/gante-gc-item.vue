<template>
  <div class="ganteview-content">
    <!-- ganteview-ones是一个完整的div里面有可能有子集有可能没有 -->
    <div
      v-for="(item,index) in gante_data"
      :key="index"
      class="ganteview-ones"
      @click="onclick(item)"
    >
      <div class="ganteview-content-one">
        <!-- |ones cont-one =>(无层级关系子集,直接两个div,)|ones一级 cont-one(一个没内容的子集)2 content(ones, 这下是无层级的的div)2 -->
        <template v-if="item.items">
          <div
            v-for="(temp,tempindex) in item.items"
            :data-toast="index"
            :data-itemstoast="tempindex"
            @mousemove="showToast"
            @mouseleave="hideToast"
            :style="{
            width:temp.width?temp.width+'px':0,
            left:temp.left?temp.left+'px':0,
            background:temp.bg_color?temp.bg_color:'#00b0ff'}"
            class="ganteview-item"
          >
            <a-tag v-if="temp.params.orderClass==1" color="orange">临时</a-tag>
            <a-tag v-else color="blue">长期</a-tag>
            {{temp.params.biaoti}}
          </div>
        </template>
        <div
          v-else-if="!item.children"
          @mousemove="showToast"
          @mouseleave="hideToast"
          :data-toast="index"
          :style="{width:item.width?item.width+'px':0,left:item.left?item.left+'px':0,background:item.bg_color?item.bg_color:'#00b0ff'}"
          class="ganteview-item"
           @click="onclicks(item.children)"
        >
          <a-tag v-if="item.params.orderClass==1" color="orange">临时</a-tag>
          <a-tag v-else color="blue">长期</a-tag>
          {{item.params.biaoti}}
        </div>

        <!-- @mousemove="showToast" @mouseleave="hideToast" -->
        <div
          v-else
          :data-toast="index"
          :style="{width:item.width?item.width+'px':0,left:item.left?item.left+'px':0,background:item.bg_color?item.bg_color:'#00b0ff'}"
          class="ganteview-item has-child"
           @click="onclicks(item.children)"
        >
          <span
            :style="{borderLeftColor:item.bg_color?item.bg_color:'#00b0ff'}"
            class="sanjiao-left"
          ></span>
          <span
            :style="{borderRightColor:item.bg_color?item.bg_color:'#00b0ff'}"
            class="sanjiao-right"
          ></span>
        </div>
      </div>
      <ganteview-item
        v-show="item.open"
        v-if="item.children"
        :th_data="th_data"
        :gante_data="item.children"
      >
        <span style="display: none">1</span>
      </ganteview-item>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ganteview-item',
  data() {
    return {}
  },
  props: {
    gante_data: Array,
    th_data: Object
  },
  methods: {
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
  box-sizing: border-box;
  line-height: 44px;
  border-bottom: 1px solid #ebeef5;
  /* 设置定位 处理z_index 不生效BUG */
  z-index: 1;
  position: relative;
  top: 0;
  left: 0;
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
</style>
