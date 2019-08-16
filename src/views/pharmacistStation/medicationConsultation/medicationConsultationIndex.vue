<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
     <a-button class="margin-top-10" type="primary" @click="medicationConsultationAdd">新增</a-button>
    <a-spin :spinning="loading" tip="加载中...">
      <el-table
        class="margin-top-10"
        :data="dataSource"
        border
        :highlight-current-row="true"
        style="width: 100%"
      >
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
        <el-table-column
          fixed="right"
          label="操作"
          :width="180"
          align="center"
          v-if="true"
        >
          <template slot-scope="scope">
             <opcol :items="items" :more="false" :data="scope.row"></opcol>
          </template>
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
    <!-- <a-modal
      title="Title"
      :visible="modalVisible"
      @cancel="handleCancel"
    >
      <p>wrwfc </p>
    </a-modal> -->
    <modalDetail ref="modalDetail" :modalData="modalData"></modalDetail>
  </a-card>
</template>

<script>
  import modalDetail from './detailModal'
  export default {
    name: 'medicationConsultationResultIndex',
    data(){
      return{
        loading: false,
        total: 2,
        pageSize: 10,
        columns: [
          { title: '监护等级', value: 'planScope', width: 90, format: this.taskScope, align: 'center' },
          { title: '类别', value: 'name', width: 80 },
          { title: '患者位置', value: 'extractionsNumber', width: 100, align: 'right' },
          { title: '住院号', value: 'percentageComplete', width: 130 },
          { title: '患者姓名', value: 'na3me', width: 100, align: 'right' },
          { title: '性别', value: 'filterStartTime', width: 70 },
          { title: '年龄', value: 'filterEndTime', width: 70 },
          { title: '入院时间', value: 'updateTime', width: 130 },
          { title: '入院诊断', value: 'enter' },
          { title: '咨询医生', value: 'user', width: 100, align: 'center' },
          { title: '咨询类别', value: 'type', width: 130 },
          { title: '紧急程度', value: 'radio', width: 100 },
          { title: '咨询状态', value: 'sta1tus', width: 100 },
          { title: '咨询时间', value: 'sta我tus', width: 100 },
        ],
        items: [
          { text: '详情',  showtip: false, click: this.detailModal, status: '' },
        ],
        dataSource: [{name:'张三123',user:'李医生',type:'7',radio:'2',response:'真好'}],
        current:1,
        searchData:{},
        visible:false,
        modalData:{},
      }
    },
    components:{
      modalDetail
    },
    computed: {
      list() {
        return [
          {
          name: '患者位置',
          dataField: 'address',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '患者姓名',
          dataField: 'admitNum',
          type: 'text'
        },
        {
          name: '咨询医生',
          dataField: 'status',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '咨询状态',
          dataField: 'level',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '咨询类别',
          dataField: 'level',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '紧急程度',
          dataField: 'level',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '监护等级',
          dataField: 'level',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
          {
            name: '咨询时间',
            dataField: 'time',
            type: 'range-picker',
          },
        ]
      }
    },
    methods:{
      detailModal(data) {
        this.$refs.modalDetail.showModal()
        this.modalData=data;
      },
      medicationConsultationAdd(){},
      //搜索
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue();
        this.searchData =  this.$refs.searchPanel.form.getFieldsValue();
        params.pageSize = this.pageSize
        params.offset = 0;
        this.getData(params)
      },
      //重置
      resetForm({}) {
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
      

      //枚举
      testItemTypeFormatter(data) {
        let levelText
        this.enum.testItemType.forEach(item => {
          if (Number(data) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      },
      //枚举
      resultTypeFormatter(data) {
        let levelText
        this.enum.resultType.forEach(item => {
          if (Number(data) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      },
      //枚举
      isCalcFormatter(data) {
        let levelText
        this.enum.isCalc.forEach(item => {
          if (Number(data) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      }
    }
  }
</script>

<style scoped>

</style>