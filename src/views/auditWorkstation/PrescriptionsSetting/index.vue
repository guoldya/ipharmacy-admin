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
        :data="loadData" border
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
            <span v-else-if="item.dataIndex == 'levelType'" v-html="levelType(props.row.levelType)"></span>
            <span v-else-if="item.dataIndex == 'problemLevel'" >
              {{props.row.problemLevel=='1'?'门诊':'住院' }}
            </span>
            <span v-else-if="item.dataIndex == 'status'">
                <a-badge :status="props.row.status == 0? 'default':'processing'"
                         :text="props.row.status==0?'停用':'启用'"/>
            </span>
            <span v-else-if="item.dataIndex == 'roleNum'">
                                    <a-badge :showZero="true" :count="props.row.roleNum" @click="checkRol(props)"
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
          {title: '方案名称',dataIndex: 'id',width:200},
          {title: '方案类型',dataIndex: 'levelType',align: 'center',width:80},
          {title: '方案范围',dataIndex: 'problemLevel',align: 'center',width:80},
          {title: '方案描述',dataIndex: 'createTime'},
          { title: '分配', dataIndex: 'roleNum', align: 'center',width:80 },
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
        loadData:[],
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
        this.fetchYJSMapData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        this.fetchYJSMapData({ pageSize: 10, offset: 0 })
      },
      getData(){
        this.loadData = [{id:'审方方案1',levelType:'1',status:1,problemLevel:'1',createTime:'无',colors:'red',roleNum:5,editTime:'无'},
          {id:'审方方案2',levelType:'2',status:1,problemLevel:'2',createTime:'无',colors:'yellow',roleNum:4,editTime:'无'}];
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
      levelType(value){
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