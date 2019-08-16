<template>
  <div id="detailpanel" class="detailpanel" ref="dom">
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape != 'model-card-conclusion'">节点属性</div>
      <div class="block-container" v-if="selectNode.shape != 'model-card-conclusion'">
        <a-form>
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input size="small" v-if="selectNode.shape == 'flow-circle-start'" v-model="selectNode.label"
                     :disabled="true"/>
            <a-input size="small" :read-only="true" v-else v-model="selectNode.label"/>
          </a-form-item>
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
          <a-form-item label="结论类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              :dropdownStyle="{ maxHeight: '250px', overflow: 'auto' }"
              :treeData="dicBaseTreeData"
              v-model="selectNode.verdictType"
              treeDefaultExpandAll>
            </a-tree-select>
          </a-form-item>
          <a-form-item label="消息" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" v-model="selectNode.message" :rows="3"/>
          </a-form-item>
          <a-form-item label="建议" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-textarea size="small" v-model="selectNode.suggest" :rows="3"/>
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
          <a-form-item label="逻辑运算" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" class="nodeSelect" v-model="selectNode.lo" @change="logicalChange">
              <a-select-option v-for="item in this.enum.logical" :value=item.id :title=item.text :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item  label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select v-if="selectNode.lo==1" size="small" v-model="selectNode.ro" @select="selectNodeRo">
              <a-select-option :value=1 title="=">等于</a-select-option>
              <a-select-option :value=2 title="≠">不等于</a-select-option>
              <a-select-option :value=3 title="<">小于</a-select-option>
              <a-select-option :value=4 title="≤">小于等于</a-select-option>
              <a-select-option :value=5 title=">">大于</a-select-option>
              <a-select-option :value=6 title="≥">大于等于</a-select-option>
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else-if="selectNode.lo==2" size="small" v-model="selectNode.ro" @select="selectNodeRo">
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else-if="selectNode.lo==3" size="small" v-model="selectNode.ro" @select="selectNodeRo">
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else size="small">
            </a-select>
          </a-form-item>
          <a-form-item label="条件值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input :type="boxInitialized.inValueType" v-if="selectNode.lo==1 && selectNode.colDbType !=2"
                     @change="inputChange" size="small" v-model="selectNode.assertVal"></a-input>
            <div v-else-if="selectNode.lo==2 && selectNode.colDbType !=2">
              <a-input :type="boxInitialized.inValueType" class="inputLeft" size="small" placeholder="最小值"
                       @change="scopeAssertVal" v-model="selectNode.assertVal"/>
              <a-input class="inputCenter" size="small" placeholder="~" disabled/>
              <a-input :type="boxInitialized.inValueType" class="inputRight" size="small" placeholder="最大值"
                       @change="scopeAssertVal1" v-model="selectNode.assertVal1"/>
            </div>
            <div v-else-if="boxInitialized.inputType =='select' && selectNode.lo==3">
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
                <a-select-option v-for="(op,index) in boxInitialized.inputSelectData" :value="op.ID" :title="op.NAME"
                                 :key="index">{{op.NAME}}
                </a-select-option>
              </a-select>
            </div>
            <div v-else-if="boxInitialized.inputType =='treeSelect' && selectNode.lo==3">
              <a-tree-select
                size="small"
                showSearch
                allowClear
                multiple
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData=" boxInitialized.inputSelectData"
                v-model="selectNode.assertValList"
                @change="selectNodeTree"
              >
              </a-tree-select>
            </div>
            <a-date-picker v-else-if="selectNode.lo==1 && selectNode.colDbType ==2"
                           :defaultValue =" selectNode.assertVal? moment(selectNode.assertVal,'YYYY-MM-DD') : null"
                            @change="nodeDatePick"
                           size="small"></a-date-picker>
            <a-range-picker v-else-if="selectNode.lo==2 && selectNode.colDbType ==2"
                            :defaultValue="selectNode.assertVal? [moment(selectNode.assertVal,  'YYYY-MM-DD'), moment(selectNode.assertVal1,  'YYYY-MM-DD')]:null"
                            @change="nodeRangePick" size="small"></a-range-picker>
            <div v-else>
              <a-input size="small"></a-input>
            </div>
          </a-form-item>
          <a-form-item v-if="boxInitialized.inputType =='treeSelect' && selectNode.lo==3 " label="包含下级"
                       :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-checkbox @change="containsChange" value="node" key="1"
                        :checked="selectNode.dataDrilling=='1'? true:false"></a-checkbox>
          </a-form-item>

        </a-form>
      </div>

      <div class="panel-title" v-if="selectNode.shape == 'flow-rhombus-if'">前置条件</div>
      <div class="block-container" v-if="selectNode.shape == 'flow-rhombus-if'">
        <a-form>
          <a-form-item label="范围" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              size="small"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="judgePreDetailData"
              v-model="selectNode.precondition"
              placeholder="默认按当前数据行"
              class="nodeSelect">
            </a-tree-select>
          </a-form-item>
          <a-form-item label="方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select
              size="small"
              allowClear
              disabled
              class="readOnlyInput"
              :showArrow="false"
              v-model="selectNode.calculation"
              @change="selectIfCalculation">
              <a-select-option v-for="item in this.enum.calculation" :value=item.id :title=item.text :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="公式" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-if="selectNode.calculation =='1'" v-model="selectNode.formula">
              <a-select-option v-for="item in this.enum.conOperation" :value=item.id :title=item.text :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
            <a-select size="small" v-else-if="selectNode.calculation==2" v-model="selectNode.formula">
              <a-select-option v-for="(item,index) in this.enum.aggregation" :value=item.id :title=item.text
                               :key="index">
                {{item.text}}
              </a-select-option>
            </a-select>
            <a-select size="small" v-else>
            </a-select>
          </a-form-item>
          <a-form-item v-if="selectNode.calculation==1" label="值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input v-model="selectNode.calculated" size="small"/>
          </a-form-item>
          <a-form-item v-if="selectNode.calculation==2" label="去重" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-checkbox @change="nodeIsRepeat" value="node" key="2"
                        :checked="selectNode.isRepeat=='1'? true:false"></a-checkbox>
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
      <div class="panel-title" v-if="selectNode.shape == 'model-rect-attribute'">前置条件</div>
      <div class="block-container" v-if="selectNode.shape == 'model-rect-attribute'">
        <a-form>
          <a-form-item label="范围" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              size="small"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="preDetailData"
              v-model="selectNode.precondition"
              placeholder="默认按当前数据行"
              treeDefaultExpandAll>
            </a-tree-select>
          </a-form-item>
          <a-form-item label="方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select
              size="small"
              allowClear
              @change="selectCalculation"
              v-model="selectNode.calculation"
            >
              <a-select-option v-for="item in this.enum.calculation" :value=item.id :title=item.text :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="公式" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-if="selectNode.calculation=='1'" v-model="selectNode.formula">
              <a-select-option v-for="(item,index) in this.enum.conOperation" :value=item.id :title=item.text
                               :key="index">
                {{item.text}}
              </a-select-option>
            </a-select>
            <a-select size="small" v-else-if="selectNode.calculation =='2'" v-model="selectNode.formula">
              <a-select-option v-for="(item,index)  in this.enum.aggregation" :value=item.id :title=item.text
                               :key="index">
                {{item.text}}
              </a-select-option>
            </a-select>
            <a-select size="small" v-else>
            </a-select>
          </a-form-item>
          <a-form-item v-if="selectNode.calculation=='1'" label="值" :label-col="{ span: 5 }"
                       :wrapper-col="{ span: 19 }">
            <a-input v-model="selectNode.calculated" size="small"/>
          </a-form-item>
          <a-form-item v-if="selectNode.calculation=='2'" label="去重" :label-col="{ span: 5 }"
                       :wrapper-col="{ span: 19 }">
            <a-checkbox @change="nodeIsRepeat" value="node" key="2"
                        :checked="selectNode.isRepeat=='1'? true:false"></a-checkbox>
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
            <a-select size="small" v-model="selectEdge.assertVal" @select="lineCondition">
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
          <a-form-item label="逻辑运算" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" class="nodeSelect" @change="logicalEdge" v-model="selectEdge.lo">
              <a-select-option v-for="item in this.enum.logical" :value=item.id :title=item.text :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item  label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select v-if="selectEdge.lo == 1" size="small" v-model="selectEdge.ro" @select="selectEdgeRo">
              <a-select-option :value=1 title="=">等于</a-select-option>
              <a-select-option :value=2 title="≠">不等于</a-select-option>
              <a-select-option :value=3 title="<">小于</a-select-option>
              <a-select-option :value=4 title="≤">小于等于</a-select-option>
              <a-select-option :value=5 title=">">大于</a-select-option>
              <a-select-option :value=6 title="≥">大于等于</a-select-option>
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else-if="selectEdge.lo == 2" size="small" v-model="selectEdge.ro" @select="selectNodeRo">
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else-if="selectEdge.lo==3" size="small" v-model="selectEdge.ro" @select="selectNodeRo">
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
            <a-select v-else size="small">
            </a-select>
          </a-form-item>

          <a-form-item label="条件值" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input :type="edgeInitialized.inValueEdge" v-if="selectEdge.lo ==1 && selectEdge.colDbType !=2"
                     @change="inputEdgeChange" size="small" v-model="selectEdge.assertVal"></a-input>
            <div v-else-if="selectEdge.lo ==2 && selectEdge.colDbType !=2">
              <a-input :type="edgeInitialized.inValueEdge" class="inputLeft" size="small" placeholder="最小值"
                       @change="edgeAssertVal" v-model="selectEdge.assertVal"/>
              <a-input-number class="inputCenter" size="small" placeholder="~" disabled/>
              <a-input :type="edgeInitialized.inValueEdge" class="inputRight" size="small" placeholder="最大值"
                       @change="edgeAssertVal1" v-model="selectEdge.assertVal1"/>
            </div>
            <div v-else-if="edgeInitialized.inputEdge =='select' && selectEdge.lo ==3">
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
                <a-select-option v-for="(op,index) in edgeInitialized.inputEdgeSelect" :value="op.ID" :title="op.NAME"
                                 :key="index">{{op.NAME}}
                </a-select-option>
              </a-select>
            </div>
            <div v-else-if="edgeInitialized.inputEdge =='treeSelect' && selectEdge.lo ==3">
