<template>
  <div>
    <a-card>
      <a-row :gutter="20">
        <a-col :span="3"></a-col>
        <div v-for="op in countText">
          <a-col class="countFor" :style="{color:op.colors}" :span="6">
            <countTo class="countStyle" :end="op.count"></countTo>
            <span>{{op.text}}</span>
          </a-col>
        </div>
        <a-col :span="3"></a-col>
      </a-row>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10 margin-left-5" :type="buttonType" @click="buttonClick">{{buttonText}}</a-button>
      <a-button class="margin-left-5" @click="pass" :disabled="disable">批量通过</a-button>
      <a-button class="margin-left-5" @click="rejected" :disabled="disable">批量驳回</a-button>
      <a-button class="margin-left-5" :disabled="disable">审方设置</a-button>
      <a-alert class="margin-top-10" type="info" :show-icon="true">
        <div slot="message">
          已选择&nbsp;<a style="font-weight: 600">{{checkSelect}}</a>&nbsp;项&nbsp;
          <a style="margin-left: 2px" @click="clearSelect">清空</a>
        </div>
      </a-alert>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="multipleTable"
          class="multipleEl"
          :data="dataSource"
          border
          style="width: 100%"
          @select="selectBox"
          @select-all="selectAll"
          :header-cell-style="{background:'#fafafa'}"
        >
          <el-table-column
            type="selection"
            width="55"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="100"
            :filters="[{ text: '待审核', value: '0' }, { text: '打回修改', value: '1' },{ text: '拒绝建议', value: '2' },{ text: '通过审核', value: '3' }]"
            :filter-method="filterTag"
            filter-placement="bottom"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <a-badge v-if="props.row.status == 0" status="default" text="待审核"/>
              <a-badge v-else-if="props.row.status == 1" status="warning" text="打回修改"/>
              <a-badge v-else-if="props.row.status == 2" status="error" text="拒绝建议"/>
              <a-badge v-else-if="props.row.status == 3" status="success" text="通过审核"/>
            </template>
          </el-table-column>
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
              <span v-else-if="item.prop == 'prescriptionNum'">
                 <!--<a-badge  :showZero="true" :count="props.row.prescriptionNum"-->
                <!--:numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>-->
                    <a-popover  trigger="hover">
                      <template slot="content">
                        <el-table
                          class="margin-top-10"
                          border
                          style="width: 100%"
                          :data="adviceData"
                          :cell-style="cellStyle"
                          :header-cell-style="{background:'#fafafa'}">
          <el-table-column
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns2"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <span>
                {{props.row[item.prop]}}
                  </span>
            </template>
          </el-table-column>
        </el-table>
                      </template>
                      <a-badge  :showZero="true" :count="props.row.prescriptionNum"
                                :numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>
                    </a-popover>
                  </span>
              <span v-else>
                {{props.row[item.prop]}}
                  </span>
            </template>


          </el-table-column>
          <el-table-column
            prop="problem"
            label="问题"
            align="center"
            width="80"
            :filters="[{ text: '1级', value: '1' }, { text: '2级', value: '2' },{ text: '3级', value: '3' },{ text: '4级', value: '4' },{ text: '5级', value: '5' }]"
            :filter-method="filterTag"
            filter-placement="bottom"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <a-tag :color="props.row.colors"> {{props.row.problem}}级</a-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="text"
            label=""
          >
            <template slot-scope="props">
              <el-tooltip placement="top">
                <div slot="content" style="width: 300px">{{props.row.problemText}}{{props.row.text}}</div>
                <div class="multiLineText">
                  <span :style="{color:props.row.colors,}">{{props.row.problemText}}</span>{{props.row.text}}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="props">
              <a @click="looks(props.row)">查看</a>
              <a-divider type="vertical"/>
              <a @click="passSingle(props.row)">通过</a>
              <a-divider type="vertical"/>
              <a @click="rejectedSingle(props.row)">驳回</a>
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
        title="药嘱明细"
        :visible="Modal.visible"
        @ok="handleOk"
        :confirmLoading="Modal.confirmLoading"
        @cancel="handleCancel"
        :width="700"
      >
        <a-row class="modalRow">
          <a-col :span="12">费别：<span class="opacity8">医保</span></a-col>
          <a-col :span="12">临床诊断：<span class="opacity8">胃炎</span></a-col>
        </a-row>
        <el-table
          class="margin-top-10"
          border
          style="width: 100%"
          :data="adviceData"
          :cell-style="cellStyle"
          :header-cell-style="{background:'#fafafa'}">
          <el-table-column
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns2"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="props">
              <span>
                {{props.row[item.prop]}}
                  </span>
            </template>
          </el-table-column>
        </el-table>

        <template slot="footer">
          &nbsp;
        </template>
      </a-modal>
      <a-drawer
        title="药嘱明细"
        placement="right"
        :closable="false"
        @close="onClose"
        :width="800"
        :visible="visible"
        align="center"
      >
        <!--<a-row class="drawerRow" >-->
        <!--<a-col :span="12">姓名：<span class="opacity8" >张三</span></a-col>-->
        <!--<a-col :span="12">性别：<span class="opacity8" >男</span></a-col>-->
        <!--</a-row>-->
        <!--<a-row class="drawerRow">-->
        <!--<a-col :span="12">年龄：<span class="opacity8" >55岁</span></a-col>-->
        <!--<a-col :span="12">科室：<span class="opacity8" >消化内科</span></a-col>-->
        <!--</a-row>-->
        <a-row class="drawerRow">
          <a-col :span="12">费别：<span class="opacity8">医保</span></a-col>
          <a-col :span="12">临床诊断：<span class="opacity8">胃炎</span></a-col>
        </a-row>
        <!--<a-row class="drawerRow">-->
        <!--&lt;!&ndash;<a-col :span="12">门诊号：<span class="opacity8" >8008208820</span></a-col>&ndash;&gt;-->
        <!--<a-col :span="12">临床诊断：<span class="opacity8" >胃炎</span></a-col>-->
        <!--</a-row>-->
        <!--<a-row class="drawerRow">-->
        <!--<a-col :span="12" class="opacity8" >2018年05月03日</a-col>-->
        <!--</a-row>-->
        <!--<my-icon class="myIcon" type="anticonchufang"/>：-->
        <div class="prescription" v-for="(op,index) in columns">
          <a-row>
            <a-col :offset="1" :span="20">{{index+1}}.异烟肼片 0.1GM*100 <span
              style="font-size: 16px;font-weight: bold">7粒</span></a-col>
            <a-col :offset="3" :span="20">用法：<span class="opacity8" style="font-size: 16px;">0.33g 每天三次 口服</span>
            </a-col>
          </a-row>
        </div>

      </a-drawer>


    </a-card>
  </div>
