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
          <a-button
            class="margin-top-10 margin-left-5"
            :type="buttonType"
            @click="buttonClick"
          >{{buttonText}}</a-button>
          <a-button class="margin-left-5" @click="pass" :disabled="disable">批量通过</a-button>
          <a-button class="margin-left-5" @click="rejected" :disabled="disable">批量驳回</a-button>
        </a-col>
        <a-col :span="14" class=".">
          <countText :countList="countText"></countText>
        </a-col>
      </a-row>
      <alert :checkNum="checkSelect" :clearSelect="clearSelect"></alert>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="multipleTable"
          class="multipleEl"
          :data="dataSources"
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
                <a href>
                  {{props.row[item.prop]}}&nbsp;
                  <a-icon type="message"/>
                </a>
              </span>
              <span v-else>{{props.row[item.prop]}}</span>
            </template>
          </el-table-column>
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
            <a-card class="margin-top-10" v-for="(op,index) in problemsData" :key="index">
              <a-tag :color="op.colors" style="cursor: default;font-weight: bold">{{op.problem }}级</a-tag>
              <span :style="{fontWeight:'bold'}">{{op.problemText}}</span>
              <div class="lineText opacity8">{{op.text}}</div>
              <a-row class="margin-top-10 selectInput">
                <a-col :span="3" style="line-height: 24px">驳回理由:</a-col>
                <a-col :span="18">
                  <a-input size="small">
                    <a-select
                      slot="addonBefore"
                      :dropdownMatchSelectWidth="false"
                      size="small"
                      defaultValue="+86"
                    >
                      <a-select-option value="+86">药房库存不足</a-select-option>
                      <a-select-option value="+87">药房库存不足</a-select-option>
                    </a-select>
                  </a-input>
                </a-col>
                <a-col :span="3">
                  <a-button size="small">存为模板</a-button>
                </a-col>
              </a-row>
            </a-card>
          </a-tab-pane>
          <a-tab-pane tab="干预记录" key="2">
            <a-timeline>
              <a-timeline-item color="green">系统预判不通过 2015-09-01</a-timeline-item>
              <a-timeline-item color="green">请医生再次审核 2015-09-01</a-timeline-item>
              <a-timeline-item color="red">
                <p>有接触隔离医嘱 1</p>
                <p>有隔离措施 2</p>
                <p>医疗废物处置 3 2015-09-01</p>
              </a-timeline-item>
              <a-timeline-item>
                <p>离开病区检查是否通知相关科室做好防护等 1</p>
                <p>有隔离措施 2</p>
                <p>医疗废物处置 3 2015-09-01</p>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
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
        selectPage: 'sys/reviewOrderissue/selectHospitalizationRecord',
        selectTreeData: 'sys/sysDepts/selectDeptsTreeList',
        getStatusData: 'sys/reviewOrderissue/selectTribunalRecordNum',
        updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus'
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
      dataSources: [],
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
      treeDatas: []
    }
  },
  computed: {
    list() {
      return [
        { name: '医生', dataField: 'submitDoc', type: 'text' },
        { name: '患者', dataField: 'patientName', type: 'text' },
        {
          name: '科室',
          dataField: 'admitDept',
          type: 'tree-select',
          keyExpr: 'keyword',
          treeData: this.treeDatas
          //valueExpr: 'text'
        },
        { name: '住院号', dataField: 'admitNum', type: 'text' }
      ]
    }
  },
  mounted() {
    this.getDatas()
    this.getTreeseldata()
    this.getStatusDatas({ reviewResouce: 2 })
  },
  methods: {
    // 开始数据
    getDatas(params = {}) {
      this.$axios({
        url: this.api.selectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSources = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //状态数据
    getStatusDatas(params = {}) {
      this.$axios({
        url: this.api.getStatusData,
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
      this.getDatas(params)
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
    //TODO:后台暂未获取数据
    fetchYJSMapData(params = { pageSize: 10, offset: 0 }) {
      params.statusYjs = '1'
      params.drugSource = '1'
      this.loading = false
      this.dealData()
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
    //开始审方
    buttonClick() {
      if (this.buttonText == '开始审方') {
        this.buttonText = '停止审方'
        this.buttonType = 'danger'
        this.disable = false
      } else {
        this.buttonText = '开始审方'
        this.buttonType = 'primary'
        this.disable = true
      }
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
      if ($.trim(this.selections).length <= 0) {
        this.warn('请选择处方')
        return
      } else {
      }
    },
    //单个通过
    passSingle(data) {},
    //单个驳回
    rejectedSingle(data) {
      this.Modal.visible = true
      this.problemsData = data.row.problemList
      for (let key in this.problemsData) {
        this.problemsData[key].rejectReason = '病入膏肓'
      }
    },
    //弹窗提交
    handleOk() {
      this.Modal.visible = false
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
      this.$router.push({
        name: 'presHospitalizedDetail',
        query: { visId: data.visId, maxSubmitNo: data.maxSubmitNo }
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