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
      <span class="separator"></span>
      <i v-if="titleData.visible" class="operating icon-font action action-xinzeng"  title="新增" @click="addRuleData" ></i>
      <i  v-if="titleData.visible" class="operating icon-font action action-fuzhi1"  title="复制规则"  @click="copyRule" ></i>
      <i  v-if="titleData.visible" class="operating icon-font action action-xiaoyan2"  title="校验"  @click="verifyFlow({status:true})" ></i>
      <span class="separator"></span>
      <i  v-if="titleData.visible" class="operating icon-font action action-baocun"  title="保存" style="color: #52c41a"  @click="saveFlow" ></i>
      <i  v-if="titleData.visible" class="operating icon-font action action-tijiao2" style="color: #2eabff"  title="提交"  @click="submitFlow" ></i>
    </div>
    <div class="rightButton" style="text-align:right;">
      <a-row>
        <span class="opacity8 margin-left-5"><a-tag color="blue">{{titleData.type2 | typeType}}</a-tag></span>
        <span class="opacity8 margin-right-15" v-if="titleData.type"><a-tag color="blue">{{titleData.type}}</a-tag></span>
        <span class="opacity8 margin-right-15">{{titleData.name}}</span>
        <span v-if="titleData.status =='启用'" style="color: #2D8cF0;" class="opacity8 margin-right-15"> {{titleData.status}}  </span>
        <span v-else style="color: #ff9900;" class="opacity8 margin-right-15"> {{titleData.status}}  </span>
        <span class="opacity8 margin-right-15">{{titleData.updateTime}}</span>
      </a-row>
    </div>

  </div>
</template>

<script>
  export default {
    // props:['saveFlow'],
    props: {
      titleData: Object, // 传入数据
      saveFlow: Function, // 获取数据
      verifyFlow: Function,
      submitFlow: Function,
      copyRule: Function,
      addRuleData: Function,
    },
    mounted(){
    },
    methods: {
      // saveFlows() {
      //   console.log(this.saveFlow,"保存信息");//.save()
      //   //localStorage.setItem('test', JSON.stringify(this.flow.save()))
      // },

    },
    filters:{
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

  .toolbar .leftDom {
    float: left;
    line-height: 35px;
  }

  .toolbar .rightButton {
    width: 50%;
    float: right;
    line-height: 35px;
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
    height: 35px;
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
  .toolbar .margin-right-15{
  margin-right: 15px;
  }
  .toolbar .operating{
    width: 27px;
    height: 35px;
    margin: 0px 6px;
    border-radius: 2px;
    padding-left: 4px;
    display: inline-block;
    border: 1px solid rgba(2, 2, 2, 0);
  }
  .toolbar .operating:nth-of-type(1) {
    margin-left: 24px;
  }

  .toolbar .operating:hover {
    cursor: pointer;
    border: 1px solid #e9e9e9;
  }
</style>
