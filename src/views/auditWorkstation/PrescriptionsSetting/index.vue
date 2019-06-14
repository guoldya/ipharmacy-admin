<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <a-spin :spinning="loading" tip="加载中...">
      <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
      <el-table
        class="margin-top-10"
        :data="dataSource" border
        :highlight-current-row="true">
        <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                         :prop="item.dataIndex" :width="item.width" :align="item.align">
          <template slot-scope="props">
            <span v-if="item.dataIndex == 'action'">
               <opcol :items="items" :more="false" :data="props.row" :filterItem="['status']"></opcol>
            </span>
            <span v-else-if="item.dataIndex == 'planType'" v-html="planType(props.row.planType)"></span>
            <span v-else-if="item.dataIndex == 'planScope'">
              {{props.row.planScope=='1'?'门诊':'住院' }}
            </span>
            <span v-else-if="item.dataIndex == 'status'">
                <a-badge :status="props.row.status == 0? 'default':'processing'"
                         :text="props.row.status==0?'停用':'启用'"/>
            </span>
            <span v-else-if="item.dataIndex == 'userNum'">
                                    <a-badge :showZero="true" :count="props.row.userNum" @click="checkRol(props)"
                                             :numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>
                                </span>
            <span v-else>{{props.row[item.dataIndex]}}</span>
          </template>
        </el-table-column>
      </el-table>

      <a-pagination
        showSizeChanger
        showQuickJumper
        :total="total"
        class="pnstyle"
        :defaultPageSize="pageSize"
        :pageSizeOptions="['10', '20','50']"
        @showSizeChange="pageChangeSize"
        @change="pageChange"
        size="small"
      >
      </a-pagination>
    </a-spin>
    <a-modal
      title="分配药师"
      :visible="visible"
      @ok="handleOk"
      :maskClosable="false"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      width="690px"
    >
      <a-select style="width: 400px" class="margin-left-5">
        <a-select-option
          v-for="(item,index) in this.enum.clientClass"
          :value='item.id'
          :key="index"
        >
          {{item.text}}
        </a-select-option>
      </a-select>
      <a-button type="primary" class="margin-left-5">分配</a-button>

      <el-table
        class="margin-top-10"
        :data="dataSource" border
        :highlight-current-row="true">
        <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                         :prop="item.dataIndex" :width="item.width" :align="item.align">
          <template slot-scope="props">
            <span>{{props.row[item.dataIndex]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <a-pagination
        showSizeChanger
        showQuickJumper
        :total="total"
        class="pnstyle"
        :defaultPageSize="pageSize"
        :pageSizeOptions="['10', '20','50']"
        @showSizeChange="pageChangeSize"
        @change="pageChange"
        size="small"
      >
      </a-pagination>
    </a-modal>
  </a-card>
</template>

<script>
  import { reviewPlanPage } from '@/api/login'

  export default {
    name: 'index',
    data() {
      return {
        api: {
          reviewPlanUpdate: 'sys/reviewPlan/update',
          updateStatus: 'sys/reviewPlan/updateStatus'
        },
        loading: false,
        total: 10,
        curent: 1,
        pageSize: 10,
        visible: false,
        confirmLoading: false,
        //穿梭狂数据
        targetKeys: [],
        mockData: [],
        columns: [
          { title: '方案名称', dataIndex: 'planName', width: 250 },
          { title: '方案类型', dataIndex: 'planType', align: 'center', width: 80 },
          { title: '方案范围', dataIndex: 'planScope', align: 'center', width: 80 },
          { title: '方案描述', dataIndex: 'describe' },
          { title: '分配', dataIndex: 'userNum', align: 'center', width: 80 },
          { title: '状态', dataIndex: 'status', width: 80, align: 'center' },
          { title: '操作', dataIndex: 'action', align: 'center', width: 140 }
        ],
        items: [
          { text: '编辑', showtip: false, click: this.edits },
          { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus, status: '1' },
          { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0' }
        ],
        colors: '#ffffff',
        dataSource: []
      }
    },
    computed: {
      list() {
        return [
          {
            name: '方案名称',
            dataField: 'clientId',
            type: 'text',
            keyExpr: 'clientId',
            valueExpr: 'clientName'
          },
          {
            name: '方案类型',
            dataField: 'planType',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.packageType
          }
        ]
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      //搜索
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        this.getData({ pageSize: 10, offset: 0 })
      },
      getData(params = { pageSize: 10, offset: 0 }) {
        this.loading = true
        // params.orderId = 1
        reviewPlanPage(params).then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total
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
      pageChange(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: this.pageSize })
      },
      pageChangeSize(page, pageSize){
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //新增
      add() {
        this.$router.push({
          name: 'PrescriptionsDetail',
          params: { planId: 0 }
        })
      },
      //停用
      changeStatus(data) {
        let params = {}
        if (data.status == '1') {
          params.status = 0
        } else {
          params.status = 1
        }
        params.planId = data.planId
        console.log(params)
        this.$axios({
          url: this.api.updateStatus,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              if (data.status == '1') {
                this.success('停用成功')
              } else {
                this.success('启用成功')
              }
              this.getData()
            } else {
              if (data.status == '1') {
                this.warn('停用失败')
              } else {
                this.warn('启用失败')
              }
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      edits(data) {
        this.$router.push({
          name: 'PrescriptionsDetail',
          params: { planId: data.planId }
        })
      },

      checkRol(data) {
        this.visible = true
        // let rolePass = { account: data.row.account, centerId: data.row.centerId }
        // this.rolePass = rolePass
        // this.getUserRole(rolePass)
      },
      //确认分配药师
      handleOk() {

      },
      handleCancel() {
        this.visible = false
      },
      handleChange() {

      },
      planType(value) {
        if (value == '1') {
          return '药师审方'
        } else if (value == '2') {
          return '处方点评'
        }
      }
    }
  }
</script>

<style scoped>
  .userModel-p {
    text-align: center
  }
</style>