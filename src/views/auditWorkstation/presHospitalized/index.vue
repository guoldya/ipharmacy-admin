<template>
  <div>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-row class="dealDetail">
        <a-col :span="10">
          <a-popconfirm
            v-if="buttonType == 'danger'"
            title="确定停止审方?"
            @confirm="buttonClick"
            okText="确定"
            cancelText="取消"
          >
            <a-button class="margin-left-5" :type="buttonType">{{buttonText}}</a-button>
          </a-popconfirm>
          <a-button
            v-else
            class="margin-left-5"
            @click="buttonClick"
            :type="buttonType"
          >{{buttonText}}</a-button>
          <a-button class="margin-left-5" @click="pass" :disabled="disable">批量通过</a-button>
          <a-button class="margin-left-5" @click="rejected" :disabled="disable">批量驳回</a-button>
          <a-select
            style="width: 120px"
            class="margin-left-5"
            placeholder="刷新频率"
            @change="rateChange"
            :disabled="disable"
            defaultValue="10秒"
          >
            <a-select-option
              :value="op.id"
              v-for="(op,index) in this.enum.refreshRate"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="14" class=".">
          <countText :countList="countText"></countText>
        </a-col>
      </a-row>

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
          <el-table-column type="selection" width="55" align="center" :show-overflow-tooltip="true"></el-table-column>
          <!--处方、处方数、患者列-->
          <el-table-column
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <span v-if="item.prop == 'sex'">{{dealsex(props.row.sex)}}</span>
              <span v-else-if="item.prop == 'submitTime'">{{dealtime(props.row.submitTime)}}</span>
              <span v-else-if="item.prop == 'submitName'">
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
              <span v-else>{{props.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="problem"
            label="问题"
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
                placement="topRight"
              >
                <a>通过</a>
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
        width="750px"
        class="modals"
        okText="驳回"
      >
        <jodgeStation :visData="visDatas" @adoptMessage="updateData" @upchange="updateDatas"></jodgeStation>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import {} from '@/api/login'
import { Icon } from 'ant-design-vue'
import countText from '../component/count-text'
import prescriptionTabs from '../component/prescription-tabs'
import alert from '@/components/alert'
import jodgeStation from './jodgeStationCopy.vue'
const myIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1148820_wj1pz1p40xm.js' // 在 iconfont.cn 上生成
})
export default {
  components: {
    myIcon,
    countText,
    prescriptionTabs,
    alert,
    jodgeStation
  },
  data() {
    return {
      api: {
        selectPage: 'sys/reviewOrderissue/selectHospitalizationRecord',
        selectTreeData: 'sys/sysDepts/selectDeptsTreeList',
        // getStatusData: 'sys/reviewOrderissue/selectTribunalRecordNum',
        updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus',
        reviewUpdateStatus: 'sys/reviewPlanorder/updateStatus',
        selectTribunalRecordNum: 'sys/reviewOrderissue/selectTribunalRecordNum',
        selectEason: 'sys/sysPersons/selectSysPersonsByOrgId'

        // sysPersons/selectSysPersonsByOrgId
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
        { title: '提交时间', prop: 'submitTime', width: 140, align: 'left' },
        { title: '住院号', prop: 'admitNum', width: 120 },
        { title: '医生', prop: 'submitName', width: 90 },
        { title: '科室', prop: 'deptName', width: 100 },
        { title: '患者', prop: 'pname', width: 100 },
        { title: '性别', prop: 'sex', width: 80 },
        { title: '年龄', prop: 'age', width: 50 }
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
      treeDatas: [],
      timeInitialize: null,
      refreshFreq: null,
      rateTime: 10000000000,
      loading: false,
      visDatas: {},
      templateText: '',
      tempRowData: {},
      EasonData: [],
      reviewId:''
    }
  },
  computed: {
    list() {
      return [
        { name: '住院号', dataField: 'admitNum', type: 'text' },
        { name: '患者', dataField: 'patientName', type: 'text' },
        {
          name: '科室',
          dataField: 'admitDept',
          type: 'tree-select',
          keyExpr: 'keyword',
          treeData: this.treeDatas
        },
        {
          name: '医生',
          dataField: 'personId',
          type: 'select',
          keyExpr: 'personId',
          valueExpr: 'name',
          dataSource: this.EasonData
        }
      ]
    }
  },
  mounted() {
    this.fetchYJSMapData()
    this.getTreeseldata()
    this.selectEasonData()
    // this.getStatusDatas({ reviewResouce: 2 })
  },
  methods: {
    // 获取医生
    selectEasonData(params = {}) {
      this.$axios({
        url: this.api.selectEason,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.EasonData = res.rows
           
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
    updateData(value) {
      this.templateText = value
    },
    updateDatas(value) {
      this.templateText = value
    },
    // 刷新数据
    fetchYJSMapData(params = { pageSize: 10, offset: 0 }) {
      this.loading = true
      params.orderId = 1
      this.$axios({
        url: this.api.selectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = this.$dateFormat(res.rows, ['submitTime'])
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
    //频率事件
    rateChange(value) {
      clearInterval(this.timeInitialize)
      if (value == 0) {
      } else {
        this.rateTime = value
        this.setTimeRval(this.rateTime)
      }
    },
    //定时器
    setTimeRval(data) {
      this.timeInitialize = setInterval(() => {
        this.fetchYJSMapData()
        this.getCountText()
        console.log('dddddd')
      }, data)
    },
    // 状态数据
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
      this.fetchYJSMapData(params)
      // this.fetchYJSMapData({ pageSize: 10, offset: 0 })
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
    //处理数据
    dealData() {
      let data = this.dataSource
      for (let key in data) {
        if (data[key].problem == '2') {
          data[key].colors = '#33CCFF'
        } else if (data[key].problem == '3') {
          data[key].colors = '#DFE184'
        } else if (data[key].problem == '4') {
          data[key].colors = '#FFCC00'
        } else if (data[key].problem == '5') {
          data[key].colors = '#FF6600'
        } else if (data[key].problem == '6') {
          data[key].colors = '#FF0000'
        }
      }
      this.dataSource = data
    },

    //多选框点击事件
    selectBox(selection, row) {
      //点击后获取这条数据
      //console.log(selection)
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
    // 开始审方
    buttonClick() {
      let status = null
      let _this = this
      if (this.buttonText == '开始审方') {
        this.getCountText()
        this.refreshFreq = Number(10000)
        this.setTimeRval(10000)
        this.buttonType = 'danger'
        this.disable = false
        status = '1'
        let params = { status: status, planScope: 1, planType: 1 }
        this.$axios({
          url: this.api.reviewUpdateStatus,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.buttonText = '停止审方'
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      } else {
        status = '0'
        let params = { status: status, planScope: 1, planType: 1 }
        this.$axios({
          url: this.api.reviewUpdateStatus,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              clearInterval(_this.timeInitialize)
              this.buttonText = '开始审方'
              this.buttonType = 'primary'
              this.disable = true
              if (res.data > 0) {
                this.$confirm({
                  title: '批量通过或者批量驳回！',
                  okText: '批量通过',
                  cancelText: '批量驳回',
                  onOk() {
                    let passParams = {}
                    passParams.reviewVerdict = 1
                    passParams.planScope = 1
                    _this
                      .$axios({
                        url: _this.api.updateReviewList,
                        method: 'put',
                        data: passParams
                      })
                      .then(res => {
                        if (res.code == '200') {
                          _this.success('批量通过成功')
                          _this.fetchYJSMapData()
                          _this.getCountText()
                        } else {
                          _this.warn(res.msg)
                        }
                      })
                      .catch(err => {
                        _this.error(err)
                      })
                  },
                  onCancel() {
                    let passParams = {}
                    passParams.reviewVerdict = 2
                    passParams.planScope = 1
                    _this
                      .$axios({
                        url: _this.api.updateReviewList,
                        method: 'put',
                        data: passParams
                      })
                      .then(res => {
                        if (res.code == '200') {
                          _this.success('批量驳回成功')
                          _this.fetchYJSMapData()
                          _this.getCountText()
                        } else {
                          _this.warn(res.msg)
                        }
                      })
                      .catch(err => {
                        _this.error(err)
                      })
                  }
                })
              } else {
                this.success('停止成功！')
              }
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
    },
    // 单个通过
    passSingle(data) {
      let params = {}
      params.auditType = '1'
      params.passType = '1'
      params.reviewOpinion = '通过'
      params.reviewVerdict = '1'
      params.reviewIds = []
      params.reviewIds[0] = data.reviewId
      this.$axios({
        url: this.api.updateReviewStatus,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.success(res.msg)
            this.fetchYJSMapData()
            this.getCountText()
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
              this.fetchYJSMapData()
              this.getCountText()
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
              this.fetchYJSMapData()
              this.getCountText()
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
    //单个通过

    //单个驳回
    rejectedSingle(data) {
      Object.assign(this.visDatas, { visId: data.row.visId, submitNo: data.row.maxSubmitNo })
     
      this.Modal.visible = true
      //this.problemsData = data.row.problemList
      this.tempRowData = data.row
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
            this.getCountText()
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
    filterTag(row, column) {
      console.log(column)
      console.log(row)
    },

    //查看
    looks(data) {
      console.log(data)
      this.$router.push({
        name: 'presHospitalizedDetail',
        params: { visId: data.visId, maxSubmitNo: data.maxSubmitNo,reviewId:data.reviewId,isNew:1, }
      })
    },
    //处方单网格样式

    dealsex(sex) {
      if (sex == 1) {
        return '男'
      }
      if (sex == 2) {
        return '女'
      }
      if (sex == 0) {
        return '未知'
      }
    },
    dealtime(time) {
      if (time) {
        return time.slice(0, time.lastIndexOf(':'))
      }
    },
    // 递归处理数据
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
    }
  }
}
</script>
<style lang='less'>
.divInfo span {
  margin-left: 10px;
}

.dealDetail {
  margin-top: 10px;
  .ant-row {
    padding-top: 12px;
  }
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

.multipleEl .has-gutter tr th:nth-child(3) {
  border-right: 0px;
}

.multipleEl .has-gutter tr th:nth-child(4) {
  border-right: 0px;
}

.multipleEl .has-gutter tr th:nth-child(6) {
  border-right: 0px;
}
.multipleEl .has-gutter tr th:nth-child(7) {
  border-right: 0px;
}

.multipleEl .has-gutter tr th:nth-child(8) {
  border-right: 0px;
}

.multipleEl .has-gutter tr th:nth-child(9) {
  border-right: 0px;
}

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
  margin-top: 16px;
}

.modals .selectInput {
  line-height: 24px;
  font-size: 14px;
  width: 100%;
}
</style>