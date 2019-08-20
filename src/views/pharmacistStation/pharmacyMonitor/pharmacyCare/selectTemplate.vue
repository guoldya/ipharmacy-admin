<template>
  <a-card>
    <a-row class="ruleRow">
      <a-col :xl="8" :xxl="5">
        <div class="ruleCow">
          <a-card>
            <a-row>
              <a-col :span="24">
               <a-radio-group v-model='type'>
                    <a-radio value="1">全部</a-radio>
                    <a-radio value="2">目录</a-radio>
                    <a-radio value="2">模板</a-radio>
                </a-radio-group>
              </a-col>
              <a-col class="margin-top-5" :span="24">
               <a-input-search placeholder="请输入" @search="onChange"/>
              </a-col>
            </a-row>
            <a-row>
              <a-spin tip="加载中..." :spinning="loading">
                <a-tree
                  class="draggable-tree"
                  :treeData="gData"
                  :loadData="onLoadData"
                  @select="onSelect"
                  :autoExpandParent="false"
                  @load="expandTree"
                  :loadedKeys="loadedKeys"
                ></a-tree>
              </a-spin>
            </a-row>
          </a-card>
        </div>
      </a-col>
      <a-col :xl="16" :xxl="19">
        <a-card>
          <a-form  class="ant-advanced-search-form" :form="form">
            <!-- <a-tabs :defaultActiveKey="1" @change="callback">
                <a-tab-pane v-for="(list,i) in content" :key="i+1" :tab="list.title"> -->
                    <div  v-for="(list,i) in content" :key="i+1">
                      <p :class="i>0?'padding-top-22':''" class=" font-bold fontSize16">{{list.title}}</p>
                      <a-row>
                        <a-col>
                           <a-form-item>
                              <a-textarea  v-decorator="[list.dataField]" :autosize="{ minRows: 4}" />
                            </a-form-item>
                        </a-col>
                      </a-row>
                      <a-spin v-if="list.columns"  class="margin-top-15" :spinning="loadingTable" tip="加载中...">
                          <el-table class="margin-top-15"
                                :data="list.dataSource"
                                border
                                :highlight-current-row="true" 
                                 @selection-change="e => handleSelectionChange(e,list.value)"
                                style="width: 100%"
                              >
                               <el-table-column
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                  v-for="item in list.columns"
                                  :show-overflow-tooltip="true"
                                  :key="item.value"
                                  :label="item.title"
                                  :prop="item.value"
                                  :width="item.width"
                                  :align="item.align"
                                >
                                  <template  slot-scope="scope">
                                    <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
                                    <span v-else>{{scope.row[item.value]}}</span>
                                  </template>
                                </el-table-column>
                          </el-table>
                      </a-spin>

                      <a-row  class="margin-top-5"  >
                            <a-col
                              v-for="(item,i) in list.checkItem" :key="i"
                              :span="24"
                              >
                                <a-form-item :label="item.label"
                                  :label-col="{ span: 2 }"
                                  :wrapper-col="{ span: 22 }">
                                    <a-checkbox-group :options="item.options"   v-decorator="[item.dataField,{initialValue: ['1']}]" @change="onChange" />
                                </a-form-item>
                            </a-col>
                      </a-row>

                      <!-- <a-row  class="margin-top-5" >
                            <a-col
                              v-for="(item,i) in list.formItem" :key="i"
                              :span="6"
                              >
                                <a-form-item :label="item.label" class="unit"
                                  :label-col="{ span: 7 }"
                                  :wrapper-col="{ span: 17 }">
                                    <a-date-picker v-decorator="[item.val]" v-if="item.type==='date'"/>
                                    <a-select placeholder="请选择..." :style="{width:'180px'}" v-decorator="[item.dataField]" v-if="item.type=='select'">
                                        <a-select-option :value="op.value" v-for="(op,index) in selectItem" :key="index">
                                          {{op.value}}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                      </a-row> -->
                  </div>
                <!-- </a-tab-pane>
            </a-tabs> -->
            
        </a-form>
        </a-card>
        <a-form-item :wrapper-col="{ span: 24, offset: 21 }">
          <a-button type="primary" @click="handleSubmit">保存</a-button>
          <a-button class="margin-left-20" @click="backTo">取消</a-button>
        </a-form-item>
      </a-col>
    </a-row>
    
  </a-card>
