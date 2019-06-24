<template>
  <div>
    <a-card>
      <!--<countText :countList="countText"></countText>-->
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-row>
        <a-col :span="10" style="padding-top: 15px">
          <a-button class="margin-left-5" :type="buttonType" @click="buttonClick">{{buttonText}}</a-button>
          <a-button class="margin-left-5" @click="pass" :disabled="disable">批量通过</a-button>
          <a-popconfirm title="确定批量驳回?" placement="topLeft" @confirm="rejected">
            <a-button class="margin-left-5" :disabled="disable">批量驳回</a-button>
          </a-popconfirm>
          <a-select
            style="width: 100px"
            class="margin-left-5"
            placeholder="刷新频率"
            @change="rateChange"
          >
            <a-select-option
              :value="op.id"
              v-for="(op,index) in this.enum.refreshRate"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="14" class="countCol">
          <countText :countList="countText"></countText>
        </a-col>
      </a-row>

      <alert :checkNum="checkSelect" :clearSelect="clearSelect"></alert>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="multipleTable"
          class="multipleEl"
          :data="dataSource"
          border
          style="width: 100%"
          @select="selectBox"
          @select-all="selectAll"
          highlight-current-row
        >
          <!--多选框checkbox-->
          <el-table-column type="selection" width="55" align="center" :show-overflow-tooltip="true"></el-table-column>
          <!--状态列-->
          <!-- <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="80"
            :filters="this.enum.patientStatus"
            :filter-method="filterStatus"
            filter-placement="bottom"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <a-badge v-if="props.row.status == 0" status="default" text="待审核"/>
              <a-badge v-else-if="props.row.status == 1" status="warning" text="已修改"/>
              <a-badge v-else-if="props.row.status == 2" status="error" text="坚持使用"/>
              <a-badge v-else-if="props.row.status == 3" status="success" text="已通过"/>
              <a-badge v-else-if="props.row.status == 4" status="warning" text="已驳回"/>
            </template>
          </el-table-column>-->
          <!--处方、处方数、患者列-->
          <el-table-column
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
          >
            <template slot-scope="props">
              <span v-if="item.prop == 'submitName'">
                <!-- <a href="">{{props.row[item.prop]}}&nbsp;<a-icon type="message"/></a> -->
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{props.row.submitDocPhone}}</span>
                  </template>
                  <a href>
                    {{props.row[item.prop]}}&nbsp;
                    <a-icon type="message"/>
                  </a>
                </a-tooltip>
              </span>
              <span v-else-if="item.prop == 'orderNo'">
                <a-popover @mouseenter="mouseHover(props.row)" trigger="hover">
                  <template slot="content">
                    <prescriptionTabs :tabsData="tabsData"></prescriptionTabs>
                  </template>
                  <a-tag color="#1694fb">{{props.row.orderNo}}</a-tag>
                </a-popover>
              </span>
              <span v-else-if="item.prop == 'updateTime'">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{props.row.updateTime}}</span>
                  </template>
                  <span>{{timeFormat(props.row.updateTime)}}</span>
                </a-tooltip>
              </span>
              <span v-else>{{props.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <!--问题tags列-->
          <el-table-column
            prop="problem"
            label="问题"
            :filters="this.enum.patientProblem"
            :filter-method="filterTag"
            filter-placement="bottom"
            min-width="500"
          >
            <template slot-scope="props">
              <a-row v-for="(op,index) in props.row.orderissueVOS" class="problemRow" :key="index">
                <a-col :span="2">
                  <a-tag :color="op.levelColor" style="cursor: default;">{{op.auditName }}</a-tag>
                </a-col>
                <a-col :span="22">
                  <a-tooltip placement="top" :key="index">
                    <template slot="title" style="width: 300px">
                      {{op.auditClass}}：{{op.auditDescription}}
                      <br>
                      建议：{{op.auditSuggest}}
                    </template>
                    <div class="multiLineText">
                      <span class="auditClass">{{op.auditClass}}：</span>
                      {{op.auditDescription}}
                      <span class="auditClass">建议：</span>
                      {{op.auditSuggest}}
                    </div>
                  </a-tooltip>
                </a-col>
                <a-divider v-if="index<props.row.orderissueVOS.length-1" type="horizontal"/>
              </a-row>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="140" align="center">
            <template slot-scope="props">
              <a @click="looks(props.row)">查看</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                title="确定通过?"
                @confirm="passSingle(props.row)"
                okText="通过"
                cancelText="取消"
              >
                <a href="javascript:;">通过</a>
              </a-popconfirm>
              <a-divider type="vertical"/>
              <a @click="rejectedSingle(props)">驳回</a>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
          showQuickJumper
          :total="total"
          class="pnstyle"
          v-model="current"
          :defaultPageSize="10"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="clientSizeChange"
          @change="customerPageChange"
          size="small"
        ></a-pagination>
      </a-spin>
      <a-modal
        title="驳回理由"
        :visible="Modal.visible"
        @ok="handleOk"
        :confirmLoading="Modal.confirmLoading"
        @cancel="handleCancel"
        width="600px"
        class="modals"
      >
        <a-tabs defaultActiveKey="1" size="small" style="width: 550px">

          <a-tab-pane tab="预判情况" key="1" class="tabPaneLeft">
            <div class="margin-top-10">
              <p class="dealP margin-top-10" style="float: left">审核意见：</p>
              <a-popconfirm title="确定存为模板?" @confirm="saveTemplate()" okText="确定" cancelText="取消">
                <a-button type="primary" class="saveButton" size="small">存为模板</a-button>
              </a-popconfirm>
              <a-select
                class="saveButton"
                size="small"
                style="width: 150px"
                @change="selectTemp"
                v-model="problemType"
              >
                <a-select-option
                  :value="op.tabooId"
                  v-for="(op,index) in reviewTemplates"
                  :key="index"
                >{{op.tabooTitle}}</a-select-option>
              </a-select>
              <a-tooltip placement="top" :key="index" v-for="(tt,index) in templateTags">
                <template slot="title" style="width: 100px">{{tt.titles}}</template>
                <a-tag
                  class="problemTag saveButton"
                  v-if="index<5 && tt.bgColor == '#2eabff'"
                  :key="index"
                  @click="tagsClick(tt)"
                  color="#2eabff"
                >{{tt.updateTitles}}</a-tag>
                <a-tag
                  class="problemTag saveButton"
                  v-else-if="index<5"
                  :key="index"
                  @click="tagsClick(tt)"
                >{{tt.updateTitles}}</a-tag>
              </a-tooltip>
              <a-dropdown :trigger="['hover']">
                <a-menu slot="overlay">
                  <a-menu-item
                    v-for="(gd,index) in templateTags"
                    @click="tagsClick(gd)"
                    v-if="index>=5"
                    :key="index"
                  >{{gd.updateTitles}}</a-menu-item>
                </a-menu>
                <a v-if="templateTags.length>5" class="margin-left-5 saveButton">
                  更多
                  <a-icon type="down"/>
                </a>
                <a v-else></a>
              </a-dropdown>
              <a-textarea :rows="4" v-model="templateText"></a-textarea>
            </div>

          </a-tab-pane>
          <a-tab-pane tab="干预记录" key="2">
            <a-timeline style="margin-top: 20px;margin-left: 10px">
              <a-timeline-item v-for="(rd,index) in recordList" class="timelineItem" :key="index">
                <a-icon
                  v-if="index+1 == recordList.length"
                  slot="dot"
                  type="clock-circle-o"
                  style="font-size: 16px;"
                />
                <p>
                  <a-tag>{{rd.eventPerson}}</a-tag>
                  {{rd.eventTime}}
                </p>
                <p>
                  <span class="font-bold">{{rd.event}}:</span>
                  <span>{{rd.eventText}}</span>
                </p>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import { selectTribunalRecord } from '@/api/login'
import { Icon } from 'ant-design-vue'
import countText from '@/components/count-text'
import prescriptionTabs from '@/components/prescription-tabs'
import alert from '@/components/alert'

const myIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1148820_wj1pz1p40xm.js' // 在 iconfont.cn 上生成
})
export default {
  components: {
    myIcon,
    countText,
    prescriptionTabs,
    alert
  },
  data() {
    return {
      api: {
        updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus',
        selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
        selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
        reviewTemplateUpdate: 'sys/reviewTemplate/update',
        selectTribunalRecordNum: 'sys/reviewOrderissue/selectTribunalRecordNum',
        reviewUpdateStatus: 'sys/reviewPlanorder/updateStatus',
        selectTreeData: 'sys/sysDepts/selectDeptsTreeList',
        selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },

      //页头数据
      countText: [],
      //按钮初始化
      buttonText: '开始审方',
      buttonType: 'primary',
      disable: true,
      //初始化多选项
      checkSelect: 0,
      selections: [],
      //table数据加载
      loading: false,
      dataSource: [],
      columns: [
        { title: '处方号', prop: 'orderNo', width: 100, align: 'center' },
        { title: '处方时间', prop: 'submitTime', width: 170 },
        { title: '医生', prop: 'submitName', width: 90 },
        { title: '科室', prop: 'deptName', width: 80, align: 'center' },
        { title: '门诊号', prop: 'admitNum', width: 150, align: 'right' },
        { title: '患者', prop: 'pname', width: 80 },
        { title: '性别', prop: 'sex', width: 50, align: 'center' },
        { title: '年龄', prop: 'age', width: 60 }
      ],
      //页码初始化
      total: 2,
      current: 1,
      //已分配科室
      dis: false,
      Modal: {
        visible: false,
        confirmLoading: false
      },
      form: this.$form.createForm(this),
      //处方单tabsData
      tabsData: {},
      problemsData: [],
      rateTime: 10000000000,

      problemType: '',
      reviewTemplates: [],
      //初始化定时器
      timeInitialize: null,
      templateTags: [],
      reviewTemplates: [],
      templateText: '',
      tempRowData: {},
      treeDatas: [],
      recordList:[]
    }
  },
  computed: {
    list() {
      return [
        {
          name: '患者',
          dataField: 'pname',
          type: 'text'
        },
        { name: '医生', dataField: 'submitName', type: 'text' },
        {
          name: '科室',
          dataField: 'admitDept',
          type: 'tree-select',
          keyExpr: 'keyword',
          treeData: this.treeDatas
        }
      ]
    }
  },
  mounted() {
    //获取后台数据
    this.fetchYJSMapData()
    //获取头部数据
    this.getCountText()
    // 获取科室数据
    this.getTreeseldata()
  },
  methods: {
    //获取干预记录数据
    getRecords(params={}) {
      this.$axios({
        url: this.api.selectWithVisId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.recordList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 科室树形结构
    getTreeseldata(params = {}) {
      this.$axios({
        url: this.api.selectTreeData,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.treeDatas = this.getDataChildren(res.rows, undefined)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //搜索
    search() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.pageSize = 10
      params.offset = 0
      this.fetchYJSMapData(params)
    },
    //重置
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.fetchYJSMapData({ pageSize: 10, offset: 0 })
    },

    //翻页事件
    customerPageChange(page, pageSize) {
      let params = {}
      params.pageSize = pageSize
      params.offset = (page - 1) * pageSize
      this.fetchYJSMapData(params)
    },
    //更改一页多少数据
    clientSizeChange(current, size) {
      this.current = 1
      let params = {}
      params.pageSize = size
      params.offset = 0
      this.fetchYJSMapData(params)
    },

    //TODO:后台暂未获取数据
    fetchYJSMapData(params = { pageSize: 10, offset: 0 }) {
      this.loading = true
      params.orderId = 1
      selectTribunalRecord(params)
        .then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total
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
    //TODO：数据暂未获取
    getCountText() {
      let params = { reviewResouce: 1 }
      this.$axios({
        url: this.api.selectTribunalRecordNum,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.countText = res.rows
            for (let key in this.countText) {
              if (this.countText[key].item == '待审核') {
                this.countText[key].colors = '#32c5d2'
              } else if (this.countText[key].item == '驳回待确认') {
                this.countText[key].colors = '#f3c200'
              } else if (this.countText[key].item == '已通过') {
                this.countText[key].colors = '#3598dc'
              } else if (this.countText[key].item == '已驳回') {
                this.countText[key].colors = '#E6A23C'
              }
            }
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //多选框点击事件
    selectBox(selection, row) {
      //点击后获取这条数据
      this.selections = selection
      this.checkSelect = selection.length
    },
    //全选
    selectAll(selection) {
      this.selections = selection
      this.checkSelect = selection.length
    },
    //清空多选
    clearSelect() {
      this.$refs.multipleTable.clearSelection()
      this.checkSelect = 0
    },
    //开始审方
    buttonClick() {
      let status = null
      if (this.buttonText == '开始审方') {
        this.buttonText = '停止审方'
        this.buttonType = 'danger'
        this.disable = false
        status = 1
      } else {
        this.buttonText = '开始审方'
        this.buttonType = 'primary'
        this.disable = true
        status = 0
      }
      let params = { status: status }
      this.$axios({
        url: this.api.reviewUpdateStatus,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //批量通过
    pass() {
      let params = {}
      let reviewIds = []
      if ($.trim(this.selections).length <= 0) {
        this.warn('请选择处方')
        return
      } else {
        for (let key in this.selections) {
          reviewIds[key] = this.selections[key].reviewId
        }
        params.auditType = '1'
        params.passType = '1'
        params.reviewOpinion = '批量通过'
        params.reviewVerdict = '1'
        params.reviewIds = reviewIds
        this.$axios({
          url: this.api.updateReviewStatus,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
    },
    //批量驳回
    rejected() {
      let params = {}
      let reviewIds = []
      if ($.trim(this.selections).length <= 0) {
        this.warn('请选择处方')
        return
      } else {
        for (let key in this.selections) {
          reviewIds[key] = this.selections[key].reviewId
        }
        params.auditType = '1'
        params.passType = '1'
        params.reviewOpinion = '批量驳回'
        params.reviewVerdict = '2'
        params.reviewIds = reviewIds
        this.$axios({
          url: this.api.updateReviewStatus,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
    },
    //单个通过
    passSingle(data) {
      let params = {}
      params.auditType = '1'
      params.passType = '1'
      params.reviewOpinion = '通过'
      params.reviewVerdict = '1'
      params.reviewIds = []
      params.reviewIds[0] = data.row.reviewId
      this.$axios({
        url: this.api.updateReviewStatus,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success(res.msg)
            this.fetchYJSMapData()
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //单个驳回
    rejectedSingle(data) {
      this.Modal.visible = true
      this.tempRowData = data.row
      this.problemsData = data.row.orderissueVOS
      this.getRecords({visId:data.row.visId})
      this.getTemplate(data)
    },
    getTemplate(data) {
      let params = {}
      params.visId = data.row.visId
      params.prescOrderNo = data.row.orderNo
      console.log(data, 'data')
      this.$axios({
        url: this.api.selectWithReviewId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.reviewTemplates = res.rows
            if (this.reviewTemplates.length > 0) {
              this.problemType = this.reviewTemplates[0].tabooId
              this.getTemplateDetail()
            }
            this.reviewTemplates.push({ tabooId: '-1', tabooTitle: '----通用----' })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    getTemplateDetail(data) {
      let params = {}
      params.tabooClass = this.problemType
      this.$axios({
        url: this.api.selectReviewTemplateDetail,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.templateTags = res.rows
            this.dealTemplateTags(this.templateTags)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    dealTemplateTags(data) {
      for (let i in data) {
        data[i].bgColor = '#d9d9d9'
        if (data[i].titles.length > 5) {
          data[i].updateTitles = data[i].titles.substr(0, 5) + '...'
        } else {
          data[i].updateTitles = data[i].titles
        }
      }
    },
    //存为模板
    saveTemplate() {
      if ($.trim(this.templateText).length == 0) {
        this.warn('请输入审核意见')
        return
      } else {
        let params = {}
        params.contents = this.templateText
        params.tabooClass = this.problemType
        params.templetType = '1'
        params.titles = this.templateText.slice(0, 10)
        this.$axios({
          url: this.api.reviewTemplateUpdate,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
    },
    selectTemp(data) {
      this.problemType = data
      this.getTemplateDetail()
    },
    tagsClick(data) {
      let list = this.templateTags
      for (let i in list) {
        if (list[i].id == data.id) {
          list[i].bgColor = '#2eabff'
        } else {
          list[i].bgColor = '#d9d9d9'
        }
      }
      console.log(data, 'data')
      this.templateText = data.reviewTemplate
    },
    //弹窗提交
    handleOk() {
      this.problemsData
      let params = {}
      params.auditType = '1'
      params.passType = '1'
      params.reviewOpinion = this.templateText
      params.reviewVerdict = '1'
      params.reviewIds = []
      params.reviewIds[0] = this.tempRowData.reviewId
      this.$axios({
        url: this.api.updateReviewStatus,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success(res.msg)
            this.Modal.visible = false
            this.fetchYJSMapData()
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //弹窗取消
    handleCancel() {
      this.Modal.visible = false
    },
    //筛选
    filterTag(value, row) {
      console.log(value, 'value')
      console.log(row, 'row')
    },
    filterStatus(value, row) {
      return row.status == value
    },
    //查看
    looks(data) {
      this.$router.push({
        name: 'presOutpatientDetail',
        query: { visId: data.visId, submitNo: data.maxSubmitNo }
      })
    },
    //TODO:处方单数据暂未处理
    mouseHover(data) {
      let tabsOne = {}
      let columns2 = [
        { title: '序号', prop: 'seqNum', width: 50, align: 'right' },
        { title: '', prop: 'mark', width: 20, align: 'left' },
        { title: '名称', prop: 'drugName' },
        // { title: '', prop: 'tags',width:100 },
        { title: '规格', prop: 'spec', width: 80 },
        { title: '单量', prop: 'dosageStr', width: 60 },
        { title: '总量', prop: 'amountStr', width: 60 },
        { title: '频次', prop: 'frequency', width: 80, align: 'center' },
        { title: '服药方式', prop: 'useType', width: 80 }
      ]
      let adviceData = data.clinicPrescVOS
      tabsOne.tabName = '处方单1'
      if (data.diseaseName) {
        tabsOne.diseaseName = data.diseaseName
      }
      if (data.ptype) {
        tabsOne.costType = data.ptype
      }
      tabsOne.listData = adviceData
      tabsOne.columns = columns2
      this.dealTabsData(tabsOne)
    },

    dealTabsData(dataOne) {
      this.tabsData.tabsOne = {
        tabName: dataOne.tabName,
        diagnose: dataOne.diseaseName,
        costType: dataOne.costType,
        adviceData: dataOne.listData,
        columns: dataOne.columns
      }
    },

    changeBox(data) {
      if (data.target.checked) {
        this.dis = true
      } else {
        this.dis = false
      }
    },
    getDataChildren(bdata, pid) {
      var items = []
      for (var key in bdata) {
        var item = bdata[key]
        if (pid == item.parentId) {
          items.push({
            title: item.title,
            value: item.deptId,
            key: item.deptId,
            children: this.getDataChildren(bdata, item.deptId)
          })
        }
      }
      return items
    },

    //频率事件
    rateChange(value) {
      this.rateTime = value
      clearInterval(this.timeInitialize)
      this.setTimeRval(this.rateTime)
    },
    //定时器
    setTimeRval() {
      this.timeInitialize = setInterval(() => {
        this.fetchYJSMapData()
      }, this.rateTime)
    }
  },
  beforeDestroy() {
    if (this.timeInitialize) {
      clearInterval(this.timeInitialize)
    }
  }
}
</script>
<style>
.divInfo span {
  margin-left: 10px;
}

/*自定义图标样式*/
.myIcon {
  font-size: 22px;
  font-weight: bold;
  padding-top: 40px;
}

/*网格样式*/
.multipleEl {
  margin-top: 10px;
}
.auditClass {
  font-weight: bold;
  color: #000000;
  opacity: 0.9;
}

/*.multipleEl .has-gutter tr th:nth-child(3) {*/
/*border-right: 0px;*/
/*}*/

/*.multipleEl .has-gutter tr th:nth-child(4) {*/
/*border-right: 0px;*/
/*}*/

/*.multipleEl .has-gutter tr th:nth-child(7) {*/
/*border-right: 0px;*/
/*}*/

/*.multipleEl .has-gutter tr th:nth-child(8) {*/
/*border-right: 0px;*/
/*}*/

/*.multipleEl .has-gutter tr th:nth-child(9) {*/
/*border-right: 0px;*/
/*}*/

.multipleEl .has-gutter tr th:nth-child(11) {
  border-right: 0px;
}

/*.multipleEl .el-table__row td:nth-child(11) {*/
/*border-right: 0px;*/
/*}*/
.problemRow {
  line-height: 30px;
}

.problemRow .ant-divider-horizontal {
  margin: 0 0;
}

.multipleEl .multiLineText {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1; /*限制在一个块元素显示的文本的行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 100%;
  /*text-indent:2em;*/
}

.lineText {
  height: 100%;
  text-indent: 2em;
  font-size: 12px;
}

.modals .ant-form-item {
  margin-bottom: 5px;
}

.modals .ant-modal-body {
  padding: 8px 24px;
}

.modals .ant-form-item-control {
  line-height: 30px;
}

.modals .ant-form-item-label {
  line-height: 30px;
}

.modals .ant-tabs-bar {
  margin: 0 0 0px 0;
}

.modals .ant-card-body {
  padding: 10px 21px;
}

.modals .ant-timeline {
  margin-top: 20px;
}

.modals .selectInput {
  line-height: 24px;
  font-size: 14px;
  width: 100%;
}
.countCol .countStyle {
  margin-top: 0px !important;
}
.countCol .countFor {
  margin-bottom: 0px !important;
}
.saveButton {
  margin-top: 10px;
  margin-left: 10px;
  float: left;
}

.problemTag {
  font-size: 12px;
  margin-left: 7px;
  margin-bottom: 5px;
}
.timelineItem p {
  margin-bottom: 5px;
}

.timelineItem p:nth-child(n + 2) {
  opacity: 0.8;
}
</style>