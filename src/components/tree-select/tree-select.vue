<template>
  <div class="select" ref="sel">
    <a-select
      :size="size"
      mode="multiple"
      :value="vModel"
      placeholder="请选择"
      @dropdownVisibleChange="dvc"
      @change="selectChange"
    >
      <a-select-option v-for="item in optionData" :key="item.key">
        {{item.title}}
      </a-select-option>
      <div slot="dropdownRender" slot-scope="menu">
      </div>
    </a-select>
    <div
      class="content"
      :class="{'bottom' : position == 'bottom', 'top' : position == 'top'}"
      v-show="show && values.length"
      ref="content">
      <a-tree
        multiple
        style="maxHeight:400px;overflow-y:auto;"
        :autoExpandParent="false"
        :treeData="treeData"
        @select="treeSelect"
        :loadData="loadData"
        :selectedKeys="selectedKeys"
      />
    </div>

  </div>
</template>
<script>
  export default {
    props: {
      size:{
        type: String,
      },
      treeData: {
        type: Array
      },
      optionData:{
        type: Array
      },
      treeSelect:{
        type: Function
      },
      loadData:{
        type: Function
      },
      selectChange:{
        type: Function
      },
      selectedKeys:{
        type: Array
      },
      values: {
        type: Array,
        default() {
          return ['23423', '234234', '234234']
        }
      },
      vModel:{
        type: Array,
      },
      placeholder: {
        type: String,
        default: '请选择'
      }
    },
    data() {
      return {
        show: false,
        position: 'bottom'
      }
    },
    mounted() {
    },
    methods: {
      dvc(open) {
        if (!this.show && open) {
          this.show = open
          this.computePos()
          document.addEventListener('click', this.handleBodyClick, true)
        }
      },
      handleBodyClick(e) {
        if (this.$refs.sel && this.$refs.sel.contains(e.target)) {
          // 如果是子元素则阻止事件捕获
        } else {
          document.removeEventListener('click', this.handleBodyClick)
          this.show = false
        }
      },
      getElementTop(element) {
        var actualTop = element.offsetTop
        var current = element.offsetParent
        while (current !== null) {
          actualTop += current.offsetTop
          current = current.offsetParent
        }
        return actualTop
      },
      // 计算选择框是往上弹出还是往下弹出
      computePos() {
        let elHeight = this.$refs.sel.offsetHeight
        let absPos = this.getElementTop(this.$refs.sel)
        let contentHeight = this.values.length * 40
        let docScrollHei = document.body.scrollTop
          || document.documentElement.scrollTop || 0
        let docHeight = document.documentElement.clientHeight
          || document.body.clientHeight || 0
        if ((elHeight + absPos + contentHeight - docScrollHei) > docHeight) {
          this.position = 'top'
        } else {
          this.position = 'bottom'
        }
      }

    }
  }
</script>

<style scoped>

  .select {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
  }

  .content {
    width: 100%;
    max-height: px(300);
    overflow-y: scroll;
    border-radius: 4px;
    /*margin-top: 2px;*/
    position: absolute;
    left: 0;
    background-color: white;
    box-shadow: 0 0 20px 2px #ccc;
    z-index: 2;
  }

  .content::-webkit-scrollbar {
    display: none;
  }

  .bottom {
    top: 100%;
  }

  .top {
    bottom: 125%;
  }

</style>