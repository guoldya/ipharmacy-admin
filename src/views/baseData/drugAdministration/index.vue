<template>
  <a-card>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10" type="primary" @click="addClass">添加分类</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="table"
          :data="tableData"
          border
          class="margin-top-10"
          :highlight-current-row="true"
        >
          <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
            <template slot-scope="scope">
              <opcol :items="items" :more="false" :data="scope.row" :filterItem="['status']"></opcol>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" v-for="item in columns" :key="item.value"
                           :label="item.title" :prop="item.value" :width="item.width" :align="item.align">
            <template slot-scope="scope">
             <span v-if="item.value == 'status'">
              <a-badge
                :status="scope.row.status == 0? 'default':'processing'"
                :text="scope.row.status==0?'停用':'启用'"
              />
              </span>
              <span v-else-if="item.value=='limitedNum'">
          <a-badge :showZero="true" :count="scope.row.limitedNum" @click="checkRol(scope)"
                   :numberStyle="{backgroundColor: '#1694fb',cursor: 'pointer'}"/>
          </span>
              <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
              <span v-else>{{scope.row[item.value]}}</span>
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
        title="分配药品"
        :visible="Modal.visible"
        @ok="handleOk"
        :maskClosable="false"
        @cancel="handleCancel"
        width="700px"
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
          :data="drugData" border
          :highlight-current-row="true">
          <el-table-column v-for="item in columns2" :show-overflow-tooltip="true" :key="item.value" :label="item.title"
                           :prop="item.value" :width="item.width" :align="item.align">
            <template slot-scope="props">
              <span>{{props.row[item.value]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
          showQuickJumper
          :total="total1"
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
  </a-card>
</template>

<script>

  export default {
    name: 'ruleMgt',
    data() {
      return {
        api: {
          coreSelectPage: 'sys/coreGroupingSpec/selectPage',
          specSelectOne: 'sys/coreGroupingSpec/selectOne',
          coreUpdateStatus:"sys/coreGroupingSpec/updateStatus",
          dicDrugSelectPage:'sys/dicDrug/selectPage',
          dicDrugSelectList:'sys/dicDrug/selectList',
        },
        loading: false,
        codeLoading: false,
        tableData: [],
        drugData: [],
        drugAllList:[],
        columns: [{ title: '编码', value: 'id', width: 80, align: 'right' },
          { title: '名称', value: 'specName' },
          { title: '药品数', value: 'limitedNum', width: 100, align: 'center' },
          { title: '备注', value: 'remark' },
          { title: '更新人', value: 'updateName', width: 100 },
          { title: '更新时间', value: 'updateTime', width: 150 },
          { title: '状态', value: 'status', width: 100, align: 'center', },
        ],
        columns2: [{ title: '药品编码', value: 'drugCode', width: 80, align: 'right' },
          { title: '药品名称', value: 'drugName' },
          // { title: '拼音码', value: 'spellCode', width: 100, },
          { title: '生产厂商', value: 'producedBy', width: 150, },
          { title: '规格', value: 'spec',width:150 },
        ],
        items: [
          {text:'编辑', showtip: false, click: this.edits },
          {text:'启用',color:'#2D8cF0',showtip:true,tip:'确认启用吗？',click:this.changeStatus,status:'1'},
          {text:'停用',color:'#ff9900',showtip:true,tip:'确认停用吗？',click:this.changeStatus,status:'0'},
        ],
        Modal:{
          visible:false,
        },
        total: null,
        total1:null,
        pageSize: 10
      }
    },
    mounted() {
      this.getData();
    },
    computed: {
      list() {
        return [
          {
            name: '名称',
            dataField: 'specName',
            type: 'text'
          },
          {
            name: '状态',
            dataField: 'status',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          }
        ]
      }
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
      //获取网格数据
      getData(params={}) {
        this.loading = true;
        this.$axios({
          url: this.api.coreSelectPage,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.loading = false;
            this.tableData = this.$dateFormat(res.rows,['updateTime']);
            this.total = res.total;
          } else {
            this.loading = false;
            this.warn(res.msg)
          }
        })
          .catch(err => {
            this.loading = false;
            this.error(err)
          })
      },
      //页码数change事件
      pageChangeSize(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //页码跳转事件
      pageChange(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //编辑按钮事件
      edits(data) {
        this.$router.push({
          name: 'drugAdminDetail',
          params:{id:data.id}
        })
      },
      //添加分类
      addClass() {
        this.$router.push({
          name: 'drugAdminDetail',
          params: {id:0},
        })
      },
      //
      //启用停用
      changeStatus(data){
        let params = {}
        if (data.status == '1') {
          params.status = '0'
        } else {
          params.status = '1'
        }
        params.id = data.id
        console.log(params)
        this.$axios({
          url: this.api.coreUpdateStatus,
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

      checkRol(data){
        console.log(data,'data');
        this.Modal.visible = true;
        let params = {id:data.row.id};
        this.getDrugList();
        this.$axios({
          url: this.api.specSelectOne,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.drugData = res.data.drugList;
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      //获取药品list
      getDrugList(){
        let params = {};
        this.$axios({
          url: this.api.dicDrugSelectList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              // this.drugAllList = res.data.drugList;
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
      },
      //确定分配
      handleOk(){
        this.Modal.visible = false;
      }

    }
  }
</script>

<style>

</style>