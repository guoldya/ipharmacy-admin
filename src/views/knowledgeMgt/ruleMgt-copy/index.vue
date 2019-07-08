<template>
  <a-card>
    <a-row class="ruleRow">
        <a-card>
          <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
            </div>
          </Searchpanel>
          <a-button class="margin-top-10" type="primary"  @click="addMdc">添加规则</a-button>
          <a-spin tip="加载中..." :spinning="loadingTable">
            <el-table
              ref="table"
              :data="loadData"
              border
              class="margin-top-10"
              :highlight-current-row="true"
            >
              <el-table-column :show-overflow-tooltip="true" v-for="item in columns" :key="item.prop"
                               :label="item.title" :prop="item.prop" :width="item.width" :align="item.align">
                <template slot-scope="props">
                  <span v-if="item.prop == 'status'">
                    <a-badge :status="props.row.status == 0? 'default':'processing'"
                             :text="props.row.status==0?'停用':'启用'"/>
                  </span>
                  <span v-else-if="item.prop == 'type'" v-html="typeRule(props.row.type)"></span>
                  <span v-else-if="item.prop == 'type2'" v-html="typeType(props.row.type2)"></span>
                  <span v-else-if="item.prop == 'action'">
                    <a @click="look(props)" v-if="props.row.type == 1">查看</a>
                    <a @click="edit(props)" v-else>编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm  title="确认启用吗？" placement="topRight" @confirm="updateStatus(props.row,1)" v-if="props.row.status == '0'">
                      <a>启用</a>
                    </a-popconfirm>
                    <a-popconfirm title="确认停用吗？" placement="topRight" @confirm="updateStatus(props.row,0)" v-else>
                      <a>停用</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if="props.row.type == 2"/>
                    <a-popconfirm style="width: 50px" title="确定删除?" placement="topRight" @confirm="del(props.row)" v-if="props.row.type == 2">
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
            >
            </a-pagination>
          </a-spin>
        </a-card>
      <a-modal
        :title="drugModal.modalTitle"
        :visible="drugModal.visible"
        @ok="drugOk"
        :confirmLoading="drugModal.confirmLoading"
        @cancel="drugCancel"
        width="700px"
      >
        <a-form :form="drugForm">
          <a-form-item label="类型"
                       :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 17 }">
            <a-radio-group
              v-decorator="[ 'type2',  {rules: [{ required: true,message: '请选择类型'}]}  ]"
              @change="selectType"
              placeholder="请选择类型">
              <a-radio :value='op.id' v-for="(op,index) in this.enum.ruleClassification" :key="index">
                {{op.text}}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="药品"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 17 }"
            v-if="selkeys == 1">
            <a-select v-decorator="[ 'limitedItemid',  {rules: [{ required: true,message: '请选择药品'  }]} ]"
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
              <a-select-option :value='op.drugCode' v-for="(op,index) in selectDrug" :key="op.drugCode"
                               :title="op.drugName">
                <a-row>
                  <a-col  :span="16">
                    {{op.drugName}}
                  </a-col>
                  <a-col :span="8" style="text-align: right">
                    <a-tag >{{op.dosageForms}}</a-tag>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col style="opacity: 0.6">
                    生产厂商：{{op.producedBy}}
                  </a-col>
                </a-row>
                <a-divider style="margin: 8px 0 0 0;"/>
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="药品分类"
                       :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 17 }"
                       v-if="selkeys == 2"
          >
            <a-select v-decorator="[ 'categoryId',  {rules: [{ required: true,message: '请选择分类'  }]} ]"
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
              <a-select-option :value='op.categoryId' v-for="(op,index) in selectCategory" :key="op.categoryId"
                               :title="op.categoryName">
                <a-row>
                  <a-col :span="23" class="selectCol">
                    {{op.categoryName}}
                  </a-col>
                  <a-col v-if="op.isleaf == '1'" style="text-align: right">
                    <a-tag >存在下级</a-tag>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col style="opacity: 0.6">
                    {{op.categoryPath}}
                  </a-col>
                </a-row>
                <a-divider style="margin: 8px 0 0 0;"/>
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="药品组"
                       :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 17 }"
                       v-if=" selkeys == 3"
          >
            <a-select v-decorator="[ 'limited',{rules: [{ required: true,message: '请选择药品组'  }]} ]"
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
              <a-select-option :value='op.id' v-for="op in coreRule" :key="op.id">{{op.specName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="规则名称"
                       :label-col="{ span: 4}"
                       :wrapper-col="{ span: 17 }"
                       v-if=" selkeys == 4"
                       placeholder="请输入规则名称"
          >
            <a-input v-decorator="[ 'name',{rules: [{ required: true,message: '请输入规则名称'  }]} ]">
            </a-input>
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

  export default {
    name: 'ruleMgt',
    data() {
      this.handleSearch = debounce(this.handleSearch, 800)
      this.searchCoreRule = debounce(this.searchCoreRule, 800)
      return {
        loadedKeys: ['1', '2'],
        //树形机构数据
        gData: [],
        //网格数据
        loadData: [],
        loading: false,
        loadingTable: false,
        confirmLoading: false,
        //网格列
        columns: [{ title: '规则', prop: 'type', width: 90, align: 'center' },
          { title: '类型', prop: 'type2', width: 90, align: 'center' },
          { title: '规则名称', prop: 'name' },
          { title: '更新人', prop: 'updateBy', width: 150 },
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
        drugData: [
          { drugId: '123456', drugName: '阿司匹林', dosage: '颗粒', manufacturer: '肛泰制药' }
        ],
        //药品列
        column2: [{ title: '药品编码', prop: 'drugId', width: 100 },
          { title: '药品名称', prop: 'drugName' },
          { title: '剂型', prop: 'dosage', width: 70 },
          { title: '生成厂家', prop: 'manufacturer', width: 100 }],
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
        //选择分类Id
        typeIds: '-1',
        selkeys:1,
        parentData: {},
        //编辑新增树
        treeEditor: false,
        selectDrug: [],
        coreRule: [],
        ruleName: '',
        selectCategory:[],
      }
    },
    mounted() {
      this.getPageData();
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
            name: '状态',
            dataField: 'status',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          },

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
        this.getPageData()
      },

      //查询
      searchRule() {
        const expandedKeys = this.dataList.map((item) => {
          if (this.values) {
            if (item.title.indexOf(this.values) > -1) {
              return this.getParentKey(item.title, this.gData)
            }
          }
          return null
        }).filter((item, i, self) => item && self.indexOf(item) === i)
        Object.assign(this, {
          expandedKeys,
          searchValue: this.values
        })
      },

      selectType(e){
        console.log(e.target.value);
        if (e.target.value == 1) {
          // this.drugModal.modalTitle = '添加药品规则'
          this.selkeys = 1
        } else if (e.target.value == 2) {
          // this.drugModal.modalTitle = '添加药品分类规则'
          this.selkeys = 2
          this.coreRuleCategory({keyword:''})
        } else if (e.target.value == 3) {
          // this.drugModal.modalTitle = '添加药品组规则'
          this.coreRuleGroup({ keyword: '' })
          this.selkeys = 3
        } else if (e.target.value == 4) {
          // this.drugModal.modalTitle = '添加全局规则'
          this.selkeys = 4
        }
      },

      //药品select列
      coreRuleSelect(params = {}) {
        coreRuleSelectKeyword(params).then(res => {
          if (res.code == '200') {
            this.selectDrug = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品分类列
      coreRuleCategory(params = {}){
        coreRuleCategoryKeyword(params).then(res => {
          if (res.code == '200') {
            this.selectCategory = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品组select列
      coreRuleGroup(params = {}) {
        this.coreRule=[];
        coreRuleGroupSpec(params).then(res => {
          if (res.code == '200') {
            for (let key in res.rows) {
              this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
            }
            console.log(this.coreRule)
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品选择列搜索
      handleSearch(value) {
        console.log(value)
        coreRuleSelectKeyword({ keyword: value }).then(res => {
          if (res.code == '200') {
            this.selectDrug = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品分类搜索
      handleCategory(value){
        coreRuleCategoryKeyword({ keyword: value }).then(res => {
          if (res.code == '200') {
            this.selectCategory = res.rows
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //药品组搜索
      searchCoreRule(value) {
        coreRuleGroupSpec({ keyword: value }).then(res => {
          if (res.code == '200') {
            for (let key in res.rows) {
              this.coreRule.push({ id: '' + res.rows[key].id, specName: res.rows[key].specName })
            }
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },

      //添加药品按钮事件
      addMdc() {
        this.drugModal.visible = true;
        this.drugForm.resetFields();
        this.selkeys = 1;
        setTimeout(()=>{
          this.drugForm.setFieldsValue({type2:1})
        },0)
      },
      //药品确认选
      drugOk(e) {
        this.drugForm.validateFields((err, values) => {
            if (!err) {
              let params = {};
              console.log(values)
              if (values.name){
                params.name = values.name;
                params.type2 = values.type2;
              }else{
                params.name = this.ruleName.label
                params.limitedItemid = this.ruleName.key
                params.type2 = values.type2;
              }
              // params.type = this.selectNode.type
              // params.type2 = this.selectNode.type2
              // params.typeId = this.selectNode.key
              coreRuleUpdate(params).then(res => {
                if (res.code == '200') {
                  this.getPageData()
                  this.success(res.msg)
                } else {
                  this.warn(res.msg)
                }
              }).catch(err => {
                this.error(err)
              })
              this.drugModal.visible = false
            }
          }
        )

      },
      //药品取消
      drugCancel() {
        this.drugModal.visible = false
      },
      //药品搜索
      searchDrug(e) {
      },

      //获取网格分页
      getPageData(params = {}) {
        params.typeId = this.typeIds
        this.loadingTable = true
        coreRuleTypePage(params).then(res => {
          if (res.code == '200') {
            this.loadData = res.rows
            this.total = res.total
            this.loadingTable = false
          } else {
            this.loadingTable = false
            this.warn(res.msg)
          }
        }).catch(err => {
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
        console.log(data);
        let newPage = this.$router.resolve({
          name: 'flowChartEditor',
          params:{id:data.row.id},
        })
        window.open(newPage.href, '_blank')
      },
      //查看炒作
      look(data){
        let newPage = this.$router.resolve({
          name: 'flowChartEditor',
          params:{id:data.row.id},
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
        coreRuleUpdate(params).then(res => {
          if (res.code == '200') {
            this.success('操作成功', () => {
              this.getPageData()
            })
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //操作删除
      del(value) {
        console.log(value)
        let params = {}
        params.id = value.id
        coreRuleDelete(params).then(res => {
          if (res.code == '200') {
            this.success(res.msg, () => {
              this.getPageData()
            })
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
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
    line-height: 32px
  }

  .ruleRow .ant-card-body {
    padding: 24px 20px !important;
  }

  .ruleModal .ant-modal-body {
    padding: 4px !important;

  }

  .drugModal .ant-modal-body {
    /*text-align: right*/
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