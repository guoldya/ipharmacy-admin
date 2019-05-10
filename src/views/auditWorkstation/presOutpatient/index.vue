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
          <a-button class=" margin-left-5" :type="buttonType" @click="buttonClick">{{buttonText}}</a-button>
          <a-button class="margin-left-5" @click="pass" :disabled="disable">批量通过</a-button>
          <a-button class="margin-left-5" @click="rejected" :disabled="disable">批量驳回</a-button>
          <a-select style="width: 100px"  class="margin-left-5"  placeholder="刷新频率" @change="rateChange">
            <a-select-option :value='op.id' v-for="(op,index) in this.enum.refreshRate" :key="index">
              {{op.text}}
            </a-select-option>
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
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :show-overflow-tooltip="true">
          </el-table-column>
          <!--状态列-->
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="80"
            :filters="this.enum.patientStatus"
            :filter-method="filterTag"
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
          </el-table-column>
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
              <span v-if="item.prop == 'openName'">
                        <a href="">{{props.row[item.prop]}}&nbsp;<a-icon type="message"/></a>
                  </span>
              <span v-else-if="item.prop == 'orderNo'">
                <a-popover @mouseenter="mouseHover(props.row)" trigger="hover">
                  <template slot="content">
                    <prescriptionTabs :tabsData="tabsData"></prescriptionTabs>
                  </template>
                  <a-tag color="#1694fb"> {{props.row.orderNo}}</a-tag>
                  <!--<a-badge :showZero="true" :count="props.row.orderNo"-->
                           <!--:numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>-->
                </a-popover>
              </span>
              <span v-else>
                {{props.row[item.prop]}}
              </span>
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
                  <a-tag :color="op.levelColor" style="cursor: default;"> {{op.auditName }}</a-tag>
                </a-col>
                <a-col :span="22">
                  <a-tooltip placement="top" :key="index">
                    <template slot="title" style="width: 300px">{{op.auditClass}}：{{op.auditDescription}}</template>
                    <div class="multiLineText">
                      <span class="auditClass">{{op.auditClass}}：</span>{{op.auditDescription}}
                    </div>
                  </a-tooltip>
                </a-col>
                <a-divider v-if="index<props.row.orderissueVOS.length-1" type="horizontal"/>
              </a-row>
            </template>
          </el-table-column>
          <!--问题详情列-->
          <!--<el-table-column-->
          <!--prop="text"-->
          <!--label=""-->
          <!--&gt;-->
          <!--<template slot-scope="props">-->
          <!--<a-tooltip placement="top" v-for="(op,index) in props.row.problemList" :key="index">-->
          <!--<template slot="title" style="width: 300px">{{op.problemText}}：{{op.text}}</template>-->
          <!--<div class="multiLineText">-->
          <!--<span :style="{color:op.colors}">{{op.problemText}}：</span>{{op.text}}-->
          <!--</div>-->
          <!--</a-tooltip>-->

          <!--</template>-->
          <!--</el-table-column>-->
          <!--操作列-->
          <el-table-column
            prop="action"
            label="操作"
            width="140"
            align="center"
          >
            <template slot-scope="props">
              <a @click="looks(props.row)">查看</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定通过?" @confirm="passSingle(props.row)" okText="通过" cancelText="取消">
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
        >
        </a-pagination>
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
              <a-tag :color="op.levelColor" style="cursor: default;font-weight: bold"> {{op.problem }}级</a-tag>
              <span :style="{fontWeight:'bold'}">{{op.problemText}}</span>
              <div class="lineText opacity8">
                {{op.text}}
              </div>
              <a-row class="margin-top-10 selectInput ">
                <a-col :span="3" style="line-height: 24px">驳回理由:</a-col>
                <a-col :span="18">
                  <a-input size="small">
                    <a-select slot="addonBefore" :dropdownMatchSelectWidth="false" size="small" defaultValue="+86">
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
          { title: '性别', prop: 'sex', width: 50,align:'center' },
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
        rateTime:10000000000,
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
          { name: '问题类型', dataField: 'drugName', type: 'select' },
          // { name: '选择日期', dataField: 'factoryId', type: 'range-picker' },
          { name: '医生', dataField: 'submitName', type: 'text' },
          // { name: '科室', dataField: 'dept', type: 'select', disable: this.dis },
          // {
          //   type: 'checkbox',
          //   name: '已分配科室',
          //   dataField: 'check',
          //   onChange: this.changeBox
          // }
        ]
      }
    },
    mounted() {
      //获取后台数据
      this.fetchYJSMapData()
      //获取头部数据
      this.getCountText();



    },
    methods: {
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
        this.loading = false
        params.orderId = 1
        selectTribunalRecord(params).then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total;
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.error(err)
        })

      },
      //TODO：数据暂未获取
      getCountText() {
        this.countText = [{ count: 1, text: '新审核处方', colors: '#32c5d2' },
          { count: 3, text: '待确认处方', colors: '#f3c200' },
          { count: 12, text: '已通过处方', colors: '#3598dc' }
        ]
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
        if ($.trim(this.selections).length <= 0) {
          this.warn('请选择处方')
          return
        } else {
          console.log(1)
        }
      },
      //批量驳回
      rejected() {
        if ($.trim(this.selections).length <= 0) {
          this.warn('请选择处方')
          return
        } else {
          console.log(1)
        }
      },
      //单个通过
      passSingle(data) {
        console.log(data)
        console.log(1)
      },
      //单个驳回
      rejectedSingle(data) {
        this.Modal.visible = true
        console.log(data.row.problemList)
        this.problemsData = data.row.orderissueVOS
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
          name: 'presOutpatientDetail'
          // params:data,
        })
      },
      //处方单网格样式
      //TODO:处方单显示数据颜色暂未控制
      cellStyle(row) {
        if (row.rowIndex == 0 && row.columnIndex == 2) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 0 && row.columnIndex == 4) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 4 && row.columnIndex == 2) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 4 && row.columnIndex == 5) {
          return 'color: red; opacity: 0.6;'
        }
      },
      //TODO:处方单数据暂未处理
      mouseHover(data) {
        let tabsOne = {}
        let columns2 = [
          { title: '序号', prop: 'num', width: 50, align: 'right' },
          { title: '', prop: 'mark', width: 20, align: 'left' },
          { title: '名称', prop: 'name' },
          { title: '规格', prop: 'spec', width: 130 },
          { title: '总量', prop: 'total', width: 60 },
          { title: '单量', prop: 'single', width: 60 },
          { title: '频次', prop: 'freq', width: 80, align: 'center' },
          { title: '服药方式', prop: 'way', width: 80, align: 'center' }
        ]
        if (data.patientName == '张力') {
          let adviceData = [{
            num: 1,
            mark: '┎',
            name: '5%葡萄糖氯化钠注射液',
            spec: '500ml/袋',
            total: '1袋',
            single: '500ml',
            freq: '每天一次',
            way: '静滴'
          },
            {
              num: 2,
              mark: '┃',
              name: '西咪替丁注射液',
              spec: '2ml:0.2g',
              total: '2支',
              single: '0.4g',
              freq: '每天一次',
              way: '静滴'
            },
            {
              num: 3,
              mark: '┖',
              name: '银参通络胶囊',
              spec: '0.46g*24粒/盒 ',
              total: '20粒',
              single: '0.46g',
              freq: '每天三次',
              way: '口服'
            },
            { num: 4, name: '益肾灵胶囊', spec: '0.1GM*100粒/瓶', total: '72粒', single: '0.33g', freq: '每天三次', way: '口服' },
            { num: 5, name: '银杏叶丸', spec: '0.2g*12颗/瓶 ', total: '40颗', single: '0.33g', freq: '每天三次', way: '口服' }
          ]
          tabsOne.tabName = '处方单1'
          tabsOne.diagnose = '胃炎'
          tabsOne.costType = '自费'
          tabsOne.listData = adviceData
          tabsOne.columns = columns2

        } else {
          let adviceData = [
            { num: 1, name: '银参通络胶囊', spec: '0.46g*24粒/盒 ', total: '20粒', single: '0.46g', freq: '每天三次', way: '口服' },
            { num: 2, name: '益肾灵胶囊', spec: '0.1GM*100粒/瓶', total: '72粒', single: '0.33g', freq: '每天三次', way: '口服' },
            { num: 3, name: '银杏叶丸', spec: '0.2g*12颗/瓶 ', total: '40颗', single: '0.33g', freq: '每天三次', way: '口服' },
            { num: 4, name: '云南白药胶囊', spec: '0.18g*24片/盒 ', total: '24片', single: '0.18g', freq: '每天三次', way: '口服' },
            { num: 5, name: '异烟肼片', spec: '0.1GM*100粒/瓶', total: '7粒', single: '0.33g', freq: '每天三次', way: '口服' }
          ]
          tabsOne.tabName = '处方单1'
          tabsOne.diagnose = '胃炎'
          tabsOne.costType = '自费'
          tabsOne.listData = adviceData
          tabsOne.columns = columns2

        }
        this.dealTabsData(tabsOne)
      },

      dealTabsData(dataOne) {
        this.tabsData.tabsOne = {
          tabName: dataOne.tabName,
          diagnose: dataOne.diagnose,
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

      //频率事件
      rateChange(value){
        this.rateTime = value;
        console.log(value);
        clearInterval(()=>{
          this.fetchYJSMapData();
          console.log(1111);
        },value)
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
  .auditClass{
    font-weight: bold;
    color:#000000;
    opacity: 0.9
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
  .countCol .countStyle{
    margin-top: 0px !important;
  }
  .countCol .countFor{
    margin-bottom: 0px !important;
  }
</style>