<!--              <a-tree-select-->
<!--                size="small"-->
<!--                allowClear-->
<!--                multiple-->
<!--                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"-->
<!--                :treeData=" edgeInitialized.inputEdgeSelect"-->
<!--                v-model="selectEdge.assertValList"-->
<!--                @change="selectEdgeTree"-->
<!--              >-->
<!--              </a-tree-select>-->
              <treeSelect
                :size="'small'"
                style="maxHeight:300px;"
                :vModel="selectEdge.assertValList"
                :optionData="edgeInitialized.viewSelect"
                :treeData="edgeInitialized.inputEdgeSelect"
                :selectChange="edgeSelectChange"
                :treeSelect="edgeTreeSelected"
                :loadData="edgeLoadData"
                :selectedKeys="edgeSelectedKeys"
                :selectSearch="edgeSelectSearch"
              >

              </treeSelect>
            </div>
            <a-date-picker v-else-if="selectEdge.lo==1 && selectEdge.colDbType ==2" size="small"
                           :defaultValue="selectEdge.assertVal? moment(selectEdge.assertVal, 'YYYY-MM-DD'): null"
                           @change="edgeDatePick"></a-date-picker>
            <a-range-picker v-else-if="selectEdge.lo==2 && selectEdge.colDbType ==2" size="small"
                            @change="edgeRangePick"
                            :defaultValue="selectEdge.assertVal ? [moment(selectEdge.assertVal,  'YYYY-MM-DD'), moment(this.selectEdge.assertVal1,  'YYYY-MM-DD')]: null"
                            v-model="selectEdge.assertVal"></a-range-picker>
            <a-input v-else size="small"></a-input>
          </a-form-item>
          <a-form-item v-if="edgeInitialized.inputEdge =='treeSelect' && selectEdge.lo ==3" label="包含下级"
                       :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-checkbox @change="edgeContainsChange" value="edge" key="2"
                        :checked="selectEdge.dataDrilling=='1'? true:false"></a-checkbox>
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
  import { reviewAuditlevelSelect, dicBaseSelectClassList, coreFactColAll, coreRuleNodeSelectColId } from '@/api/login'
  import debounce from 'lodash/debounce'
  import moment from 'moment'

  export default {
    props: ['graphAPI', 'selectNode', 'selectEdge', 'boxInitialized', 'edgeInitialized', 'preData', 'judgePreData'],
    data() {
      this.searchSelect = debounce(this.searchSelect, 500)
      this.searchEdge = debounce(this.searchEdge, 500)
      this.edgeSelectSearch = debounce(this.edgeSelectSearch,500)
      return {
        levelData: [],
        dicBaseTreeData: [],
        CoreFactAllTree: [],
        inputType: 'input',
        inValueType: 'Number',
        inputSelectData: [],
        modelValue: '',
        condition: '',
        conditionValue: '',
        conditionValue1: '',
        //模型id
        modelId: null,
        inputEdge: 'input',
        inValueEdge: 'Number',
        edgeModel: '',
        edgeId: null,
        edgeCondition: '',
        edgeConditionValue: '',
        edgeConditionValue1: '',
        preDetailData: [],
        judgePreDetailData: [],
        calculaStatus: null,
        calculaFhombus: null,
        vModel:[],
        treeData:[],
        edgeSelectedKeys:[],
      }
    },
    watch: {
      preData(newValue, oldValue) {
        if (newValue.length > 0) {
          this.preDetailData = this.preData
        } else {
          this.preDetailData = []
        }
      },
      judgePreData(newValue, oldValue) {
        if (newValue.length > 0) {
          this.judgePreDetailData = this.judgePreData
        } else {
          this.judgePreDetailData = []
        }
      }
    },
    mounted() {
      this.getReviewLevel()
      this.getSelectClassList()
      this.getCoreFactAllStart()
    },
    methods: {
      moment,
      sourceName(value, option) {
        this.selectNode.sourcename = option.componentOptions.propsData.title
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
        this.selectNode.levelColor = option.componentOptions.propsData.title
        this.selectNode.levels = '' + option.componentOptions.propsData.value
      },
      getSelectClassList() {
        dicBaseSelectClassList({ codeClass: '7', status: '1' }).then(res => {
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
              value: '' + data[key].id,
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
                isLeaf: true
              })
            }
          }
        }
        this.dicBaseTreeData = treeData
      },
      coreFactTreeChange(value, node, extra) {
        this.selectNode.precondition = null
        this.selectNode.assertVal1 = null
        this.selectNode.assertVal = null
        let params = extra.selectedNodes[0].data.props
        let _this = this
        _this.selectNode.itemId = params.id
        if (params.lo == 1) {
          this.boxInitialized.inputType = 'input'
        } else if (params.lo == 2) {
          this.boxInitialized.inputType = 'scopeInput'
        } else if (params.lo == 3 && $.trim(params.parentId).length == 0) {
          this.boxInitialized.inputType = 'select'
          this.boxInitialized.itemId = ''+params.id
          coreRuleNodeSelectColId({ id: params.id }).then(res => {
            if (res.code == '200') {
              this.boxInitialized.inputSelectData = []
              for (let key in res.rows) {
                this.boxInitialized.inputSelectData.push({
                  ID: res.rows[key][params.val],
                  NAME: res.rows[key][params.display]
                })
              }
            } else {
              this.warn(res.msg)
              this.boxInitialized.inputSelectData = []
            }
          }).catch(err => {
            this.error(err)
          })
        } else if (params.lo == 3 && $.trim(params.parentId).length > 0) {
          this.boxInitialized.inputType = 'treeSelect'
          this.boxInitialized.itemId = ''+params.id
          let paramsNodeData = { id: params.id }
          coreRuleNodeSelectColId(paramsNodeData).then(res => {
            if (res.code == '200') {
              let listData = []
              this.boxInitialized.inputSelectData = []
              for (let key in res.rows) {
                listData.push({
                  ID: res.rows[key][params.val],
                  NAME: res.rows[key][params.display],
                  PID: res.rows[key][params.parentId]
                })
              }
              this.boxInitialized.inputSelectData = this.dealValTree(listData, undefined)
            } else {
              this.warn(res.msg)
              this.boxInitialized.inputSelectData = []
            }
          }).catch(err => {
            this.error(err)
          })
        }


        if (params.colDbType == 1) {
          this.boxInitialized.inValueType = 'number'
        } else if (params.colDbType == 2) {
          this.boxInitialized.inputType == 'time'
        } else if (params.colDbType == 3) {
          this.boxInitialized.inValueType = 'text'
        }
        _this.selectNode.lo = params.lo
        _this.selectNode.ro = null
        _this.selectNode.colDbType = params.colDbType
        this.modelValue = params.title
        _this.selectNode.label = this.modelValue
        _this.selectNode.assertVal = null
        _this.selectNode.assertVal1 = null
        _this.selectNode.assertValList = []
        this.condition = ''
        this.conditionValue = ''
        this.conditionValue1 = ''
        this.judgePreDetailData = []
        this.preDetailData = []
        for (let key in this.CoreFactAllTree) {
          if (params.pid == this.CoreFactAllTree[key].id) {
            this.judgePreDetailData.push(this.CoreFactAllTree[key])
          }
        }
      },
      //判断节点条件选择事件
      selectNodeRo(value, option) {
        this.condition = option.componentOptions.propsData.title
        if ($.trim(this.modelValue).length == 0) {
          this.modelValue = this.selectNode.itemName
        }
        this.selectNode.ro = value
        this.selectNode.label = this.modelValue + this.condition + this.conditionValue
      },
      //条件值单个输入事件
      inputChange(e) {
        this.conditionValue = e.srcElement.value
        if ($.trim(this.modelValue).length == 0) {
          this.modelValue = this.selectNode.itemName
        }
        this.selectNode.label = this.modelValue + this.condition + this.conditionValue
      },
      //多个条件值输入第一个事件
      scopeAssertVal(e) {
        this.conditionValue = e.srcElement.value
        if ($.trim(this.modelValue).length == 0) {
          this.modelValue = this.selectNode.itemName
        }
        if ($.trim(this.conditionValue1).length == 0) {
          this.conditionValue1 = this.selectNode.assertVal1
        }
        this.selectNode.label = this.modelValue + '[' + this.conditionValue + '-' + this.conditionValue1 + ']'
      },
      scopeAssertVal1(e) {
        this.conditionValue1 = e.srcElement.value
        if ($.trim(this.modelValue).length == 0) {
          this.modelValue = this.selectNode.itemName
        }
        if ($.trim(this.conditionValue).length == 0) {
          this.conditionValue = this.selectNode.assertVal
        }
        this.selectNode.label = this.modelValue + '[' + this.conditionValue + '-' + this.conditionValue1 + ']'
      },
      //下拉选择事件
      assertValSelect(value, option) {
        if ($.trim(this.modelValue).length == 0) {
          this.modelValue = this.selectNode.itemName
        }
        if ($.trim(this.condition).length == 0) {
          this.condition = this.selectNode.roSymbol
        }
        this.conditionValue = ''
        for (let key in option) {
          if (key < 1) {
            this.conditionValue = option[0].componentOptions.propsData.title
          } else {
            this.conditionValue = option[0].componentOptions.propsData.title + '...'
          }
        }

        this.selectNode.label = this.modelValue + this.condition + this.conditionValue
      },
      //枚举时搜索下拉框
      searchSelect(value) {
        let params = {}
        params.keyword = value
        // if ($.trim(this.modelId).length == 0){
        //   params.id = this.boxInitialized.itemId;
        // } else{
        //   params.id = this.modelId;
        // }
        params.id = this.boxInitialized.itemId
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            this.boxInitialized.inputSelectData = res.rows
          } else {
            this.inputSelectData = []
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },

      //线判断条件
      lineCondition(value, option) {
        option.componentOptions.propsData.title
        this.selectEdge.label = option.componentOptions.propsData.title
      },
      //属性节点后线段属性
      attributeEdge(value, node, extra) {
        let _this = this
        let params = extra.selectedNodes[0].data.props
        this.selectNode.lo = params.lo
        _this.selectNode.label = params.title
        _this.selectNode.itemId = params.id
        if (params.lo == 1) {
          _this.edgeInitialized.inputEdge = 'input'
        } else if (params.lo == 2) {
          _this.edgeInitialized.inputEdge = 'scopeInput'
        } else if (params.lo == 3 && $.trim(params.parentId).length == 0) {
          _this.edgeInitialized.inputEdge = 'select'
          _this.edgeId = params.id
          _this.edgeInitialized.itemId = ''+params.id
          coreRuleNodeSelectColId({ id: this.edgeId }).then(res => {
            if (res.code == '200') {
              _this.edgeInitialized.inputEdgeSelect = []
              for (let key in res.rows) {
                _this.edgeInitialized.inputEdgeSelect.push({
                  ID: res.rows[key][params.val],
                  NAME: res.rows[key][params.display]
                })
              }
            } else {
              this.warn(res.msg)
            }
          }).catch(err => {
            this.error(err)
          })
        } else if (params.lo == 3 && $.trim(params.parentId).length > 0) {
          _this.edgeInitialized.inputEdge = 'treeSelect'
          _this.edgeId = params.id
          _this.edgeInitialized.itemId = ''+params.id
          coreRuleNodeSelectColId({ id: this.edgeId }).then(res => {
            if (res.code == '200') {
              let list = []
              _this.edgeInitialized.inputEdgeSelect = []
              for (let key in res.rows) {
                list.push({
                  ID: res.rows[key][params.val],
                  NAME: res.rows[key][params.display],
                  PID: res.rows[key][params.parentId]
                })
              }
              _this.edgeInitialized.inputEdgeSelect = this.dealValTree(list, undefined)
            } else {
              this.warn(res.msg)
            }
          }).catch(err => {
            this.error(err)
          })
        }
        if (params.colDbType == 1) {
          _this.edgeInitialized.inValueEdge = 'number'
        } else if (params.colDbType == 2) {
          _this.edgeInitialized.inValueEdge == 'time'
        } else if (params.colDbType == 3) {
          _this.edgeInitialized.inValueEdge = 'text'
        }
        this.preDetailData = []
        for (let key in this.CoreFactAllTree) {
          if (params.pid == this.CoreFactAllTree[key].id) {
            this.preDetailData.push(this.CoreFactAllTree[key])
          }
        }
      },

      //线段输入框input事件
      inputEdgeChange(e) {
        this.edgeConditionValue = e.srcElement.value
        this.selectEdge.label = this.edgeCondition + this.edgeConditionValue
      },
      //线中下拉事件
      assertValEdge(value, option) {
        this.selectEdge.lo = 3
        if ($.trim(this.edgeCondition).length == 0) {
          this.edgeCondition = this.selectEdge.roSymbol
        }
        this.edgeConditionValue = ''
        for (let key in option) {
          if (key < 1) {
            this.edgeConditionValue = option[0].componentOptions.propsData.title
          } else {
            this.edgeConditionValue = option[0].componentOptions.propsData.title + '...'
          }
        }
        this.selectEdge.label = this.edgeCondition + this.edgeConditionValue
      },
      //线下拉搜索
      searchEdge(value) {
        let params = {}
        params.keyword = value
        params.id = this.edgeInitialized.itemId
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            this.edgeInitialized.inputEdgeSelect = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //线条件选择
      selectEdgeRo(value, option) {
        this.edgeCondition = option.componentOptions.propsData.title
        this.selectEdge.label = this.edgeCondition
      },
      //多个条件值输入第一个事件
      edgeAssertVal(e) {
        this.edgeConditionValue = '' + e
        if ($.trim(this.edgeConditionValue1).length == 0) {
          this.edgeConditionValue1 = '' + this.selectNode.assertVal1
        }
        this.selectEdge.label = '范围' + '[' + this.edgeConditionValue + '-' + this.edgeConditionValue1 + ']'
      },
      edgeAssertVal1(e) {
        this.edgeConditionValue1 = '' + e
        if ($.trim(this.edgeConditionValue).length == 0) {
          this.edgeConditionValue = '' + this.selectNode.assertVal
        }
        this.selectEdge.label = '范围' + '[' + this.edgeConditionValue + '-' + this.edgeConditionValue1 + ']'
      },
      getCoreFactAllStart() {
        coreFactColAll({}).then(res => {
          if (res.code == '200') {
            let indexData = this.dealAllStartTree(res.rows)
            this.CoreFactAllTree = this.recursiveNodeTree(indexData, undefined)
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //处理模型字段
      dealAllStartTree(list) {
        let indexData = {}
        for (let key in list) {
          let children = indexData[list[key].pid]
          if (children instanceof Array) {
            children.push({
              title: list[key].colName,
              value: '' + list[key].id,
              key: '' + list[key].id,
              disabled: list[key].isleaf ? true : false,
              id: '' + list[key].id,
              pid: ''+list[key].pid,
              lo: list[key].lo,
              val: list[key].val,
              display: list[key].display,
              parentId: list[key].parentId,
              colDbType: list[key].colDbType
            })
          } else {
            children = [{
              title: list[key].colName,
              value: '' +list[key].id,
              key: '' + list[key].id,
              disabled: list[key].isleaf ? true : false,
              id: '' + list[key].id,
              pid:''+ list[key].pid,
              lo: list[key].lo,
              val: list[key].val,
              display: list[key].display,
              parentId: list[key].parentId,
              colDbType: list[key].colDbType
            }]
          }
          indexData[list[key].pid] = children
        }
        return indexData
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
      //撰取数据
      containsChange(e) {
        if (e.target.checked) {
          this.selectNode.dataDrilling = '1'
        } else {
          this.selectNode.dataDrilling = '0'
        }
      },
      edgeContainsChange(e) {
        if (e.target.checked) {
          this.selectEdge.dataDrilling = '1'
        } else {
          this.selectEdge.dataDrilling = '0'
        }
      },
      //去重判断
      nodeIsRepeat(e) {
        if (e.target.checked) {
          this.selectNode.isRepeat = '1'
        } else {
          this.selectNode.isRepeat = '0'
        }
      },
      edgeIsRepeat(e) {
        if (e.target.checked) {
          this.selectEdge.isRepeat = '1'
        } else {
          this.selectEdge.isRepeat = '0'
        }
      },
      selectNodeTree(value, option) {
        if ($.trim(this.modelValue).length == 0) {
          this.modelValue = this.selectNode.itemName
        }
        if ($.trim(this.condition).length == 0) {
          this.condition = this.selectNode.roSymbol
        }
        this.conditionValue = ''
        for (let key in option) {
          if (key < 1) {
            this.conditionValue = option[0]
          } else {
            this.conditionValue = option[0] + '...'
          }
        }

        this.selectNode.label = this.modelValue + this.condition + this.conditionValue
      },
      selectEdgeTree(value, option) {
        this.selectEdge.lo = 3
        if ($.trim(this.edgeCondition).length == 0) {
          this.edgeCondition = this.selectEdge.roSymbol
        }
        this.edgeConditionValue = ''
        for (let key in option) {
          if (key < 1) {
            this.edgeConditionValue = option[0]
          } else {
            this.edgeConditionValue = option[0] + '...'
          }
        }
        this.selectEdge.label = this.edgeCondition + this.edgeConditionValue
      },

      searchEdgeTree(value){
        let _this = this;
        let params = {}
        params.id = _this.edgeInitialized.edgeTreeData.itemId;
        params.keyword = value
        params.valueList = this.selectEdge.assertValList;
        params.val = _this.edgeInitialized.edgeTreeData.val;
        params.display = _this.edgeInitialized.edgeTreeData.display;
        params.parentId = _this.edgeInitialized.edgeTreeData.parentId;
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            let list = []
            _this.edgeInitialized.inputEdgeSelect = []
            for (let key in res.rows) {
              list.push({
                ID: res.rows[key][ _this.edgeInitialized.edgeTreeData.val],
                NAME: res.rows[key][ _this.edgeInitialized.edgeTreeData.display],
                PID: res.rows[key][ _this.edgeInitialized.edgeTreeData.parentId]
              })
            }
            _this.edgeInitialized.inputEdgeSelect = this.dealValTree(list, undefined)
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      dealValTree(data, pid) {
        var items = []
        for (var key in data) {
          var item = data[key]
          if (pid == item.PID) {
            items.push({
              title: item.NAME,
              value: item.ID,
              key: item.ID,
              children: this.dealValTree(data, item.ID)
            })
          }
        }
        return items
      },

      //节点时间选择
      nodeDatePick(date, dateString) {
        if (date) {
          this.selectNode.assertVal = '' + date.format('YYYY-MM-DD HH:mm')
        }
      },
      //节点时间范围选择
      nodeRangePick(date, dateString) {
        if (date.length > 0) {
          this.selectNode.assertVal = '' + date[0].format('YYYY-MM-DD')
          this.selectNode.assertVal1 = '' + date[1].format('YYYY-MM-DD')
        }
      },

      //线时间选择
      edgeDatePick(date){
        if (date) {
          this.selectEdge.assertVal = '' + date.format('YYYY-MM-DD HH:mm')
        }
      },

      //线时间范围选择
      edgeRangePick(date, dateString) {
        if (date.length > 0) {
          this.selectEdge.assertVal = '' + date[0].format('YYYY-MM-DD')
          this.selectEdge.assertVal1 = '' + date[1].format('YYYY-MM-DD')
        }
      },
      //计算方式
      selectCalculation(value) {
        this.selectNode.formula = null
        this.selectNode.calculated = ''
        this.selectNode.isRepeat = null
      },
      //判断条件计算方式
      selectIfCalculation(value) {
        this.selectNode.formula = null
        this.selectNode.calculated = ''
        this.selectNode.isRepeat = null
      },
      logicalChange(value) {
        console.log(value, 'value')
        this.selectNode.lo = value
        this.selectNode.ro = 7
      },
      logicalEdge(value) {
        this.selectEdge.lo = value
        this.selectEdge.ro = 7
      },


      edgeSelectChange(value){
        this.edgeSelectedKeys = value;
        this.selectEdge.assertValList = value;
      },
      edgeTreeSelected(value){
        console.log(value);
        this.edgeSelectedKeys = value;
        this.selectEdge.assertValList = value;
      },
      edgeLoadData(treeNode){
        let _this = this;
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            let params = {}
            params.parentId = _this.edgeInitialized.edgeTreeData.parentId
            params.parentValue= treeNode.dataRef.key
            params.id= _this.edgeInitialized.edgeTreeData.itemId
            coreRuleNodeSelectColId(params).then(res => {
                if (res.code == '200') {
                  treeNode.dataRef.children = []
                  for (let i in res.rows) {
                    treeNode.dataRef.children.push({
                    key:res.rows[i][_this.edgeInitialized.edgeTreeData.val],title:res.rows[i][_this.edgeInitialized.edgeTreeData.display]
                    })
                    _this.edgeInitialized.viewSelect.push({
                      key:res.rows[i][_this.edgeInitialized.edgeTreeData.val],title:res.rows[i][_this.edgeInitialized.edgeTreeData.display]
                    })
                  }
                  console.log( treeNode.dataRef.children,'3344')
                  _this.edgeInitialized.inputEdgeSelect = [..._this.edgeInitialized.inputEdgeSelect]
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.error(err)
              })
            resolve()
          }, 100)
        })
      },
      //线树形搜索框事件
      edgeSelectSearch(value){
        let _this = this;
       console.log(value,'value');
            let params = {}
            params.id= _this.edgeInitialized.edgeTreeData.itemId
        params.val= _this.edgeInitialized.edgeTreeData.val
        params.name = _this.edgeInitialized.edgeTreeData.display
        params.keyword = value
            coreRuleNodeSelectColId(params).then(res => {
              if (res.code == '200') {
                _this.edgeInitialized.inputEdgeSelect = []
                for (let i in res.rows) {
                  _this.edgeInitialized.inputEdgeSelect.push({
                    key:res.rows[i][_this.edgeInitialized.edgeTreeData.val],title:res.rows[i][_this.edgeInitialized.edgeTreeData.display]
                  })
                  _this.edgeInitialized.viewSelect.push({
                    key:res.rows[i][_this.edgeInitialized.edgeTreeData.val],title:res.rows[i][_this.edgeInitialized.edgeTreeData.display]
                  })
                }
              } else {
                this.warn(res.msg)
              }
            })
              .catch(err => {
                this.error(err)
              })
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
    width: 350px;
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