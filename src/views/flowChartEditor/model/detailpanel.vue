<template>
  <div id="detailpanel" class="detailpanel" ref="dom">
    <div data-status="node-selected" class="pannel" id="node_detailpannel" style="display: none;">
      <div class="panel-title" v-if="selectNode.shape != 'model-card-conclusion'">节点属性</div>
      <div class="block-container" v-if="selectNode.shape != 'model-card-conclusion'">
        <a-form>
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-input size="small" v-if="selectNode.shape == 'flow-circle-start'" v-model="selectNode.label"
                     :disabled="true"/>
            <a-input size="small" v-else v-model="selectNode.label"/>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div data-status="node-selected" class="pannel" style="display: none;">
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
      <!--判断节点和属性节点-->
      <div class="panel-title"
           v-if="selectNode.shape == 'flow-rhombus-if' || selectNode.shape == 'model-rect-attribute'">规则属性
      </div>
      <div class="block-container"
           v-if="selectNode.shape == 'flow-rhombus-if' || selectNode.shape == 'model-rect-attribute'">
        <a-form>
          <a-form-item label="模型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
                       v-if="selectNode.shape == 'flow-rhombus-if'">
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
          <a-form-item label="模型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
                       v-if="selectNode.shape == 'model-rect-attribute'">
            <a-tree-select
              size="small"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="CoreFactAllTree"
              v-model="selectNode.itemId"
              @select="attributeEdge"
              treeDefaultExpandAll>
            </a-tree-select>
          </a-form-item>
          <div v-if="selectNode.shape == 'flow-rhombus-if'">
            <a-form-item label="逻辑运算" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select size="small" class="nodeSelect" v-model="selectNode.lo" @change="logicalChange">
                <a-select-option v-for="item in this.enum.logical" :value=item.id :title=item.text :key="item.id">
                  {{item.text}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select size="small" v-model="selectNode.ro" @select="selectNodeRo">
                <a-select-option v-if="selectNode.lo==1" v-for="(item,index) in this.enum.condition" :value="item.id"
                                 :title="item.title" :key="index">
                  {{item.text}}
                </a-select-option>
                <a-select-option :value=7 title="包含">包含</a-select-option>
                <a-select-option :value=8 title="不包含">不包含</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="计算条件" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-tree-select
                size="small"
                :allowClear="true"
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData="judgePreDetailData"
                v-model="selectNode.rearCondition"
                @change="rearChange"
                placeholder="默认按当前数据行"
                class="nodeSelect">
              </a-tree-select>
            </a-form-item>
            <a-form-item v-if="!selectNode.rearCondition" label="条件值" :label-col="{ span: 5 }"
                         :wrapper-col="{ span: 19 }">
              <a-input :type="boxInitialized.inValueType" v-if="selectNode.lo==1 && selectNode.colDbType !=2" size="small" v-model="selectNode.assertVal"></a-input>
              <div v-else-if="selectNode.lo==2 && selectNode.colDbType !=2">
                <a-input :type="boxInitialized.inValueType" class="inputLeft" size="small" placeholder="最小值" v-model="selectNode.assertVal"/>
                <a-input class="inputCenter" size="small" placeholder="~" disabled/>
                <a-input :type="boxInitialized.inValueType" class="inputRight" size="small" placeholder="最大值" v-model="selectNode.assertVal1"/>
              </div>
              <div v-else-if="boxInitialized.inputType =='select' && selectNode.lo==3">
                <a-select
                  size="small"
                  v-model="selectNode.assertValList"
                  showSearch
                  mode="multiple"
                  @search="searchSelect"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  :maxTagCount="3"
                  :open="nodeSelectOpen"
                  @dropdownVisibleChange="nodeDropdownVisible"
                >
                  <span slot="maxTagPlaceholder" class="primary" @click="nodeSelectMaxTag">查看更多</span>
                  <a-select-option v-for="(op,index) in boxInitialized.inputSelectData" :value="op.ID" :title="op.NAME"
                                   :key="index">{{op.NAME}}
                  </a-select-option>
                </a-select>
              </div>
              <div v-else-if="boxInitialized.inputType =='treeSelect' && selectNode.lo==3">
                <treeSelect
                  :size="'small'"
                  style="maxHeight:300px;z-index: 100"
                  :vModel="selectNode.assertValList"
                  :optionData="boxInitialized.viewSelect"
                  :treeData="boxInitialized.inputSelectData"
                  :selectChange="nodeTreeSelectChange"
                  :treeSelect="nodeTreeSelected"
                  :loadData="nodeTreeLoadData"
                  :loadedKeys="nodeLoadedKeys"
                  :load="nodeTreeLoad"
                  :selectedKeys="selectNode.assertValList"
                  :selectSearch="nodeTreeSelectSearch"
                  :treeMoreTag="nodeTreeSelectMaxTag"
                >
                </treeSelect>
              </div>
              <a-date-picker v-else-if="selectNode.lo==1 && selectNode.colDbType ==2"
                             :defaultValue=" selectNode.assertVal? moment(selectNode.assertVal,'YYYY-MM-DD') : null"
                             @change="nodeDatePick"
                             size="small"></a-date-picker>
              <a-range-picker v-else-if="selectNode.lo==2 && selectNode.colDbType ==2"
                              :defaultValue="selectNode.assertVal? [moment(selectNode.assertVal,  'YYYY-MM-DD'), moment(selectNode.assertVal1,  'YYYY-MM-DD')]:null"
                              @change="nodeRangePick" size="small"></a-range-picker>
              <div v-else>
                <a-input size="small"></a-input>
              </div>
            </a-form-item>
            <a-form-item
              v-if="boxInitialized.inputType =='treeSelect' && selectNode.lo==3 && !selectNode.rearCondition "
              label="包含下级"
              :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-checkbox @change="nodeContainsChange" value="node" key="1"
                          :checked="selectNode.dataDrilling=='1'? true:false"></a-checkbox>
            </a-form-item>
          </div>
        </a-form>
      </div>
      <!--属性节点-->
      <!--前置条件-->
      <div class="panel-title"
           v-if="selectNode.shape == 'flow-rhombus-if' || selectNode.shape =='model-rect-attribute'">前置条件
      </div>
      <div class="block-container"
           v-if="selectNode.shape == 'flow-rhombus-if' || selectNode.shape =='model-rect-attribute'">
        <a-form>
          <a-form-item label="范围" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              size="small"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="judgePreDetailData"
              v-model="selectNode.precondition"
              placeholder="默认按当前数据行"
              class="nodeSelect"
              @select="nodePreSelect"
              @change="nodePreChange"
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item label="方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select
              size="small"
              :allowClear="true"
              :showArrow="false"
              v-model="selectNode.calculation"
              @change="selectIfCalculation">
              <a-select-option v-if="selectNode.precondition" value='2' title='聚合'>聚合</a-select-option>
              <a-select-option v-else value='1' title='常量'>
                常量
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="公式" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectNode.formula" allowClear>
              <a-select-option v-if="selectNode.calculation =='1'" v-for="item in this.enum.conOperation" :value=item.id
                               :title=item.text :key="item.id">{{item.text}}
              </a-select-option>
              <a-select-option v-if="selectNode.calculation=='2'" v-for="(item,index) in this.enum.aggregation"
                               :value=item.id :title=item.text :key="index">
                {{item.text}}
              </a-select-option>
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

    <div data-status="edge-selected" class="pannel" style="display: none;">
      <div class="panel-title">线属性</div>
      <div class="block-container">
        <div class="p name">
          名称：
          <a-input size="small" v-model="selectEdge.label"></a-input>
        </div>
      </div>
      <div class="panel-title"
           v-if="selectEdge.sourceType=='flow-rhombus-if' || selectEdge.sourceType=='model-rect-attribute'">规则属性
      </div>
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
      <div class="block-container" v-if="selectEdge.sourceType=='model-rect-attribute'">
        <a-form>
          <a-form-item label="逻辑运算" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" class="nodeSelect" @change="logicalEdge" v-model="selectEdge.lo">
              <a-select-option v-for="item in this.enum.logical" :value=item.id :title=item.text :key="item.id">
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="条件关系" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-select size="small" v-model="selectEdge.ro" @select="selectEdgeRo">
              <a-select-option v-if="selectEdge.lo==1" v-for="(item,index) in this.enum.condition" :value="item.id"
                               :title="item.title" :key="index">
                {{item.text}}
              </a-select-option>
              <a-select-option :value=7 title="包含">包含</a-select-option>
              <a-select-option :value=8 title="不包含">不包含</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="计算条件" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
            <a-tree-select
              size="small"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="preDetailData"
              v-model="selectEdge.rearCondition"
              @change="nodeRearChange"
              placeholder="默认按当前数据行"
              treeDefaultExpandAll>
            </a-tree-select>
          </a-form-item>

          <a-form-item v-if="!selectEdge.rearCondition" label="条件值" :label-col="{ span: 5 }"
                       :wrapper-col="{ span: 19 }">
            <a-input :type="edgeInitialized.inValueEdge" v-if="edgeInitialized.lo ==1 && edgeInitialized.colDbType !=2"
                     @change="inputEdgeChange" size="small" v-model="selectEdge.assertVal"></a-input>
            <div v-else-if="edgeInitialized.lo ==2 && edgeInitialized.colDbType !=2">
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
                :maxTagCount="3"
                :open="edgeSelectOpen"
                @dropdownVisibleChange="edgeDropdownVisible"
              >
                <span slot="maxTagPlaceholder" class="primary" @click="edgeSelectMaxTag">查看更多</span>
                <a-select-option v-for="(op,index) in edgeInitialized.inputEdgeSelect" :value="op.ID" :title="op.NAME"
                                 :key="index">{{op.NAME}}
                </a-select-option>
              </a-select>
            </div>
            <div v-else-if="edgeInitialized.inputEdge =='treeSelect' && selectEdge.lo ==3">
              <treeSelect
                :size="'small'"
                style="maxHeight:300px;z-index: 100"
                :vModel="selectEdge.assertValList"
                :optionData="edgeInitialized.viewSelect"
                :treeData="edgeInitialized.inputEdgeSelect"
                :selectChange="edgeTreeSelectChange"
                :treeSelect="edgeTreeSelected"
                :loadData="edgeTreeLoadData"
                :loadedKeys="edgeLoadedKeys"
                :load="edgeTreeLoad"
                :selectedKeys="selectEdge.assertValList"
                :selectSearch="edgeTreeSelectSearch"
                :treeMoreTag="edgeTreeSelectMaxTag"
              >
              </treeSelect>
            </div>
            <a-date-picker v-else-if="edgeInitialized.lo==1 && edgeInitialized.colDbType=='2'" size="small"
                           :defaultValue="selectEdge.assertVal? moment(selectEdge.assertVal, 'YYYY-MM-DD'): null"
                           @change="edgeDatePick"></a-date-picker>
            <a-range-picker v-else-if="edgeInitialized.lo==2 && edgeInitialized.colDbType=='2'" size="small"
                            @change="edgeRangePick"
                            :defaultValue="selectEdge.assertVal ? [moment(selectEdge.assertVal,  'YYYY-MM-DD'), moment(this.selectEdge.assertVal1,  'YYYY-MM-DD')]: null"
                            v-model="selectEdge.assertVal"></a-range-picker>
            <a-input v-else size="small"></a-input>
          </a-form-item>
          <a-form-item v-if="edgeInitialized.inputEdge =='treeSelect' && edgeInitialized.lo ==3 && !selectEdge.rearCondition"
                       label="包含下级"
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

    <valueListModal
      :title="modalTitle"
      v-if="modalVisible"
      :visibled="modalVisible"
      :cancel="modalCancel"
      :ok="modalOkl"
      :fullData="fullData"
      :initialized="initialized"
      :assertValList="valueList"
    />

  </div>

</template>

<script>
  import { reviewAuditlevelSelect, dicBaseSelectClassList, coreFactColAll, coreRuleNodeSelectColId } from '@/api/login'
  import debounce from 'lodash/debounce'
  import moment from 'moment'
  import valueListModal from './valueListModal'

  export default {
    props: ['graphAPI', 'selectNode', 'selectEdge', 'boxInitialized', 'edgeInitialized', 'preData', 'judgePreData'],
    components: {
      'valueListModal': valueListModal
    },
    data() {
      this.searchSelect = debounce(this.searchSelect, 500)
      this.searchEdge = debounce(this.searchEdge, 500)
      this.edgeTreeSelectSearch = debounce(this.edgeTreeSelectSearch, 500)
      this.nodeTreeSelectSearch = debounce(this.nodeTreeSelectSearch, 500)

      return {
        levelData: [],
        dicBaseTreeData: [],
        CoreFactAllTree: [],
        inputSelectData: [],
        edgeId: null,
        edgeCondition: '',
        edgeConditionValue: '',
        edgeConditionValue1: '',
        preDetailData: [],
        judgePreDetailData: [],
        vModel: [],
        treeData: [],
        nodeSelectedKeys: [],
        modalVisible: false,
        modalTitle: '',
        valueList: [],
        fullData: {},
        initialized: {},
        edgeSelectOpen: false,
        nodeSelectOpen: false,
        nodeLoadedKeys: [],
        edgeLoadedKeys: [],
      }
    },
    watch: {
      preData(newValue) {
        if (newValue.length > 0) {
          this.preDetailData = this.preData
        } else {
          this.preDetailData = []
        }
      },
      judgePreData(newValue) {
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
        this.selectNode.assertValList = []
        let params = extra.selectedNodes[0].data.props
        let _this = this
        _this.selectNode.itemId = params.id
        if (params.lo == 3 && this.$util.trim(params.parentId) == null) {
          this.boxInitialized.inputType = 'select'
          this.boxInitialized.itemId = '' + params.id
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
        } else if (params.lo == 3 && this.$util.trim(params.parentId)) {
          this.boxInitialized.inputType = 'treeSelect'
          this.boxInitialized.itemId = '' + params.id
          this.boxInitialized.val = params.val
          this.boxInitialized.display = params.display
          this.boxInitialized.parentId = params.parentId
          this.boxInitialized.itemId = params.itemId
          coreRuleNodeSelectColId({id: params.id, val:params.val, display:params.display, parentId:params.parentId}).then(res => {
            if (res.code == '200') {
              this.boxInitialized.inputSelectData = []
              this.boxInitialized.viewSelect = []
              for (let key in res.rows) {
                this.boxInitialized.inputSelectData.push({
                  key: res.rows[key][params.val],
                  title: res.rows[key][params.display]
                })
                this.boxInitialized.viewSelect.push({
                  key: res.rows[key][params.val],
                  title: res.rows[key][params.display]
                })
              }
            } else {
              this.warn(res.msg)
              this.boxInitialized.inputSelectData = []
              this.boxInitialized.viewSelect = []
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
        _this.selectNode.label = params.title
        _this.selectNode.assertVal = null
        _this.selectNode.assertVal1 = null
        _this.selectNode.assertValList = []
        _this.selectNode.val = params.val
        _this.selectNode.display = params.display
        _this.selectNode.parentId = params.parentId
        this.judgePreDetailData = []
        this.preDetailData = []
        //处理节点上计算条件数据
        for (let key in this.CoreFactAllTree) {
          if (params.pid == '15') {
            this.judgePreDetailData.push(this.CoreFactAllTree[key])
          }
        }
      },
      //判断节点条件选择事件
      selectNodeRo(value, option) {
        this.selectNode.ro = value
      },
      //枚举时搜索下拉框
      searchSelect(value) {
        let _this = this;
        let params = {}
        params.keyword = value
        params.val = _this.boxInitialized.val
        params.display = _this.boxInitialized.display
        params.parentId = _this.boxInitialized.parentId
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
        this.selectEdge.label = option.componentOptions.propsData.title
      },
      selectEdgeRo(value, option) {
        this.edgeCondition = option.componentOptions.propsData.title
        this.selectEdge.ro = value
        this.selectEdge.label = this.edgeCondition + this.edgeConditionValue + this.edgeConditionValue1
      },
      //属性节点后线段属性
      attributeEdge(value, node, extra) {
        let _this = this;
        let params = extra.selectedNodes[0].data.props
        _this.selectNode.lo = params.lo
        _this.selectNode.label = params.title
        _this.selectNode.colDbType = params.colDbType
        _this.selectNode.itemId = params.id
        _this.selectNode.precondition = null
        _this.selectNode.lo = params.lo
        _this.selectNode.val = params.val
        _this.selectNode.display = params.display
        _this.selectNode.parentId = params.parentId
        if (params.lo == 1) {
          this.edgeInitialized.inputEdge = 'input'
        } else if (params.lo == 2) {
          this.edgeInitialized.inputEdge = 'scopeInput'
        } else if (params.lo == 3 && this.$util.trim(params.parentId) == null) {
          this.edgeInitialized.inputEdge = 'select'
          this.edgeId = params.id
          this.edgeInitialized.itemId = '' + params.id
        } else if (params.lo == 3 && this.$util.trim(params.parentId)) {
          this.edgeInitialized.inputEdge = 'treeSelect'
          this.edgeId = params.id
          this.edgeInitialized.itemId = '' + params.id
        }
        //线上计算条件处理
        this.preDetailData = []
        for (let key in this.CoreFactAllTree) {
          if (params.pid == '15') {
            this.preDetailData.push(this.CoreFactAllTree[key])
          }
        }
      },

      //线段输入框input事件
      inputEdgeChange(e) {
        this.edgeConditionValue = this.selectEdge.assertVal
        this.selectEdge.label = this.edgeCondition + this.edgeConditionValue
      },
      //线上选择框change事件
      assertValEdge(value, option) {
        this.selectEdge.lo = 3
        if (!this.edgeCondition) {
          this.edgeCondition = this.selectEdge.roSymbol
        }
        for (let key in option) {
          if (key < 1) {
            this.edgeConditionValue = option[0].componentOptions.propsData.title
          }
        }
        this.selectEdge.label = this.edgeCondition + this.edgeConditionValue
      },
      //线上选择框搜索
      searchEdge(value) {
        let params = {}
        params.keyword = value
        params.id = this.edgeInitialized.itemId
        params.val = this.edgeInitialized.val
        params.name = this.edgeInitialized.display
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

      //多个条件值输入第一个事件
      edgeAssertVal() {
        this.selectEdge.label = []
        this.edgeConditionValue = this.selectEdge.assertVal
        this.selectEdge.label = this.edgeCondition + '[' + this.edgeConditionValue + '-' + this.edgeConditionValue1 + ']'
      },
      edgeAssertVal1() {
        this.selectEdge.label = []
        this.edgeConditionValue1 = this.selectEdge.assertVal1
        this.selectEdge.label = this.edgeCondition + '[' + this.edgeConditionValue + '-' + this.edgeConditionValue1 + ']'
      },
      //获取模型数据
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
              pid: '' + list[key].pid,
              lo: list[key].lo,
              val: list[key].val,
              display: list[key].display,
              parentId: list[key].parentId,
              colDbType: list[key].colDbType
            })
          } else {
            children = [{
              title: list[key].colName,
              value: '' + list[key].id,
              key: '' + list[key].id,
              disabled: list[key].isleaf ? true : false,
              id: '' + list[key].id,
              pid: '' + list[key].pid,
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
      //节点包含下级
      nodeContainsChange(e) {
        if (e.target.checked) {
          this.selectNode.dataDrilling = '1'
        } else {
          this.selectNode.dataDrilling = '0'
        }
      },
      //线包含下级
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
      edgeDatePick(date) {
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
      //判断条件计算方式
      selectIfCalculation(value) {
        this.selectNode.formula = null
        this.selectNode.calculated = ''
        this.selectNode.isRepeat = null
      },
      //节点上逻辑运算事件
      logicalChange(value) {
        let _this = this;
        _this.selectNode.lo = value
        _this.selectNode.ro = 7
        if (value ==3){
          if (_this.boxInitialized.parentId){
            _this.boxInitialized.inputType ='treeSelect'
          }else{
            _this.boxInitialized.inputType ='select'
          }
        }
      },
      //线上逻辑运算事件
      logicalEdge(value) {
        this.selectEdge.lo = value
        this.selectEdge.ro = 7
        this.edgeInitialized.lo = value
        if (value ==3){
          if (this.edgeInitialized.parentId){
            this.edgeInitialized.inputEdge ='treeSelect'
          }else{
            this.edgeInitialized.inputEdge ='select'
          }
        }
      },

      /**
       * @线上树形选择框
       *
       */
      edgeTreeSelectChange(value) {
        this.selectEdge.assertValList = value
      },
      edgeTreeSelected(value, option) {
        this.selectEdge.assertValList = value
        this.edgeConditionValue = option.selectedNodes[0].data.props.title
        this.selectEdge.label = this.edgeCondition +this.edgeConditionValue
      },
      //线上树形结构异步加载事件
      edgeTreeLoadData(treeNode) {
        let _this = this
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            let params = {}
            params.parentId = _this.edgeInitialized.parentId
            params.parentValue = treeNode.dataRef.key
            params.id = _this.edgeInitialized.itemId
            coreRuleNodeSelectColId(params).then(res => {
              if (res.code == '200') {
                treeNode.dataRef.children = []
                for (let i in res.rows) {
                  treeNode.dataRef.children.push({
                    key: res.rows[i][_this.edgeInitialized.val], title: res.rows[i][_this.edgeInitialized.display]
                  })
                  _this.edgeInitialized.viewSelect.push(... treeNode.dataRef.children);
                  _this.edgeInitialized.viewSelect = Array.from(new Set( _this.edgeInitialized.viewSelect))
                }
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
      //线上树形结构异步加完成事件
      edgeTreeLoad(loadedKeys, expanded) {
        this.edgeLoadedKeys = loadedKeys
      },
      //线树形搜索框事件
      edgeTreeSelectSearch(value) {
        this.edgeLoadedKeys = []
        let _this = this
        let params = {}
        params.id = _this.edgeInitialized.itemId
        params.val = _this.edgeInitialized.val
        params.parentId = _this.edgeInitialized.parentId
        params.name = _this.edgeInitialized.display
        params.keyword = value
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            _this.edgeInitialized.inputEdgeSelect = []
            for (let i in res.rows) {
              if (this.$util.trim(value)) {
                _this.edgeInitialized.inputEdgeSelect.push({
                  key: res.rows[i][_this.edgeInitialized.val],
                  title: res.rows[i][_this.edgeInitialized.display],
                  isLeaf: true
                })
              } else {
                _this.edgeInitialized.inputEdgeSelect.push({
                  key: res.rows[i][_this.edgeInitialized.val],
                  title: res.rows[i][_this.edgeInitialized.display],
                  isLeaf: false
                })
              }
              _this.edgeInitialized.viewSelect.push({
                key: res.rows[i][_this.edgeInitialized.val], title: res.rows[i][_this.edgeInitialized.display]
              })
            }
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      //线上树形显示更多点击事件
      edgeTreeSelectMaxTag() {
        this.modalTitle = this.selectEdge.label
        this.modalVisible = true
        this.valueList = this.selectEdge.assertValList
        this.fullData = this.selectEdge
        this.initialized = this.edgeInitialized
      },


      /**
       *
       * @节点上树形选择框
       */
      //判断节点
      nodeTreeSelectChange(value) {
        this.selectNode.assertValList = value
      },
      //节点树形选择事件
      nodeTreeSelected(value) {
        if ( this.selectNode.assertValList){
        }else{
          this.selectNode.assertValList = []
        }
        this.selectNode.assertValList = value
      },
      //节点异步加载事件
      nodeTreeLoadData(treeNode) {
        let _this = this
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            let params = {}
            params.parentId = _this.boxInitialized.parentId
            params.parentValue = treeNode.dataRef.key
            params.id = _this.boxInitialized.itemId
            coreRuleNodeSelectColId(params).then(res => {
              if (res.code == '200') {
                treeNode.dataRef.children = []
                for (let i in res.rows) {
                  treeNode.dataRef.children.push({
                    key: res.rows[i][_this.boxInitialized.val], title: res.rows[i][_this.boxInitialized.display]
                  })
                  _this.boxInitialized.viewSelect.push(... treeNode.dataRef.children);
                  _this.boxInitialized.viewSelect = Array.from(new Set( _this.boxInitialized.viewSelect))
                }
                _this.boxInitialized.inputSelectData = [..._this.boxInitialized.inputSelectData]
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
      //节点异步加载完成事件
      nodeTreeLoad(loadedKeys, expanded) {
        this.nodeLoadedKeys = loadedKeys
      },
      //节点树形搜索框事件
      nodeTreeSelectSearch(value) {
        this.nodeLoadedKeys = []
        let _this = this
        let params = {}
        params.id = this.boxInitialized.itemId
        params.val = this.boxInitialized.val
        params.parentId = this.boxInitialized.parentId
        params.name = this.boxInitialized.display
        params.keyword = value
        coreRuleNodeSelectColId(params).then(res => {
          if (res.code == '200') {
            _this.boxInitialized.inputSelectData = []
            for (let i in res.rows) {
              if (this.$util.trim(value)) {
                _this.boxInitialized.inputSelectData.push({
                  key: res.rows[i][_this.boxInitialized.val],
                  title: res.rows[i][_this.boxInitialized.display],
                  isLeaf: true
                })
              } else {
                _this.boxInitialized.inputSelectData.push({
                  key: res.rows[i][_this.boxInitialized.val],
                  title: res.rows[i][_this.boxInitialized.display],
                  isLeaf: false
                })
              }
              _this.boxInitialized.viewSelect.push({
                key: res.rows[i][_this.boxInitialized.val], title: res.rows[i][_this.boxInitialized.display]
              })
            }
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      //节点树形显示更多点击事件
      nodeTreeSelectMaxTag() {
        this.modalTitle = this.selectNode.label
        this.modalVisible = true
        this.valueList = this.selectNode.assertValList
        this.fullData = this.selectNode
        this.initialized = this.boxInitialized
      },


      //后置条件选择
      rearChange(value) {
        if (value) {
          this.selectNode.assertVal = null
          this.selectNode.assertVal1 = null
          this.selectNode.assertValList = []
          this.selectNode.dataDrilling = null
        }
      },
      //计算条件改变事件
      nodeRearChange(value) {
        if (value) {
          this.selectEdge.assertVal = null
          this.selectEdge.assertVal1 = null
          this.selectEdge.assertValList = []
          this.selectEdge.dataDrilling = null
        }
      },
      //范围选择事件
      nodePreChange: function(value) {
        if (!value) {
          this.selectNode.calculation = null
          this.selectNode.formula = null
        }
      },
      //范围值change事件
      nodePreSelect(value, label, extra) {
        this.selectNode.calculation = null
      },

      //线上显示更多点击事件
      edgeSelectMaxTag() {
        this.modalTitle = this.selectEdge.label
        this.modalVisible = true
        this.edgeSelectOpen = false
        this.valueList = this.selectEdge.assertValList
        this.fullData = this.selectEdge
        this.initialized = this.edgeInitialized
      },
      //线上选择框下拉事件
      edgeDropdownVisible(open) {
        if (!this.modalVisible) {
          this.edgeSelectOpen = open
        } else {
          this.edgeSelectOpen = false
        }
      },

      //节点上显示更多事件
      nodeSelectMaxTag() {
        this.modalTitle = this.selectNode.label
        this.modalVisible = true
        this.nodeSelectOpen = false
        this.valueList = this.selectNode.assertValList
        this.fullData = this.selectNode
        this.initialized = this.boxInitialized
      },
      //节点选择框下拉事件
      nodeDropdownVisible(open) {
        if (!this.modalVisible) {
          this.nodeSelectOpen = open
        } else {
          this.nodeSelectOpen = false
        }
      },



      modalCancel() {
        this.modalVisible = false
      },
      modalOkl() {
        this.modalVisible = false
      }
    }
  }
</script>this
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