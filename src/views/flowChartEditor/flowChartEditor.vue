<template>
  <div class="editorg6">
    <!-- 工具栏 -->
    <a-toolbar v-bind:saveFlow="saveFlow" ref="toolbar"></a-toolbar>
    <div style="height: 42px;"></div>
    <div class="bottom-container">
      <!-- 节点 -->
      <a-itempanel ref="itempannel"></a-itempanel>
      <!-- 属性节点 -->
      <a-detailpanel
        ref="detailpannel"
        v-bind:graphAPI="graph"
        v-bind:selectNode="selectNode"
        v-bind:selectEdge="selectEdge"
      ></a-detailpanel>
      <!-- 缩略图 -->
      <a-navigator ref="navigator" v-bind:graphAPI="graph"></a-navigator>
      <!-- 右键菜单 -->
      <a-contextmenu ref="contextmenu"></a-contextmenu>

      <div id="page" class="page" ref="flow" :style="conheight"></div>
    </div>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
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

//控件模块加载
import contextmenu from './model/contextmenu'
import detailpanel from './model/detailpanel'
import itempanel from './model/itempanel'
import navigator from './model/navigator'
import toolbar from './model/toolbar'

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
    'a-toolbar': toolbar
  },
  data() {
    return {
      page: null,
      flow: null,
      graph: null,
      selectNode: {
        id: null,
        shape: null,
        label: null,
        ///-------结论节点特有属性---------
        basisLabel: null,
        messageLabel: null,
        suggestLabel: null,
        colorLevel: '#ffffff',
        level:'0',
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
        sourceType: null,
        targetId: null,
        targetType: null
      },
      conheight: {
        height: '700px'
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
      gridCheck: false
    }
  },
  mounted() {
    this.initEditor()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  computed: {
    selectNodeBasisLabel() {
      return this.selectNode.basisLabel
    },
    selectNodeMessageLabel() {
      return this.selectNode.messageLabel
    },
    selectNodeSuggestLabel() {
      return this.selectNode.suggestLabel
    },
    selectNodecolorLevel() {
      return this.selectNode.colorLevel
    },
    selectNodeLevel() {
      return this.selectNode.level
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
    selectEdgeLabel() {
      return this.selectEdge.label
    }
  },

  watch: {
    selectNodeLevel(newValue, oldValue) {
      if (newValue != oldValue) {
        this.flow.update(this.selectNode.id, { level: newValue })
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
    selectNodeBasisLabel(newValue, oldValue) {
      if (newValue != oldValue) {
        this.flow.update(this.selectNode.id, { basisLabel: newValue })
      }
    },
    selectNodeMessageLabel(newValue, oldValue) {
      if (newValue != oldValue) {
        this.flow.update(this.selectNode.id, { messageLabel: newValue })
      }
    },
    selectNodeSuggestLabel(newValue, oldValue) {
      if (newValue != oldValue) {
        this.flow.update(this.selectNode.id, { suggestLabel: newValue })
      }
    },
    selectNodelabel(newValue, oldValue) {
      if (newValue != oldValue) {
        this.flow.update(this.selectNode.id, { label: newValue })
      }
    },
    selectNodecolorLevel(newValue, oldValue) {
      if (newValue != oldValue) {
        switch (this.selectNode.shape) {
          case 'model-card-conclusion':
            this.flow.update(this.selectNode.id, { colorLevel: newValue })
            break
          case 'model-rect-attribute':
            this.flow.update(this.selectNode.id, { color: newValue })
            break
        }
      }
    },
    selectEdgeLabel(newValue, oldValue) {
      if (newValue != oldValue && newValue != null) {
        this.flow.update(this.selectEdge.id, { label: { text: newValue } })
      }
    }
  },
  methods: {
    saveFlow() {
      console.log(this.flow.save(),"保存信息");//
     localStorage.setItem('test', JSON.stringify(this.flow.save()))
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
      this.g6data && this.flow.read(this.g6data)
      let temp = localStorage.getItem('test')
      if (temp != null) {
        this.flow.read(JSON.parse(temp))
      }
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
        shape: 'flow-polyline' //flow-polyline-round
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
        // console.log(ev)
        // 判断数据类型
        switch (ev.item.type) {
          case 'node':
            if (!ev.item.isSelected) {
              _this.nodeId = ev.item.model.id
              let model = ev.item.model
              let shape = ev.item.shapeObj

              _this.selectNode.id = model.id
              _this.selectNode.shape = model.shape
              _this.selectNode.label = model.label != null ? model.label : shape.label
              switch (_this.selectNode.shape) {
                case 'model-card-conclusion':
                  _this.selectNode.basisLabel = model.basisLabel != null ? model.basisLabel : shape.basisLabel
                  _this.selectNode.colorLevel = model.colorLevel != null ? model.colorLevel : shape.colorLevel
                  _this.selectNode.messageLabel = model.messageLabel != null ? model.messageLabel : shape.messageLabel
                  _this.selectNode.suggestLabel = model.suggestLabel != null ? model.suggestLabel : shape.suggestLabel
                  _this.selectNode.level = model.level != null ? model.level : shape.level
                  break
                case 'model-rect-attribute':
                  _this.selectNode.colorLevel = model.color != null ? model.color : shape.color
                  _this.selectNode.prototypes = model.prototypes != null ? model.prototypes : shape.prototypes
                  _this.selectNode.field = model.field != null ? model.field : shape.field
                  break
              }
            } else {
              _this.multiId.push(ev.item.model.id)
            }

            break
          case 'edge':
            //选中后设置颜色 和连接线的宽度
            _this.flow.update(ev.item.model.id, { style: { stroke: '#1890ff', lineWidth: 3 } })
            setTimeout(() => {
              _this.selectEdge.id = ev.item.model.id
              _this.selectEdge.label = ev.item.model.label ? ev.item.model.label.text : null

              _this.selectEdge.sourceId = ev.item.source.id
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
        // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
        if (ev.dragEndPointType === 'target') {
         
          //已经连接过的点禁用
          if (ev.target.model.shape!="model-card-conclusion"&&this.page.anchorHasBeenLinked(ev.target, ev.targetAnchor)) {
            ev.cancel = true
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
        console.log(ev, ev.dragEndPointType)
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

    /**
     * @description: 保存流图数据
     */
    saveFlow() {
      localStorage.setItem('test', JSON.stringify(this.flow.save()))
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
    }
  }
}
</script>

<style  >
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
