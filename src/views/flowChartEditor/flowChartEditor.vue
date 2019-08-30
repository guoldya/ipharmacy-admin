<template>
  <div class="editorg6">
    <!-- 工具栏 -->
    <a-toolbar
      v-bind:saveFlow="saveFlow"
      :verifyFlow="verifyFlow"
      :submitFlow="submitFlow"
      :copyRule="copyRule"
      :addRuleData="addRuleData"
      :titleData="titleData"
      ref="toolbar"></a-toolbar>
    <div style="height: 42px;"></div>
    <a-spin size="large" :spinning="spinning">
      <div class="bottom-container">
        <!-- 节点 -->
        <a-itempanel ref="itempannel"></a-itempanel>
        <!-- 属性节点 -->
        <a-detailpanel
          ref="detailpannel"
          v-bind:graphAPI="graph"
          v-bind:selectNode="selectNode"
          v-bind:selectEdge="selectEdge"
          v-bind:boxInitialized="boxInitialized"
          v-bind:edgeInitialized="edgeInitialized"
          v-bind:preData="preData"
          v-bind:judgePreData="judgePreData"
        ></a-detailpanel>
        <!-- 缩略图 -->
        <a-navigator ref="navigator" v-bind:graphAPI="graph"></a-navigator>
        <!-- 右键菜单 -->
        <a-contextmenu ref="contextmenu"></a-contextmenu>

        <div id="page" class="page" ref="flow" :style="conheight"></div>
      </div>
    </a-spin>
    <a-modal
      :title="modal.title"
      :visible="modal.visible"
      @ok="modalOk"
      :confirmLoading="modal.confirmLoading"
      @cancel="modalCancel"
      class="drugModal"
      width="600px"
      :maskClosable="false">
      <a-ruleModal :handleChange="ruleModalChange"></a-ruleModal>
    </a-modal>
    <a-addRule ref="addRule" :visible="addVisible" :addRuleOk="addRuleOk" :addRuleCancel="addRuleCancel"></a-addRule>
  </div>
</template>

