<template>
  <a-Row class="testchk">
    <a-Col :span="13">
      <a-card :bodyStyle="{padding:'12px 16px'}">
        <Searchpanel ref="searchPanel" :list="list" :col="12">
          <div slot="control">
            <a-button type="primary" @click="search" style="margin-right: 5px">查询</a-button>
            <a-button class @click="resetForm" style="margin-right: 10px">重置</a-button>
          </div>
        </Searchpanel>
        <a-spin tip="加载中..." :spinning="spinning">
          <el-table
            class="margin-top-10"
            :data="dataSource"
            border
            style="width: 100%"
            @row-click="clickLeftRow"
            highlight-current-row
          >
            <el-table-column
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :label="item.title"
              :key="index"
              v-for="(item,index) in columns"
              :width="item.width"
              :align="item.align"
            >
              <template slot-scope="scope">
                <span v-if="item.prop == 'isCurrent'">
                  <a-badge
                    :status="scope.row.isCurrent == 0? 'default':'processing'"
                    :text="scope.row.isCurrent ==0?'未对码':'已对码'"
                  />
                </span>
                <span v-else>{{scope.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <a-pagination
            :total="total"
            showSizeChanger
            v-model="current"
            class="pnstyle"
            :defaultPageSize="20"
            :pageSizeOptions="['20', '50','100']"
            @showSizeChange="pageChangeSize"
            @change="pageChange"
            size="small"
          ></a-pagination>
        </a-spin>
      </a-card>
    </a-Col>

    <a-Col :span="11" class="details">
      <a-card title="用药频次对码">
        <a-row class="box table-th">
          <a-col :span="6"></a-col>
          <a-col :span="8">医院用药频次</a-col>
          <a-col :span="8" class="zhishiku">知识库用药频次</a-col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">编码：</a-col>
          <a-col :span="8">{{NData.frequenceId}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.id}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">名称：</a-col>
          <a-col :span="8">{{NData.frequenceName}}</a-col>
          <a-Col :span="10" class="td-content" @click="changeFormat">
            <div :class="{'pt':isActive}">
              <header v-if="isShow" class="headers">
                <a-tooltip placement="topLeft" style="cursor: pointer;">
                  <template slot="title">
                    <span>{{ this.remark}}</span>
                  </template>
                  {{ this.remark}}
                </a-tooltip>
              </header>
              <footer v-if="!isShow">
                <a-select
                  style="width:100%"
                  showSearch
                  allowClear
                  mode="single"
                  optionLabelProp="title"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  @search="handleSearch"
                  @change="handleChange"
                  v-decorator="[ 'id']"
                >
                  <a-select-option
                    v-for="(item,index) in this.drugAllList"
                    :value="item.id"
                    :key="item.dosageForms"
                    :remark="item.remark"
                    :code="item.code"
                  >
                    <a-row>
                      <a-col>{{item.remark}}</a-col>
                    </a-row>
                    <a-row>
                      <a-col style="opacity: 0.6">编码：{{item.id}}</a-col>
                    </a-row>
                    <a-divider style="margin: 8px 0 0 0;" />
                  </a-select-option>
                </a-select>
              </footer>
            </div>
          </a-Col>
        </a-row>
        <div class="surea">
          <a-button @click="clickCancel">取消</a-button>
          <a-button
            type="primary"
            @click="clickSure"
            @loading="loading"
            class="margin-left-20"
            :disabled="disable"
          >确定</a-button>
        </div>
      </a-card>

      <a-card class="margin-top-5" title="相似用药频次">
        <a-spin tip="加载中..." :spinning="similarSpin">
          <el-table @row-click="clickRightRow" :data="similarData" :highlight-current-row="true">
            <el-table-column
              :prop="item.prop"
              :label="item.title"
              :key="index"
              v-for="(item,index) in columnscheckdtl"
              :width="item.width"
              :align="item.align"
              :formatter="item.formatter"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="props">
                <span v-if>{{props.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <a-pagination
            :total="similarTotal"
            showSizeChanger
            v-model="similarCurrent"
            class="pnstyle"
            :defaultPageSize="10"
            :pageSizeOptions="['10', '20','50']"
            @showSizeChange="similarSizeChange"
            @change="similarPageChange"
            size="small"
          ></a-pagination>
        </a-spin>
      </a-card>
    </a-Col>
  </a-Row>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
  data() {
    this.handleSearch = debounce(this.handleSearch, 800)
    return {
      similarSpin: false,
      similarTotal: 0,
      similarCurrent: 1,
      current: 1,
      dataSource: [],
      spinning: false,
      columns: [
        { title: '编码', prop: 'frequenceId', width: 80 },
        { title: '代码', prop: 'frequenceCode' },
        { title: '名称', prop: 'frequenceName' },
        { title: '对码状态', prop: 'isCurrent', width: 80, align: 'center' }
      ],
      pageSize: 20,
      total: 1,
      api: {
        hisDrugDataUrl: '/sys/hisFrequence/selectPage',
        similarDrugDataUrl: '/sys/hisFrequence/selectSimilarDicFrequencePage',
        mapUrl: 'sys/dicFrequenceMapper/insert',
        dicDrugSelectList: 'sys/dicFrequence/selectDicFrequenceByKeyword',
         orgUrl: '/sys/sysOrgs/selectList'
      },
      loading: false,
      columnscheckdtl: [
        { title: '编码', prop: 'id', width: 90, align: 'right' },
        { title: '名称', prop: 'remark' },
        { title: '代码', prop: 'code', width: 100 }
      ],
      similarData: [],
      NData: {},
      MData: {},
      M: 1,
      N: 1,
      disable: true,
      frequenceName: '',
      marpperId: '',
      remark: '',
      isShow: true,
      drugAllList: [],
      isActive: true,
       orgData: []
    }
  },
  computed: {
    list() {
      return [
        {
          name: '机构',
          dataField: 'orgId',
          type: 'tree-select',
          keyExpr: 'keyword',
          treeData: this.orgData
          // onSelect: this.selectTree
        },
        {
          name: '名称',
          dataField: 'frequenceName',
          type: 'text'
        },
        {
          name: '状态',
          dataField: 'isCurrent',
          type: 'select',
          dataSource: this.enum.drugstatus,
          keyExpr: 'id',
          valueExpr: 'text'
        }
      ]
    }
  },
  mounted() {
    this.$refs.searchPanel.form.setFieldsValue({ orgId: this.$store.state.user.account.info.orgId })
    this.getData()
     this.getOrgData()
  },
  methods: {
    // 搜索
    handleSearch(value) {
      let params = { keyword: value, id: this.marpperId }
      this.$axios({
        url: this.api.dicDrugSelectList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.drugAllList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //获取药品list
    getDrugList() {
      let params = { keyword: '', id: this.marpperId }
      this.$axios({
        url: this.api.dicDrugSelectList,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.drugAllList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 点击名称栏
    changeFormat() {
      this.isShow = false
      this.disable = true
      this.getDrugList()
    },
    // 实例化右边相似
    handleChange(value, option) {
      let params = option.data.attrs
      this.disable = false
      this.isShow = true
      this.remark = params.remark
      this.MData.id = value
      //this.MData.code = params.code
    },
    lostFocus() {
      this.remark = value
      this.isShow = true
    },
    //点击第左边的table列事件
    clickLeftRow(row) {
      this.remark = ''
      this.isShow = true
      this.isActive = false
      let params = { frequenceName: row.frequenceName }
      this.frequenceName = row.frequenceName
      this.NData = row
      this.MData = {}
      if (this.NData.isCurrent == '0') {
        this.getSimilarData(params)
      } else {
        this.MData = row.dicFrequence
        this.remark = this.MData.remark
        this.getSimilarData(params)
      }
    },
    nchange(val) {
      if (val > 1) {
        this.M = 1
      }
    },
    mchange(val) {
      if (val > 1) {
        this.N = 1
      }
    },
    //右边部分数据的获取
    getSimilarData(params = {}) {
      this.similarSpin = true
      this.$axios({
        url: this.api.similarDrugDataUrl,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.similarData = res.rows
            this.similarTotal = res.total
            this.similarSpin = false
          } else {
            this.similarSpin = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.similarSpin = false
          this.error(err)
        })
    },
    //左边部分的数据获取
    getData(params = { pageSize: 20, offset: 0, orgId: this.$store.state.user.account.info.orgId }) {
      this.spinning = true
      this.$axios({
        url: this.api.hisDrugDataUrl,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total
            this.spinning = false
          } else {
            this.spinning = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.spinning = false
          this.error(err)
        })
    },
    //点击右边的table事件
    clickRightRow(row) {
      this.MData = row
      this.disable = false
      this.isShow = true
      this.remark = this.MData.remark
    },
    //点击确定的处理事件
    clickSure() {
      console.log(this.MData.id)
      let params = {
        orgId: this.NData.orgId,
        hisfrequenceId: this.NData.frequenceId,
        hisfrequenceName: this.NData.frequenceName,
        // hisfrequenceCode: this.NData.code,
        // frequenceCode: this.MData.code,
        frequenceId: this.MData.id,
        frequenceName: this.remark,
        id: this.NData.mapperId
      }
      if (Object.keys(this.MData).length == 0) {
        $message.info('请添加知识库数据')
      }
      this.loading = true
      this.$axios({
        url: this.api.mapUrl,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success('对码成功', () => {
              this.NData = {}
              this.MData = {}
              this.similarData = []
              let param = {
                  pageSize: this.pageSize,
                  offset:(this.current - 1) * this.pageSize
                }
                Object.assign(param, this.$refs.searchPanel.form.getFieldsValue())
                this.getData(
                  param
                )
              this.loading = false
              this.isActive = true
              this.remark = ''
            })
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
    //点击取消
    clickCancel() {
      this.MData = {}
    },
    //搜索
    search() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.pageSize = 20
      params.offset = 0
      this.current = 1
      this.getData(params)
    },
    //重置
    resetForm() {
      // this.$refs.searchPanel.form.resetFields()
      // this.getData({ pageSize: 20, offset: 0 })
      this.$refs.searchPanel.form.resetFields(['frequenceName', 'isCurrent', []])
      let params = { pageSize: 20, offset: 0 }
        this.$refs.searchPanel.form.setFieldsValue({ orgId: this.$store.state.user.account.info.orgId })
      Object.assign(params, this.$refs.searchPanel.form.getFieldsValue())
      this.current = 1
      this.getData(params)
    },
    //页码size change事件
    pageChangeSize(page, pageSize) {
      this.pageSize = pageSize
      this.current = 1
      let params = { offset: 0, pageSize: pageSize }
      Object.assign(params, this.$refs.searchPanel.form.getFieldsValue())
      this.getData(params)
    },
    //页码跳转事件
    pageChange(page, pageSize) {
      this.current = page
      let params = { offset: (page - 1) * pageSize, pageSize: pageSize }
      Object.assign(params, this.$refs.searchPanel.form.getFieldsValue())
      this.getData(params)
    },
    //页码跳转
    similarPageChange(page, size) {
      let params = {}
      params.frequenceName = this.frequenceName
      params.offset = (page - 1) * size
      this.getSimilarData(params)
    },
    //页码数的改变
    similarSizeChange(current, size) {
      this.current = 1
      let params = {}
      params.frequenceName = this.frequenceName
      params.pageSize = size
      this.getSimilarData(params)
    },
     // 机构选取
    getOrgData(obj = {}) {
      this.$axios({
        url: this.api.orgUrl,
        method: 'put',
        data: obj
      })
        .then(res => {
          if (res.code == '200') {
            this.orgData = this.getOrgTreeData(res.rows, undefined)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    getOrgTreeData(data, pid) {
      let tree = []
      data.forEach(item => {
        let row = item
        row.key = item.orgId
        row.value = item.orgId
        if (pid == item.parentId) {
          row.children = this.getOrgTreeData(data, item.orgId)
          tree.push(row)
        }
      })
      return tree
    },
  }
}
</script>
<style lang='less'>
.testchk {
  .headers {
    line-height: 35px;
  }
  .zhishiku {
    padding-left: 5px;
  }
  .ant-card-body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 1px;
  }
  .ant-card {
    padding-top: 1px;
  }
}

.details {
  .ant-input-number {
    margin-top: 3px;
  }
  padding: 0px 0px 0px 5px;
  .td-content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-left: 1px solid rgb(235, 238, 245);
    height: 30px;
    padding-left: 5px;
  }
  .table-th {
    background: #fafafa;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
  }
  .ant-row {
    line-height: 30px;
  }
  .textRight {
    text-align: right;
    color: rgba(0, 0, 0, 0.85);
  }
  .box {
    line-height: 35px;
    border-bottom: 1px solid #ebeef5;
    div {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.surea {
  float: right;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-right: 10px;
}

.ant-input-number {
  width: 100% !important;
}
</style>
