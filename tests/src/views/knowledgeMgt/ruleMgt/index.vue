<template>
  <a-card>
    <a-row class="ruleRow">
      <a-col :xl="8" :xxl="5">
        <div class="ruleCow">
          <a-card>
            <a-row>
              <a-col :span="13">
                <a-input @pressEnter="pressEnterChange" placeholder="请输入" @change="onChange" />
              </a-col>
              <a-col class="treeCol" :span="5">
                <a-button size="small" type="primary" @click="searchRule">查询</a-button>
              </a-col>
              <a-col :span="6" class="treeCol">
                <a-dropdown :trigger="['click']">
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="newTreeNode">新增</a-menu-item>
                    <a-menu-item key="2" @click="updateTreeNode">编辑</a-menu-item>
                    <a-menu-item key="3" @click="deleteTreeNode">删除</a-menu-item>
                  </a-menu>
                  <a :disabled="disable">
                    操作
                    <a-icon type="down" />
                  </a>
                </a-dropdown>
              </a-col>
            </a-row>
            <a-row>
              <a-spin tip="加载中..." :spinning="loading">
                <a-tree
                  class="draggable-tree"
                  :treeData="gData"
                  :loadData="onLoadData"
                  @select="onSelect"
                ></a-tree>
              </a-spin>
            </a-row>
          </a-card>
        </div>
      </a-col>
      <a-col :xl="16" :xxl="19">
        <a-card>
          <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
            </div>
          </Searchpanel>
          <a-button class="margin-top-10" type="primary" :disabled="disable" @click="addMdc">添加规则</a-button>
          <a-spin tip="加载中..." :spinning="loadingTable">
            <el-table
              ref="table"
              :data="loadData"
              border
              class="margin-top-10"
              :highlight-current-row="true"
            >
              <el-table-column
                :show-overflow-tooltip="true"
                v-for="item in columns"
                :key="item.prop"
                :label="item.title"
                :prop="item.prop"
                :width="item.width"
                :align="item.align"
              >
                <template slot-scope="props">
                  <span v-if="item.prop == 'status'">
                    <a-badge
                      :status="props.row.status == 0? 'default':'processing'"
                      :text="props.row.status==0?'停用':'启用'"
                    />
                  </span>
                  <span v-else-if="item.prop == 'type'" v-html="ruleType(props.row.type)"></span>
                  <span v-else-if="item.prop == 'type2'" v-html="typeType(props.row.type2)"></span>
                  <span v-else-if="item.prop == 'action'">
                    <a @click="look(props)" v-if="props.row.type == 1">查看</a>
                    <a @click="edit(props)" v-else>编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm
                      title="确认启用吗？"
                      placement="topLeft"
                      @confirm="updateStatus(props.row,1)"
                      v-if="props.row.status == '0'"
                    >
                      <a>启用</a>
                    </a-popconfirm>
                    <a-popconfirm
                      title="确认停用吗？"
                      placement="topLeft"
                      @confirm="updateStatus(props.row,0)"
                      v-else
                    >
                      <a>停用</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if="props.row.type == 2" />
                    <a-popconfirm
                      style="width: 50px"
                      title="确定删除?"
                      placement="topRight"
                      @confirm="del(props.row)"
                      v-if="props.row.type == 2"
                    >
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <a-pagination
              showSizeChanger
              showQuickJumper
              :total="total"
              class="pnstyle"
              :defaultPageSize="pageSize"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="pageChangeSize"
              @change="pageChange"
              size="small"
              v-model="current"
            ></a-pagination>
          </a-spin>
        </a-card>
      </a-col>
      <a-modal
        :title="Modal.modalTitle"
        :visible="Modal.visible"
        @ok="handleOk"
        :confirmLoading="Modal.confirmLoading"
        @cancel="handleCancel"
        class="ruleModal"
        :maskClosable="false"
      >
        <a-form :form="form">
          <a-form-item
            style="padding-top: 20px"
            label="分类名称"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
          >
            <a-input v-decorator="[ 'title' ]" />
          </a-form-item>
          <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
            <a-select v-decorator="[ 'type2' ]" :disabled="treeEditor">
              <a-select-option
                :value="op.id"
                v-for="(op,index) in this.enum.ruleClassification"
                :key="index"
              >{{op.text}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        :title="drugModal.modalTitle"
        :visible="drugModal.visible"
        @ok="drugOk"
        :confirmLoading="drugModal.confirmLoading"
        @cancel="drugCancel"
        width="600px"
        :maskClosable="false"
      >
        <a-form :form="drugForm">
          <a-form-item
            label="药品"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
            v-if="selkeys == 1"
          >
            <a-select
              v-decorator="[ 'limitedItemid',  {rules: [{ required: true,message: '请选择药品'  }]} ]"
              showSearch
              allowClear
              optionLabelProp="title"
              @search="handleSearch"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              labelInValue
              @change="handleChange"
            >
              <a-select-option
                :value="op.drugCode"
                v-for="(op,index) in selectDrug"
                :key="op.drugCode"
                :title="op.drugName"
              >
                <a-row>
                  <a-col class="selectCol" :span="20">{{op.drugName}}</a-col>
                  <a-col :span="4" style="text-align: right">
                    <a-tag>{{op.dosageForms}}</a-tag>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="opacity8">{{op.producedBy}}</a-col>
                </a-row>
                <a-divider style="margin: 8px 0 0 0;" />
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="药品分类"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
            v-if="selkeys == 2"
          >
            <a-select
              v-decorator="[ 'categoryId',  {rules: [{ required: true,message: '请选择分类规则'  }]} ]"
              showSearch
              optionLabelProp="title"
              @search="handleCategory"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              labelInValue
              @change="handleChange"
            >
              <a-select-option
                :value="op.categoryId"
                v-for="(op,index) in selectCategory"
                :key="op.categoryId"
                :title="op.categoryName"
              >
                <a-row>
                  <a-col :span="23" class="selectCol">{{op.categoryName}}</a-col>
                  <a-col v-if="op.isleaf == '1'" style="text-align: right">
                    <a-tag>存在下级</a-tag>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col style="opacity: 0.6">{{op.categoryPath}}</a-col>
                </a-row>
                <a-divider style="margin: 8px 0 0 0;" />
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="药品组"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
            v-if=" selkeys == 3"
          >
            <a-select
              v-decorator="[ 'limited',{rules: [{ required: true,message: '请选择药品组'  }]} ]"
              showSearch
              allowClear
              @search="searchCoreRule"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              labelInValue
              @change="handleChange"
            >
              <a-select-option :value="op.id" v-for="op in coreRule" :key="op.id">{{op.specName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="规则名称"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 15 }"
            v-if=" selkeys == 4"
          >
            <a-input v-decorator="[ 'name',{rules: [{ required: true,message: '请输入规则名称'  }]} ]"></a-input>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-row>
  </a-card>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'ruleMgt',
  data() {
    this.handleSearch = debounce(this.handleSearch, 800)
    this.searchCoreRule = debounce(this.searchCoreRule, 800)
    return {
      api:{
        coreRuleTypeSelect:'/sys/coreRuleType/selectTypePid',
        coreRuleTypePage:'/sys/coreRule/selectPage',
        coreRuleTypeUpdate:'/sys/coreRuleType/update',
        coreRuleTypeDelete:'/sys/coreRuleType/delete',
        coreRuleSelectKeyword:'/sys/coreRule/selectDrugKeyword',
        coreRuleUpdate:'/sys/coreRule/update',
        coreRuleDelete:'/sys/coreRule/delete',
        coreRuleGroupSpec: '/sys/coreRule/coreGroupingSpec',
        coreRuleCategoryKeyword:'/sys/coreRule/selectCategoryKeyword',
      },
      loadedKeys: ['1', '2'],
      //树形机构数据
      gData: [],
      //网格数据
      loadData: [],
      loading: false,
      loadingTable: false,
      confirmLoading: false,
      //网格列
      columns: [
        { title: '规则', prop: 'type', width: 90, align: 'center' },
        { title: '类型', prop: 'type2', width: 90, align: 'center' },
        { title: '规则名称', prop: 'name' },
        { title: '更新人', prop: 'updatorby', width: 150 },
        { title: '更新时间', prop: 'updateTime', width: 150 },
        { title: '状态', prop: 'status', width: 80, align: 'center' },
        { title: '操作', prop: 'action', width: 160, align: 'center' }
      ],
      total: 10,
      pageSize: 10,
      items: [
        { text: '编辑', showtip: false, click: this.edit },
        { text: '删除', color: '#E6A23C', showtip: true, tip: '确认删除吗？', click: this.delRow },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.changeStatus }
      ],
      //药品数据和表格title
      drugData: [{ drugId: '123456', drugName: '阿司匹林', dosage: '颗粒', manufacturer: '肛泰制药' }],
      //药品列
      column2: [
        { title: '药品编码', prop: 'drugId', width: 100 },
        { title: '药品名称', prop: 'drugName' },
        { title: '剂型', prop: 'dosage', width: 70 },
        { title: '生成厂家', prop: 'manufacturer', width: 100 }
      ],
      values: '',
      selectNode: '',
      //操作按钮停用启用
      disable: true,
      //分类modal
      Modal: {
        modalTitle: '新增分类',
        visible: false,
        confirmLoading: false
      },
      // 药品modal
      drugModal: {
        modalTitle: '添加规则',
        visible: false,
        confirmLoading: false
      },

      form: this.$form.createForm(this),
      drugForm: this.$form.createForm(this),
      //选择分类Id
      typeIds: '-1',
      selkeys: '',
      parentData: {},
      //编辑新增树
      treeEditor: false,
      selectDrug: [],
      coreRule: [],
      ruleName: '',
      selectCategory: [],
      current: 1
    }
  },
  mounted() {
    this.getData()
    this.getPageData()
  },
  computed: {
    list() {
      return [
        {
          name: '规则名称',
          dataField: 'name',
          type: 'text'
        },
        {
          name: '状态',
          dataField: 'status',
          type: 'select',
          dataSource: this.enum.status,
          keyExpr: 'id',
          valueExpr: 'text'
        }
      ]
    }
  },
  methods: {
    //搜索
    search() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
      console.log(params)
      params.pageSize = 10
      params.offset = 0
      this.getPageData(params)
    },
    //重置
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.getPageData({ offset: 0, pageSize: 10 })
    },
    //查询按下回车的回调
    pressEnterChange(e) {
      this.searchRule()
    },
    //查询
    searchRule() {
      const expandedKeys = this.dataList
        .map(item => {
          if (this.values) {
            if (item.title.indexOf(this.values) > -1) {
              return this.getParentKey(item.title, this.gData)
            }
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: this.values
      })
    },
    //输入框值改变事件
    onChange(e) {
      // this.values = e.target.value
    },
    //树形节点点击事件
    onSelect(selectedKeys, e) {
      this.drugForm.resetFields()
      this.typeIds = e.node.dataRef.key
      this.getPageData()
      this.selectNode = e.node.dataRef
      if (e.node.dataRef.type == '2') {
        this.disable = false
      } else {
        this.disable = true
      }
      if (e.node.dataRef.type2 == 1) {
        this.drugModal.modalTitle = '添加药品规则'
        this.selkeys = 1
        this.coreRuleSelect({ keyword: '' })
      } else if (e.node.dataRef.type2 == 2) {
        this.drugModal.modalTitle = '添加药品分类规则'
        this.selkeys = 2
        this.coreRuleCategory({ keyword: '' })
      } else if (e.node.dataRef.type2 == 3) {
        this.drugModal.modalTitle = '添加药品组规则'
        this.coreRuleGroup({ keyword: '' })
        this.selkeys = 3
      } else if (e.node.dataRef.type2 == 4) {
        this.drugModal.modalTitle = '添加全局规则'
        this.selkeys = 4
      }
    },
    //树形节点展开事件
    onExpand(expandedKeys) {},
    //异步加载数据
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        setTimeout(() => {
          let params = {}
          params.typePid = treeNode.dataRef.key
          this.$axios({
            url:this.api.coreRuleTypeSelect,
            method:'put',
            data:params,
          })
            .then(res => {
              if (res.code == '200') {
                treeNode.dataRef.children = []
                for (let i in res.rows) {
                  let isLeaf = false
                  if (res.rows[i].isleaf == 1) {
                    isLeaf = false
                  } else {
                    isLeaf = true
                  }
                  treeNode.dataRef.children.push({
                    key: res.rows[i].typeId,
                    title: res.rows[i].typeName,
                    isLeaf: isLeaf,
                    type: res.rows[i].type,
                    type2: res.rows[i].type2,
                    typePid: res.rows[i].typePid
                  })
                }
                this.gData = [...this.gData]
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
          resolve()
        }, 500)
      })
    },
    //获取tree初始数据
    getData() {
      this.gData = []
      let params = {}
      params.typePid = -1
      this.loading = true
      this.$axios({
        url:this.api.coreRuleTypeSelect,
        method:'put',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            this.dealData(res.rows)
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.error(err)
        })
    },
    //处理tree初始数据
    dealData(data) {
      for (let i in data) {
        let isleaf = false
        if (data[i].isleaf == 1) {
          isleaf = false
        } else {
          isleaf = true
        }
        this.gData.push({
          key: data[i].typeId,
          title: data[i].typeName,
          isLeaf: isleaf,
          type: data[i].type,
          type2: data[i].type2
        })
      }
    },

    //分类新增子集按钮事件
    newTreeNode() {
      console.log(this.selectNode)
      if (this.selectNode) {
        this.Modal.modalTitle = '新增分类'
        this.Modal.visible = true
        this.treeEditor = false
        this.form.resetFields()
      } else {
        this.warn('请选择规则')
      }
    },
    //分类更新按钮事件
    updateTreeNode() {
      setTimeout(() => {
        this.form.setFieldsValue({ title: this.selectNode.title, type2: this.selectNode.type2 })
      }, 100)
      this.Modal.modalTitle = '编辑分类'
      this.Modal.visible = true
      this.treeEditor = true
    },
    //分类删除按钮事件
    deleteTreeNode() {
      if (this.selectNode) {
        let params = { id: this.selectNode.key }
        this.$axios({
          url:this.api.coreRuleTypeDelete,
          method:'delete',
          data:params,
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
              setTimeout(() => {
                this.selectParent(this.selectNode, this.gData)
                this.$set(this.gData)
              })
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      } else {
        this.warn('请选择规则')
      }
    },
    selectParent(params, gdata) {
      for (let i in gdata) {
        let item = gdata[i]
        if (item.key == params.typePid) {
          for (let j in item.children) {
            if (item.children[j].key == params.key) {
              item.children.splice(j, 1)
            }
          }
          return
        } else if (item.children) {
          this.selectParent(params, item.children)
        }
      }
    },
    //提交分类操作
    handleOk() {
      let data = this.form.getFieldsValue()
      let params = {}
      if (this.Modal.modalTitle == '新增分类') {
        params.pid = this.selectNode.key
        params.name = data.title
        params.type2 = data.type2
      } else {
        params.id = this.selectNode.key
        params.name = data.title
      }
      this.Modal.visible = false
      this.$axios({
        url:this.api.coreRuleTypeUpdate,
        method:'post',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            if (this.Modal.modalTitle == '编辑分类') {
              this.updateGdata(params, this.gData)
            } else {
              if (this.selectNode.children) {
                // this.addGdata(params, this.gData);
              }
            }
            this.success(res.msg)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },

    //本地编辑时修改gdata
    updateGdata(params, gdata) {
      for (let i in gdata) {
        let item = gdata[i]
        if (item.key == params.id) {
          item.title = params.name
          item.isleaf = '1'
          item.children.push(params)
          return
        } else if (item.children) {
          this.updateGdata(params, item.children)
        }
      }
    },
    //新增
    addGdata(params, gdata) {
      for (let i in gdata) {
        let item = gdata[i]
        if (item.key == params.pid) {
          let list = {}
          list.type = 2
          list.type2 = params.type2
          list.isleaf = '1'
          list.typeName = params.name
          list.typePid = params.pid
          item.children.push(list)
          return
        } else if (item.children) {
          this.updateGdata(params, item.children)
        }
      }
    },
    //取消分类操作
    handleCancel() {
      this.Modal.visible = false
    },

    //药品select列
    coreRuleSelect(params = {}) {
      this.$axios({
        url:this.api.coreRuleSelectKeyword,
        method:'post',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            this.selectDrug = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //药品分类列
    coreRuleCategory(params = {}) {
      this.$axios({
        url:this.api.coreRuleCategoryKeyword,
        method:'put',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            this.selectCategory = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //药品组select列
    coreRuleGroup(params = {}) {
      this.$axios({
        url:this.api.coreRuleGroupSpec,
        method:'put',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            for (let key in res.rows) {
              this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
            }
            console.log(this.coreRule)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //药品选择列搜索
    handleSearch(value) {
      this.$axios({
        url:this.api.coreRuleSelectKeyword,
        method:'post',
        data:{ keyword: value },
      })
        .then(res => {
          if (res.code == '200') {
            this.selectDrug = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //药品分类搜索
    handleCategory(value) {
      this.$axios({
        url:this.api.coreRuleCategoryKeyword,
        method:'put',
        data:{ keyword: value },
      })
        .then(res => {
          if (res.code == '200') {
            this.selectCategory = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //药品组搜索
    searchCoreRule(value) {
      this.$axios({
        url:this.api.coreRuleGroupSpec,
        method:'put',
        data:{ keyword: value },
      })
        .then(res => {
          if (res.code == '200') {
            for (let key in res.rows) {
              this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
            }
            console.log(this.coreRule)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },

    //添加药品按钮事件
    addMdc() {
      if (!this.disable) {
        this.drugModal.visible = true
      } else {
        this.warn('请选择规则')
      }
    },
    //药品确认选
    drugOk(e) {
      this.drugForm.validateFields((err, values) => {
        if (!err) {
          let params = {}
          if (values.name) {
            params.name = values.name
          } else {
            params.name = this.ruleName.label
            params.limitedItemid = this.ruleName.key
          }
          params.type = this.selectNode.type
          params.type2 = this.selectNode.type2
          params.typeId = this.selectNode.key
          this.$axios({
            url:this.api.coreRuleUpdate,
            method:'put',
            data:params,
          })
            .then(res => {
              if (res.code == '200') {
                this.getPageData()
                this.success(res.msg)
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
          this.drugModal.visible = false
        }
      })
    },
    //药品取消
    drugCancel() {
      this.drugModal.visible = false
    },
    //药品搜索
    searchDrug(e) {},

    //获取网格分页
    getPageData(params = {}) {
      params.typeId = this.typeIds
      this.loadingTable = true
      this.$axios({
        url:this.api.coreRuleTypePage,
        method:'put',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            if (params.offset == 0) {
              this.current = 1
            }
            this.loadData = res.rows
            this.total = res.total
            this.loadingTable = false
          } else {
            this.loadingTable = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loadingTable = false
          this.error(err)
        })
    },
    //页面数change事件
    pageChangeSize(page, pageSize) {
      this.getPageData({ offset: (page - 1) * pageSize, pageSize: pageSize })
    },
    //页面跳转事件
    pageChange(page, pageSize) {
      this.getPageData({ offset: (page - 1) * pageSize, pageSize: pageSize })
    },
    //编辑操作
    edit(data) {
      console.log(data)
      let newPage = this.$router.resolve({
        name: 'flowChartEditor',
        query: { id: data.row.id }
      })
      window.open(newPage.href, '_blank')
    },
    //查看炒作
    look(data) {
      let newPage = this.$router.resolve({
        name: 'flowChartEditor'
      })
      window.open(newPage.href, '_blank')
    },
    handleChange(value) {
      console.log(value)
      this.ruleName = value
    },

    //操作启用停用
    updateStatus(row, val) {
      let params = {}
      params.id = row.id
      params.status = val
      this.$axios({
        url:this.api.coreRuleUpdate,
        method:'put',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            this.success('操作成功', () => {
              this.getPageData({ offset: (this.current - 1) * 10, pageSize: 10 })
            })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //操作删除
    del(value) {
      let params = {}
      params.id = value.id
      this.$axios({
        url:this.api.coreRuleDelete,
        method:'delete',
        data:params,
      })
        .then(res => {
          if (res.code == '200') {
            this.success(res.msg, () => {
              this.getPageData()
            })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },

    //filter
    ruleType(value) {
      if (value == '1') {
        return '系统'
      } else if (value == '2') {
        return '自定义'
      }
    },
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
.ruleCow {
  padding-right: 5px;
}

.treeCol {
  padding-left: 10px;
  line-height: 32px;
}

.ruleRow .ant-card-body {
  padding: 24px 20px !important;
}

.ruleModal .ant-modal-body {
  padding: 4px !important;
}

.drugModal .ant-modal-body {
  /*text-align: right;*/
}

.selectCol {
  overflow: hidden;
  text-align: left;
  display: inline-block;
  width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>