<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
     <a-button class="margin-top-10" type="primary" @click="effectMonitorReportAdd">新增</a-button>
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
             <a @click="">查看</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定删除?"
              @confirm="del(scope.row)"
              okText="删除"
              cancelText="取消"
              
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
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
    name: 'effectMonitorReportIndex',
    data(){
      return{
        loading: false,
        total: 2,
        pageSize: 10,
        columns: [
          { title: '患者类型', dataIndex: 'indexId', width: 80, align: 'left' },
          { title: '患者姓名', dataIndex: 'name', align: 'left', width: 100 },
          { title: '住院号/就诊卡号', dataIndex: 'englishName', align: 'right', width: 140 },
          { title: '不良反应名称', dataIndex: 'testItemName', align: 'left' },
          { title: '药品名称', dataIndex: 'testItemClass', width: 120, align: 'left' },
          { title: '批号', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '发生时间', width: 100, dataIndex: 'resultType', align: 'left' },
          { title: '不良反应结果', dataIndex: 'resultType1', align: 'left' },
          { title: '报告药师', width: 100, dataIndex: 'resultType2', align: 'left' },
          { title: '报告编号', width: 100, dataIndex: 'resultType3', align: 'left' },
        ],
        dataSource: [{name:'张三'}],
        current:1,
        searchData:{},
      }
    },
    computed: {
      list() {
        return [
          {
            name: '患者类型',
            dataField: 'indexId',
            type: 'text'
          },
          {
            name: '患者信息',
            dataField: 'testItemCode',
            type: 'text'
          },
          {
            name: '不良反应结果',
            dataField: 'testItemType1',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '报告药师',
            dataField: 'testItemType2',
            type: 'select',
            dataSource: this.enum.patientProblem,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '报告编号',
             dataField: 'indexId12',
            type: 'text'
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
      effectMonitorReportAdd(){
        this.$router.push({
          name: 'effectMonitorReportAdd',
        })
        window.localStorage.setItem('childPage', JSON.stringify('add'))
      },
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