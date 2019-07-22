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
                        <span v-if="item.value == 'status'">
                            <a-badge
                              :status="scope.row.status == 0? 'default':'processing'"
                              :text="scope.row.status==0?'停用':'启用'"
                            />
                        </span>
          <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
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
    name: 'drugTable',
    data() {
      return {
        api: {
          selectPage: 'sys/reviewAuditlevel/selectPage',
          reviewAuditlevelUpdate: 'sys/reviewAuditlevel/update'
        },
        loading: false,
        total: null,
        curent: 1,
        pageSize: 10,
        columns: [
          { title: '药品名称', value: 'auditLevel',},
          { title: '规格', value: 'levelType',  width: 130, format: this.levelFormatter },
          { title: '剂型', value: 'levelName', align: 'center', width: 100 },
          { title: '生产厂商', value: 'handleType',   format: this.handleFormatter },
          { title: '次数', value: 'levelDescription' , align: 'right',width: 100, },
        ],
        items: [
          { text: '详情', showtip: false, click: this.edits },
        ],
        levelColor: '#ffffff',
        dataSource: [],
        current: 1,
        searchData: {}
      }
    },
    computed: {
      list() {
        return [
          {
            name: '药品名称',
            dataField: 'levelType',
            type: 'text',
          },
          {
            name: '生产厂商',
            dataField: 'handleType',
            type: 'text',
          },
        ]
      }
    },
    mounted() {
      this.getData()
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
      //启用停用
      user(data) {
        if (data.status == 1) {
          data.status = '0'
        } else {
          data.status = '1'
        }
        this.$axios({
          url: this.api.reviewAuditlevelUpdate,
          method: 'post',
          data: data
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      edits(data) {
        this.$router.push({
          name: 'problemLevelDetail',
          params: { auditLevel: data.auditLevel }
        })
      },
      cellStyle(row) {
        if (row.column.label === '显示颜色') {
          return 'backgroundColor:' + row.row.levelColor
        }
      },

      add() {
        this.$router.push({
          name: 'problemLevelDetail',
          params: { auditLevel: 'new' }
        })
      },

      //枚举
      levelFormatter(data) {
        let levelText
        this.enum.levelType.forEach(item => {
          if (Number(data.levelType) == item.id) {
            levelText = item.text
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