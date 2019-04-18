<template>
  <div>
    <a-card>
      <a-row  :gutter="20">
        <a-col :span="3"></a-col>
        <div v-for="op in countText" >
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
      <a-button class="margin-top-10" :type="buttonType" @click="buttonClick">{{buttonText}}</a-button>
      <a-button class="margin-left-5" type="primary" @click="pass">通过</a-button>
      <a-button class="margin-left-5" @click="rejected">驳回</a-button>

      <a-button class="margin-left-5">审方设置</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          class="margin-top-10"
          :data="dataSource"
          border
          size="small"
          style="width: 100%"
          @select="selectBox"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <a @click="drugMap(scope.row)">查看</a>
              <a-divider type="vertical"/>
              <a @click="passSingle(scope.row)">通过</a>
              <a-divider type="vertical"/>
              <a @click="rejectedSingle(scope.row)">驳回</a>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
          >
            <template  slot-scope="props">
                  <span v-if="item.prop == 'status'" >
                    <a-badge v-if="props.row.status == 0"   status="default" text="待审核"/>
                    <a-badge v-else-if="props.row.status == 1" status="warning" text="打回修改"/>
                    <a-badge v-else-if="props.row.status == 2"  status="error"  text="拒绝建议"/>
                    <a-badge v-else-if="props.row.status == 3" status="success"  text="通过审核"/>
                  </span>
              <span v-else-if="item.prop == 'prescriptionInfo'">
                        {{props.row.time}}&nbsp&nbsp{{props.row.openName}}&nbsp&nbsp{{props.row.deptName}}
                  </span>
              <span v-else-if="item.prop == 'patient'">
                        {{props.row.patientNum}}&nbsp&nbsp{{props.row.patientName}}&nbsp&nbsp{{props.row.patientSex}}&nbsp&nbsp{{props.row.patientAge}}
                  </span>
              <span v-else>
                {{props.row[item.prop]}}
                  </span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
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
      <a-drawer
        title="处方签单"
        placement="right"
        :closable="false"
        @close="onClose"
        :width="600"
        :visible="visible"
      >
        <a-row class="drawerRow" >
          <a-col :span="12">姓名：<span style="opacity: 0.6">张三</span></a-col>
          <a-col :span="12">性别：<span style="opacity: 0.6">男</span></a-col>
        </a-row>
        <a-row class="drawerRow">
          <a-col :span="12">年龄：<span style="opacity: 0.6">55岁</span></a-col>
          <a-col :span="12">科室：<span style="opacity: 0.6">消化内科</span></a-col>
        </a-row>
        <a-row class="drawerRow">
          <a-col :span="24">费别：<span style="opacity: 0.6">医保 新农合 公费 工伤 自费 其他</span></a-col>
        </a-row>
        <a-row class="drawerRow">
          <a-col :span="12">门诊号：<span style="opacity: 0.6">8008208820</span></a-col>
          <a-col :span="12">临床诊断：<span style="opacity: 0.6">胃炎</span></a-col>
        </a-row>
        <a-row class="drawerRow">
          <a-col :span="12" style="opacity: 0.6">2018年05月03日</a-col>
        </a-row>
        <p style="font-size: 22px;font-weight: bold;padding-top: 15px;">R:</p>
        <div v-for="(op,index) in columns">
          <a-row style="margin-bottom: 15px;line-height: 30px;">
            <a-col :offset="1" :span="20">{{index+1}}.异烟肼片 0.1GM*100 <span style="font-size: 18px;font-weight: bold">7粒</span> </a-col>
            <a-col :offset="3" :span="20">用法：<span style="font-size: 16px;">0.33g 每天三次 口服</span></a-col>
          </a-row>
        </div>

      </a-drawer>
    </a-card>
  </div>
</template>
<script>
  import {} from '@/api/login'
  import countTo from '@/components/count-to'

  export default {
    components: {
      countTo
    },
    data() {
      return {
        clientData: [],
        count: 30,
        visible: false,
        loading: false,
        dataSource: [{
          status: 1,
          time:'2018-09-21  08:50:08',
          openName:'黄磊',
          deptName:'消化内科',
          prescriptionNum:201904010001,
          patientName:'张力',
          patientNum:'201904010001',
          patientSex:'女',
          patientAge:'23岁',
          problem:'5级',},
          { status: 2 }],
        columns: [
          { title: '状态', prop: 'status', width: 100, align: 'center' },
          { title: '处方信息', prop: 'prescriptionInfo' },
          { title: '处方数', prop: 'prescriptionNum' },
          { title: '患者', prop: 'patient' },
          { title: '问题', prop: 'problem' }
        ],
        total: null,
        current: 1,
        countText: [],
        selections:[],
        buttonText:'开始审方',
        buttonType:'primary',
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
            valueExpr: 'clientName',
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
      drugMap() {
        this.visible = true
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
        this.countText = [{ count: 1, text: '新审核处方',colors:'#32c5d2' },
          { count: 3, text: '待确认处方',colors:'#f3c200' },
          { count: 12, text: '已通过处方',colors:'#3598dc' }
        ]
      },

      //多选框点击事件
      selectBox(selection,row){
        this.selections = selection;
        console.log(selection);
        console.log(row);
      },
      //通过按钮事件
      pass(){
          if ($.trim(this.selections).length<=0){
            this.warn('请选择处方')
            return;
          }else {
            console.log(1);
          }
      },
      //单个通过
      passSingle(data){

      },
      //单个驳回
      rejectedSingle(data){

      },
      rejected(){
        if ($.trim(this.selections).length<=0){
          this.warn('请选择处方')
          return;
        }else {
          console.log(1);
        }
      },
      buttonClick(){
        if (this.buttonText=='开始审方'){
          this.buttonText = '停止审方'
          this.buttonType = 'default'
        }else {
          this.buttonText = '开始审方'
          this.buttonType = 'primary'
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
    margin-bottom: 10px;
  }
  .countStyle {
    font-size: 24px;
  }

  .content-outer {
    margin-bottom: 0px;
  }
  .drawerRow{
    border-bottom: 1px solid #cecece;
    line-height: 37px;
  }
</style>