</template>
<script>
  import {} from '@/api/login'
  import countTo from '@/components/count-to'
  import { Icon } from 'ant-design-vue'

  const myIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1148820_wj1pz1p40xm.js' // 在 iconfont.cn 上生成
  })
  export default {
    components: {
      countTo,
      myIcon
    },
    data() {
      return {
        clientData: [],
        count: 30,
        visible: false,
        loading: false,
        dataSource: [{
          status: 1,
          time: '2018-09-21  08:50:08',
          openName: '黄磊',
          deptName: '消化内科',
          prescriptionNum: 1,
          patientName: '张力',
          patientNum: '201904010001',
          patientSex: '女',
          patientAge: '23岁',
          problem: '5',
          problemText: '重复给药：',
          text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。头孢丙烯分散片和头孢克洛缓释胶囊为重复用药.头孢丙烯分散片和头孢克洛缓释胶囊为重复用药头孢丙烯分散片和头孢克洛缓释胶囊为重复用药'
        },
          {
            status: 1,
            time: '2018-09-21  08:50:08',
            openName: '张力張',
            deptName: '消化内科',
            prescriptionNum: 1,
            patientName: '张力張',
            patientNum: '201904010001',
            patientSex: '女',
            patientAge: '23岁',
            problem: '4',
            problemText: '重复给药：',
            text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。'
          }],
        columns: [
          { title: '处方', prop: 'time', width: 150 },
          { title: '', prop: 'openName', width: 90 },
          { title: '', prop: 'deptName', width: 80 },
          { title: '处方数', prop: 'prescriptionNum', width: 80, align: 'center' },
          { title: '患者', prop: 'patientNum', width: 150 },
          { title: '', prop: 'patientName', width: 80 },
          { title: '', prop: 'patientSex', width: 50 },
          { title: '', prop: 'patientAge', width: 60 }
        ],
        //医嘱数据
        adviceData: [{ name: '异烟肼片', spec: '0.1GM*100粒/瓶', total: '7粒', single: '0.33g', freq: '每天三次', way: '口服' },
          { name: '银参通络胶囊', spec: '0.46g*24粒/盒 ', total: '20粒', single: '0.46g', freq: '每天三次', way: '口服' },
          { name: '益肾灵胶囊', spec: '0.1GM*100粒/瓶', total: '72粒', single: '0.33g', freq: '每天三次', way: '口服' },
          { name: '银杏叶丸', spec: '0.2g*12颗/瓶 ', total: '40颗', single: '0.33g', freq: '每天三次', way: '口服' },
          { name: '云南白药胶囊', spec: '0.18g*24片/盒 ', total: '24片', single: '0.18g', freq: '每天三次', way: '口服' }],
        columns2: [
          { title: '名称', prop: 'name',width: 130  },
          { title: '规格', prop: 'spec', width: 140 },
          { title: '总量', prop: 'total', width: 60 },
          { title: '单量', prop: 'single', width: 60 },
          { title: '频次', prop: 'freq', width: 80, align: 'center' },
          { title: '服药方式', prop: 'way', width: 80 }
        ],
        total: 2,
        current: 1,
        countText: [],
        selections: [],
        buttonText: '开始审方',
        buttonType: 'primary',
        disable: true,
        checkSelect: 0,
        Modal: {
          visible: false,
          confirmLoading: false
        }
      }
    },
    computed: {
      list() {
        return [
          {
            name: '患者',
            dataField: 'clientId',
            type: 'text',
            keyExpr: 'clientId',
            valueExpr: 'clientName'
          },
          { name: '问题类型', dataField: 'drugName', type: 'select' },
          { name: '选择日期', dataField: 'factoryId', type: 'range-picker' },
          { name: '医生', dataField: 'doctor', type: 'text' },
          { name: '科室', dataField: 'dept', type: 'select' },
          {
            name: '来源',
            dataField: 'drugSource',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.drugSource
          }
        ]
      }
    },
    mounted() {
      this.fetchYJSMapData()
      this.fetchClientListData()
      this.getCountText()
      this.dealData()
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
      customerPageChange(page, pageSize) {
        let params = {}
        params.pageSize = pageSize
        params.offset = (page - 1) * pageSize
        this.fetchYJSMapData(params)
      },
      clientSizeChange(current, size) {
        this.current = 1
        let params = {}
        params.pageSize = size
        params.offset = 0
        this.fetchYJSMapData(params)
      },

      //获取数据

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
        console.log(this.dataSource)
      },
      drugMap() {
        this.Modal.visible = true
        // this.visible = true
      },
      onClose() {
        this.visible = false
      },
      fetchYJSMapData(params = { pageSize: 10, offset: 0 }) {
        params.statusYjs = '1'
        params.drugSource = '1'
        this.loading = false
        // yjsDrugMap(params).then(res => {
        //   if (res.code == '200') {
        //     this.dataSource = res.rows;
        //     this.total = res.total;
        //     this.loading = false;
        //   } else {
        //     this.loading = false;
        //     this.warn(res.msg)
        //   }
        // }).catch(err => {
        //   this.loading = false;
        //   this.error(err)
        // })
      },
      fetchClientListData(params = {}) {
        // clientListData(params).then(res => {
        //   if (res.code == '200') {
        //     this.clientData = res.rows;
        //   } else {
        //     this.warn(res.msg)
        //   }
        // }).catch(err => {
        //   this.error(err)
        // })
      },

      getCountText() {
        this.countText = [{ count: 1, text: '新审核处方', colors: '#32c5d2' },
          { count: 3, text: '待确认处方', colors: '#f3c200' },
          { count: 12, text: '已通过处方', colors: '#3598dc' }
        ]
      },

      //多选框点击事件
      selectBox(selection, row) {
        this.selections = selection
        this.checkSelect = selection.length
      },
      //全选
      selectAll(selection) {
        this.selections = selection
        this.checkSelect = selection.length
      },
      //清空
      clearSelect() {
        this.$refs.multipleTable.clearSelection()
        this.checkSelect = 0
      },
      //通过按钮事件
      pass() {
        if ($.trim(this.selections).length <= 0) {
          this.warn('请选择处方')
          return
        } else {
          console.log(1)
        }
      },
      //单个通过
      passSingle(data) {

      },
      //单个驳回
      rejectedSingle(data) {

      },
      rejected() {
        if ($.trim(this.selections).length <= 0) {
          this.warn('请选择处方')
          return
        } else {
          console.log(1)
        }
      },
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

      //弹窗取消
      handleOk() {
        this.Modal.visible = false
      },
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

      },

      cellStyle(row) {
        if (row.rowIndex == 0 && row.columnIndex == 0) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 0 && row.columnIndex == 4) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 4 && row.columnIndex == 0) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 4 && row.columnIndex == 5) {
          return 'color: red; opacity: 0.6;'
        }
      }
    }
  }
</script>
<style>

  .divInfo span {
    margin-left: 10px;
  }

  .countFor {
    text-align: center;
    margin-bottom: 4px;
  }

  .countStyle {
    font-size: 24px;
    margin-top: -12px;
    margin-bottom: -6px;
  }

  .drawerRow {
    border-bottom: 1px solid #cecece;
    line-height: 37px;
  }

  /*自定义图标样式*/
  .myIcon {
    font-size: 22px;
    font-weight: bold;
    padding-top: 40px;
  }

  /*药方样式*/
  .prescription {
    margin-top: 15px;
    line-height: 30px;
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

  .multipleEl .has-gutter tr th:nth-child(7) {
    border-right: 0px;
  }

  .multipleEl .has-gutter tr th:nth-child(8) {
    border-right: 0px;
  }

  .multipleEl .has-gutter tr th:nth-child(9) {
    border-right: 0px;
  }

  .multipleEl .has-gutter tr th:nth-child(11) {
    border-right: 0px;
  }

  .multipleEl .el-table__row td:nth-child(11) {
    border-right: 0px;
  }

  .multipleEl .multiLineText {
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2; /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 100%;
  }

  /*弹窗样式*/
  .modalRow {
    margin-bottom: 16px;
  }
</style>