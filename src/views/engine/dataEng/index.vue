<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
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
            <opcol :items="items" :more="false" :data="scope.row" :filterItem="['status']"></opcol>
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
           <span v-else-if="item.value == 'updateTime'">
              {{changeTime(scope.row.updateTime)}}
            </span>
            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
            <span v-else>{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
      </el-table>

      <a-pagination
        showSizeChanger
        showQuickJumper
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
  </a-card>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      api: {
        selectPage: 'sys/coreDbDatasource/selectPage',
        //Update: 'sys/coreRuleDatasource/updateStatus'
      },
      loading: false,
      total: null,
      curent: 1,
      pageSize: 10,
      columns: [
        { title: '编号', value: 'id', width: 60, align: 'right' },
        //   { title: '数据源名称', value: 'dsName', align: 'center', width: 100 , format:this.levelFormatter  },
        { title: '数据源名称', value: 'dsName', align: 'left', width: 100 },
        { title: '驱动名称', value: 'driverClass', align: 'left', width: 100 },
        { title: '数据库连接', value: 'url', align: 'left' },
        { title: '密码', value: 'password', width: 120 },
        { title: '更新时间', value: 'updateTime', width: 140 },
        { title: '状态', value: 'status', width: 80, align: 'center' }
      ],
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.user, status: '0' }
      ],
      levelColor: '#ffffff',
      dataSource: [],
      current: 1
    }
  },
  computed: {
    list() {
      return [
        {
          name: '编号',
          dataField: 'id',
          type: 'text',
          pattern:/^\d{1,100}$/,
          message:'请输入数字'
        },
        {
          name: '数据源名称',
          dataField: 'dsName',
          type: 'text'
        },
        {
          name: '状态',
          dataField: 'status',
          type: 'select',
          keyExpr: 'id',
          valueExpr: 'text',
          dataSource: this.enum.statu
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
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.pageSize = 10
      params.offset = 0
      this.getData(params)
    },
    //重置
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.getData({ pageSize: 10, offset: 0 })
    },
    getData(params = { pageSize: 10, offset: 0 }) {
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
    pageChange(page, pageSize) {
      this.curent = page
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getData(params)
    },
    pageChangeSize(page, pageSize) {
      this.pageSize = pageSize
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getData(params)
    },
    //启用停用
    user(data) {
      let params = { id: data.id, status: data.status }
      this.$axios({
        url: this.api.Update,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.getData({ offset: (this.current - 1) * 10, pageSize: this.pageSize })
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
        name: 'dataEngDetail',
        params: { id: data.id }
      })
    },

    add() {
      this.$router.push({
        name: 'dataEngDetail',
        params: { id: 'new' }
      })
    },

    //枚举
    changeTime(time) {
      if(time){
         // return time.replace(/^(\d{4}-)|(:\d{2})$/, '')
            return time.replace(/(:\d{2})$/, '')
      }
    },
  }
}
</script>

<style scoped>
</style>