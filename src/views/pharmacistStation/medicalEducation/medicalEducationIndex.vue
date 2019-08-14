<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
     <a-button class="margin-top-10" type="primary" @click="medicalEducationAdd">新增</a-button>
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
            <!-- <template slot-scope="scope">
              <opcol :items="items" :more="false" :data="scope.row"></opcol>
            </template> -->
          <template slot-scope="scope">

             <a v-if="scope.row.audit === '0'" @click="">审核</a>
             <a v-if="scope.row.audit === '1'" @click="">查看</a>
            <a-divider type="vertical" v-if="scope.row.status == 1 || scope.row.status == 3 || scope.row.status == 4 " />
            <a-popconfirm
              title="确定删除?"
              @confirm="del(scope.row)"
              okText="删除"
              cancelText="取消"
              v-if="scope.row.status == 1"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" v-if="scope.row.status == 1"/>
            <a>打印</a>
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
    name: 'medicalEducationIndex',
    data(){
      return{
        loading: false,
        total: 2,
        pageSize: 10,
        columns: [
          { title: '监护等级', dataIndex: 'indexId', width: 80, align: 'right' },
          { title: '患者姓名', dataIndex: 'name', align: 'left', width: 100 },
          { title: '位置', dataIndex: 'testItemName', align: 'left' },
          { title: '住院号', dataIndex: 'englishName', align: 'right' },
          { title: '年龄', dataIndex: 'testItemClass', width: 120, align: 'right' },
          { title: '药品', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '教育类型', width: 100, dataIndex: 'resultType', align: 'left' },
          { title: '教育时间', width: 100, dataIndex: 'resultType1', align: 'left' },
          { title: '创建人', width: 100, dataIndex: 'resultType2', align: 'left' },
          { title: '审核状态', width: 100, dataIndex: 'resultType3', align: 'left' },
          { title: '打印状态', width: 100, dataIndex: 'resultType4', align: 'left' },
        ],
        dataSource: [{name:'张三',status:'1',audit:'0'},{name:'李四',status:'1',audit:'1'}],
        current:1,
        searchData:{},
        items: [
          { text: '审核',  showtip: false, click: this.edits, status: '0' },
          { text: '查看',  showtip: false, click: this.edits, status: '1' },
          { text: '删除', color: 'red', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
          { text: '打印',  showtip: false, click: this.edits, status: '' },

        ],
      }
    },
    computed: {
      list() {
        return [
          {
            name: '患者位置',
            dataField: 'indexId',
            type: 'text'
          },
          {
            name: '患者信息',
            dataField: 'testItemCode',
            type: 'text'
          },
          {
            name: '审核状态',
            dataField: 'testItemType1',
            type: 'select',
            dataSource: this.enum.status,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '教育类型',
            dataField: 'testItemType2',
            type: 'select',
            dataSource: this.enum.patientProblem,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '带教学员',
            dataField: 'resultType3',
            type: 'select',
            dataSource: this.enum.levelType,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '打印状态',
            dataField: 'resultType',
            type: 'select',
            dataSource: this.enum.resultType,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          {
            name: '带教时间',
            dataField: 'time',
            type: 'range-picker',
          },
        ]
      }
    },
    methods:{
      medicalEducationAdd(){
        this.$router.push({
          name: 'medicalEducationAdd',
        })
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