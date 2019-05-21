<template>
    <div id="toolbar" class="toolbar" ref="dom">
    <!-- 工具栏 DOM 结构规约参考 Toolbar API -->
      <div class="leftDom">
        <link
          rel="stylesheet"
          type="text/css"
          href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
        >
        <i data-command="undo" class="command iconfont icon-undo" title="撤销"></i>
        <i data-command="redo" class="command iconfont icon-redo" title="重做"></i>
        <span class="separator"></span>
        <i data-command="copy" class="command iconfont icon-copy-o" title="复制"></i>
        <i data-command="paste" class="command iconfont icon-paster-o" title="粘贴"></i>
        <i data-command="delete" class="command iconfont icon-delete-o" title="删除"></i>
        <span class="separator"></span>
        <i data-command="zoomIn" class="command iconfont icon-zoom-in-o" title="放大"></i>
        <i data-command="zoomOut" class="command iconfont icon-zoom-out-o" title="缩小"></i>
        <i data-command="autoZoom" class="command iconfont icon-fit" title="适应画布"></i>
        <i data-command="resetZoom" class="command iconfont icon-actual-size-o" title="实际尺寸"></i>
        <span class="separator"></span>
        <i data-command="toBack" class="command iconfont icon-to-back" title="层级后置"></i>
        <i data-command="toFront" class="command iconfont icon-to-front" title="层级前置"></i>
        <span class="separator"></span>
        <i data-command="multiSelect" class="command iconfont icon-select" title="多选"></i>
        <!-- <i data-command="addGroup" class="command iconfont icon-group" title="成组"></i>
        <i data-command="unGroup" class="command iconfont icon-ungroup" title="解组"></i> -->
        <!-- <a href="https://www.yuque.com/antv/g6-editor">G6-Editor 文档</a> -->
        <!--<a href="javascript:void(0); " @click="saveFlow">保存节点信息</a>-->
        <!--<i class="iconfont action action-user-lock"></i>-->
        <a-button size="small" type="primary" @click="saveFlow" class="margin-left-5">保存</a-button>
        <a-button size="small" type="primary" class="margin-left-5">提交</a-button>
        <a-button size="small" class="margin-left-5" >复制规则</a-button>
        <a-button size="small" class="margin-left-5">校验</a-button>

      </div>
      <div class="rightButton">
        <a-row>
          <a-col :span="2">状态：<span class="opacity8">{{titleData.status}}</span></a-col>
          <a-col :span="3">规则：<span class="opacity8">{{titleData.type}}</span></a-col>
          <a-col :span="3">类型：<span class="opacity8" v-html="typeType(titleData.type2)"></span></a-col>
          <a-col :span="9">规则名称：<span class="opacity8">{{titleData.name}}</span></a-col>
          <a-col :span="7">更新时间：<span class="opacity8">{{titleData.updateTime}}</span></a-col>
        </a-row>
      </div>

    </div>
</template>

<script>
export default {
  // props:['saveFlow'],
  props:{
    titleData: Object, // 传入数据
    saveFlow: Function // 获取数据
  },
  methods: {
    // saveFlows() {
    //   console.log(this.saveFlow,"保存信息");//.save()
    //   //localStorage.setItem('test', JSON.stringify(this.flow.save()))
    // },
    typeType(value) {
      if (value == '1') {
        return '药品'
      } else if (value == '2') {
        return '药品分类'
      } else if (value == '3') {
        return '药品组'
      } else if (value == '4') {
        return '全局'
      }
    }
  }

}
</script>
<style>

.toolbar {
  /*padding: 8px 0px;*/
  width: 100%;
  border: 1px solid #e9e9e9;
  height: 42px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  position: absolute;
  /*line-height: 18px;    */
  background-color: white;
  overflow: hidden;
}
.toolbar .leftDom{
  float: left;
  line-height: 35px;
}
.toolbar .rightButton{
  width: 50%;
  float: right;
  line-height: 35px;
  color: #F5222D;
}
.toolbar *::before {
  font-size: 16px !important;
}
.toolbar .disable {
  color: rgba(0, 0, 0, 0.25);
}
.toolbar .icon-select.disable {
  background: #eeeeee;
}
.toolbar .separator {
  margin: 4px;
  border-left: 1px solid #e9e9e9;
}
.toolbar .command {
  width: 27px;
  height: 27px;
  margin: 0px 6px;
  border-radius: 2px;
  padding-left: 4px;
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
}
.toolbar .command:nth-of-type(1) {
  margin-left: 24px;
}
.toolbar .command:hover {
  cursor: pointer;
  border: 1px solid #e9e9e9;
}
.toolbar .disable:hover {
  cursor: default;
  border: 1px solid rgba(2, 2, 2, 0);
}

</style>
