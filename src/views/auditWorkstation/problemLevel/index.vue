<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search" >查询</a-button>
        <a-button class="margin-left-5" @click="resetForm" >重置</a-button>
      </div>
    </Searchpanel>
    <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
    <a-spin :spinning="loading" tip="加载中...">
      <el-table
        class="margin-top-10"
        :data="dataSource" border
        :highlight-current-row="true"
        style="width: 100%"
      >
        <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                         :prop="item.dataIndex" :width="item.width" :align="item.align">
          <template slot-scope="props">
            <span v-if="item.dataIndex == 'action'">
              <opcol :items="items" :more="false" :data="props.row" :filterItem="['status']"></opcol>
            </span>
            <span v-if="item.dataIndex == 'levelName'">
              <a-tag :color="props.row.levelColor" style="cursor: default;"> {{props.row.levelName}}</a-tag>
            </span>
            <span v-else-if="item.dataIndex == 'levelType'" v-html="levelFormatter(props.row.levelType)"></span>
            <span v-else-if="item.dataIndex == 'handleType'" v-html="handleFormatter(props.row.handleType)"></span>
            <span v-else-if="item.dataIndex == 'status'">
              <a-badge :status="props.row.status == 0? 'default':'processing'"
                       :text="props.row.status==0?'停用':'启用'"/>
            </span>
            <span v-else>{{props.row[item.dataIndex]}}</span>
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
        v-model='current'
      >
      </a-pagination>
    </a-spin>
  </a-card>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        api:{
          selectPage:'sys/reviewAuditlevel/selectPage',
          reviewAuditlevelUpdate:'sys/reviewAuditlevel/update',
        },
        loading: false,
        total: null,
        curent: 1,
        pageSize: 10,
        columns: [
          { title: '编号', dataIndex: 'auditLevel', width: 60, align: 'right' },
          { title: '等级类型', dataIndex: 'levelType', align: 'center', width: 100 },
          { title: '问题等级', dataIndex: 'levelName', align: 'center', width: 100 },
          { title: '处理类型', dataIndex: 'handleType', align: 'center', width: 110 },
          { title: '等级说明', dataIndex: 'levelDescription' },
          { title: '状态', dataIndex: 'status', width: 80, align: 'center' },
          { title: '操作', width: 100, dataIndex: 'action', align: 'center' }
        ],
        items:[
          {text:'编辑',showtip:false,click:this.edits},
          {text:'启用',showtip:true,tip:'确认启用吗？',click:this.user,status:'1'},
          {text:'停用',showtip:true,tip:'确认停用吗？',click:this.user,status:'0'},
        ],
        levelColor: '#ffffff',
        dataSource: [],
        current:1
      }
    },
    computed: {
      list() {
        return [
          {
            name: '等级类型',
            dataField: 'levelType',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource:this.enum.levelType,
          },
          { name: '处理类型',
            dataField: 'handleType',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource:this.enum.handleType,}
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
        if(params.offset==0){
        this.current=1
      }
        this.$axios({
          url: this.api.selectPage,
          method: 'put',
          data: params
        }).then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            this.total = res.total;
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.error(err)
        })
      },
      pageChange(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: this.pageSize })
      },
      pageChangeSize(page, pageSize){
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //启用停用
      user(data) {
        if (data.status){
          data.status = '0'
        } else{
          data.status = '1'
        }
        this.$axios({
          url: this.api.reviewAuditlevelUpdate,
          method: 'post',
          data: data
        })
          .then(res => {
            if (res.code == '200') {
              this.success(res.msg);
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })


      },
      //停用
      ban(data) {
      },
      edits(data) {
        this.$router.push({
          name: 'problemLevelDetail',
          params: {auditLevel:data.auditLevel}
        })
      },

      cellStyle(row) {
        if (row.column.label === '显示颜色') {
          return 'backgroundColor:' + row.row.levelColor
        }
      },

      add(){
        this.$router.push({
          name: 'problemLevelDetail',
          params: {auditLevel:'new'}
        })
      },

      //枚举
      levelFormatter(data) {
        let levelText
        this.enum.levelType.forEach(item => {
          if (Number(data) == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      },
      handleFormatter(data){
        let levelText
        this.enum.handleType.forEach(item => {
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