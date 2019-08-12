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
          :key="item.dataIndex"
          :label="item.title"
          :prop="item.dataIndex"
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
             <a @click="look">查看</a>
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
  </a-card>
</template>

<script>
  export default {
    name: 'medicationConsultationResultIndex',
    data(){
      return{
        loading: false,
        total: 2,
        pageSize: 10,
        columns: [
          { title: '咨询者姓名', dataIndex: 'indexId', width: 120, align: 'left' },
          { title: '性别', dataIndex: 'name', align: 'left', width: 100 },
          { title: '咨询者分类', dataIndex: 'englishName', align: 'left', width: 140 },
          { title: '处理药师', dataIndex: 'testItemName', align: 'left' , width: 120},
          { title: '问题摘要', dataIndex: 'testItemClass', width: 140,align: 'left' },
          { title: '咨询方式', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '问题归类', width: 100, dataIndex: 'resultType', align: 'left' },
          { title: '备注', dataIndex: 'resultType1', align: 'left' },
          { title: '咨询时间', width: 100, dataIndex: 'resultType3', align: 'left' },
        ],
        items: [
          { text: '查看',  showtip: false, click: this.edits, status: '' },
        ],
        dataSource: [{name:'张三123'}],
        current:1,
        searchData:{},
      }
    },
    computed: {
      list() {
        return [
          {
            name: '咨询者姓名',
            dataField: 'admitNum',
            type: 'text'
          },
          {
            name: '咨询者分类',
            dataField: 'testItemType8',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '处理药师',
            dataField: 'testItemType1',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '咨询方式',
            dataField: 'testItemType2',
            type: 'select',
            dataSource: this.enum.patientProblem,
            keyExpr: 'id',
            valueExpr: 'text'
          },
           {
            name: '问题归类',
            dataField: 'testItemType21',
            type: 'select',
            dataSource: this.enum.patientProblem,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '发生时间',
            dataField: 'time',
            type: 'range-picker',
          },
        ]
      }
    },
    methods:{
      look(){
       
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
      edits(data) {
        //console.log(data)
        data.msg = 'old'
        this.$router.push({
          name: 'indicatorsMgtDetail',
          params:{ indexId:data.row.indexId ,}
        })
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