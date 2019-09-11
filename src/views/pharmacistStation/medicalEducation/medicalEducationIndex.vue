<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
     <a-button class="margin-top-10" type="primary" @click="medicalEducationAdd(true)">新增</a-button>
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
    name: 'medicalEducationIndex',
    data(){
      return{
        loading: false,
        total: 2,
        pageSize: 10,
        columns: [
          { title: '监护等级', dataIndex: 'indexId', width: 80, align: 'right' },
          { title: '类别', dataIndex: 'name6', align: 'left', width: 100 },
          { title: '患者位置', dataIndex: 'testItemName', align: 'left' },
          { title: '住院号', dataIndex: 'englishName', align: 'right' },
          { title: '患者姓名', dataIndex: 'name', align: 'left', width: 100 },
          { title: '性别', dataIndex: 'nam3e', align: 'left', width: 60 },
          { title: '年龄', dataIndex: 'testItemClass', width: 60, align: 'right' },
          { title: '入院时间', dataIndex: 'testItemCelass', width: 100, align: 'right' },
          { title: '入院诊断', dataIndex: 'test2ItemClass', align: 'right' },
          { title: '药品', dataIndex: 'testItemType', width: 80, align: 'left' },
          { title: '教育类型', width: 100, dataIndex: 'resultType', align: 'left' },
          { title: '教育时间', width: 100, dataIndex: 'resultType1', align: 'left' },
          { title: '创建人', width: 100, dataIndex: 'resultType2', align: 'left' },
          { title: '打印状态', width: 80, dataIndex: 'resultType4', align: 'left' },
        ],
        dataSource: [{name:'张三',status:'1',audit:'0'},{name:'李四',status:'1',audit:'1'}],
        current:1,
        searchData:{},
        items: [
          { text: '查看',  showtip: false, click: this.medicalEducationAdd, status: '1' },
          { text: '删除', color: 'red', showtip: true, tip: '确认删除吗？', click: this.delete, status: '1' },
          { text: '打印',  showtip: false, click: this.print, status: '' },

        ],
      }
    },
    computed: {
      list() {
        return [
          {
            name: '患者位置',
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
            name: '监护等级',
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
            name: '教育时间',
            dataField: 'time',
            type: 'range-picker',
          },
        ]
      }
    },
    methods:{
      delete(data) {},
      medicalEducationAdd(val){
        this.$router.push({
          name: 'medicalEducationAdd',
          params:{val:'1'},
        })
        if(typeof(val)==='boolean'){
          window.sessionStorage.setItem('childPage', JSON.stringify('add'));
        }else{
          window.sessionStorage.setItem('childPage', JSON.stringify('look'))
           window.sessionStorage.setItem('medicalEducationData', JSON.stringify(val))

        }
      },
      //搜索
      search() {
          this.$refs.chatModal.showModal()

        // let params = this.$refs.searchPanel.form.getFieldsValue();
        // this.searchData =  this.$refs.searchPanel.form.getFieldsValue();
        // if (params.time) {
        //     params.startTime = params.time[0].format('YYYY-MM-DD');
        //     params.endTime = params.time[1].format('YYYY-MM-DD');
        // }
        // console.log(params)
        // params.pageSize = this.pageSize
        // params.offset = 0;
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
      print(data) {
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