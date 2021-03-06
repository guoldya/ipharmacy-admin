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
        <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
          <template slot-scope="scope">
            <opcol :items="items" :more="false" :data="scope.row" :filterItem="['status']"></opcol>
          </template>
        </el-table-column>
        <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                         :prop="item.dataIndex" :width="item.width" :align="item.align">
          <template slot-scope="scope">
            <span v-if="item.dataIndex == 'status'">
                <a-badge :status="scope.row.status == 0? 'default':'processing'"
                         :text="scope.row.status==0?'停用':'启用'"/>
            </span>
            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
            <span v-else>{{scope.row[item.dataIndex]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <a-pagination
        showSizeChanger
        showQuickJumper
        :total="total"
        class="pnstyle"
        :pageSize="pageSize"
        :pageSizeOptions="['10', '20','50']"
        @showSizeChange="pageChangeSize"
        @change="pageChange"
        size="small"
        v-model='current'
      >
      </a-pagination>
    </a-spin>
    <a-button class="margin-top-10" type="primary" @click="addDoctor" :disabled="doctorDisabled">新增</a-button>
    <assignDoctor :pageInPlanData="pageInPlanData" :loading="confirmLoading" :planId="planId" :totals='totals'  ></assignDoctor>
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
          reviewPlanPage:'/sys/reviewPlan/selectPage',
        },
        loading: false,
        total: 10,
        pageSize: 10,
        visible: false,
        confirmLoading: false,
        columns: [
          { title: '方案名称', dataIndex: 'planName', width: 250 },
          { title: '方案类型', dataIndex: 'planType', align: 'center', width: 80,format:this.planType },
          { title: '方案范围', dataIndex: 'planScope', align: 'center', width: 80,format:this.planScope },
          { title: '方案描述', dataIndex: 'describe' },
          { title: '创建人', dataIndex: 'creatorName', width: 130 },
          { title: '创建时间', dataIndex: 'createDate', width: 150 },
          { title: '状态', dataIndex: 'status', width: 80, align: 'center' },
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
        current:1,
        Modal:{
          visible:false,
        },
        searchData:{},
        totals:[],
        pages:1,
        doctorDisabled:true,
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
          },
          {
            name: '方案范围',
            dataField: 'planScope',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.patientScope
          },
          {
            name: '状态',
            dataField: 'status',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.status
          },
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
        this.searchData = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = this.pageSize
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.searchData={}
        this.doctorListData={}
        this.pageInPlanData = []
        this.doctorDisabled = true;
        this.$refs.searchPanel.form.resetFields()
         this.pageSize=10
        this.getData({ pageSize:  this.pageSize, offset: 0 })
      },
      getData(params = {}) {
        this.loading = true
        if(params.offset==0){
          this.current=1
        }
        // params.orderId = 1
        this.$axios({
          url:this.api.reviewPlanPage,
          method:'put',
          data:params,
        }).then(res => {
          if (res.code == '200') {
            this.dataSource = this.$dateFormat(res.rows,['createDate']);
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
        this.doctorDisabled = true;
        this.pageInPlanData = []
        this.current=page
        let params =this.searchData
        params.offset=(page - 1) * pageSize;
        params.pageSize=pageSize;
        this.getData(params)
      },
      pageChangeSize(page, pageSize){
        this.doctorDisabled = true;
        this.pageInPlanData = []
        this.pageSize = pageSize
        let params = this.searchData
        params.pageSize = pageSize;
        params.offset=(page - 1) * pageSize;
        this.getData(params)
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
          params.status = '0'
        } else {
          params.status = '1'
        }
        params.planId = data.planId
        this.$axios({
          url: this.api.updateStatus,
          method: 'post',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
              let data =  this.searchData
              data.pageSize = this.pageSize;
              data.offset =(this.current - 1) * this.pageSize;
              this.getData(data)
            } else {
              this.warn(res.msg)
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
        this.doctorDisabled = false;
        this.planId = data.planId;
        this.getPersonsInPlan({offset:0,pageSize:10,planId:data.planId});
        this.getPersonsOutPlan({planId:data.planId});
      },
      planType(value) {
        if (value.planType == '1') {
          return '药师审方'
        } else if (value.planType == '2') {
          return '处方点评'
        }else{
          return '未知'
        }
      },
      planScope(value){
        if (value.planScope == '1') {
          return '门诊'
        } else if (value.planScope == '2') {
          return '住院'
        }else{
          return '未知'
        }
      },
      addDoctor(){
        this.personsToData = [];
        this.Modal.visible = true;
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
            this.totals[0]=1
            this.totals[1]=res.total
            this.totals.push()
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