<script>
  //import HeadInfo from '@/components/tools/HeadInfo'
  import G6Editor from '@antv/g6-editor'
  import { setTimeout } from 'timers'

  //图形模块加载
  import './nodemode/flow-circle-start' //开始
  //import './nodemode/model-node' //
  import './nodemode/model-rhombus' //
  import './nodemode/flow-rhombus-if' //判断
  import './nodemode/model-card'
  import './nodemode/model-card-conclusion' //结论
  import './nodemode/model-image'
  import './nodemode/model-image-branch' //图片包含
  import './nodemode/model-rect'
  import './nodemode/model-rect-attribute' //属性
  import moment from 'moment'

  //控件模块加载
  import contextmenu from './model/contextmenu'
  import detailpanel from './model/detailpanel'
  import itempanel from './model/itempanel'
  import navigator from './model/navigator'
  import toolbar from './model/toolbar'
  import ruleModal from './model/ruleModal'
  import addRule from './model/addRule'
  export default {
    name: 'g6e',
    props: {
      g6data: Object, // 传入数据
      getData: Function // 获取数据
    },
    components: {
      'a-contextmenu': contextmenu,
      'a-detailpanel': detailpanel,
      'a-itempanel': itempanel,
      'a-navigator': navigator,
      'a-toolbar': toolbar,
      'a-ruleModal': ruleModal,
      'a-addRule': addRule
    },
    data() {
      return {
        api: {
          RuleNodeAndRuleCable: 'sys/coreRuleNode/selectRuleNodeAndRuleCable',
          selectRuleContent: 'sys/coreRuleNode/selectRuleContent',
          coreRuleUpdate: '/sys/coreRule/update',
          coreRuleNodeUpdate:'/sys/coreRuleNode/update',
          reviewAuditlevelSelect:'/sys/reviewAuditlevel/selectUsingList',
          coreRuleNodeSelectColId:'/sys/coreRuleNode/selectColId',
          coreFactColAll:'/sys/coreFactCol/selectAllUsing',
          judgeUrl:'sys/coreRuleNode/selectColSqlValuePage',
        },
        spinning: false,
        ruleId: null,
        page: null,
        flow: null,
        graph: null,
        selectNode: {
          id: null,
          shape: null,
          label: null,
          ///-------结论节点特有属性---------
          inAccordanceWith: null,
          sourcename: null,
          colDbType: null,
          message: null,
          suggest: null,
          restrictionType: null,
          verdictType: null,
          itemId: null,
          precondition: null,
          dataDrilling: null,
          calculation: '',
          formula: null,
          calculated: null,
          isRepeat: null,
          rearCondition: null,
          val: null,
          display: null,
          parentId: null,
          itemName: null,
          ro: null,
          lo: null,
          roSymbol: null,
          assertVal: null,
          assertValList: [],
          assertVal1: null,
          levelColor: '#ffffff',
          levels: 0,

          ///-------结论节点特有属性---------

          ///-------------属性节点特定属性-----------------
          field: null,
          prototypes: null
          ///-------------属性节点特定属性-----------------
        }, //当前选中节点
        selectEdge: {
          id: null,
          label: null,
          value: null,
          sourceId: null,
          colDbType: null,
          sourceType: null,
          targetId: null,
          targetType: null,
          assertVal: null,
          assertValList: [],
          assertVal1: null,
          dataDrilling: null,
          rearCondition: null,
          ro: null,
          lo: null,
          roSymbol: null
        },
        conheight: {
          height: '806px'
        },
        color: '#194d33',
        ///////////////分割线一下是备用待删除参数////////////
        nodeId: null,
        nodeName: null,
        nodeWidth: null,
        nodeHeight: null,
        nodeColor: null,
        groupId: null,
        groupName: null,
        groupColor: null,
        edgeId: null,
        edgeName: null,
        multiId: [], // 多选模式选中的node节点id
        multiColor: null, // 多选模式下的color，仅以最后一个为代表颜色
        isMultiSelect: false, // 是否是多选模式
        gridCheck: false,
        titleData: {
          status: null,
          type2: null,
          type: null,
          name: null,
          updateTime: null,
          visible: null,
          updateBy: null,
          loading:false,
        },
        //属性框初始化
        boxInitialized: { inputSelectData: [], inputType: 'input', inValueType: '', nodeTreeData: {}, viewSelect: [],loadedKeys:[] },
        edgeInitialized: { inputEdgeSelect: [], inputEdge: 'input', inValueEdge: '', edgeTreeData: {}, viewSelect: [],loadedKeys:[]  },
        pieChartData: {},
        getEdgesData: [],
        //modal属性
        modal: {
          visible: false,
          title: '复制规则',
          confirmLoading: false
        },
        ruleModalId: null,
        submitStatus: true,
        verifyStatus: true,
        //新增规则
        addVisible: false,
        CoreFactAllTree: [],
        prePid: null,
        preData: [],
        judgePreData: [],
        isCopy:'0',
      }
    },
    mounted() {
      this.initEditor()
      window.addEventListener('resize', this.getHeight)
      this.getHeight()
      this.getNodeData()
      this.getDataList()
      // this.getReviewLevel();
      this.getCoreFactAllStart()
      setTimeout(() => {
        this.autoZoom()
      }, 500)

    },
    computed: {
      selectNodeInAccordanceWith() {
        return this.selectNode.inAccordanceWith
      },
      selectNodeSourcename() {
        return this.selectNode.sourcename
      },
      selectNodeMessage() {
        return this.selectNode.message
      },
      selectNodeSuggest() {
        return this.selectNode.suggest
      },
      selectNodeVerdictType() {
        return this.selectNode.verdictType
      },
      selectNodeRestrictionType() {
        return this.selectNode.restrictionType
      },
      selectNodeLevelColor() {
        return this.selectNode.levelColor
      },
      selectNodeLevels() {
        return this.selectNode.levels
      },

      selectNodelabel() {
        return this.selectNode.label
      },
      selectNodeprototypes() {
        return this.selectNode.prototypes
      },
      selectNodelfield() {
        return this.selectNode.field
      },
      selectNodeItemId() {
        return this.selectNode.itemId
      },
      selectNodePrecondition() {
        return this.selectNode.precondition
      },
      selectNodeRearCondition() {
        return this.selectNode.rearCondition
      },
      selectNodeDataDrilling() {
        return this.selectNode.dataDrilling
      },
      selectNodeCalculation() {
        return this.selectNode.calculation
      },
      selectNodeFormula() {
        return this.selectNode.formula
      },
      selectNodeCalculated() {
        return this.selectNode.calculated
      },
      selectNodeIsRepeat() {
        return this.selectNode.isRepeat
      },
      selectNodeItemName() {
        return this.selectNode.itemName
      },
      selectNodeRo() {
        return this.selectNode.ro
      },
      selectNodeLo() {
        return this.selectNode.lo
      },
      selectNodeColDbType() {
        return this.selectNode.colDbType
      },
      selectNodeAssertVal() {
        return this.selectNode.assertVal
      },
      selectNodeAssertValList() {
        return this.selectNode.assertValList
      },
      selectNodeAssertVal1() {
        return this.selectNode.assertVal1
      },
      selectNodeRoSymbol() {
        return this.selectNode.roSymbol
      },
      selectNodeRoVal() {
        return this.selectNode.val
      },
      selectNodeRoDisplay() {
        return this.selectNode.display
      },
      selectNodeRoParentId() {
        return this.selectNode.parentId
      },

      selectEdgeLabel() {
        return this.selectEdge.label
      },
      selectEdgeLo() {
        return this.selectEdge.lo
      },
      selectEdgeColDbType() {
        return this.selectEdge.colDbType
      },
      selectEdgeValue() {
        return this.selectEdge.value
      },
      selectEdgeAssertVal() {
        return this.selectEdge.assertVal
      },
      selectEdgeAssertValList() {
        return this.selectEdge.assertValList
      },
      selectEdgeRearCondition() {
        return this.selectEdge.rearCondition
      },
      selectEdgeDataDrilling() {
        return this.selectEdge.dataDrilling
      },
      selectEdgeAssertVal1() {
        return this.selectEdge.assertVal1
      },
      selectEdgeRo() {
        return this.selectEdge.ro
      },
      selectEdgeRoSymbol() {
        return this.selectEdge.roSymbol
      }
    },

    watch: {
      selectNodeLevels(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { levels: newValue })
        }
      },
      selectNodeprototypes(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { prototypes: newValue })
        }
      },
      selectNodelfield(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { field: newValue })
        }
      },
      selectNodeInAccordanceWith(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { inAccordanceWith: newValue })
        }
      },
      selectNodeSourcename(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { sourcename: newValue })
        }
      },
      selectNodeMessage(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { message: newValue })
        }
      },
      selectNodeSuggest(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { suggest: newValue })
        }
      },
      selectNodeVerdictType(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { verdictType: newValue })
        }
      },
      selectNodeRestrictionType(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { restrictionType: newValue })
        }
      },
      selectNodelabel(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { label: newValue })
        }
      },
      selectNodeLevelColor(newValue, oldValue) {
        if (newValue != oldValue) {
          switch (this.selectNode.shape) {
            case 'model-card-conclusion':
              this.flow.update(this.selectNode.id, { levelColor: newValue })
              break
            case 'model-rect-attribute':
              this.flow.update(this.selectNode.id, { color: newValue })
              break
          }
        }
      },
      selectNodeItemId(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { itemId: newValue })
        }
      },
      selectNodePrecondition(newValue, oldValue) {
        if (newValue != oldValue) {
          if (newValue) {
            this.flow.update(this.selectNode.id, { precondition: newValue })
          } else {
            this.flow.update(this.selectNode.id, { precondition: newValue })
          }
        }
      },
      selectNodeRearCondition(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { rearCondition: newValue })
        }
      },
      selectNodeDataDrilling(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { dataDrilling: newValue })
        }
      },
      selectNodeCalculation(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { calculation: newValue })
        }
      },
      selectNodeFormula(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { formula: newValue })
        }
      },
      selectNodeCalculated(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { calculated: newValue })
        }
      },
      selectNodeIsRepeat(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { isRepeat: newValue })
        }
      },
      selectNodeItemName(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { itemName: newValue })
        }
      },
      selectNodeRo(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { ro: newValue })
        }
      },
      selectNodeLo(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { lo: newValue })
        }
      },
      selectNodeColDbType(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { colDbType: newValue })
        }
      },
      selectNodeRoSymbol(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { roSymbol: newValue })
        }
      },
      selectNodeAssertVal(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { assertVal: newValue })
        }
      },
      selectNodeAssertValList(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { assertValList: newValue })
        }
      },
      selectNodeAssertVal1(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { assertVal1: newValue })
        }
      },

      selectNodeRoVal(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { val: newValue })
        }
      },
      selectNodeRoDisplay(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { display: newValue })
        }
      },
      selectNodeRoParentId(newValue, oldValue) {
        console.log(newValue)
        console.log(oldValue)
        if (newValue != oldValue) {
          this.flow.update(this.selectNode.id, { parentId: newValue })
        }
      },
      selectEdgeLabel(newValue, oldValue) {
        if (newValue != oldValue && newValue != null) {
          this.flow.update(this.selectEdge.id, { label: newValue })
        }
      },
      selectEdgeValue(newValue, oldValue) {
        if (newValue != oldValue && newValue != null) {
          this.flow.update(this.selectEdge.id, { value: newValue })
        }
      },
      selectEdgeLo(newValue, oldValue) {
        if (newValue != oldValue && newValue != null) {
          this.flow.update(this.selectEdge.id, { lo: newValue })
        }
      },
      selectEdgeColDbType(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { colDbType: newValue })
        }
      },
      selectEdgeAssertVal(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { assertVal: newValue })
        }
      },
      selectEdgeAssertValList(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { assertValList: newValue })
        }
      },
      selectEdgeDataDrilling(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { dataDrilling: newValue })
        }
      },
      selectEdgeRearCondition(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { rearCondition: newValue })
        }
      },
      selectEdgeAssertVal1(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { assertVal1: newValue })
        }
      },
      selectEdgeRo(newValue, oldValue) {
        if (newValue != oldValue && newValue != null) {
          this.flow.update(this.selectEdge.id, { ro: newValue })
        }
      },
      selectEdgeRoSymbol(newValue, oldValue) {
        if (newValue != oldValue) {
          this.flow.update(this.selectEdge.id, { roSymbol: newValue })
        }
      }
    },

    methods: {
      moment,
      autoZoom() {
        //自动跳转自适应画布
        for (let key in this.toolbar.commands) {
          let item = this.toolbar.commands[key]
          if (item.dataset && item.dataset.command == 'autoZoom') {
            const event = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            })
            this.toolbar.commands[key].dispatchEvent(event)
            window.abcd = this
            break
          }
        }
      },
      getHeight() {
        this.conheight.height = window.innerHeight - 48 + 'px'
      },
      /**
       * @description: 初始化编辑器
       */
      initEditor() {
        const editor = new G6Editor()
        // 关闭追踪反馈
        G6Editor.track(false)
        // 基础流程图
        this.flow = new G6Editor.Flow({
          graph: {
            container: this.$refs.flow
            //rollback: true,
            //forceAlign: true,
          },
          align: {
            grid: true // 网格对齐
          },
          grid: {
            cell: 20 // 网孔尺寸
          },
          shortcut: {
            zoomIn: true, // 开启放大快捷键
            zoomOut: true // 开启视口缩小快捷键
          },
          //不允许空白连线
          noEndEdge: false
        })
        // 流程图图类
        this.itempannel = new G6Editor.Itempannel({
          container: this.$refs.itempannel.$refs.dom
          // interactiveType: 'drag'
        })
        // 缩略图
        this.minimap = new G6Editor.Minimap({
          container: this.$refs.navigator.$refs.dom
        })
        // 命令工具
        this.toolbar = new G6Editor.Toolbar({
          container: this.$refs.toolbar.$refs.dom
        })
        // 右键菜单
        this.contextmenu = new G6Editor.Contextmenu({
          container: this.$refs.contextmenu.$refs.dom
        })
        // 详细信息面板
        this.detailpannel = new G6Editor.Detailpannel({
          container: this.$refs.detailpannel.$refs.dom
        })

        // 通过editor添加关联
        editor.add(this.flow)
        editor.add(this.itempannel)
        editor.add(this.minimap)
        editor.add(this.toolbar)
        editor.add(this.contextmenu)
        editor.add(this.detailpannel)
        // 流图读取数据
        // this.g6data && this.flow.read(this.g6data)
        // let temp = localStorage.getItem('test')
        // if (temp != null) {
        //   this.flow.read(JSON.parse(temp))
        // }
        // 获取流图的graph示例
        this.graph = this.flow.getGraph()
        // 居中画布中的内容
        this.graph.setFitView('cc')
        // 边形状映射
        this.graph.edge({
          // style: {
          //   stroke: '#1890ff'
          // },
          color: 'rgba(0,0,0,0.25)', // flow-smooth
          shape: 'flow-smooth' //flow-polyline-round
          // labelRectStyle: {
          //   fill: '#ffffff'
          // }
        })
        // 获取当前页
        this.page = editor.getCurrentPage()
        // 默认关闭网格对齐
        this.page.hideGrid()
        // 修改添加边的模型
        // this.page.changeAddEdgeModel({
        //   shape: 'flow-smooth'
        // })
        var _this = this
        // 选中数据处理
        this.page.on('afteritemselected', ev => {
          // 判断数据类型
          switch (ev.item.type) {
            case 'node':
              this.getEdgesData = ev.item.model.childNodes
              if (!ev.item.isSelected) {
                _this.nodeId = ev.item.model.id
                let model = ev.item.model
                let shape = ev.item.shapeObj
                _this.selectNode.id = model.id
                _this.selectNode.pid = model.pid
                _this.selectNode.shape = model.shape
                _this.selectNode.label = model.label != null ? model.label : shape.label
                switch (_this.selectNode.shape) {
                  case 'model-card-conclusion':
                    _this.selectNode.inAccordanceWith = model.inAccordanceWith != null ? model.inAccordanceWith : shape.inAccordanceWith
                    _this.selectNode.sourcename = model.sourcename != null ? model.sourcename : shape.sourcename
                    _this.selectNode.levelColor = model.levelColor != null ? model.levelColor : shape.levelColor
                    _this.selectNode.message = model.message != null ? model.message : shape.message
                    _this.selectNode.suggest = model.suggest != null ? model.suggest : shape.suggest
                    _this.selectNode.verdictType = model.verdictType != null ? model.verdictType : shape.verdictType
                    _this.selectNode.restrictionType = model.restrictionType != null ? model.restrictionType : shape.restrictionType
                    _this.selectNode.levels = model.levels != null ? model.levels : shape.levels
                    break
                  case 'model-rect-attribute':
                    _this.selectNode.levelColor = model.color != null ? model.color : shape.color
                    _this.selectNode.colDbType = model.colDbType != null ? model.colDbType : shape.colDbType
                    _this.selectNode.itemId = model.itemId != null ? '' + model.itemId : shape.itemId
                    _this.selectNode.precondition = model.precondition != null ? '' + model.precondition : shape.precondition
                    _this.selectNode.calculation = model.calculation != null ? model.calculation : shape.calculation
                    _this.selectNode.formula = model.formula != null ? model.formula : shape.formula
                    _this.selectNode.calculated = model.calculated != null ? model.calculated : shape.calculated
                    _this.selectNode.isRepeat = model.isRepeat != null ? model.isRepeat : shape.isRepeat
                    _this.selectNode.itemName = model.itemName != null ? model.itemName : shape.itemName
                    _this.selectNode.val = model.val != null ? model.val : shape.val
                    _this.selectNode.display = model.display != null ? model.display : shape.display
                    _this.selectNode.parentId = model.parentId != null ? model.parentId : shape.parentId
                    _this.selectNode.ro = model.ro != null ? model.ro : shape.ro
                    _this.selectNode.lo = model.lo != null ? model.lo : shape.lo
                    _this.prePid = []
                    _this.getPrePidData(this.selectNode.itemId, this.CoreFactAllTree)
                    _this.preData = []
                    if (this.getPreData(this.prePid, this.CoreFactAllTree).length == 0) {
                      _this.preData = []
                    } else {
                        _this.preData = this.getPreData(this.prePid, this.CoreFactAllTree)
                    }
                    break
                  case 'flow-rhombus-if':
                    let params = ev.item.model
                    if (params.lo == 1) {
                      this.boxInitialized.inputType = 'input'
                    } else if (params.lo == 2) {
                      this.boxInitialized.inputType = 'scopeInput'
                      console.log(params,'params')
                    } else if (params.lo == 3 && !this.$util.trim(params.parentId)) {
                      this.boxInitialized.inputType = 'select'
                      this.boxInitialized.itemId = params.itemId
                      this.boxInitialized.val = params.val
                      this.boxInitialized.display = params.display
                      let paramsNodeData = { id: params.itemId }
                      if (ev.item.model.assertValList) {
                        paramsNodeData.valueList = params.assertValList
                      }
                      paramsNodeData.val = params.val
                      paramsNodeData.display = params.display
                      this.$axios({
                        url:this.api.  coreRuleNodeSelectColId,
                        method:'put',
                        data: paramsNodeData,
                      }).then(res => {
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
                      console.log(params,'params')
                      this.boxInitialized.inputType = 'treeSelect'
                      this.boxInitialized.itemId = params.itemId
                      this.boxInitialized.val = params.val
                      this.boxInitialized.display = params.display
                      this.boxInitialized.parentId = params.parentId
                      this.boxInitialized.loadedKeys = []
                      let paramsNodeData = { id: params.itemId }
                      paramsNodeData.val = params.val
                      paramsNodeData.display = params.display
                      paramsNodeData.parentId = params.parentId
                      this.$axios({
                        url:this.api.  coreRuleNodeSelectColId,
                        method:'put',
                        data: paramsNodeData,
                      }).then(res => {
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
                        }
                      }).catch(err => {
                        this.error(err)
                      })
                      let listData = {}
                      listData.id = params.itemId
                      listData.val = params.val
                      listData.display = params.display
                      listData.parentId = params.parentId
                      if (params.assertValList) {
                        listData.valueList = params.assertValList
                      }
                      this.$axios({
                        url:this.api.  coreRuleNodeSelectColId,
                        method:'put',
                        data: listData,
                      }).then(res => {
                        if (res.code == '200') {
                          let resData = []
                          for (let key in res.rows) {
                            resData.push({ key: res.rows[key][params.val], title: res.rows[key][params.display] })
                          }
                          this.boxInitialized.viewSelect.push(...resData)
                          this.boxInitialized.viewSelect = Array.from(new Set(this.boxInitialized.viewSelect))
                        } else {
                          this.warn(res.msg)
                          this.boxInitialized.viewSelect = []
                        }
                      }).catch(err => {
                        this.error(err)
                      })
                    } else {
                      this.boxInitialized.inputType = 'input'
                    }
                    if (params.colDbType == 1) {
                      this.boxInitialized.inValueType = 'number'
                    } else if (params.colDbType == 2) {
                      this.boxInitialized.inputType == 'time'
                    } else if (params.colDbType == 3) {
                      this.boxInitialized.inValueType = 'text'
                    }
                    _this.selectNode.lo = params.lo
                    _this.selectNode.colDbType = params.colDbType
                    _this.selectNode.itemId = model.itemId != null ? '' + model.itemId : shape.itemId
                    _this.selectNode.precondition = model.precondition != null ? '' + model.precondition : shape.precondition
                    _this.selectNode.rearCondition = model.rearCondition != null ? '' + model.rearCondition : shape.rearCondition
                    _this.selectNode.dataDrilling = model.dataDrilling != null ? model.dataDrilling : shape.dataDrilling
                    _this.selectNode.calculation = model.calculation != null ? model.calculation : shape.calculation
                    _this.selectNode.formula = model.formula != null ? model.formula : shape.formula
                    _this.selectNode.calculated = model.calculated != null ? model.calculated : shape.calculated
                    _this.selectNode.isRepeat = model.isRepeat != null ? model.isRepeat : shape.isRepeat
                    _this.selectNode.itemName = model.itemName != null ? model.itemName : shape.itemName
                    _this.selectNode.val = model.val != null ? model.val : shape.val
                    _this.selectNode.display = model.display != null ? model.display : shape.display
                    _this.selectNode.parentId = model.parentId != null ? model.parentId : shape.parentId
                    _this.selectNode.ro = model.ro != null ? model.ro : shape.ro
                    _this.selectNode.lo = model.lo != null ? model.lo : shape.lo
                    _this.selectNode.assertVal = model.assertVal != null ? model.assertVal : shape.assertVal
                    _this.selectNode.assertValList = model.assertValList != null ? model.assertValList : []
                    _this.selectNode.assertVal1 = model.assertVal1 != null ? model.assertVal1 : shape.assertVal1
                    _this.selectNode.roSymbol = model.roSymbol != null ? model.roSymbol : shape.roSymbol
                }
              } else {
                _this.multiId.push(ev.item.model.id)
              }
              this.prePid = []
              this.getPrePidData(this.selectNode.itemId, this.CoreFactAllTree)
              _this.judgePreData = []
              if (this.getPreData(this.prePid, this.CoreFactAllTree).length == 0) {
                _this.judgePreData = []
              } else {
                  _this.judgePreData = this.getPreData(this.prePid, this.CoreFactAllTree)
              }
              break
            case 'edge':
              //选中后设置颜色 和连接线的宽度
              _this.flow.update(ev.item.model.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
              let sourceP = ev.item.source.model
              if (sourceP.shape == 'model-rect-attribute') {
                _this.selectEdge.rearCondition = ev.item.model.rearCondition
                _this.edgeInitialized.colDbType = sourceP.colDbType
                if (sourceP.lo == 1) {
                  _this.edgeInitialized.inputEdge = 'input'
                  _this.edgeInitialized.lo = 1
                } else if (sourceP.lo == 2) {
                  _this.edgeInitialized.inputEdge = 'scopeInput'
                  _this.edgeInitialized.lo = 2
                } else if (sourceP.lo == 3 && !this.$util.trim(sourceP.parentId)) {
                  _this.edgeInitialized.lo = 3
                  _this.edgeInitialized.inputEdge = 'select'
                  _this.edgeInitialized.itemId = sourceP.itemId
                  _this.edgeInitialized.val = sourceP.val
                  _this.edgeInitialized.display = sourceP.display
                  let paramsData = { id: sourceP.itemId }
                  if (ev.item.model.assertValList) {
                    paramsData.valueList = ev.item.model.assertValList
                    paramsData.val = sourceP.val
                    paramsData.display = sourceP.display
                  }
                  this.$axios({
                    url:this.api.  coreRuleNodeSelectColId,
                    method:'put',
                    data: paramsData,
                  }).then(res => {
                    if (res.code == '200') {
                      _this.edgeInitialized.inputEdgeSelect = []
                      for (let key in res.rows) {
                        _this.edgeInitialized.inputEdgeSelect.push({
                          ID: res.rows[key][sourceP.val],
                          NAME: res.rows[key][sourceP.display]
                        })
                      }
                    } else {
                      this.warn(res.msg)
                      _this.edgeInitialized.inputEdgeSelect = []
                    }
                  }).catch(err => {
                    this.error(err)
                  })
                } else if (sourceP.lo == 3 && this.$util.trim(sourceP.parentId)) {
                  _this.edgeInitialized.lo = 3
                  _this.edgeInitialized.inputEdge = 'treeSelect'
                  _this.edgeInitialized.itemId = sourceP.itemId
                  _this.edgeInitialized.val = sourceP.val
                  _this.edgeInitialized.display = sourceP.display
                  _this.edgeInitialized.parentId = sourceP.parentId
                  _this.edgeInitialized.loadedKeys = []
                  let paramsData = { id: sourceP.itemId }
                  paramsData.val = sourceP.val
                  paramsData.display = sourceP.display
                  paramsData.parentId = sourceP.parentId
                  this.$axios({
                    url:this.api.  coreRuleNodeSelectColId,
                    method:'put',
                    data: paramsData,
                  }).then(res => {
                    if (res.code == '200') {
                      _this.edgeInitialized.inputEdgeSelect = []
                      _this.edgeInitialized.viewSelect = []
                      for (let key in res.rows) {
                        _this.edgeInitialized.inputEdgeSelect.push({
                          key: res.rows[key][sourceP.val],
                          title: res.rows[key][sourceP.display]
                        })
                        _this.edgeInitialized.viewSelect.push({
                          key: res.rows[key][sourceP.val],
                          title: res.rows[key][sourceP.display]
                        })
                      }
                    } else {
                      this.warn(res.msg)
                      _this.edgeInitialized.inputEdgeSelect = []
                    }
                  }).catch(err => {
                    this.error(err)
                  })
                  let listData = {}
                  listData.id = sourceP.itemId
                  listData.val = sourceP.val
                  listData.display = sourceP.display
                  listData.parentId = sourceP.parentId
                  if (ev.item.model.assertValList) {
                    listData.valueList = ev.item.model.assertValList
                  } else {
                    listData.valueList = []
                    ev.item.model.assertValList = []
                  }
                  this.$axios({
                    url:this.api.  coreRuleNodeSelectColId,
                    method:'put',
                    data: listData,
                  }).then(res => {
                    if (res.code == '200') {
                      let resData = []
                      for (let key in res.rows) {
                        resData.push({ key: res.rows[key][sourceP.val], title: res.rows[key][sourceP.display] })
                      }
                      this.edgeInitialized.viewSelect.push(...resData)
                      this.edgeInitialized.viewSelect = Array.from(new Set(this.edgeInitialized.viewSelect))
                    } else {
                      this.warn(res.msg)
                    }
                  }).catch(err => {
                    this.error(err)
                  })
                }
                if (sourceP.colDbType == '1') {
                  this.edgeInitialized.inValueEdge = 'number'
                } else if (sourceP.colDbType == '2') {
                  this.edgeInitialized.inValueEdge = 'time'
                } else if (sourceP.colDbType == '3') {
                  this.edgeInitialized.inValueEdge = 'text'
                }
              }
              setTimeout(() => {
                _this.selectEdge.id = ev.item.model.id
                _this.selectEdge.label = ev.item.model.label
                _this.selectEdge.lo = ev.item.model.lo
                _this.selectEdge.value = ev.item.model.value
                _this.selectEdge.sourceId = ev.item.source.id
                _this.selectEdge.assertVal = ev.item.model.assertVal
                _this.selectEdge.assertValList = ev.item.model.assertValList
                _this.selectEdge.dataDrilling = ev.item.model.dataDrilling
                _this.selectEdge.assertVal1 = ev.item.model.assertVal1
                _this.selectEdge.ro = ev.item.model.ro
                _this.selectEdge.roSymbol = ev.item.model.roSymbol
                if (ev.item.source.model) {
                  _this.selectEdge.sourceType = ev.item.source.model.shape
                }
                _this.selectEdge.targetId = ev.item.target.id
                if (ev.item.target.model) {
                  _this.selectEdge.targetType = ev.item.target.model.shape
                }
              }, 0)
              break
          }
        })

        this.page.on('afteritemunselected', ev => {
          switch (ev.item.type) {
            case 'edge':
              //修改状态回原来模式 必须延迟执行否则会出现BUG
              setTimeout(() => {
                _this.flow.update(ev.item.model.id, { style: { stroke: 'rgba(0,0,0,0.25)', lineWidth: 1 } })
              }, 0)
              break
            default:
              break
          }
        })
        // 输入锚点不可以连出边
        this.page.on('hoveranchor:beforeaddedge', ev => {
          if (ev.anchor.type === 'input') {
            ev.cancel = true
          }
        })
        this.page.on('dragedge:beforeshowanchor', ev => {
          // 只允许目标锚点是输入，源锚点是输出，才能连接
          if (!(ev.targetAnchor.type === 'input' && ev.sourceAnchor.type === 'output')) {
            ev.cancel = true
          }
          //   if (!(ev.targetAnchor.type === 'input')) {
          //   ev.cancel = true
          // }
          // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
          if (ev.dragEndPointType === 'target') {
            //已经连接过的点禁用
            if (ev.target.model.shape != 'model-image-branch' && ev.target.model.shape != 'model-card-conclusion' && this.page.anchorHasBeenLinked(ev.target, ev.targetAnchor)) {
              ev.cancel = true
            }
            //起始节点不能直接连接分支节点
            if (ev.source.model.shape == 'flow-circle-start' && ev.target.model.shape == 'model-image-branch') {
              ev.cancel = true
            }
            //分支节点可以有多个接入节点，但输出节点只有一个
            if (ev.target.model.shape == 'model-image-branch') {
              for (let key in ev.target.getEdges()) {
                if (ev.target.getEdges()[key].target.model.shape == 'model-image-branch') {
                  ev.cancel = true
                }
              }
            }
            //目标和源都是同一个模块 禁用
            if (ev.target.model.id == ev.source.model.id) {
              ev.cancel = true
            } else {
              //判断目标点是否和当前节点已经连接过 连  连接过不允许再次连接
              let edges = ev.target.getEdges()
              for (let key in edges) {
                let tempNode = edges[key]
                if (tempNode.target.model.id == ev.source.model.id || tempNode.source.model.id == ev.source.model.id) {
                  ev.cancel = true
                  return
                }
              }
            }
          }

          // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
          if (ev.dragEndPointType === 'source' && this.page.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
            ev.cancel = true
          }
        })

        // 取消多选
        // this.page.on('beforeitemunselected', () => {
        //   this.isMultiSelect = false
        // })
        // // 自动更新
        // this.graph.on('afterchangesize', () => {
        //   this.graph.update()
        // })
      },
      //校验数据
      verifyFlow(status) {
        this.submitStatus = true
        let data = this.flow.save()
        if (this.$util.trim(data.nodes) == null && this.$util.trim(data.edges) == null) {
          if (status.status) {
            this.warn('未选择节点!')
          }
          this.submitStatus = false
          return
        }
        if (data.nodes.filter(item => item.shape == 'flow-circle-start').length == 0) {
          if (status.status) {
            this.warn('起点不存在!')
          }
          this.submitStatus = false
          return
        }
        if (this.$util.trim(data.edges) == null) {
          if (status.status) {
            this.warn('节点未连线!')
          }
          this.submitStatus = false
          return
        }
        let list = []
        if (data.edges) {
          list = data.nodes.concat(data.edges)
        } else {
          list = data.nodes
        }
        for (let key in list) {
          if (list[key].type == 'node') {
            list[key].pid = this.getNodePids(data.edges, list[key].id)
          } else {
            list[key].type = 'edge'
            list[key].pid = list[key].source
          }
          list[key].disOrder = list[key].index
          list[key].ruleId = this.ruleId
          list[key].verdictType = list[key].verdictType
        }
        let indexData = this.getNodeTreeData(list)
        let i = 0
        let nodeTree = this.recursiveNodeTree(indexData, '', i)
        this.verifyTree(nodeTree, data.nodes, data.edges, status)
        if (this.submitStatus && status.status) {
          this.success('校验成功')
        }
      },

      //校验数据
      verifyTree(nodeTree, nodes, edges, status) {
        for (let key in nodeTree) {
          if (nodeTree[key].type == 'edge' && this.submitStatus == true) {
            if (this.judgeEdge(nodeTree[key], nodes, status) == false)
              this.submitStatus = false
          }
          if (nodeTree[key].type == 'node' && this.submitStatus == true) {
            if (this.judgeNode(nodeTree[key], edges, status) == false)
              this.submitStatus = false
          }
          if (nodeTree[key].childNodes) {
            this.verifyTree(nodeTree[key].childNodes, nodes, edges, status)
          }
        }
      },
      //判断线的父节点类型
      judgeEdge(edge, nodes, status) {
        for (let i in nodes) {
          if (nodes[i].id == edge.pid) {
            if (nodes[i].shape == 'model-rect-attribute') {
              if (nodes[i].lo == 3) {
                let valueList = null
                if (this.$util.trim(edge.rearCondition) != null) {
                  valueList = 1
                } else {
                  valueList = this.$util.trim(edge.assertValList)
                }
                if (this.$util.trim(edge.label) == null || this.$util.trim(edge.ro) == null || valueList == null) {
                  if (status.status) {
                    this.warn('请输入线段值')
                  }
                  this.flow.update(edge.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
                  this.submitStatus = false
                  return false
                }
              } else if (nodes[i].lo == 2) {
                let value, value1 = null
                if (this.$util.trim(edge.rearCondition) != null) {
                  value = 1
                  value1 = 1
                } else {
                  value = this.$util.trim(edge.assertVal)
                  value1 = this.$util.trim(edge.assertVal1)
                }
                if (this.$util.trim(edge.label) == null || value == null || value1 == null) {
                  if (status.status) {
                    this.warn('请输入线段值')
                  }
                  this.flow.update(edge.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
                  this.submitStatus = false
                  return false
                }
              } else if (nodes[i].lo == 1) {
                let value = null
                if (this.$util.trim(edge.rearCondition) != null) {
                  value = 1
                } else {
                  value = this.$util.trim(edge.assertVal)
                }
                if (this.$util.trim(edge.label) == null || value == null || this.$util.trim(edge.ro) == null) {
                  if (status.status) {
                    this.warn('请输入线段值')
                  }
                  this.flow.update(edge.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
                  this.submitStatus = false
                  return false
                }
              }
            } else if (nodes[i].shape == 'flow-rhombus-if') {
              if (this.$util.trim(edge.label) == null || this.$util.trim(edge.assertVal) == null) {
                if (status.status) {
                  this.warn('请输入线段值')
                }
                this.flow.update(edge.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
                this.submitStatus = false
                return false
              }
            } else if (nodes[i].shape == 'model-image-branch') {
              if (this.$util.trim(edge.label) == null) {
                if (status.status) {
                  this.warn('请输入线段值')
                }
                this.flow.update(edge.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
                this.submitStatus = false
                return false
              }
            }
          }
        }
      },
      //判断节点父节点
      judgeNode(node, edges, status) {
        if (node.shape == 'model-rect-attribute') {
          if (this.$util.trim(node.itemId) == null || this.$util.trim(node.childNodes) == null || node.pid.length == 0) {
            if (status.status) {
              this.warn('属性节点未完善或缺少结论节点和上级节点')
            }
            this.submitStatus = false
            return false
          }
        } else if (node.shape == 'model-image-branch') {
          if (this.$util.trim(node.label) == null || this.$util.trim(node.childNodes) == null || node.pid.length == 0) {
            if (status.status) {
              this.warn('分支节点或缺少结论节点和上级节点')
            }
            this.submitStatus = false
            return false
          }
        } else if (node.shape == 'flow-rhombus-if') {
          if (node.lo == 3) {
            let valueList = null
            if (this.$util.trim(node.rearCondition) != null) {
              valueList = 1
            } else {
              valueList = this.$util.trim(node.assertValList)
            }
            if (this.$util.trim(node.itemId) == null || this.$util.trim(node.ro) == null || this.$util.trim(node.childNodes) == null || node.pid.length == 0 || valueList == null) {
              if (status.status) {
                this.warn('条件节点或缺少结论节点和上级节点')
              }
              this.submitStatus = false
              return false
            }
          } else {
            let value = null
            if (this.$util.trim(node.rearCondition) != null) {
              value = 1
            } else {
              value = this.$util.trim(node.assertVal)
            }
            if (this.$util.trim(node.itemId) == null || this.$util.trim(node.ro) == null
              || value == null || this.$util.trim(node.childNodes) == null
              || node.pid.length == 0) {
              if (status.status) {
                this.warn('条件节点或缺少结论节点和上级节点')
              }
              this.submitStatus = false
              return false
            }
          }
        } else if (node.shape == 'model-card-conclusion') {
          if (this.$util.trim(node.inAccordanceWith) == null || this.$util.trim(node.levels) == null
            || (this.$util.trim(node.message) == null || this.$util.trim(node.suggest) == null
              || this.$util.trim(node.verdictType) == null || node.pid.length == 0)) {
            if (status.status) {
              this.warn('结论节点未完善或缺少上级节点')
            }
            this.flow.update(node.id, { isSelected: false })
            this.submitStatus = false
            return false
          }
        }
      },
      /**
       * @description: 保存流图数据
       */
      saveFlow() {
        this.titleData.loading = true;
        let data = this.flow.save()
        let list = []
        if (data.edges) {
          list = data.nodes.concat(data.edges)
        } else {
          list = data.nodes
        }
        for (let key in list) {
          delete list[key].childNodes
          if (list[key].type == 'node') {
            list[key].pid = this.getNodePids(data.edges, list[key].id)
          } else {
            list[key].pid = list[key].source
          }
          list[key].disOrder = list[key].index
          list[key].ruleId = this.$route.params.id
          list[key].verdictType = list[key].verdictType
          list[key].precondition = Number(list[key].precondition)
          list[key].itemId = Number(list[key].itemId)
          delete list[key].index
        }
        this.$axios({
          url: this.api.coreRuleNodeUpdate,
          method: 'post',
          data: { ruleNodeVOS: list, status: '0', ruleId: this.$route.params.id,isCopy:this.isCopy }
        }).then(res => {
          if (res.code == '200') {
            this.titleData.loading = false;
            this.success('保存成功')
          } else {
            this.titleData.loading = false;
            this.warn(res.msg);
          }
        }).catch(err => {
          this.titleData.loading = false;
          this.error(err);
        })
        localStorage.setItem('test', JSON.stringify(this.flow.save()))
      },
      /**
       * @description: 提交流图数据
       */
      submitFlow() {
        this.titleData.loading = true;
        this.verifyStatus = false
        let data = this.flow.save()
        let list = []
        if (data.edges) {
          list = data.nodes.concat(data.edges)
        } else {
          list = data.nodes
        }
        for (let key in list) {
          delete list[key].childNodes
          if (list[key].type == 'node') {
            list[key].pid = this.getNodePids(data.edges, list[key].id)
          } else {
            list[key].pid = list[key].source
          }
          list[key].disOrder = list[key].index
          list[key].verdictType = list[key].verdictType
          list[key].ruleId = this.$route.params.id
          delete list[key].index
        }
        this.verifyFlow({ status: false })
        if (this.submitStatus) {
          this.$axios({
            url:this.api.coreRuleNodeUpdate,
            method:'post',
            data:{ ruleNodeVOS: list, status: '1', ruleId: this.$route.params.id,isCopy:this.isCopy }
          }).then(res => {
            if (res.code == '200') {
              this.titleData.loading = false;
              this.success('提交成功')
            } else {
              this.titleData.loading = false;
              this.warn(res.msg)
            }
          }).catch(err => {
            this.titleData.loading = false;
            this.error(err)
          })
        } else {
          this.warn('流程图未完善不能提交，可以保存')
          this.titleData.loading = false;
        }

      },

      //复制规则
      copyRule() {
        this.modal.visible = true
      },
      //选择规则
      ruleModalChange(value) {
        this.ruleModalId = '' + value.key
      },
      //保存复制规则
      modalOk() {
        let _this = this
        this.modal.visible = false
        this.isCopy = '1'
        _this.flow.remove()
        setTimeout(() => {
          this.getNodeData({ ruleId: this.ruleModalId })
        }, 0)
      },
      //取消复制规则
      modalCancel() {
        this.modal.visible = false
      },
      getNodePids(edges, id) {
        let pids = []
        for (let y in edges) {
          let edge = edges[y]
          if (edge.target == id) {
            pids.push(edges[y].id)
          }
        }
        return pids.join(',')
      },
      /**
       * @description: 下载流图
       */
      // downloadFlow() {
      //   this.page.hideGrid()
      //   this.graph.setFitView('cc')
      //   const canvas = this.$refs.flow.childNodes[0].childNodes[0]

      //   const imgData = canvas.toDataURL('image/png')
      //   const pdf = new JsPDF({
      //     orientation: 'l', // 竖排
      //     unit: 'pt',
      //     format: 'a4'
      //   })
      //   // const width = 1190.55 // a3
      //   const pdfWidth = 840.51 // a4
      //   pdf.addImage(imgData, 'PNG', 0, 0,
      // pdfWidth, pdfWidth / canvas.width * canvas.height, '', 'FAST')
      //   pdf.save('download.pdf')
      // },

      /**
       * @description: 格式化
       */
      formatTooltip(val) {
        return `${val}%`
      },

      getDataList(params = {}) {
        if (params.ruleId == null) {
          params.ruleId = this.$route.params.id
          this.ruleId = this.$route.params.id
        } else {
          this.ruleId = params.ruleId
        }
        this.$axios({
          url: this.api.selectRuleContent,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.titleData.name = res.data.name
            this.titleData.status = res.data.status ? '启用' : '停用'
            this.titleData.type = res.data.type == 1 ? '系统' : null
            this.titleData.visible = res.data.type == 1 ? false : true

            let dealDate = moment(res.data.updateTime, 'YYYY-MM-DD hh:ss')
            this.titleData.updateTime =  dealDate.format('YYYY-MM-DD hh:ss')
            this.titleData.updateBy = res.data.updateBy
            this.titleData.type2 = res.data.type2
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          console.log(err)
          this.error(err)
        })
      },

      /**
       * @description:获取节点数据
       */
      getNodeData(params = {}) {
        this.spinning = true
        if (params.ruleId == null) {
          params.ruleId = this.$route.params.id
          this.ruleId = this.$route.params.id
        } else {
          this.ruleId = params.ruleId
        }
        this.$axios({
          url: this.api.RuleNodeAndRuleCable,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.spinning = false
            let edgesData = res.data.ruleCableVOS
            let nodeData = res.data.ruleNodeVOS
            let edges = []
            let nodes = []
            let x = 0
            let y = 0
            for (let key in nodeData) {
              if (nodeData[key].x) {
                x = nodeData[key].x
              } else {
                x = 0
              }
              if (nodeData[key].y) {
                y = nodeData[key].y
              } else {
                y = 0
              }
              let nodeSize = ''
              let nodeColor = ''
              switch (nodeData[key].shape) {
                case 'flow-circle-start':
                  nodeSize = '70*70'
                  nodeColor = '#FA8C16'
                  break
                case 'model-rect-attribute':
                  nodeSize = '180*70'
                  nodeColor = '#1890FF'
                  break
                case 'flow-rhombus-if':
                  nodeSize = '160*70'
                  nodeColor = '#13C2C2'
                  break
                case 'model-image-branch':
                  nodeSize = '80*70'
                  nodeColor = '#1890FF'
                  break
                case 'model-card-conclusion':
                  nodeSize = '290*80'
                  nodeColor = '#13C2C2'
                  break
              }
              nodes.push({
                color: nodeColor,
                id: nodeData[key].id,
                pid: '' + nodeData[key].pid,
                index: nodeData[key].id,
                shape: nodeData[key].shape,
                type: 'node',
                label: nodeData[key].label,
                levels: nodeData[key].levels,
                levelColor: nodeData[key].levelColor,
                message: nodeData[key].message,
                suggest: nodeData[key].suggest,
                sourcename: nodeData[key].sourcename,
                inAccordanceWith: nodeData[key].inAccordanceWith,
                verdictType: nodeData[key].verdictType,
                restrictionType: nodeData[key].restrictionType,
                ro: nodeData[key].ro,
                lo: nodeData[key].lo,
                roSymbol: nodeData[key].roSymbol,
                colDbType: nodeData[key].colDbType,
                handleType: nodeData[key].handleType,
                itemName: nodeData[key].itemName,
                itemId: nodeData[key].itemId,
                precondition: nodeData[key].precondition,
                dataDrilling: nodeData[key].dataDrilling,
                rearCondition: nodeData[key].rearCondition,
                calculation: nodeData[key].calculation,
                formula: nodeData[key].formula,
                calculated: nodeData[key].calculated,
                isRepeat: nodeData[key].isRepeat,
                assertVal: nodeData[key].assertVal,
                assertValList: nodeData[key].assertValList,
                assertVal1: nodeData[key].assertVal1,
                size: nodeSize,
                val: nodeData[key].ruleDatasourceVal,
                display: nodeData[key].ruleDatasourceDisplay,
                parentId: nodeData[key].ruleDatasourceParentId,
                y: y,
                x: x
              })
            }
            for (let key in edgesData) {
              let targetAnchor = 1
              if (key == 0) {
                targetAnchor = 0
              }
              edges.push({
                color: 'rgba(0,0,0,0.25)',
                id: edgesData[key].id,
                pid: edgesData[key].pid,
                label: edgesData[key].label,
                index: edgesData[key].id,
                shape: 'flow-smooth',
                source: edgesData[key].pid,
                sourceAnchor: 1,
                target: edgesData[key].target,
                ro: edgesData[key].ro,
                lo: edgesData[key].lo,
                roSymbol: edgesData[key].roSymbol,
                assertVal: edgesData[key].assertVal,
                assertValList: edgesData[key].assertValList,
                dataDrilling: edgesData[key].dataDrilling,
                rearCondition: edgesData[key].rearCondition,
                assertVal1: edgesData[key].assertVal1,
                targetAnchor: 0,
                type: 'edge'
              })
            }
            let list = nodes.concat(edges)
            let indexData = this.getNodeTreeData(list)
            let i = 0
            this.pieChartData = {}
            let nodeTree = this.recursiveNodeTree(indexData, 'undefined', i)
            let edgeData = this.getNodesData(nodeTree, [], 'edge')
            let nodesData = this.getDealPieChart()
            var temp = JSON.stringify({ edges: edgeData, nodes: nodesData })
            this.flow.read(JSON.parse(temp))
          } else {
            this.warn(res.msg)
            this.spinning = false
          }
        }).catch(err => {
          console.log(err)
          this.spinning = false
          this.error(err)
        })
      },
      getNodeTreeData(list) {
        let indexData = {}
        for (let key in list) {
          let pids = list[key].pid.split(',')
          for (let p in pids) {
            let pid = pids[p]
            let childNodes = indexData[pid]
            if (childNodes instanceof Array) {
              childNodes.push(list[key])
            } else {
              childNodes = [list[key]]
            }
            indexData[pid] = childNodes
          }
        }
        return indexData
      },
      recursiveNodeTree(indexData, pid, i) {
        i++
        let childNodes = indexData[pid]
        if (childNodes != null && childNodes != undefined) {
          for (let ckey in childNodes) {
            let cnode = childNodes[ckey]
            childNodes[ckey].childNodes = this.recursiveNodeTree(indexData, cnode.id, i)
            if (childNodes[ckey].type == 'node') {
              let shapeKey = i
              if (childNodes[ckey].shape == 'model-card-conclusion') {
                shapeKey = 999
              }
              if (!this.pieChartData[shapeKey]) {
                this.pieChartData[shapeKey] = []
              }
              this.pieChartData[shapeKey].push(childNodes[ckey])
            }
          }
        }
        return childNodes
      },
      getDealPieChart() {
        let newNodeData = []
        let yHeight = 1
        for (let key in this.pieChartData) {
          let data = this.pieChartData[key]
          let yLength = data.length / 2
          for (let i in data) {
            if (data[i].x && data[i].y) {
              data[i].x = data[i].x
              data[i].y = data[i].y
            } else {
              if (key == 999) {
                if (i >= data.length / 2) {
                  data[i].y = (i - yLength) * 130
                  data[i].yaxis = (i - yLength) * 130
                } else {
                  data[i].y = -(yLength - i) * 130
                  data[i].yaxis = -(yLength - i) * 130
                }
                let pieDataLength = Object.getOwnPropertyNames(this.pieChartData).length
                data[i].x = pieDataLength * 300
              } else if (key == 1) {
                data[i].x = 0
              } else {
                if (i >= data.length / 2) {
                  data[i].y = (i - yLength) * 250
                  data[i].yaxis = (i - yLength) * 250
                } else {
                  data[i].y = -(yLength - i) * 250
                  data[i].yaxis = -(yLength - i) * 250
                }
                data[i].x = key * 180
              }
            }
          }
          yHeight = yLength
          newNodeData = newNodeData.concat(data)
        }
        let keys = []
        let nodes = []
        for (let key in newNodeData) {
          if (keys.indexOf(newNodeData[key].id) == -1) {
            keys.push(newNodeData[key].id)
            delete newNodeData[key].childNodes
            nodes.push(newNodeData[key])
          }
        }
        return nodes
      },
      //获取树形结构node
      getNodesData(nodeShaft, data, type) {
        for (let key in nodeShaft) {
          if (nodeShaft[key].childNodes) {
            if (nodeShaft[key].type == 'edge') {
              data.push(nodeShaft[key])
            }
            this.getNodesData(nodeShaft[key].childNodes, data, 'edge')
          } else {
            if (nodeShaft[key].type == 'edge') {
              data.push(nodeShaft[key])
            }
          }
        }
        return data
      },

      getReviewLevel() {
        this.$axios({
          url:this.api.reviewAuditlevelSelect,
          method:'put',
          data:{}
        }).then(res => {
          if (res.code == '200') {
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },

      //
      addRuleData() {
        this.$refs.addRule.drugForm.resetFields()
        setTimeout(() => {
          this.$refs.addRule.drugForm.setFieldsValue({ type2: 1 })
        }, 0)
        this.addVisible = true
      },
      //新增规则
      addRuleOk(data) {
        this.$refs.addRule.drugForm.validateFields((err, values) => {
            if (!err) {
              let params = {}
              if (values.name) {
                params.name = values.name
                params.type2 = values.type2
              } else {
                params.name = data.label
                params.limitedItemid = data.key
                params.type2 = values.type2
              }
              this.addVisible = false
              this.$axios({
                url: this.api.coreRuleUpdate,
                method: 'post',
                data: params
              }).then(res => {
                if (res.code == '200') {
                  let _this = this
                  this.success(res.msg)
                  this.addVisible = false
                  this.$router.push({
                    name: 'flowChartEditor',
                    params: { id: res.data.id, type: res.data.type }
                  })
                  _this.flow.remove()
                  setTimeout(() => {
                    this.getNodeData({ ruleId: res.data.id })
                    this.getDataList({ ruleId: res.data.id })
                  }, 0)
                } else {
                  this.warn(res.msg)
                  this.addVisible = false
                }
              }).catch(err => {
                this.error(err)
                this.addVisible = false
              })
            }
          }
        )
      },

      //取消新增规则
      addRuleCancel() {
        this.addVisible = false
      },
      getCoreFactAllStart() {
        this.$axios({
          url:this.api.coreFactColAll,
          method:'put',
          data:{}
        }).then(res => {
          if (res.code == '200') {
            let indexData = this.dealAllStartTree(res.rows)
            this.CoreFactAllTree = this.dealNodeTree(indexData, 'undefined')
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
              id: list[key].id,
              pid: '' + list[key].pid,
              lo: list[key].lo,
              colDbType: list[key].colDbType

            })
          } else {
            children = [{
              title: list[key].colName,
              value: '' + list[key].id,
              key: '' + list[key].id,
              disabled: list[key].isleaf ? true : false,
              id: list[key].id,
              pid: '' + list[key].pid,
              lo: list[key].lo,
              colDbType: list[key].colDbType
            }]
          }
          indexData[list[key].pid] = children
        }
        return indexData
      },
      dealNodeTree(indexData, pid) {
        let children = indexData[pid]
        if (children != null && children != undefined) {
          for (let ckey in children) {
            let cnode = children[ckey]
            children[ckey].children = this.recursiveNodeTree(indexData, cnode.id)
          }
        }
        return children
      },
      getPrePidData(id, data) {
        for (let key in data) {
          if (id == data[key].id) {
            this.prePid = data[key].pid
            return
          } else {
            this.getPrePidData(id, data[key].children)
          }
        }
      },
      getPreData(pid, data) {
        if (this.$util.trim(pid) && pid == 15) {
          for (let key in data) {
            if (pid == data[key].id ) {
              return data[key].children
            }
          }
        } else {
          return []
        }
      },
    }
  }
</script>

<style>
  html {
    overflow: hidden;
  }

  　
    /* .page {
      height: 700px;
    } */
  .editorg6 {
    margin: 0px;
    background-color: white;
    position: relative;
    left: 0px;
    top: 0px;
  }

  .editorg6 div {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
</style>
