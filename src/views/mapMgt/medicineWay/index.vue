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
                <span v-if="item.prop == 'editDate'">{{changeTime(scope.row.editDate)}}</span>
                <span v-else-if="item.prop == 'isCurrent'">
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
      <a-card :bodyStyle="{}" title="给药途径">
        <a-row class="box table-th">
          <a-col :span="6"></a-col>
          <a-col :span="8">医院给药途径</a-col>
          <a-col :span="8" class="zhishiku">知识库给药途径</a-col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">编码：</a-col>
          <a-col :span="8">{{NData.id}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.id}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">名称：</a-col>
          <a-col :span="8">{{NData.name}}</a-col>
          <a-Col :span="10" class="td-content" @click="changeFormat">
            <div :class="{'pt':isActive}">
              <header v-if="isShow" class="headers">
                <a-tooltip placement="topLeft" style="cursor: pointer;">
                  <template slot="title">
                    <span>{{ this.name}}</span>
                  </template>
                  {{ this.name}}
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
                    :name="item.name"
                    :dosageFormsStr="item.dosageFormsStr"
                  >
                    <a-row>
                      <a-col>{{item.name}}</a-col>
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

      <a-card class="margin-top-5" title="相似给药途径">
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
        { title: '编码', prop: 'id', width: 80 },
        { title: '名称', prop: 'name' },
        { title: '对码状态', prop: 'isCurrent', width: 80, align: 'center' }
      ],
      pageSize: 20,
      total: 1,
      api: {
        similarDrugDataUrl: '/sys/hisWay/selectSimilarDicWayPage',
        mapUrl: 'sys/dicWayMapper/insert',
        icdAll: 'sys/hisWay/selectPage',
        dicDrugSelectList: 'sys/hisWay/selectDicWayByKeyword',
        orgUrl: '/sys/sysOrgs/selectList'
      },
      loading: false,
      columnscheckdtl: [
        { title: '编码', prop: 'id', width: 80 },
        { title: '名称', prop: 'name' },
        { title: '拼音码', prop: 'spellCode' }
      ],
      similarData: [],
      NData: {},
      MData: {},
      M: 1,
      N: 1,
      disable: true,
      icdnames: '',
      marpperId: '',
      name: '',
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
          dataField: 'name',
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
    this.getData({ pageSize: this.pageSize, offset: 0, orgId: this.$store.state.user.account.info.orgId })
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
      this.name = params.name
      this.MData.id = value
    },
    lostFocus() {
      this.name = value

      this.isShow = true
    },
    //点击第左边的table列事件
    clickLeftRow(row) {
      this.name = ''
      this.isActive = false
      let params = { icdName: row.icdname }
      this.icdnames = row.icdname
      this.isCurrent = row.isCurrent
      this.NData = row
      this.MData = {}
      if (this.NData.isCurrent == '0') {
        this.getSimilarData(params)
      } else {
        this.MData = row.dicBase
        this.name = this.MData.name
        this.getSimilarData(params)
      }
    },
    //右边部分数据的获取
    getSimilarData(params = {}) {
      this.similarSpin = true
      params.wayName = this.NData.name
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
    getData(params = {}) {
      this.spinning = true
      this.$axios({
        url: this.api.icdAll,
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
      this.name = this.MData.name
    },
    //点击确定的处理事件
    clickSure() {
      let params = {
        orgId: this.NData.orgId,
        hisWayId: this.NData.id,
        hisWayName: this.NData.name,
        wayId: this.MData.id,
        wayName: this.MData.name,
        id: this.NData.mapperId
      }
      const arrl = Object.keys(this.MData)
      if (arrl.length == 0) {
        this.$message.info('请添加知识库数据!')
      } else {
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
                this.name = ''
               let param = {
                  pageSize: this.pageSize,
                  offset: (this.current - 1) * this.pageSize
                }
                Object.assign(param, this.$refs.searchPanel.form.getFieldsValue())
                this.getData(
                  param
                )
                this.loading = false
                this.isActive = true
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
      }
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
      // this.current = 1
      this.$refs.searchPanel.form.resetFields(['name', 'isCurrent', []])
      let params = { pageSize: 20, offset: 0 }
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
      params.icdName = this.icdnames
      params.offset = (page - 1) * size
      this.getSimilarData(params)
    },
    //页码数的改变
    similarSizeChange(current, size) {
      this.current = 1
      let params = {}
      params.icdName = this.icdnames
      params.pageSize = size
      this.getSimilarData(params)
    },
    // 改时间格式
    changeTime(time) {
      let times = time.replace(/:\d{2}$/, '')
      console.log(times)
      return times
    },
    // 过滤
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
    }
  }
}
</script>
<style lang='less'>
.testchk {
  .ant-card {
    padding-top: 12px;
  }
  .headers {
    line-height: 36px;
  }
  .zhishiku {
    padding-left: 5px;
  }
  .ant-card-body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 1px;
  }
  .table-th {
    background: #fafafa;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
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
