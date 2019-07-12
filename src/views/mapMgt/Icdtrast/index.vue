<template>
  <a-Row class="testchks">
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

    <a-Col :span="11" class="detailsa">
      <a-card title="ICD对码">
        <a-row class="box table-th">
          <a-col :span="6"></a-col>
          <a-col :span="8">医院诊断</a-col>
          <a-col :span="8" class="zhishiku">知识库诊断</a-col>
        </a-row>

        <a-row class="box">
          <a-col :span="6" class="textRight">icd编码：</a-col>
          <a-col :span="8">{{NData.icdid}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.id}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">icd名称：</a-col>
          <a-col :span="8">{{NData.icdname}}</a-col>
          <a-Col :span="10" class="td-content" @click="changeFormat">
            <div :class="{'pt':isActive}">
              <header v-if="isShow" class="headers">
                <a-tooltip placement="topLeft" style="cursor: pointer;">
                  <template slot="title">
                    <span>{{ this.icdname}}</span>
                  </template>
                  {{ this.icdname}}
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
                  v-decorator="[ 'drugCodes']"
                >
                  <a-select-option
                    v-for="(item,index) in this.drugAllList"
                    :value="item.drugCode"
                    :key="item.dosageForms"
                    :producedBy="item.producedBy"
                    :spec="item.spec"
                    :spellCode="item.spellCode"
                    :icdname="item.icdname"
                    :dosageFormsStr="item.dosageFormsStr"
                  >
                    <a-row>
                      <a-col>{{item.icdname}}</a-col>
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

      <a-card class="margin-top-5" title="相似诊断">
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
        { title: 'icd编码', prop: 'icdid', width: 80 },

        { title: 'icd名称', prop: 'icdname' },
        // { title: 'icd名称', prop: 'editDate' },

        { title: '对码状态', prop: 'isCurrent', width: 80, align: 'center' }
      ],
      pageSize: 20,
      total: 1,
      api: {
        // hisDrugDataUrl: '/sys/hisDrug/selectPage',
        similarDrugDataUrl: '/sys/hisIcd/selectSimilarDicIcdPage',
        mapUrl: 'sys/dicIcdMapper/insert',
        icdAll: 'sys/hisIcd/selectPage',
        dicDrugSelectList: 'sys/dicDrug/selectDrugListByKeyword',
         icdSelectList: 'sys/dicIcd/selectDicIcdByKeyword',
      },
      loading: false,
      columnscheckdtl: [
        { title: 'icd编码', prop: 'id', width: 80 },

        { title: 'icd名称', prop: 'icdname' },
        { title: '拼音码', prop: 'spellcode' }
      ],
      similarData: [],
      NData: {},
      MData: {},
      M: 1,
      N: 1,
      disable: true,
      icdnames: '',
      isActive: true,
      isShow: true,
      marpperId:'',
      icdname:'',
      icdname:'',
      drugAllList:[]
    }
  },
  computed: {
    list() {
      return [
        {
          name: 'ICD名称',
          dataField: 'icdName',
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
    this.getData()
  },
  methods: {
     // 搜索
    handleSearch(value) {
      let params = { keyword: value, id: this.marpperId }
      this.$axios({
        url: this.api.icdSelectList,
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
     // 获取选择框数据
     getDrugList() {
      let params = { keyword: '', id: this.marpperId }
      this.$axios({
        url: this.api.icdSelectList,
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
    // 数据实例化
     handleChange(value, option) {
      console.log(option)
      let params = option.data.attrs
      this.disable = false
      this.isShow = true
      this.icdname = params.icdname
      this.MData.dosageFormsStr = params.dosageFormsStr
      this.MData.producedBy = params.producedBy
      this.MData.spec = params.spec
      this.MData.drugCode = value
      this.MData.unit=params.unit
    },
     // 点击名称栏
     changeFormat() {
      this.isShow = false
      this.disable = true
      this.getDrugList()
    },
    //点击第左边的table列事件
    clickLeftRow(row) {
       this.icdname = ''
      this.isShow=true
      this.isActive = false
      let params = { icdName: row.icdname }
      this.icdnames = row.icdname
      this.NData = row
      this.MData = {}
      if (this.NData.isCurrent == '0') {
        this.getSimilarData(params)
      } else {
        this.MData = row.dicIcd
        this.icdname = this.MData.icdname
        this.getSimilarData(params)
      }
    },
     
   
    //右边部分数据的获取
    getSimilarData(params = {}) {
      this.similarSpin = true
      params.producedBy = this.NData.producedBy
      params.icdname = this.NData.icdname
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
    getData(params = { pageSize: 20, offset: 0 }) {
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
      this.isShow=true
      this.MData = row
      this.disable = false
       this.icdname = this.MData.icdname
    },
    //点击确定的处理事件
    clickSure() {
      let params = {
        orgId: this.NData.orgId,
        hisicdid: this.NData.icdid,
        hisicdname: this.NData.icdname,
        icdid: this.MData.id,
        icdname: this.MData.icdname,
        id: this.NData.mapperId
      }
       this.marpperId = this.NData.mapperId
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
                this.getData()
                this.loading = false
                this.isActive = true
                 this.icdname=''
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
      this.$refs.searchPanel.form.resetFields()
      this.getData({ pageSize: 20, offset: 0 })
      this.current = 1
      this.getData(params)
    },
    //页码数change事件
    pageChangeSize(page, pageSize) {
      this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
    },
    //页码跳转事件
    pageChange(page, pageSize) {
      this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
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
    lostFocus(){

    }
  }
}
</script>
<style lang='less'>
.testchks {
   .ant-card{
    padding-top: 12px;
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
.headers{
    line-height: 36px;
  }
.detailsa {
  .table-th {
    background: #fafafa;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
  }
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
}
.ant-input-number {
  width: 100% !important;
}
.pt {
  pointer-events: none;
}
 
</style>
