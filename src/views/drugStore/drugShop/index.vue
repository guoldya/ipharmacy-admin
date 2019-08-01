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
                :text="scope.row.status==0?'待审核':'已审核'"
              />
            </span>
            <span v-else-if="item.value == 'authStatus'">{{scope.row.authStatus==0?'到店自取':'全部'}}</span>
            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
            <span v-else>{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
          <template slot-scope="scope">
            <opcol :items="items" :more="false" :data="scope.row" :filterItem="['status']"></opcol>
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
        selectPage: 'sys/coreRuleDatasource/selectPage',
        Update: 'sys/coreRuleDatasource/updateStatus'
      },
      loading: false,
      total: null,
      curent: 1,
      pageSize: 10,
      columns: [
        { title: '药师编码', value: 'orgCode', align: 'left', width: 100 },
        { title: '药店名称', value: 'orgName', align: 'left', width: 250 },
        { title: '区域', value: 'address', align: 'left', width: 240 },
        { title: '联系人', value: 'contacts' },
        { title: '联系电话', value: 'telephone', width: 140 },
        { title: '地址', value: 'areaId', width: 200, align: 'center' },
        { title: '配送方式', value: 'authStatus', width: 80, align: 'center' },
        { title: '状态', value: 'status', width: 80, align: 'center' },
        { title: '操作', value: 'id', width: 60, align: 'right' }
      ],
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.user, status: '0' }
      ],
      levelColor: '#ffffff',
      //   dataSource: [{id:'编辑',dsName:"Du0361",display:"彭丫男测试医师",sqlText:"女",updatorName:"归公",updateTime:"全天下",range:"哈哈",address:"议题啊偶",professional:"多顶顶",status:"1"}],
      dataSource: [
        {
          address: '重庆市万州区',
          areaId: 500101,
          authStatus: 0,
          contacts: '开发二号',
          dispatchType: 2,
          id: 69,
          orgCode: 'OC0272',
          orgName: '开发者二号',
          status: 1,
          telephone: '13612345678'
        },
        {
          address: '渝北区的测试药店5地址',
          areaId: 500112,
          authStatus: 1,
          contacts: '测试药店5',
          dispatchType: 3,
          id: 67,
          orgCode: 'OC0261',
          orgName: '测试药店5',
          status: 1,
          telephone: '13222333322'
        }
      ],
      current: 1
    }
  },
  computed: {
    list() {
      return [
        {
          name: '药店',
          dataField: 'id',
          type: 'text'
        }
      ]
    }
  },
  mounted() {
    // this.getData()
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

    edits(data) {
        sessionStorage.setItem('drug', JSON.stringify(data))
      this.$router.push({
        name: 'drugShopDetail',     
      })
    },

    add() {
      this.$router.push({
        name: 'drugShopDetail',
        params: { id: 'new' }
      })
    },

    //枚举
    // 改时间格式
    changeTime(time) {
      if (time) {
        return time.replace(/(:\d{2})$/, '')
      }
    }
  }
}
</script>

<style scoped>
</style>