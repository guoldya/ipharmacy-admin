<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <!-- <a-button class="margin-top-10" type="primary" @click="add">新增</a-button> -->
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
          <template slot-scope="props">
            <span v-if="item.dataIndex == 'action'">
              <a @click="edits(props)">详情</a>
            </span>
            <span
              v-else-if="item.dataIndex == 'testItemType'"
              v-html="testItemTypeFormatter(props.row.testItemType)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'resultType'"
              v-html="resultTypeFormatter(props.row.resultType)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'resultType'"
              v-html="resultTypeFormatter(props.row.resultType)"
            ></span>
            <span v-else-if="item.dataIndex == 'isCalc'" v-html="isCalcFormatter(props.row.isCalc)"></span>
            <span v-else>{{props.row[item.dataIndex]}}</span>
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
import { reviewAuditlevelPage } from '@/api/login'
import { Icon } from 'ant-design-vue'
import STable from '@/components/table/'
const myIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1148820_zonmgh0a7kq.js' // 在 iconfont.cn 上生成
})
export default {
  components: { myIcon, STable },
  name: 'index',
  data() {
    return {
      api: {
        selectPage: 'sys/testIndex/selectPage'
      },
      loading: false,
      total: null,
      pageSize: 10,
      columns: [
        { title: '检验指标', dataIndex: 'indexId', width: 80, align: 'right' },
        { title: '指标编码', dataIndex: 'testItemCode', align: 'left', width: 100 },
        { title: '指标名称', dataIndex: 'testItemName', align: 'left' },
        { title: '英文名', dataIndex: 'englishName', align: 'left' },
        { title: '指标分类', dataIndex: 'testItemClass', width: 120, align: 'left' },
        { title: '指标类型', dataIndex: 'testItemType', width: 80, align: 'left' },
        { title: '结果类型', width: 100, dataIndex: 'resultType', align: 'left' },
        { title: '计算项', width: 100, dataIndex: 'isCalc', align: 'left' },
        { title: '操作', width: 100, dataIndex: 'action', align: 'center' }
      ],
      dataSource: [],
      current:1,
      searchData:{},
    }
  },
  computed: {
    list() {
      return [
        {
          name: '检验指标',
          dataField: 'indexId',
          type: 'text'
        },
        {
          name: '指标编码',
          dataField: 'testItemCode',
          type: 'text'
        },
        {
          name: '指标名称',
          dataField: 'testItemName',
          type: 'text'
        },
        {
          name: '指标类型',
          dataField: 'testItemType',
          type: 'select',
          dataSource: this.enum.testItemType,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '结果类型',
          dataField: 'resultType',
          type: 'select',
          dataSource: this.enum.resultType,
          keyExpr: 'id',
          valueExpr: 'text'
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    //搜索
    search() {
      let params = this.$refs.searchPanel.form.getFieldsValue();
      this.searchData =  this.$refs.searchPanel.form.getFieldsValue();
      params.pageSize = this.pageSize
      params.offset = 0
      this.getData(params)
    },
    //重置
    resetForm({}) {
      this.$refs.searchPanel.form.resetFields()
      this.searchData ={};
      this.pageSize=10
      this.getData({ pageSize: this.pageSize, offset: 0 })
    },
    // 获取初始数据
    getData(params = {}) {
      if(params.offset==0){
        this.current=1
      }
      this.loading = true
      this.$axios({
        url: this.api.selectPage,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.error(err)
        })
    },
    // 页码
    // pageChange(page, pageSize) {
    //   this.getData({ offset: (page - 1) * pageSize, pageSize: this.pageSize })
    //    this.current=page
    // },
    // pageChangeSize(page, pageSize) {
    //   this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
    // },
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