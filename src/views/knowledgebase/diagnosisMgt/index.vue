<template>
  <a-card>
    <a-row class="ruleRow">
      <a-col :xl="8" :xxl="5">
        <div class="ruleCow">
          <a-card>
            <a-row>
              <a-col :span="13">
                <a-input @pressEnter="pressEnterChange" placeholder="请输入" @change='searchchange'/>
              </a-col>
              <a-col class="treeCol" :span="5">
                <a-button size="small" type="primary" @click="searchRule">查询</a-button>
              </a-col>
              <a-col :span="6" class="treeCol"></a-col>
            </a-row>
            <a-row>
              <a-spin tip="加载中..." :spinning="loading">
                <a-tree
                  dropdownMatchSelectWidth
                  :dropdownStyle="{ width:'100px',color:'red'}"
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

          <a-button class="margin-top-10"  type="primary" @click="addMdc">新增</a-button>
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
                  <span v-else-if="item.prop == 'icdtype'" v-html="ruleType(props.row.icdtype)"></span>

                  <span v-else-if="item.prop == 'action'">
                    <a @click="edit(props)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm
                      title="确认启用吗？"
                      placement="topLeft"
                      @confirm="updateStatus(props.row,'1')"
                      v-if="props.row.status == '0'"
                    >
                      <a>启用</a>
                    </a-popconfirm>
                    <a-popconfirm
                      title="确认停用吗？"
                      placement="topLeft"
                      @confirm="updateStatus(props.row,'0')"
                      v-else
                    >
                      <a style="color:#ff9900">停用</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if="props.row.type == 2"/>
                  </span>
                   <span v-else-if="item.prop == 'updateTime'" >{{changTime(props.row.updateTime)}}</span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <a-pagination
             v-model="current"
              showSizeChanger
              showQuickJumper
              :total="total"
              class="pnstyle"
              :defaultPageSize="pageSize"
              :pageSizeOptions="['10', '20','50']"
              @showSizeChange="pageChangeSize"
              @change="pageChange"
              size="small"
            ></a-pagination>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { coreRuleTypeSelect, coreRuleTypePage, coreRuleCategoryKeyword } from '@/api/login'
import debounce from 'lodash/debounce'

export default {
  name: 'ruleMgt',
  data() {
    return {
      api: {
        diagnosisMgtTreeList: '/sys/dicIcd/selectIcdTreeList',
        diagnosisMgtselectPage: '/sys/dicIcd/selectPage',
        diagnosisMgtupdate: '/sys/dicIcd/update'
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
      value:'',
      current:1,
      searchData:{},
    }
  },
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
          icdtype: data[i].icdtype,
          key: data[i].id
        })
      }
    },

    //搜索
    search() {
      if($.trim(this.id).length>0) {
        let params = this.$refs.searchPanel.form.getFieldsValue();
        this.searchData =  this.$refs.searchPanel.form.getFieldsValue();
        params.pageSize = 10
        params.offset = 1
        params.patientid = this.id
        this.getPageData(params)
      }
    },
    //重置
    resetForm() {
      if($.trim(this.id).length>0){
        this.searchData = {}
        this.$refs.searchPanel.form.resetFields()
        let params = { patientid: this.id }
        this.getPageData(params)
        this.current=1
      }
    },
    //查询按下回车的回调
    pressEnterChange(e) {
      this.searchRule()
    },
    //查询
    searchRule() {
      // const expandedKeys = this.dataList
      //   .map(item => {
      //     if (this.values) {
      //       if (item.title.indexOf(this.values) > -1) {
      //         return this.getParentKey(item.title, this.gData)
      //       }
      //     }
      //     return null
      //   })
      //   .filter((item, i, self) => item && self.indexOf(item) === i)
      // Object.assign(this, {
      //   expandedKeys,
      //   searchValue: this.values
      // })
       let params={keyword:this.value}
       this.getTreeData(params)
    },
    // 查找事件
    searchchange(e){
    // console.log(e.target.value)
     this.value=e.target.value
    },
    //新增事件
    addMdc() {
      this.$router.push({
        name: 'diagnosisMgtDetail',
        params: {id:'n' ,patientid:this.id }
      })
    },
    // 编辑事件
    edit(data) {
      console.log(data)
      this.$router.push({
        name: 'diagnosisMgtDetail',
     params:{ id:data.row.id ,patientid:data.row.patientid}
      })
    },
    //树形节点点击事件
    onSelect(selectedKeys, e) {
      this.id = e.node.dataRef.key
      let params={patientid:this.id}
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
      if (params.offset ==0){
        this.current = 1;
      }
      params.patientid = this.id
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
      this.pageSize = pageSize;
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getPageData(params)
    },
    //页面跳转事件
    pageChange(page, pageSize) {
      this.pageSize = pageSize;
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
              let params = {};
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
    changTime(time){
      if(time){
return time.replace(/:\d{2}$/,'')
      }
      
    }
  }
}
</script>

<style lang="less">
.ruleCow {
  padding-right: 5px;
}

.treeCol {
  padding-left: 10px;
  line-height: 32px;
}


.ant-tree li{
max-width: 100%;
overflow: hidden;
 text-overflow: ellipsis;
  white-space: nowrap;
}
</style>