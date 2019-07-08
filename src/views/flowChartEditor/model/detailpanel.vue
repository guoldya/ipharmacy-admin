<template>
  <div id="detailpanel" class="detailpanel" ref="dom">
    <div data-status="node-selected" class="pannel" id="node_detailpannel"  style="display: none;">
      <div class="panel-title" v-if="selectNode.shape != 'model-card-conclusion'">节点属性</div>
      <div class="block-container" v-if="selectNode.shape != 'model-card-conclusion'">
        <a-form>
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input size="small"  v-if="selectNode.shape == 'flow-circle-start'" v-model="selectNode.label"
                     :disabled="true"/>
            <a-input size="small" :read-only="true" v-else v-model="selectNode.label"/>
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
            <a-select size="small" v-model="selectNode.inAccordanceWith" @change="sourceName">
              <a-select-option :value=1 title="药品说明书">药品说明书</a-select-option>
              <a-select-option :value=2 title="医院规定">医院规定</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="级别" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.levels" @change="levelChange">
              <a-select-option v-for="(op,index) in levelData" :value=op.auditLevel :key="index"
                               :title="op.levelColor">{{op.levelName}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="消息" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small"  v-model="selectNode.message" :rows="3"/>
          </a-form-item>

          <a-form-item label="建议" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" v-model="selectNode.suggest" :rows="3"/>
          </a-form-item>

          <a-form-item label="结论类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              :dropdownStyle="{ maxHeight: '250px', overflow: 'auto' }"
              :treeData="dicBaseTreeData"
              v-model="selectNode.verdictType"
              treeDefaultExpandAll>
            </a-tree-select>
          </a-form-item>
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
              class="nodeSelect"
              @select="coreFactTreeChange">
            </a-tree-select>
          </a-form-item>
          <a-form-item v-if="boxInitialized.inputType !='scopeInput'" label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select v-if="boxInitialized.inputType !='select'" size="small" v-model="selectNode.ro" @select="selectNodeRo">
              <a-select-option :value=1 title="=">等于</a-select-option>
              <a-select-option :value=2 title="≠">不等于</a-select-option>
              <a-select-option :value=3 title="<">小于</a-select-option>
              <a-select-option :value=4 title="≤">小于等于</a-select-option>
              <a-select-option :value=5 title=">">大于</a-select-option>
              <a-select-option :value=6 title="≥">大于等于</a-select-option>
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else size="small" v-model="selectNode.ro" @select="selectNodeRo">
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="条件值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input :type="boxInitialized.inValueType" v-if="boxInitialized.inputType =='input'&&boxInitialized.inValueType!='time'" @change="inputChange" size="small" v-model="selectNode.assertVal"></a-input>
            <div v-else-if="boxInitialized.inputType =='scopeInput'&&boxInitialized.inValueType!='time'">
              <a-input :type="boxInitialized.inValueType" class="inputLeft" size="small" placeholder="最小值" @change="scopeAssertVal"  v-model="selectNode.assertVal"/>
              <a-input :type="boxInitialized.inValueType" class="inputCenter" size="small" placeholder="~" disabled/>
              <a-input :type="boxInitialized.inValueType" class="inputRight" size="small" placeholder="最大值" @change="scopeAssertVal1" v-model="selectNode.assertVal1"/>
            </div>
            <div v-else-if="boxInitialized.inputType =='select'&&boxInitialized.inValueType!='time'">
              <a-select
                size="small"
                v-model="selectNode.assertValList"
                showSearch
                mode="multiple"
                @search="searchSelect"
                @change="assertValSelect"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
              >
                <a-select-option v-for="(op,index) in boxInitialized.inputSelectData" :value="op.ID" :title="op.NAME" :key="index">{{op.NAME}}
                </a-select-option>
              </a-select>
            </div>
            <a-date-picker v-else-if="boxInitialized.inputType =='input'&&boxInitialized.inValueType=='time'" @change="onChange" />
            <a-range-picker v-else-if="boxInitialized.inputType =='scopeInput'&&boxInitialized.inValueType=='time'" @change="onChange" />
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape == 'model-rect-attribute'">规则属性</div>
      <div class="block-container" v-if="selectNode.shape == 'model-rect-attribute'">
        <a-form>
          <a-form-item label="模型字段" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-tree-select
                size="small"
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData="CoreFactAllTree"
                v-model="selectNode.itemId"
                @select="attributeEdge"
                treeDefaultExpandAll>
              </a-tree-select>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="edge-selected" class="pannel" id="edge_detailpannel" style="display: none;">
      <div class="panel-title">线属性</div>
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
            <a-select size="small" v-model="selectEdge.assertVal" @select="lineCondition" >
              <a-select-option value="true" title="真">真</a-select-option>
              <a-select-option value="false" title="假">假</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="edge-selected" class="pannel" id="edge_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectEdge.sourceType=='model-rect-attribute'">规则属性</div>
      <div class="block-container" v-if="selectEdge.sourceType=='model-rect-attribute'">
        <a-form>
          <a-form-item v-if="edgeInitialized.inputEdge !='scopeInput'" label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select v-if="edgeInitialized.inputEdge !='select'" size="small" v-model="selectEdge.ro" @select="selectEdgeRo">
              <a-select-option :value=1 title="=">等于</a-select-option>
              <a-select-option :value=2 title="≠">不等于</a-select-option>
              <a-select-option :value=3 title="<">小于</a-select-option>
              <a-select-option :value=4 title="≤">小于等于</a-select-option>
              <a-select-option :value=5 title=">">大于</a-select-option>
              <a-select-option :value=6 title="≥">大于等于</a-select-option>
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else size="small" v-model="selectEdge.ro" @select="selectEdgeRo">
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="条件值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input :type="edgeInitialized.inValueEdge" v-if="edgeInitialized.inputEdge =='input'&&edgeInitialized.inputEdge!='time'" @change="inputEdgeChange" size="small" v-model="selectEdge.assertVal"></a-input>
            <div v-else-if="edgeInitialized.inputEdge =='scopeInput'&&edgeInitialized.inValueEdge!='time'">
              <a-input-number  class="inputLeft" size="small" placeholder="最小值" @change="edgeAssertVal" :max="selectEdge.assertVal1"  v-model="selectEdge.assertVal"/>
              <a-input-number  class="inputCenter" size="small" placeholder="~" disabled/>
              <a-input-number  class="inputRight" size="small" placeholder="最大值" @change="edgeAssertVal1" :min="selectEdge.assertVal" v-model="selectEdge.assertVal1"/>
            </div>
            <div v-else-if="edgeInitialized.inputEdge =='select'&&edgeInitialized.inValueEdge!='time'">
              <a-select
                size="small"
                v-model="selectEdge.assertValList"
                showSearch
                mode="multiple"
                @search="searchEdge"
                @change="assertValEdge"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
              >
                <a-select-option v-for="(op,index) in edgeInitialized.inputEdgeSelect" :value="op.ID" :title="op.NAME" :key="index">{{op.NAME}}
                </a-select-option>
              </a-select>
            </div>
            <a-date-picker v-else-if="edgeInitialized.inputEdge =='input'&&edgeInitialized.inValueEdge=='time'" @change="onChange" />
            <a-range-picker v-else-if="edgeInitialized.inputEdge =='scopeInput'&&edgeInitialized.inValueEdge=='time'" @change="onChange" />
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
  import { reviewAuditlevelSelect, dicBaseSelectClassList,coreFactColAll ,coreRuleNodeSelectColId} from '@/api/login'
  import debounce from 'lodash/debounce'
  export default {
    props: ['graphAPI', 'selectNode', 'selectEdge','boxInitialized','edgeInitialized'],
    data() {
      this.searchSelect = debounce(this.searchSelect, 500)
      this.searchEdge = debounce(this.searchEdge, 500)
      return {
        levelData: [],
        dicBaseTreeData: [],
        CoreFactAllTree:[],
        inputType:'input',
        inValueType:'Number',
        inputSelectData:[],
        modelValue:'',
        condition:'',
        conditionValue:'',
        conditionValue1:'',
        //模型id
        modelId:null,
        inputEdge:'input',
        inValueEdge:'Number',
        edgeModel:'',
        edgeId:null,
        edgeCondition:'',
        edgeConditionValue:'',
        edgeConditionValue1:'',
      }
    },
    mounted() {
      this.getReviewLevel()
      this.getSelectClassList();
      this.getCoreFactAllStart();
    },
    methods: {
      textChange(){
      },
      sourceName(value, option){
        this.selectNode.sourcename = option.componentOptions.propsData.title;
      },
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
        this.selectNode.levelColor = option.componentOptions.propsData.title;
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
                value: data[i].id,
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
        let _this = this;
        _this.selectNode.itemId = params.id;
        if (params.lo == 1){
          this.boxInitialized.inputType = 'input'
        }else if (params.lo == 2){
          this.boxInitialized.inputType = 'scopeInput'
        }else if (params.lo == 3){
          this.boxInitialized.inputType = 'select';
          this.boxInitialized.itemId = params.id;
          coreRuleNodeSelectColId({id:params.id}).then(res => {
            if (res.code == '200') {
              this.boxInitialized.inputSelectData = res.rows;
            } else {
              this.warn(res.msg)
              this.boxInitialized.inputSelectData = [];
            }
          }).catch(err => {
            this.error(err)
          })
        }
        if (params.colDbType == 1){
          this.boxInitialized.inValueType = 'number'
        }else if (params.colDbType == 2){
          this.boxInitialized.inputType == 'time'
        }else if (params.colDbType == 3){
          this.boxInitialized.inValueType = 'text'
        }
        _this.selectNode.lo = params.lo;
        _this.selectNode.colDbType = params.colDbType;
        this.modelValue = params.title;
        _this.selectNode.label = this.modelValue;
        _this.selectNode.assertVal = null;
        _this.selectNode.assertVal1 = null;
        _this.selectNode.assertValList = [];
        this.condition = '';
        this.conditionValue = '';
        this.conditionValue1 = '';
      },
      //判断节点条件选择事件
      selectNodeRo(value,option){
        this.condition = option.componentOptions.propsData.title;
        if ($.trim(this.modelValue).length==0){
          this.modelValue = this.selectNode.itemName;
        }
        console.log(option)
        this.selectNode.ro = value
        this.selectNode.label =this.modelValue+this.condition+this.conditionValue;
      },
      //条件值单个输入事件
      inputChange(e){
        this.conditionValue = e.srcElement.value;
        if ($.trim(this.modelValue).length==0){
          this.modelValue = this.selectNode.itemName;
        }
        this.selectNode.label =this.modelValue+this.condition+this.conditionValue;
      },
      //多个条件值输入第一个事件
      scopeAssertVal(e){
        this.conditionValue = e.srcElement.value;
        if ($.trim(this.modelValue).length==0){
          this.modelValue = this.selectNode.itemName;
        }
        if ($.trim(this.conditionValue1).length==0){
          this.conditionValue1 = this.selectNode.assertVal1;
        }
        this.selectNode.label =this.modelValue+'['+this.conditionValue+'-'+this.conditionValue1+']';
      },
      scopeAssertVal1(e){
        this.conditionValue1 = e.srcElement.value;
        if ($.trim(this.modelValue).length==0){
          this.modelValue = this.selectNode.itemName;
        }
        if ($.trim(this.conditionValue).length==0){
          this.conditionValue = this.selectNode.assertVal;
        }
        this.selectNode.label =this.modelValue+'['+this.conditionValue+'-'+this.conditionValue1+']';
      },
      //下拉选择事件
      assertValSelect(value,option){
        if ($.trim(this.modelValue).length==0){
          this.modelValue = this.selectNode.itemName;
        }
        if ($.trim(this.condition).length==0){
          this.condition = this.selectNode.roSymbol;
        }
        this.conditionValue = '';
        for (let key in option){
          if (key < 1){
            this.conditionValue = option[0].componentOptions.propsData.title;
          } else{
            this.conditionValue = option[0].componentOptions.propsData.title+'...';
          }
        }

        this.selectNode.label =this.modelValue+this.condition+this.conditionValue;
      },
      //枚举时搜索下拉框
      searchSelect(value){
        let params = {};
        params.keyword = value;
        // if ($.trim(this.modelId).length == 0){
        //   params.id = this.boxInitialized.itemId;
        // } else{
        //   params.id = this.modelId;
        // }
        params.id = this.boxInitialized.itemId;
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            this.boxInitialized.inputSelectData = res.rows;
          } else {
            this.inputSelectData = [];
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },

      //线判断条件
      lineCondition(value,option){
        option.componentOptions.propsData.title;
        this.selectEdge.label = option.componentOptions.propsData.title;
      },
      //属性节点后线段属性
      attributeEdge(value, node, extra){
        let _this = this;
        let params = extra.selectedNodes[0].data.props;
        this.selectNode.lo = params.lo
        _this.selectNode.label = params.title;
        _this.selectNode.itemId = params.id;
        if (params.lo == 1){
          _this.edgeInitialized.inputEdge = 'input'
        }else if (params.lo == 2){
          _this.edgeInitialized.inputEdge = 'scopeInput'
        }else if (params.lo == 3){
          _this.edgeInitialized.inputEdge = 'select';
          _this.edgeId = params.id;
          _this.edgeInitialized.itemId = params.id;
          coreRuleNodeSelectColId({id:this.edgeId}).then(res => {
            if (res.code == '200') {
              _this.edgeInitialized.inputEdgeSelect = res.rows;
            } else {
              this.warn(res.msg)
            }
          }).catch(err => {
            this.error(err)
          })
        }
        if (params.colDbType == 1){
          _this.edgeInitialized.inValueEdge = 'number'
        }else if (params.colDbType == 2){
          _this.edgeInitialized.inValueEdge == 'time'
        }else if (params.colDbType == 3){
          _this.edgeInitialized.inValueEdge = 'text'
        }
      },

      //线段输入框input事件
      inputEdgeChange(e){
        this.edgeConditionValue = e.srcElement.value;
        this.selectEdge.label =this.edgeCondition+this.edgeConditionValue;
      },
      //线中下拉事件
      assertValEdge(value,option){
        console.log(this.selectEdge)
        this.selectEdge.lo =3;
        if ($.trim(this.edgeCondition).length==0){
          this.edgeCondition = this.selectEdge.roSymbol;
        }
        this.edgeConditionValue = '';
        for (let key in option){
          if (key < 1){
            this.edgeConditionValue = option[0].componentOptions.propsData.title;
          } else{
            this.edgeConditionValue = option[0].componentOptions.propsData.title+'...';
          }
        }
        this.selectEdge.label =this.edgeCondition+this.edgeConditionValue;
      },
      //线下拉搜索
      searchEdge(value){
        let params = {};
        params.keyword = value;
        // if ($.trim(this.modelId).length == 0){
        //   params.id = this.edgeInitialized.itemId;
        // } else{
        //   params.id = this.edgeId;
        // }
        params.id = this.edgeInitialized.itemId;
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            this.edgeInitialized.inputEdgeSelect = res.rows;
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },

      //线条件选择
      selectEdgeRo(value,option){
        this.edgeCondition = option.componentOptions.propsData.title;
        this.selectEdge.label =this.edgeCondition;
      },
      //多个条件值输入第一个事件
      edgeAssertVal(e){
        // edgeCondition:'',
        //   edgeConditionValue:'',
        this.edgeConditionValue = ''+ e;
        if ($.trim(this.edgeConditionValue1).length==0){
          this.edgeConditionValue1 = ''+ this.selectNode.assertVal1;
        }
        this.selectEdge.label ='范围'+'['+this.edgeConditionValue+'-'+this.edgeConditionValue1+']';
      },
      edgeAssertVal1(e){
        this.edgeConditionValue1 =  ''+e
        if ($.trim(this.edgeConditionValue).length==0){
          this.edgeConditionValue = ''+ this.selectNode.assertVal;
        }
        this.selectEdge.label ='范围'+'['+this.edgeConditionValue+'-'+this.edgeConditionValue1+']';
      },
      getCoreFactAllStart(){
        coreFactColAll({}).then(res => {
          if (res.code == '200') {
            let indexData = this.dealAllStartTree(res.rows);
            this.CoreFactAllTree = this.recursiveNodeTree(indexData, 'undefined');
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
    width: 95px;
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
    width: 95px;
    text-align: center;
    border-left: 0;
    border-radius: 0px;
  }
</style>