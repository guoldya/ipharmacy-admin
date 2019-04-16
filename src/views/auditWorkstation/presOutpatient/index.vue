<template>
  <div>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button type="primary">新建</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          class="margin-top-10"
          :data="dataSource"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <a @click="drugMap(scope.row)">查看</a>
              <a-divider type="vertical"/>
              <a @click="drugMap(scope.row)">通过</a>
              <a-divider type="vertical"/>
              <a @click="drugMap(scope.row)">驳回</a>
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
            <template slot-scope="props">
                  <span v-if="item.prop == 'status'">
                        <a-badge v-if="props.row.status == 0" status="default" text="待审核"/>
                        <a-badge v-else-if="props.row.status == 1" status="warning" text="打回修改"/>
                    <a-badge v-else-if="props.row.status == 2" status="error" text="拒绝建议"/>
                    <a-badge v-else-if="props.row.status == 3" status="success" text="通过审核"/>
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
        :width="480"
        :visible="visible"
      >
        <a-row style="border-bottom: 1px solid #cecece">
          <a-col :span="4">姓名:张三</a-col>
          <a-col :span="3">性别:男</a-col>
          <a-col :span="4">年龄:55岁</a-col>
          <a-col :span="6">科室:消化内科</a-col>
          <a-col :span="7">门诊号:8008208820</a-col>
        </a-row>
        <a-row style="border-bottom: 1px solid #cecece">
          <a-col :span="16">费别:医保 新农合 公费 工伤 自费 其他</a-col>
          <a-col :span="8">2018年05月03日</a-col>
        </a-row>
        <a-row style="border-bottom: 1px solid #cecece">
          <a-col :span="16">临床诊断:胃炎</a-col>
        </a-row>
        <p style="font-size: 22px;font-weight: bold">R:</p>
        <div v-for="(op,index) in columns">
          <a-row style="margin-bottom: 15px;">
            <a-col :offset="1" :span="16">{{index}}.异烟肼片 0.1GM*100 7粒 用法：0.33g 每天三次 口服</a-col>
          </a-row>
        </div>

      </a-drawer>
    </a-card>
  </div>
</template>
<script>
  import {} from '@/api/login'

  export default {
    data() {
      return {
        clientData: [],
        visible: false,
        loading: false,
        dataSource: [{ status: 1 }],
        columns: [
          { title: '状态', prop: 'status',width:100,align:'center' },
          { title: '处方信息', prop: 'prescriptionInfo' },
          { title: '处方数', prop: 'prescriptionNum' },
          { title: '患者', prop: 'patient' },
          { title: '问题', prop: 'problem' }
        ],
        total: null,
        current: 1
      }
    },
    computed: {
      list() {
        return [
          {
            name: '患者',
            dataField: 'clientId',
            type: 'select',
            keyExpr: 'clientId',
            valueExpr: 'clientName',
            dataSource: this.clientData
          },
          { name: '问题类型', dataField: 'drugName', type: 'text' },
          { name: '选择日期', dataField: 'factoryId', type: 'range-picker' },
          { name: '医生', dataField: 'doctor', type: 'text' },
          { name: '科室', dataField: 'dept', type: 'text' },
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
        this.visible=true;
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
      }
    }
  }
</script>
<style>
  .divInfo {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    background-color: #E6F7FF;
    padding-left: 20px;
    padding-top: 10px;
  }

  .infoIcon {
    width: 20px;
    height: 20px;
    background-color: #108EE9;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
  }

  .divInfo span {
    margin-left: 10px;
  }
</style>