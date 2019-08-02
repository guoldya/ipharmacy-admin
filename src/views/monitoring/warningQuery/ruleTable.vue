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
    props: ['moreThanNum', 'startDate', 'endDate'],
    data() {
      return {
        api: {
          selectPage: 'sys/early/selectRuleWarningRuleNode'
        },
        loading: false,
        total: null,
        current: 1,
        pageSize: 10,
        columns: [
          { title: '规则名称', value: 'name' },
          { title: '规则类型', value: 'type2', align: 'center', width: 130 },
          { title: '更新时间', value: 'updatetime', width: 130 },
          { title: '次数', value: 'total', width: 100, align: 'right' }
        ],
        items: [
          { text: '详情', showtip: false, click: this.edits },
          { text: '规则', showtip: false, click: this.ruleEdits }
        ],
        levelColor: '#ffffff',
        dataSource: [],
        current: 1,
        searchData: {},
        levelAduits: [],
        treeList: []
      }
    },
    computed: {
      list() {
        return [
          {
            name: '规则名称',
            dataField: 'name',
            type: 'text'
          },
          {
            name: '规则类型',
            dataField: 'type2',
            type: 'select',
            dataSource: this.enum.ruleClassification,
            keyExpr: 'id',
            valueExpr: 'text'
          }
        ]
      }
    },
    mounted() {
      setTimeout(() => {
        this.getData()
      }, 500)
    },
    methods: {
      //搜索
      search() {
        this.searchData = this.$refs.searchPanel.form.getFieldsValue()
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = this.pageSize
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.searchData = {}
        this.$refs.searchPanel.form.resetFields()
        this.getData({ pageSize: this.pageSize, offset: 0 })
      },
      getData(params = {}) {
        this.loading = true
        if (params.offset == 0) {
          this.current = 1
        }
        params.endDate = this.endDate
        params.startDate = this.startDate
        if ($.trim(this.moreThanNum).length > 0) {
          params.total = '' + this.moreThanNum
          this.$axios({
            url: this.api.selectPage,
            method: 'put',
            data: params
          })
            .then(res => {
              if (res.code == '200') {
                this.dataSource = this.$dateFormat(res.rows, ['updatetime'])
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
        }else{
          this.loading = false
        }
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
      edits(data){
        this.$router.push({
          name: 'detailProblemIndex',
          params: { id: data.id,startDate:this.startDate,endDate:this.endDate }
        })
      },
      ruleEdits(data){
        this.$router.push({
          name: 'ruleMgtCopyIndex',
          params: { id: data.id,startDate:this.startDate,endDate:this.endDate }
        })
      },

      //枚举
      ruleType(data) {
        let levelText
        this.enum.ruleClassification.forEach(item => {
          if (Number(data.type2) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      }
    },

    watch: {
//观察option的变化
      moreThanNum: {
        handler(newVal, oldVal) {
            this.getData()
        },
        deep: true //对象内部属性的监听，关键。
      },
      startDate: {
        handler(newVal, oldVal) {
          if (oldVal != newVal) {
            this.getData()
          }
        },
        deep: true //对象内部属性的监听，关键。
      },
      endDate: {
        handler(newVal, oldVal) {
          if (oldVal != newVal) {
            this.getData()
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    }
  }
</script>

<style scoped>

</style>