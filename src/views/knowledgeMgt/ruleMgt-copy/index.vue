<template>
  <a-card>
    <a-row class="ruleRow">
      <Searchpanel ref="searchPanel" :list="list"  :choose="choose">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10" type="primary" @click="addMdc">添加规则</a-button>
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
              <span v-else-if="item.prop == 'type'" v-html="typeRule(props.row.type)"></span>
              <span
                v-else-if="item.prop == 'type2'"
                v-html="typeType(props.row.type2)"
              ></span>
              <span v-else-if="item.prop == 'action'">
                                <a @click="look(props)" v-if="props.row.type == 1">查看</a>
                                <a @click="edit(props)" v-else>编辑</a>
                                <a-divider type="vertical"/>
                                <a-popconfirm
                                  title="确认启用吗？"
                                  placement="topRight"
                                  @confirm="updateStatus(props.row)"
                                  v-if="props.row.status == '0'"
                                >
                                    <a>启用</a>
                                </a-popconfirm>
                                <a-popconfirm
                                  title="确认停用吗？"
                                  placement="topRight"
                                  @confirm="updateStatus(props.row)"
                                  v-else
                                >
                                    <a style="color:#ff9900">停用</a>
                                </a-popconfirm>
                                <a-divider type="vertical" v-if="props.row.type == 2"/>
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
      <a-modal
        :maskClosable="false"
        :title="drugModal.modalTitle"
        :visible="drugModal.visible"
        @ok="drugOk"
        :confirmLoading="drugModal.confirmLoading"
        @cancel="drugCancel"
        width="700px"
      >
        <a-form :form="drugForm">
          <a-form-item label="类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
            <a-radio-group
              v-decorator="[ 'type2',  {rules: [{ required: true,message: '请选择类型'}]}  ]"
              @change="selectType"
              placeholder="请选择类型"
            >
              <a-radio
                :value="op.id"
                v-for="(op,index) in this.enum.ruleClassification"
                :key="index"
              >{{op.text}}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="药品"
            :label-col="{ span: 4 }"
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
              placeholder="请选择药品"
            >
              <a-select-option
                :value="op.drugCode"
                v-for="(op,index) in selectDrug"
                :key="op.drugCode"
                :title="op.drugName"
              >
                <a-row>
                  <a-col :span="16">{{op.drugName}}</a-col>
                  <a-col :span="8" style="text-align: right">
                    <a-tag>{{op.dosageForms}}</a-tag>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col style="opacity: 0.6">生产厂商：{{op.producedBy}}</a-col>
                </a-row>
                <a-divider style="margin: 8px 0 0 0;"/>
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="药品分类"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 17 }"
            v-if="selkeys == 2"
          >
            <a-select
              v-decorator="[ 'categoryId',  {rules: [{ required: true,message: '请选择分类'  }]} ]"
              showSearch
              optionLabelProp="title"
              @search="handleCategory"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              labelInValue
              @change="handleChange"
              placeholder="请选择分类"
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
                <a-divider style="margin: 8px 0 0 0;"/>
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="药品组"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 17 }"
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
              placeholder="请选择药品组"
            >
              <a-select-option
                :value="op.id"
                v-for="op in coreRule"
                :key="op.id"
              >{{op.specName}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="规则名称"
            :label-col="{ span: 4}"
            :wrapper-col="{ span: 17 }"
            v-if=" selkeys == 4"
            placeholder="请输入规则名称"
          >
            <a-input
              v-decorator="[ 'name',{rules: [{ required: true,message: '请输入规则名称'  }]} ]"
            ></a-input>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-row>
  </a-card>
</template>

<script>
  import {
    coreRuleTypeSelect,
    coreRuleTypePage,
    coreRuleTypeUpdate,
    coreRuleTypeDelete,
    coreRuleSelectKeyword,
    coreRuleGroupSpec,
    coreRuleUpdate,
    coreRuleDelete,
    coreRuleCategoryKeyword
  } from '@/api/login'
  import debounce from 'lodash/debounce'
  import moment from 'moment'
  export default {
    name: 'ruleMgt',
    components: {
      moment
    },
    data() {
      this.handleSearch = debounce(this.handleSearch, 800)
      this.searchCoreRule = debounce(this.searchCoreRule, 800)
      return {
        api:{
          updateStatus:'sys/coreRule/updateStatus'
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
          { title: '结论数量', prop: 'verdictCount' ,width:80,align:'right'},
          { title: '更新人', prop: 'updateBy', width: 150 },
          { title: '更新时间', prop: 'updateTime', width: 150 },
          { title: '状态', prop: 'status', width: 80, align: 'center' },
          { title: '操作', prop: 'action', width: 160, align: 'center' }
        ],
        total: 10,
        pageSize: 10,
        current: 1,
        items: [
          { text: '编辑', showtip: false, click: this.edit },
          { text: '删除', color: '#E6A23C', showtip: true, tip: '确认删除吗？', click: this.del },
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
        // 药品modal
        drugModal: {
          modalTitle: '添加规则',
          visible: false,
          confirmLoading: false
        },

        form: this.$form.createForm(this),
        drugForm: this.$form.createForm(this),
        selkeys: 1,
        parentData: {},
        //编辑新增树
        treeEditor: false,
        selectDrug: [],
        coreRule: [],
        ruleName: '',
        selectCategory: [],
        pageChangeFilter: {},
        paramsData:{},
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.paramsData = this.$route.params
        let dateRange = []
        dateRange[0] = moment(this.$route.params.startDate, 'YYYY-MM-DD')
        dateRange[1] = moment(this.$route.params.endDate, 'YYYY-MM-DD')
        this.$refs.searchPanel.form.setFieldsValue({ updateTime: dateRange })
      }
      console.log(this.$route.params,'111')
      this.getPageData()
      this.coreRuleSelect({ keyword: '' })
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
            name: '类型',
            dataField: 'type2',
            type: 'select',
            dataSource: this.enum.ruleClassification,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '规则',
            dataField: 'type',
            type: 'select',
            dataSource: this.enum.rulesType,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '更新时间',
            dataField: 'updateTime',
            type: 'range-picker',
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
      },
      choose(){
        return { isshow: false, isextend: true }
      },
    },
    methods: {
      getFormData(){
        let params = this.$refs.searchPanel.form.getFieldsValue();
        if(params.updateTime){
          params.updateTime = [params.updateTime[0].format('YYYY-MM-DD'),params.updateTime[1].format('YYYY-MM-DD')]
        }
        return params
      },
      //搜索
      search() {
        let params =this.getFormData();
        this.pageChangeFilter =this.getFormData();
        params.pageSize = this.pageSize
        params.offset = 0
        this.getPageData(params)
      },
      //重置
      resetForm() {
        let params = {}
        this.current = 1
        this.$refs.searchPanel.form.resetFields()
        params.pageSize = this.pageSize
        params.offset = 0
        this.getPageData(params)
        this.pageChangeFilter = {}
      },

      selectType(e) {
        if (e.target.value == 1) {
          this.selkeys = 1
        } else if (e.target.value == 2) {
          this.selkeys = 2
          this.coreRuleCategory({ keyword: '' })
        } else if (e.target.value == 3) {
          this.coreRuleGroup({ keyword: '' })
          this.selkeys = 3
        } else if (e.target.value == 4) {
          this.selkeys = 4
        }
      },

      //药品select列
      coreRuleSelect(params = {}) {
        coreRuleSelectKeyword(params)
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
        coreRuleCategoryKeyword(params)
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
        this.coreRule = []
        coreRuleGroupSpec(params)
          .then(res => {
            if (res.code == '200') {
              for (let key in res.rows) {
                this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
              }
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
        coreRuleSelectKeyword({ keyword: value })
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
        coreRuleCategoryKeyword({ keyword: value })
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
        coreRuleGroupSpec({ keyword: value })
          .then(res => {
            if (res.code == '200') {
              for (let key in res.rows) {
                this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
              }
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
        this.drugModal.visible = true
        this.drugForm.resetFields()
        this.selkeys = 1
        setTimeout(() => {
          this.drugForm.setFieldsValue({ type2: 1 })
        }, 0)
      },
      //药品确认选
      drugOk(e) {
        this.drugForm.validateFields((err, values) => {
          if (!err) {
            let params = {}
            if (values.name) {
              params.name = values.name
              params.type2 = values.type2
            } else {
              params.name = this.ruleName.label
              params.limitedItemid = this.ruleName.key
              params.type2 = values.type2
            }
            coreRuleUpdate(params)
              .then(res => {
                if (res.code == '200') {
                  let params = {};
                  params.offset = 0
                  params.pageSize = this.pageSize
                  this.getPageData(params)
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

      //获取网格分页
      getPageData(params = {}) {
        if (params.offset == 0) {
          this.current = 1
        }
        this.loadingTable = true
        if (this.paramsData.id){
          params.id =  this.paramsData.id;
          if (!params.updateTime){
            params.updateTime=  [this.paramsData.startDate,this.paramsData.endDate];
          }
        }
        coreRuleTypePage(params)
          .then(res => {
            if (res.code == '200') {
              this.loadData = this.$dateFormat(res.rows, ['updateTime'])
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
        this.current = 1
        let params = this.pageChangeFilter
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.pageSize = pageSize
        this.getPageData(params)
      },
      //页面跳转事件
      pageChange(page, pageSize) {
        this.pageSize = pageSize;
        let params = this.pageChangeFilter
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getPageData(params)
      },
      //编辑操作
      edit(data) {
        let newPage = this.$router.resolve({
          name: 'flowChartEditor',
          params: { id: data.row.id }
        })
        window.open(newPage.href, '_blank')
      },
      //查看炒作
      look(data) {
        let newPage = this.$router.resolve({
          name: 'flowChartEditor',
          params: { id: data.row.id }
        })
        window.open(newPage.href, '_blank')
      },
      handleChange(value) {
        this.ruleName = value
      },

      //操作启用停用
      updateStatus(row) {
        let params = {}
        if (row.status == '1') {
          params.status = '0'
        } else {
          params.status = '1'
        }
        params.id = row.id
        this.$axios({
          url: this.api.updateStatus,
          method: 'put',
          data: params
        }).then(res => {
            if (res.code == '200') {
              this.success('操作成功', () => {
                row.status = params.status
              })
              let params =this.pageChangeFilter;
              params.offset = (this.current - 1) * this.pageSize
              params.pageSize = this.pageSize
              this.getPageData(params)
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
        if(value.status ==1){
          this.warn('请停用后再删除')
        }else{
          coreRuleDelete(params)
            .then(res => {
              if (res.code == '200') {
                this.success(res.msg, () => {
                  let data =this.pageChangeFilter;
                  data.offset = (this.current - 1) * this.pageSize
                  data.pageSize = this.pageSize
                  this.getPageData(data)
                })
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
        }

      },

      //filter
      typeRule(value) {
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

  .ruleModal .ant-modal-body {
    padding: 4px !important;
  }

  .selectCol {
    overflow: hidden;
    text-align: left;
    display: inline-block;
    width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>