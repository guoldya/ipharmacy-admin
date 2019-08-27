<template>
  <div class="detailModal">
    <a-modal
      title="选择医嘱信息"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :maskClosable="false"
      :width="900"
      :destroyOnClose='true'
    >
     <Searchpanel ref="searchPanel" :list="list">
         <div slot="control">
           <a-button type="primary" @click="search">查询</a-button>
           <a-button class="margin-left-5" @click="resetForm">重置</a-button>
         </div>
     </Searchpanel>
      <a-spin :spinning="loading" tip="加载中...">
        <el-table
          class="margin-top-10"
          :data="dataSource"
          border
          :highlight-current-row="true"
          @selection-change="handleSelectionChange"
          style="width: 100%" 
        >
        <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :show-overflow-tooltip="true"
            :key="item.value"
            :label="item.title"
            :prop="item.value"
            :width="item.width"
            :align="item.align"
          >
          </el-table-column>
        </el-table>
        <a-pagination
          showSizeChanger
          showQuickJumper
          :total="total"
          class="pnstyle"
          :defaultPageSize="10"
          :pageSizeOptions="['10', '20','50']"
          @showSizeChange="pageChangeSize"
          @change="pageChange"
          size="small"
          v-model='current'
          :pageSize="pageSize"
        ></a-pagination>
    </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { selectOutDetail } from '@/api/login'
export default {
    name:"selectDoctorAdvice",
    props: {
       
    },
  data() {
    return {
      loading:false,
      total: 2,
      pageSize: 10,
      columns: [
          { title: '类型', value: 'planScope', width: 90, format: this.taskScope, align: 'center' },
          { title: '类别', value: 'name', width: 80 },
          { title: '医嘱项目名称', value: 'extractionsNumber', width: 120},
          { title: '频次', value: 'percentageComplete', width: 130 },
          { title: '剂量', value: 'na3me', width: 100, align: 'right' },
          { title: '单位', value: 'filterStartTime', width: 70 },
          { title: '用法', value: 'filterEndTime', width: 70 },
          { title: '备注', value: 'updateTime'},
          { title: '状态', value: 'user', width: 100, align: 'center' },
          { title: '开单医生', value: 'enter', width: 130  },
          { title: '开单时间', value: 'type', width: 130 },
          { title: '开单执行时间', value: 'radio', width: 100 },
      ], 
      dataSource: [
        {name:'王五'},
      ],
      current:1,
      searchData:{},
      modalData:[],
      visible:false,
      multipleSelection: [],
    }
  },
  computed: {
      list() {
        return [
          {
            name: '医嘱名称',
            dataField: 'admitNum',
            type: 'text'
          },
          {
            name: '医嘱选择',
            dataField: 'status',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '医嘱类型',
            dataField: 'level',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '医嘱类别',
            dataField: 'level',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
        ]
      }
    },
  mounted() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
   showModal() {
      this.visible = true
    },
    handleCancel(e) {
      this.visible = false
    },
    handleOk(e) {
      console.log(e);
      console.log(this.multipleSelection,'multipleSelection')
      this.visible = false
    },
    search() {
        let params = this.$refs.searchPanel.form.getFieldsValue();
        this.searchData =  this.$refs.searchPanel.form.getFieldsValue();
        params.pageSize = this.pageSize
        params.offset = 0;
        this.getData(params)
      },
      //重置
      resetForm({}){
        this.$refs.searchPanel.form.resetFields()
        this.searchData ={};
        this.getData({ pageSize: this.pageSize, offset: 0 })
      },
      pageChange(page, pageSize) {
        let params =  this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },
      pageChangeSize(page, pageSize) {
        let params =  this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
        this.pageSize=pageSize
      },
  }
}
</script>
<style scoped lang='less'>
</style>

    

