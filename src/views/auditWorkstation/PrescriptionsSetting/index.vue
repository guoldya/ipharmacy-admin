<template>
    <a-card>
      <Searchpanel ref="searchPanel"  :list="list">
        <div slot="control">
          <a-button type="primary" @click="search" >查询</a-button>
          <a-button class="margin-left-5" @click="resetForm" >重置</a-button>
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
              <a @click="edits(props.row)">编辑</a>
              <a-divider type="vertical" />
              <a  @click="user(props.row)">{{props.row.status==0?'启用':'停用' }}</a>
              <a-divider type="vertical" />
              <a @click="edits(props.row)">删除</a>
            </span>
            <span v-else-if="item.dataIndex == 'planType'" v-html="planType(props.row.planType)"></span>
            <span v-else-if="item.dataIndex == 'planScope'" >
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
      <a-row>
        <a-col :span="10"><p class="userModel-p">待分配药师</p></a-col>
        <a-col :span="11" :offset="3"><p class="userModel-p">已分配药师</p></a-col>
      </a-row>
      <a-transfer
        :dataSource="mockData"
        :listStyle="{
                width: '280px',
                height: '300px',
                }"
        :titles="['源列表', '目标列表']"
        :targetKeys="targetKeys"
        @change="handleChange"
        :render="item=>item.title"
        :operations="['添加', '移除']"
      >
      </a-transfer>
    </a-modal>
    </a-card>
</template>

<script>
  import { reviewPlanPage } from '@/api/login'
  export default {
    name: 'index',
    data(){
      return{
        loading:false,
        total:10,
        curent:1,
        pageSize:10,
        visible: false,
        confirmLoading: false,
        //穿梭狂数据
        targetKeys: [],
        mockData:[],
        columns: [
          {title: '方案名称',dataIndex: 'planName',width:250},
          {title: '方案类型',dataIndex: 'planType',align: 'center',width:80},
          {title: '方案范围',dataIndex: 'planScope',align: 'center',width:80},
          {title: '方案描述',dataIndex: 'describe'},
          { title: '分配', dataIndex: 'userNum', align: 'center',width:80 },
          {title: '状态',dataIndex: 'status',width:80,align:'center'},
          {title: '操作',dataIndex: 'action',align:'center',width:140,}
        ],
        items:[
          {text:'编辑',showtip:false,click:this.edits},
          {text:'删除',showtip:true,tip:'确认删除吗？',click:this.delRow},
          {text:'启用',color:'#2D8cF0',showtip:true,tip:'确认启用吗？',click:this.changeStatus},
          {text:'停用',showtip:true,tip:'确认停用吗？',click:this.changeStatus},
        ],
        colors:'#ffffff',
        dataSource:[],
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
            valueExpr: 'clientName',
          },
          { name: '方案类型',
            dataField: 'drugName',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource:this.enum.packageType,
          },
        ]
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
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
      pageChangeSize(){

      },
      pageChange(){

      },
      //新增
      add(){
        this.$router.push({
          name: 'PrescriptionsDetail',
          // params:data,
        })
      },
      //停用
      ban(data){
      },
      edits(data){
        this.$router.push({
          name: 'PrescriptionsDetail',
          query:data,
        })
      },

      checkRol(data) {
        this.visible = true
        // let rolePass = { account: data.row.account, centerId: data.row.centerId }
        // this.rolePass = rolePass
        // this.getUserRole(rolePass)
      },
      //确认分配药师
      handleOk(){

      },
      handleCancel(){
        this.visible = false
      },
      handleChange(){

      },
      planType(value){
        if(value=='1'){
          return '药师审方'
        }else if(value == '2'){
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