</template>

<script>
import { coreRuleTypeSelect, coreRuleTypePage, coreRuleCategoryKeyword } from '@/api/login'

export default {
  name: 'selectTemplate',
  data() {
    return {
      type:'1',
      content:[
          {title:'疗效监测',dataField:'curativeEffect',value:'1',
            columns: [
                { title: '类别', value: 'name', align: 'left' , width: 200},
                { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                { title: '干预', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝'},{name:'纳屈肝123'}],
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
          },
          {title:'安全性监测',dataField:'safety',value:'2',
            columns: [
                { title: '类别123', value: 'name', align: 'left' , width: 200},
                { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                { title: '干预', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝456'}],
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
          },
          {title:'从依性监测',dataField:'rely',value:'3',
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
            checkItem:[
                {label:'监护指标',type:'checked',val:'time',dataField:'target',
                  options:[
                    {label:'适应症',value:'1',dataField:'disease'},
                    {label:'用法用量',value:'2',dataField:'usage'}
                  ]
                },
                {label:'干预方案',type:'checked',val:'date',dataField:'plan',
                options:[
                  {label:'用药教育',value:'1',dataField:'medicalEdu'},
                  {label:'其他',value:'2',dataField:'other'}
                ]},
            ],
          },
        ],
        selectItem:[
          {value:'1次'},
          {value:'2次'},
        ],
      api: {
        diagnosisMgtTreeList: '/sys/dicIcd/selectIcdTreeList',
        diagnosisMgtselectPage: '/sys/dicIcd/selectPage',
        diagnosisMgtupdate: '/sys/dicIcd/updateStatus'
      },
      columns: [
        { title: '编码', prop: 'id', width: 80, align: 'right' },
        { title: 'ICD编码', prop: 'icdcode', width: 80, align: 'left' },
        { title: '诊断名称', prop: 'icdname', align: 'left', width: 300 },
        { title: '备注', prop: 'remark', align: 'left' },
        { title: '类型', prop: 'icdtype', width: 90, align: 'center' },
        { title: '状态', prop: 'status', width: 80, align: 'center' },
        { title: '更新时间', prop: 'updateTime', width: 140, align: 'center' },
        { title: '操作', prop: 'action', width: 160, align: 'center' }
      ],
      //树形结构分类
      gData: [],
      //网格数据
      loadData: [],
      loading: false,
      loadingTable: false,
      confirmLoading: false,
      total: 10,
      pageSize: 10,
      disable: true,
      form: this.$form.createForm(this),
      // key值也就是id值
      id: 'n',
      value: '',
      current: 1,
      searchData: {},
      loadedKeys: [],
      shows: true,
      form: this.$form.createForm(this),
      multipleSelection:[],
      nextMultipleSelection:[]
    }
  },
  created() {
    let patientid = sessionStorage.getItem('patientid')
    if (patientid) {
      this.shows = false
      let param = {
        offset: 0,
        pageSize: 10,
        patientid: patientid
      }
      this.getPageData(param)
    }
  },
  destroyed() {
    sessionStorage.clear()
  },
  updated() {},
  mounted() {
    this.getTreeData({})
  },
  computed: {
    list() {
      return [
        {
          name: '编码',
          dataField: 'id',
          type: 'text'
        },
        {
          name: 'ICD编码',
          dataField: 'icdcode',
          type: 'text'
        },
        {
          name: '诊断名称',
          dataField: 'icdname',
          type: 'text'
        },
        {
          name: '类型',
          dataField: 'icdtype',
          type: 'select',
          dataSource: this.enum.icdType,
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
        }
      ]
    }
  },
  methods: {
    onChange (e) {
      console.log('radio checked', e.target.value)
    },
    //radio-tabs
      callback (val) {
        console.log(val)
      },
    
    handleSubmit(e){
        e.preventDefault();
         this.form.validateFields((err, values) => {
                if (!err) {
                   console.log(values)
                }
            })
    },
    backTo() {
      this.$router.push({
        name: 'pharmacyCareIndex'
      })
    },
    handleSelectionChange(val,id) {
        if(id==='1'){
            this.multipleSelection = val;
        }else if(id==='2'){
            this.nextMultipleSelection = val;
        }
        // console.log(this.multipleSelection,id,'this.multipleSelection');
    },
    // 获取初始tree数据
    getTreeData(param) {
      let params = param
      this.gData = []
      this.loading = true
      this.$axios({
        url: this.api.diagnosisMgtTreeList,
        method: 'put',
        data: params
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
          this.error(err)
          this.loading = false
        })
    },
    //处理tree初始数据
    dealData(data) {
       this.gData = []
      for (let i in data) {
        let isleaf = false
        if (data[i].isleaf == 1) {
          isleaf = false
        } else {
          isleaf = true
        }
        this.gData.push({
          defcode2: data[i].defcode2,
          icdcode: data[i].icdcode,
          title: data[i].icdname,
            isLeaf: isleaf,
          icdtype: data[i].icdtype,
          key: data[i].id
        })
      }
    },
    //查询按下回车的回调
    pressEnterChange(e) {
      this.searchRule()
    },
    //查询
    searchRule() {
      let params = { keyword: this.value }
      this.getTreeData(params)
    },
    // 查找事件
    onChange(value) {
       this.loadedKeys = []
        if (this.$util.trim(value)) {
          this.gData = []
          let params = { keyword: value }
          this.getTreeData(params)
        } else {
          this.gData = []
          let data = {}
          this.getTreeData(data)
        }
    },
      expandTree(loadedKeys, expanded) {
        this.loadedKeys = loadedKeys
      },
    //新增事件
    addMdc() {
      this.$router.push({
        name: 'diagnosisMgtDetail',
        params: { id: 'n', patientid: sessionStorage.getItem('patientid') }
      })
    },
    // 编辑事件
    edit(data) {
      this.$router.push({
        name: 'diagnosisMgtDetail',
        params: { id: data.row.id, patientid: sessionStorage.getItem('patientid') }
      })
    },
    //树形节点点击事件
    onSelect(selectedKeys, e) {
      this.shows = false
      sessionStorage.setItem('patientid', e.node.dataRef.key)
      this.id = e.node.dataRef.key
      let params = { patientid: e.node.dataRef.key }
      this.current = 1
      params.offset = 0
      params.pageSize = this.pageSize
      this.getPageData(params)
    },
    //异步加载数据
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        setTimeout(() => {
          let params = {}
          params.patientid = treeNode.dataRef.key
          this.$axios({
            url: this.api.diagnosisMgtTreeList,
            method: 'put',
            data: params
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
                    defcode2: res.rows[i].defcode2,
                    icdcode: res.rows[i].icdcode,
                    title: res.rows[i].icdname,
                    icdtype: res.rows[i].icdtype,
                    key: res.rows[i].id,
                     isLeaf: isLeaf,
                    patientid: res.rows[i].patientid
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

    //获取网格分页
    getPageData(params = {}) {
      if (params.offset == 0) {
        this.current = 1
      }
      let pid = sessionStorage.getItem('patientid')
      params.patientid = pid != null ? pid : this.id
      this.loadingTable = true
      this.$axios({
        url: this.api.diagnosisMgtselectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.loadData = res.rows
            this.total = res.total
            this.loadingTable = false
            this.disable = false
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
      let params = this.searchData
      this.pageSize = pageSize
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getPageData(params)
    },
    //页面跳转事件
    pageChange(page, pageSize) {
      this.pageSize = pageSize
      let params = this.searchData
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getPageData({ offset: (page - 1) * pageSize, pageSize: this.pageSize })
    },

    //操作启用停用
    updateStatus(row, val) {
      let params = {}
      if (row.status == '1') {
        params.status = '0'
      } else {
        params.status = '1'
      }
      params.id = row.id
      this.$axios({
        url: this.api.diagnosisMgtupdate,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success('操作成功', () => {
              let params = this.searchData
              params.offset = (this.current - 1) * this.pageSize
              params.pageSize = this.pageSize
              this.getPageData(params)
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
        return 'icd10'
      } else if (value == '2') {
        return 'icd11'
      } else if (value == '0') {
        return 'icd9'
      }
    },
    changTime(time) {
      if (time) {
        return time.replace(/:\d{2}$/, '')
      }
    }
  }
}
</script>

<style lang="less">
    .padding-top-22{
        padding-top: 20px;
    }
    .margin-top-15{
        margin-top: -15px;
    }
    .ruleCow {
    padding-right: 5px;
    }

    .ant-tree li {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>