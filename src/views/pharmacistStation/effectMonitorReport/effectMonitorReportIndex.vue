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
            <template  slot-scope="scope">
                <a-tag color="#1890ff" v-if="item.dataIndex==='no'">123</a-tag>
                <span v-else>{{scope.row[item.dataIndex]}}</span>
            </template>
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
          { title: '监护等级', dataIndex: 'indexId', width: 80, align: 'right' },
          { title: '类别', dataIndex: 'name6', align: 'left', width: 100 },
          { title: '患者位置', dataIndex: 'testItemName', align: 'left', width: 100 },
          { title: '住院号/就诊卡号', dataIndex: 'no', align: 'right' , width: 140},
          { title: '患者姓名', dataIndex: 'name', align: 'left', width: 100 },
          { title: '性别', dataIndex: 'nam3e', align: 'left', width: 60 },
          { title: '年龄', dataIndex: 'testItemClass', width: 60, align: 'right' },
          { title: '入院时间', dataIndex: 'testItemCelass', width: 100, align: 'right' },
          { title: '入院诊断', dataIndex: 'test2ItemClass', align: 'right' },
          { title: '患者类型', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '不良反应类型', width: 120, dataIndex: 'resultType', align: 'left' },
          { title: '药品名称', width: 100, dataIndex: 'resultType1', align: 'left' },
          { title: '批号', width: 100, dataIndex: 'resultType2', align: 'left' },
          { title: '发生时间', width: 100, dataIndex: 're3sultType2', align: 'left' },
          { title: '不良反应结果', width: 120, dataIndex: 'resultType42', align: 'left' },
          { title: '报告药师', width: 80, dataIndex: 'resultType43', align: 'left' },
          { title: '报告编号', width: 80, dataIndex: 'resultType44', align: 'left' },

        ],
        items: [
          { text: '查看',  showtip: false, click: this.effectMonitorReportAdd, status: '' },
          { text: '删除', color: 'red', showtip: true, tip: '确认删除吗？', click: this.user, status: '1' },
        ],
        dataSource: [{name:'张三',no:'939393'}],
        current:1,
        searchData:{},
      }
    },
    computed: {
      list() {
        return [
          {
            name: '患者类型',
           dataField: 'testItemType123',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
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
            type: 'date-picker',
          },
        ]
      }
    },
    methods:{
      effectMonitorReportAdd(data){
      console.log(data)
        this.$router.push({
          name: 'effectMonitorReportAdd',
        })
        window.localStorage.setItem('childPage', JSON.stringify('add'))
      },
      //搜索
      search() {

        let params = this.$refs.searchPanel.form.getFieldsValue();
        if (params.time) {
            params.time = params.time.format('YYYY-MM-DD')
        }
        console.log(params)
        this.searchData =  this.$refs.searchPanel.form.getFieldsValue();
        params.pageSize = this.pageSize
        params.offset = 0;
        // this.getData(params)
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