<template>
  <a-Row class="testchk">
    <a-Col :span="14">
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

    <a-Col :span="10" class="details">
      <a-card title="药品对码" class="kapian">
        <a-row class="box table-th">
          <a-col :span="6"></a-col>
          <a-col :span="8">医院药品</a-col>
          <a-col :span="8" class="zhishiku">知识库药品</a-col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">编号：</a-col>
          <a-col :span="8">{{NData.drugCode}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.drugCode}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">药品名称：</a-col>
          <a-col :span="8">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>{{NData.drugName}}</span>
              </template>
              {{NData.drugName}}
            </a-tooltip>
          </a-col>
          <a-Col :span="10" class="td-content" @click="changeFormat">
            <div >
              <header v-if="isShow" class="headers">
                <a-tooltip placement="topLeft" style="cursor: pointer;">
                  <template slot="title">
                    <span>{{ this.drugName}}</span>
                  </template>
                  {{ this.drugName}}
                </a-tooltip>
              </header>
              <footer v-if="!isShow">
                <a-select
                  :defaultValue="drugselval"
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
                  @blur='lostFocus'
                  v-decorator="[ 'drugCodes']"
                >
                  <a-select-option
                    v-for="(item,index) in this.drugAllList"
                    :value="item.drugCode"
                    :key="item.dosageForms"
                    :producedBy="item.producedBy"
                    :spec="item.spec"
                    :spellCode="item.spellCode"
                    :drugName="item.drugName"
                    :dosageFormsStr="item.dosageFormsStr"
                  >
                    <a-row>
                      <a-col>{{item.drugName}}</a-col>
                    </a-row>
                    <a-row>
                      <a-col style="opacity: 0.6">{{item.producedBy}}</a-col>
                    </a-row>
                    <a-divider style="margin: 8px 0 0 0;" />
                  </a-select-option>
                </a-select>
              </footer>
            </div>
          </a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">生产厂商：</a-col>
          <a-col :span="8">{{NData.producedBy}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.producedBy}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">剂型：</a-col>
          <a-col :span="8">{{NData.dosageForms}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.dosageFormsStr}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">剂量单位：</a-col>
          <a-col :span="8">{{NData.doseUnit}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.unit}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">规格：</a-col>
          <a-col :span="8">{{NData.spec}}</a-col>
          <a-Col :span="8" class="td-content">{{MData.spec}}</a-Col>
        </a-row>
        <a-row class="box">
          <a-col :span="6" class="textRight">剂量系数：</a-col>
          <a-col :span="8">
            <a-input-number :min="1" size="small" @change="nchange" v-model="N" />
          </a-col>
          <a-Col :span="8" class="td-content">
            <a-input-number :min="1" size="small" @change="nchange" v-model="M" />
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

      <a-card class="margin-top-5" title="相似药品">
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
        { title: '药品编码', prop: 'drugCode', width: 80 },
        { title: '药品名称', prop: 'drugName' },
        { title: '剂型', prop: 'dosageForms', width: 130 },
        { title: '规格', prop: 'spec', width: 130 },
        { title: '厂商', prop: 'producedBy' },
        { title: '剂量单位', prop: 'doseUnit', width: 80, align: 'center' },
        { title: '对码状态', prop: 'isCurrent', width: 80, align: 'center' }
      ],
      pageSize: 20,
      total: 1,
      api: {
        hisDrugDataUrl: '/sys/hisDrug/selectPage',
        similarDrugDataUrl: '/sys/hisDrug/selectSimilarDrugPage',
        mapUrl: 'sys/dicDrugMapper/insert',
        dicDrugSelectList: 'sys/dicDrug/selectDrugListByKeyword'
      },
      loading: false,
      columnscheckdtl: [
        { title: '药品编码', prop: 'drugCode', width: 90, align: 'right' },
        { title: '药品名称', prop: 'drugName' },
        { title: '剂型', prop: 'dosageFormsStr', width: 80 },
        { title: '生产厂商', prop: 'producedBy' }
      ],
      similarData: [],
      NData: {},
      MData: {},
      M: 1,
      N: 1,
      disable: true,
      marpperId: '',
      drugName: '',
      isShow: true,
      drugAllList: [],
      isActive: true,
      drugselval:''
    }
  },
  computed: {
    list() {
      return [
        {
          name: '药品名称',
          dataField: 'drugName',
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
      console.log(option)
      let params = option.data.attrs
      this.disable = false
      this.isShow = true
      this.drugName = params.drugName
      this.MData.dosageFormsStr = params.dosageFormsStr
      this.MData.producedBy = params.producedBy
      this.MData.spec = params.spec
      this.MData.drugCode = value
      this.MData.unit=params.unit
    },
    lostFocus() {   
      console.log('www')
     //this.isShow = true
    },

    //点击第左边的table列事件
    clickLeftRow(row) {
      this.isActive = false
      this.drugName = ''
      this.isShow=true
      console.log(row)
      this.NData = row
      this.MData = {}
      let params = {}
      if (this.NData.isCurrent == '0') {
        params = {
          drugName: this.NData.drugName,
          producedBy: this.NData.producedBy
        }
        this.getSimilarData(params)
      } else {
        this.MData = row.dicDrugMapperVO
        this.drugName = this.MData.drugName
        this.drugselval=this.MData.drugName
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
      params.producedBy = this.NData.producedBy
      params.drugName = this.NData.drugName
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
      this.drugName = this.MData.drugName
       this.drugselval=this.MData.drugName
      this.disable = false
      this.isShow=true
    },
    //点击确定的处理事件
    clickSure() {
      let params = {}
      this.marpperId = this.NData.mapperId
      params.orgId = this.NData.orgId
      params.id = this.NData.mapperId
      params.hisDrugCode = this.NData.drugCode
      params.hisDrugName = this.NData.drugName
      params.hisSpec = this.NData.spec
      params.hisDoseUnit = this.NData.doseUnit
      params.hisProducedBy = this.NData.producedBy
      params.hisDosageForms = this.NData.dosageForms
      params.drugCode = this.MData.drugCode
      params.drugName = this.MData.drugName
      params.producedBy = this.MData.producedBy
      params.dosageForms = this.MData.dosageForms
      params.doseUnit = this.MData.doseUnit
      params.M = this.M
      params.N = this.N
      this.loading = true
      let arrs = Object.keys(this.MData)
      if (arrs.length == 0) {
        this.$message.info('请添加知识库数据!')
      } else {
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
                this.drugName=''
                this.getData({pageSize:this.pageSize,offset:(this.current-1)*10})
                
                this.loading = false
                this.isActive=true
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
      // this.getData(params)
    },
    //页码数change事件
    pageChangeSize(page, pageSize) {
      this.pageSize=pageSize
      this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
    },
    //页码跳转事件
    pageChange(page, pageSize) {
      this.current=page
      this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
    },
    //页码跳转
    similarPageChange(page, size) {
      let params = {}
      params.drugName = this.MData.drugName
      params.producedBy = this.MData.producedBy
      params.offset = (page - 1) * size
      this.getSimilarData(params)
    },
    //页码数的改变
    similarSizeChange(current, size) {
      //this.current = 1
      let params = {}
      params.drugName = this.MData.drugName
      params.producedBy = this.MData.producedBy
      params.pageSize = size
      this.getSimilarData(params)
    }
  }
}
</script>
<style lang='less'>
.testchk {
  .ant-card{
    padding-top: 12px;
  }
  .headers{
    line-height: 36px;
  }
  .ant-card-body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 1px;
  }
  .details {
    .ant-select-selection{
      border: 0px;
    }
    .ant-select {
      // margin-top: 4px;
          margin-left: -3px;
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
  }
  .ant-input-number {
    width: 100% !important;
  }
  .kapian {
    padding-left: 0;
    padding-right: 0;
    padding-top: 1px;
  }
  .zhishiku {
    padding-left: 5px;
  }
}
.hechengayaos {
  //color: red!important;
  opacity: 0.8;
  font-size: 13px;
}
.pt {
  pointer-events: none;
}
</style>
