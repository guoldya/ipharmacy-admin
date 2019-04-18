<template>
  <div id="detailpanel" class="detailpanel" ref="dom">
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title">节点属性</div>
      <div class="block-container">
        <a-form>
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input size="small" placeholder="请输入别名" v-model="selectNode.label"/>
          </a-form-item>

          <a-form-item label="颜色" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <colorPicker v-model="selectNode.colorLevel"/>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape == 'model-card-conclusion'">规则属性</div>
      <div class="block-container" v-if="selectNode.shape == 'model-card-conclusion'">
        <a-form>
          <a-form-item label="依据" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.basisLabel">
              <a-select-option value="医院规定">医院规定</a-select-option>
              <a-select-option value="药品说明书">药品说明书</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="级别" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.level">
              <a-select-option value="0">一级</a-select-option>
              <a-select-option value="1">二级</a-select-option>
              <a-select-option value="2">三级</a-select-option>
              <a-select-option value="3">四级</a-select-option>
              <a-select-option value="4">五级</a-select-option>
              <a-select-option value="5">六级</a-select-option>
              <a-select-option value="6">七级</a-select-option>
              <a-select-option value="7">八级</a-select-option>
            </a-select>
          </a-form-item>


          <a-form-item label="消息" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" placeholder="small size" v-model="selectNode.messageLabel" :rows="4"/>
          </a-form-item>

          <a-form-item label="建议" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" placeholder="small size" v-model="selectNode.suggestLabel" :rows="4"/>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape == 'model-rect-attribute'">规则属性</div>
      <div class="block-container" v-if="selectNode.shape == 'model-rect-attribute'">
        <a-form>
          <a-form-item label="模型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.prototypes">
              <a-select-option value="门诊模型">门诊模型</a-select-option>
              <a-select-option value="药学模型">药学模型</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="字段" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.field">
              <a-select-option value="性别">性别</a-select-option>
              <a-select-option value="年龄">年龄</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="edge-selected" class="pannel" id="edge_detailpannel" style="display: none;">
      <div class="panel-title">边属性</div>
      <div class="block-container">
        <div class="p name">
          名称：
          <a-input size="small" v-model="selectEdge.label"></a-input>
        </div>
      </div>
    </div>
    <div data-status="edge-selected" class="pannel" id="edge_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectEdge.sourceType=='flow-rhombus-if'">规则属性</div>
      <div class="block-container" v-if="selectEdge.sourceType=='flow-rhombus-if'">
         <a-form>
          <a-form-item label="判断条件" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectEdge.label">
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="edge-selected" class="pannel" id="edge_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectEdge.sourceType=='model-rect-attribute'">规则属性</div>
      <div class="block-container" v-if="selectEdge.sourceType=='model-rect-attribute'">
         <a-form>
          <a-form-item label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectEdge.label">
              <a-select-option value="不等于(!=)">不等于(!=)</a-select-option>
              <a-select-option value="等于(!=)">等于(!=)</a-select-option>
              <a-select-option value="包含(like)">包含(like)</a-select-option>
              <a-select-option value="不包含(not like)">不包含(not like)</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="条件值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input size="small" placeholder="请输入" v-model="selectNode.value" :rows="4"/>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="group-selected" class="pannel" id="group_detailpannel" style="display: none;">
      <div class="panel-title">群组</div>
    </div>
    <div
      data-status="canvas-selected"
      class="pannel"
      id="canvas_detailpannel"
      style="display: none;"
    >
      <div class="panel-title">画布</div>
    </div>
    <div data-status="multi-selected" class="pannel" id="multi_detailpannel" style="display: none;">
      <div class="panel-title">属性</div>
    </div>
  </div>
</template>

<script>
export default {
  props:['graphAPI','selectNode','selectEdge'],
  data() {
    return {
     
    }
  }
}
</script>
<style>

.detailpanel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 300px;
  border-left: 1px solid #e6e9ed;
}
.detailpanel .panel {
  display: block;
}
.detailpanel .block-containe {
  padding-top: 20px;
}
.detailpanel .input {
  margin-left: 16px;
}
.detailpanel .name-input {
  width: 120px;
}
.detailpanel .width-input {
  width: 52px;
}
.detailpanel .height-input {
  width: 52px;
}
.detailpanel .block-container {
  padding: 16px 8px;
}

.bottom-container {
  position: relative;
}
.panel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
.color-picker {
  vertical-align: middle;
  margin-left: 16px;
}
.p {
  margin-bottom: 12px;
}

.ant-slider-track {
  background-color: #91d5ff;
}
.ant-slider-handle {
  border: solid 2px #91d5ff;
}

.block-container .box {
  z-index: 99999;
  left: -70px;
  width: 215px !important;
}
.ant-form-item {
  margin-bottom: 0px !important;
}
</style>