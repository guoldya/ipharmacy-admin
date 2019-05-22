<template>
  <div id="detailpanel" class="detailpanel" ref="dom">
    <div data-status="node-selected" class="pannel" id="node_detailpannel" v-if="selectNode.shape != 'model-card-conclusion'" style="display: none;">
      <div class="panel-title">节点属性</div>
      <div class="block-container">
        <a-form>
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input size="small" v-if="selectNode.shape == 'flow-circle-start'" v-model="selectNode.label"
                     :disabled="true"/>
            <a-input size="small" v-else v-model="selectNode.label"/>
          </a-form-item>

          <!-- <a-form-item label="颜色" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <colorPicker v-model="selectNode.colorLevel"/>
          </a-form-item> -->
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
            <a-select size="small" v-model="selectNode.level" @change="levelChange">
              <a-select-option v-for="(op,index) in levelData" :value=op.auditLevel :key="index"
                               :titile="op.levelColor">{{op.levelName}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="消息" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" placeholder="small size" v-model="selectNode.message" :rows="3"/>
          </a-form-item>

          <a-form-item label="建议" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" placeholder="small size" v-model="selectNode.suggest" :rows="3"/>
          </a-form-item>

          <a-form-item label="结论类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              :dropdownStyle="{ maxHeight: '250px', overflow: 'auto' }"
              :treeData="dicBaseTreeData"
              v-model="selectNode.verdictType"
              treeDefaultExpandAll>

            </a-tree-select>
          </a-form-item>
          <!--<a-form-item label="控制类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">-->
            <!--<a-select size="small" v-model="selectNode.restrictionType">-->
              <!--<a-select-option :value=1>禁慎用</a-select-option>-->
              <!--<a-select-option :value=2>皮试提示</a-select-option>-->
              <!--<a-select-option :value=3>过敏提示</a-select-option>-->
            <!--</a-select>-->
          <!--</a-form-item>-->
        </a-form>
      </div>
    </div>
    <!--判断节点-->
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape == 'flow-rhombus-if'">规则属性</div>
      <div class="block-container" v-if="selectNode.shape == 'flow-rhombus-if'">
        <a-form>
          <a-form-item label="模型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              size="small"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="CoreFactAllTree"
              v-model="selectNode.itemId"
              treeDefaultExpandAll
              @select="coreFactTreeChange">
            </a-tree-select>
          </a-form-item>
          <a-form-item label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.ro">
              <a-select-option :value=1>等于</a-select-option>
              <a-select-option :value=2>不等于</a-select-option>
              <a-select-option :value=3>小于</a-select-option>
              <a-select-option :value=4>小于等于</a-select-option>
              <a-select-option :value=5>大于</a-select-option>
              <a-select-option :value=6>大于等于</a-select-option>
              <a-select-option :value=7>包含</a-select-option>
              <a-select-option :value=8>不包含</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="条件值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input :type="inValueType" v-if="inputType =='input'" size="small" v-model="selectNode.assertVal"></a-input>
            <div v-else-if="inputType =='scopeInput'">
              <a-input :type="inValueType" class="inputLeft" size="small" placeholder="min" v-model="selectNode.assertVal"/>
              <a-input :type="inValueType" class="inputCenter" size="small" placeholder="~" disabled/>
              <a-input :type="inValueType" class="inputRight" size="small" placeholder="max" v-model="selectNode.assertVal1"/>
            </div>
            <div v-else-if="inputType =='select'">
              <a-select size="small" v-model="selectNode.assertVal">
                <a-select-option :value=1>等于</a-select-option>
                <a-select-option :value=2>不等于</a-select-option>
                <a-select-option :value=3>小于</a-select-option>
                <a-select-option :value=4>小于等于</a-select-option>
                <a-select-option :value=5>大于</a-select-option>
                <a-select-option :value=6>大于等于</a-select-option>
                <a-select-option :value=7>包含</a-select-option>
                <a-select-option :value=8>不包含</a-select-option>
              </a-select>
            </div>
            <a-date-picker v-else-if="inputType =='input'&&inValueType=='time'" @change="onChange" />
            <a-range-picker v-else-if="inputType =='scopeInput'&&inValueType=='time'" @change="onChange" />
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape == 'model-rect-attribute'">规则属性</div>
      <div class="block-container" v-if="selectNode.shape == 'model-rect-attribute'">
        <a-form>
          <!--<a-form-item label="模型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">-->
          <!--<a-select size="small" v-model="selectNode.prototypes">-->
          <!--<a-select-option value="门诊模型">门诊模型</a-select-option>-->
          <!--<a-select-option value="药学模型">药学模型</a-select-option>-->
          <!--</a-select>-->
          <!--</a-form-item>-->
          <a-form-item label="模型字段" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-tree-select
                size="small"
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData="CoreFactAllTree"
                v-model="selectNode.itemId"
                treeDefaultExpandAll>
              </a-tree-select>
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
            <a-input size="small" placeholder="请输入" v-model="selectEdge.value" :rows="4"/>
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
  import { reviewAuditlevelSelect, dicBaseSelectClassList,coreFactColAll } from '@/api/login'

  export default {
    props: ['graphAPI', 'selectNode', 'selectEdge'],
    data() {
      return {
        levelData: [],
        dicBaseTreeData: [],
        CoreFactAllTree:[],
        inputType:'input',
        inValueType:'Number'
      }
    },
    mounted() {
      this.getReviewLevel()
      this.getSelectClassList();
      this.getCoreFactAllStart();
    },
    methods: {
      getReviewLevel() {
        reviewAuditlevelSelect({}).then(res => {
          if (res.code == '200') {
            this.levelData = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      levelChange(value, option) {
        this.selectNode.levelColor = option.data.attrs.titile
      },
      getSelectClassList() {
        dicBaseSelectClassList({ 'codeClass': '7' }).then(res => {
          if (res.code == '200') {
            this.dealClassTree(res.rows)
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      dealClassTree(data) {
        let treeData = []
        for (let key in data) {
          if (!data[key].parentId) {
            treeData.push({
              title: data[key].name,
              value:''+ data[key].id,
              key: data[key].code,
              disabled: true,
              children: []
            })
          }
        }
        for (let key in treeData) {
          for (let i in data) {
            if (treeData[key].value == data[i].parentId) {
              treeData[key].children.push({
                title: data[i].name,
                value: ''+data[i].id,
                key: data[i].code,
                isLeaf:true,
              })
            }
          }
        }
        this.dicBaseTreeData = treeData;
      },
      coreFactTreeChange(value, node, extra){
        let params = extra.selectedNodes[0].data.props;
        console.log(params,'extra');
        if (params.lo == 1){
          this.inputType = 'input'
        }else if (params.lo == 2){
          this.inputType = 'scopeInput'
        }else if (params.lo == 3){
          this.inputType = 'select'
        }
        if (params.colDbType == 1){
          this.inValueType = 'number'
        }else if (params.lo == 2){
          this.inputType == 'time'
        }else if (params.lo == 3){
          this.inValueType = 'text'
        }
        this.selectNode.label = params.title+this.selectNode.ro+this.selectNode.ro+this.selectNode.assertVal;
        console.log(this.inputType,'inputType')
        console.log(this.inValueType,'inValueType')
      },
      getCoreFactAllStart(){
        coreFactColAll({}).then(res => {
          if (res.code == '200') {
            let indexData = this.dealAllStartTree(res.rows);
            this.CoreFactAllTree = this.recursiveNodeTree(indexData, 'undefined')

            console.log(this.CoreFactAllTree);
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //处理模型字段
      dealAllStartTree(list){
        let indexData = {}
        for (let key in list) {
          let children = indexData[list[key].pid]
          if (children instanceof Array) {
            children.push({
              title:list[key].colName,
              value:''+list[key].id,
              key:list[key].id,
              disabled:list[key].isleaf? true:false,
              id:list[key].id,
              pid:list[key].pid,
              lo:list[key].lo,
              colDbType:list[key].colDbType,

            })
          } else {
            children = [{
              title:list[key].colName,
              value:''+list[key].id,
              key:list[key].id,
              disabled:list[key].isleaf? true:false,
              id:list[key].id,
              pid:list[key].pid,
              lo:list[key].lo,
              colDbType:list[key].colDbType,
            }]
          }
          indexData[list[key].pid] = children
        }
        return indexData;
      },
      recursiveNodeTree(indexData, pid) {
        let children = indexData[pid]
        if (children != null && children != undefined) {
          for (let ckey in children) {
            let cnode = children[ckey]
            children[ckey].children = this.recursiveNodeTree(indexData, cnode.id)
          }
        }
        return children
      },
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

  .inputLeft {
    width: 70px;
    text-align: center;
    border-right: 0;
    border-radius: 0px
  }

  .inputCenter {
    width: 30px;
    border-left: 0;
    border-right: 0;
    pointer-events: none;
    backgroundColor: #fff;
    border-radius: 0px;
  }

  .inputRight {
    width: 70px;
    text-align: center;
    border-left: 0;
    border-radius: 0px;
  }
</style>