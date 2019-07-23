<template>
<div>
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
      style="width: 100%"
    >
      <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
        <template slot-scope="scope">
          <opcol
            :items="items"
            :more="false"
            :data="scope.row"
            :filterItem="['status']"
          ></opcol>
        </template>
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
        <template slot-scope="scope">
          <span v-if="item.format !=null" v-html="item.format(scope.row)"></span>
          <span v-else>{{scope.row[item.value]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <a-pagination
      showSizeChanger
      showQuickJumper
      hideOnSinglePage
      :total="total"
      class="pnstyle"
      :defaultPageSize="pageSize"
      :pageSizeOptions="['10', '20','50']"
      @showSizeChange="pageChangeSize"
      @change="pageChange"
      size="small"
      v-model="current"
    ></a-pagination>
  </a-spin>
</div>
</template>

<script>
  export default {
    name: 'ruleTable',
    data() {
      return {
        api: {
          selectPage: 'sys/reviewAuditlevel/selectPage',
          reviewAuditlevelUpdate: 'sys/reviewAuditlevel/update',
        },
        loading: false,
        total: null,
        curent: 1,
        pageSize: 10,
        columns: [
          { title: '规则名称', value: 'levelType',  },
          { title: '规则类型', value: 'levelName', align: 'center', width: 130 },
          { title: '更新时间', value: 'levelDescription' },
          { title: '次数', value: '123', width: 100, align: 'right' }
        ],
        items: [
          { text: '详情', showtip: false, click: this.edits },
          { text: '规则', showtip: false, click: this.edits },
        ],
        levelColor: '#ffffff',
        dataSource: [],
        current: 1,
        searchData: {},
        levelAduits:[],
        treeList:[],
      }
    },
    computed: {
      list() {
        return [
          // {
          //   name: '禁忌分类',
          //   dataField: 'levelType',
          //   type: 'tree-select',
          //   treeData: this.treeList
          // },
          {
            name: '规则名称',
            dataField: 'levelType',
            type: 'text',
          },
          {
            name: '规则类型',
            dataField: 'levelType',
            type: 'select',
            dataSource: this.enum.ruleClassification,
            keyExpr: 'id',
            valueExpr: 'text'
          },
          // {
          //   name: '处理类型',
          //   dataField: 'handleType',
          //   type: 'select',
          //   keyExpr: 'id',
          //   valueExpr: 'text',
          //   dataSource: this.enum.handleType
          // },
          // {
          //   name: '问题等级',
          //   dataField: 'status',
          //   type: 'select',
          //   keyExpr: 'AUDITVALUE',
          //   valueExpr: 'LEVELNAME',
          //   dataSource: this.levelAduits
          // },
        ]
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      //搜索
      search() {
        this.searchData = this.$refs.searchPanel.form.getFieldsValue()
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.searchData = {}
        this.$refs.searchPanel.form.resetFields()
        this.getData({ pageSize: 10, offset: 0 })
      },
      getData(params = { pageSize: 10, offset: 0 }) {
        this.loading = true
        if (params.offset == 0) {
          this.current = 1
        }
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
      pageChange(page, pageSize) {
        let params = this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },
      pageChangeSize(page, pageSize) {
        let params = this.searchData
        params.offset = (page - 1) * pageSize
        params.pageSize = pageSize
        this.getData(params)
      },

      //枚举
      levelFormatter(data) {
        let levelText
        this.levelAduits.forEach(item => {
          if (Number(data.levelType) == item.AUDITVALUE) {
            levelText = item.LEVELNAME
            return
          }
        })
        return levelText
      },
      handleFormatter(data) {
        let levelText
        this.enum.handleType.forEach(item => {
          if (Number(data.handleType) == item.id) {
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