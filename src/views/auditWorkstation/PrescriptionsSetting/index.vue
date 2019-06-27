<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
    <a-spin :spinning="loading" tip="加载中...">
      <el-table
        class="margin-top-10"
        :data="dataSource" border
        :highlight-current-row="true"
        @row-click="checkRol"
      >
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
            <!--<span v-else-if="item.dataIndex == 'userNum'">-->
              <!--<a-badge :showZero="true" :count="props.row.userNum" @click="checkRol(props)" :numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>-->
            <!--</span>-->
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
        v-model='current'
      >
      </a-pagination>
    </a-spin>
    <a-button class="margin-top-10" type="primary" @click="addDoctor">新增</a-button>
    <assignDoctor :pageInPlanData="pageInPlanData" :loading="confirmLoading" :planId="planId"></assignDoctor>
    <a-modal
      title="分配药师"
      :visible="Modal.visible"
      @ok="handleOk"
      :maskClosable="false"
      @cancel="handleCancel"
      width="600px"
    >
      <span>选择药师:</span>
      <a-select style="width: 500px" class="margin-left-5 margin-top-10"
                allowClear
                mode="multiple"
                placeholder="药师可多选"
                v-model="personsToData"
                optionLabelProp="title"
      >
        <a-select-option
          v-for="(item,index) in this.selectPersons"
          :value='item.personId'
          :key="index"
          :title="item.name"
        >
          <div>{{item.name}}-{{item.code}}</div>
          <div>{{item.orgTitle}}-{{item.deptName}}</div>
        </a-select-option>
      </a-select>
    </a-modal>
  </a-card>
</template>

<script>
  import { reviewPlanPage } from '@/api/login'
  import assignDoctor from './assignDoctorIndex'
  export default {
    components: {
      assignDoctor
    },
    name: 'index',
    data() {
      return {
        api: {
          reviewPlanUpdate: 'sys/reviewPlan/update',
          updateStatus: 'sys/reviewPlan/updateStatus',
          notPlan:'sys/reviewPlan/selectPersonsNotInPlan',
          inPlan:'sys/reviewPlan/selectPersonsInPlan',
          insertPersonsToPlan:'sys/reviewPlan/insertPersonsToPlan',
        },
        loading: false,
        total: 10,
        curent: 1,
        pageSize: 10,
        visible: false,
        confirmLoading: false,
        columns: [
          { title: '方案名称', dataIndex: 'planName', width: 250 },
          { title: '方案类型', dataIndex: 'planType', align: 'center', width: 80 },
          { title: '方案范围', dataIndex: 'planScope', align: 'center', width: 80 },
          { title: '方案描述', dataIndex: 'describe' },
          { title: '状态', dataIndex: 'status', width: 80, align: 'center' },
          { title: '操作', dataIndex: 'action', align: 'center', width: 140 }
        ],
        items: [
          { text: '编辑', showtip: false, click: this.edits },
          { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.changeStatus, status: '1' },
          { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0' }
        ],
        colors: '#ffffff',
        dataSource: [],
        personsToData:[],
        doctorListData:{},
        planId:'',
        selectPersons:[],
        pageInPlanData:[],
        current:null,
        Modal:{
          visible:false,
        }
      }
    },
    computed: {
      list() {
        return [
          {
            name: '方案名称',
            dataField: 'planName',
            type: 'text',
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
      this.getData();
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
         if(params.offset==0){
        this.current=1
      }
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
              this.getData({offset:(this.current-1)*10})
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
        this.doctorListData = data;
        this.planId = data.planId;
        this.getPersonsInPlan({offset:0,pageSize:10,planId:data.planId});
        this.getPersonsOutPlan({planId:data.planId});
      },
      planType(value) {
        if (value == '1') {
          return '药师审方'
        } else if (value == '2') {
          return '处方点评'
        }
      },
      addDoctor(){
        this.personsToData = [];
        if (this.doctorListData.planId){
          this.Modal.visible = true;
        } else {
          this.warn("请选择方案");
        }
      },
      getPersonsOutPlan(params={}){
        this.$axios({
          url: this.api.notPlan,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.selectPersons = res.rows;
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      getPersonsInPlan(params={}) {
        this.confirmLoading = true
        this.$axios({
          url: this.api.inPlan,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.confirmLoading = false
            this.pageInPlanData = res.rows;
          } else {
            this.spinning = false
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.confirmLoading = false
            this.error(err)
          })
      },
      //确认分配
      handleOk(){
        let params = {planId:this.planId,personIds:this.personsToData}
        this.$axios({
          url: this.api.insertPersonsToPlan,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.success('分配成功!');
            this.getPersonsOutPlan({planId:this.planId});
            this.Modal.visible = false;
            setTimeout(()=>{
              this.getPersonsInPlan({offset:0,pageSize:10,planId:this.planId});
            },500)
          } else {
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.error(err)
          })
      },
      //取消分配
      handleCancel(){
        this.Modal.visible = false;
      }
    }
  }
</script>

<style scoped>
  .userModel-p {
    text-align: center
  }
</style>