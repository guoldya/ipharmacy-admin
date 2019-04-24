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
        :data="loadData" border
        :highlight-current-row="true"
        style="width: 100%"
      >
        <el-table-column v-for="item in columns" :show-overflow-tooltip="true" :key="item.dataIndex" :label="item.title"
                         :prop="item.dataIndex" :width="item.width" :align="item.align">
          <template slot-scope="props">
                  <span v-if="item.dataIndex == 'action'">
                     <a @click="edits(props.row)">编辑</a>
                     <a-divider type="vertical"/>
                        <a @click="user(props.row)">{{props.row.status==0?'启用':'停用' }}</a>
                  </span>
                  <span v-if="item.dataIndex == 'problemLevel'">
                          <a-tag :color="props.row.colors" style="cursor: default;"> {{props.row.problemLevel}}</a-tag>
                  </span>
                  <!--<span v-else-if="item.dataIndex == 'colors'">-->
                    <!--<my-icon :style="{fontSize:'22px', color:props.row.colors}" type="anticonyuanquan"/>-->
                  <!--</span>-->
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
      >
      </a-pagination>
    </a-spin>
  </a-card>
</template>

<script>
  import { Icon } from 'ant-design-vue'
  import STable from '@/components/table/'
  const myIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1148820_zonmgh0a7kq.js' // 在 iconfont.cn 上生成
  })
  export default {
    components: { myIcon,STable },
    name: 'index',
    data() {
      return {
        loading: false,
        total: 10,
        curent: 1,
        pageSize: 10,
        columns: [
          { title: '编号', dataIndex: 'id', width: 60, align: 'right' },
          { title: '等级类型', dataIndex: 'levelType', align: 'center', width: 100 },
          { title: '问题等级', dataIndex: 'problemLevel', align: 'center', width: 100 },
          { title: '处理类型', dataIndex: 'dealType', align: 'center', width: 110 },
          { title: '等级说明', dataIndex: 'levelThat' },
          { title: '状态', dataIndex: 'status', width: 80, align: 'center' },
          { title: '操作', width: 100, dataIndex: 'action', align: 'center' }
        ],
        colors: '#ffffff',
        loadData: []
      }
    },
    computed: {
      list() {
        return [
          {
            name: '等级类型',
            dataField: 'clientId',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource:this.enum.levelType,
          },
          { name: '处理类型',
            dataField: 'drugName',
            type: 'select',
            keyExpr: 'value',
            valueExpr: 'text',
            dataSource:this.enum.dealType,}
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
        this.fetchYJSMapData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        this.fetchYJSMapData({ pageSize: 10, offset: 0 })
      },
      getData() {
        this.loadData = [{
          id: 1,
          levelType: '系统',
          status: 1,
          problemLevel:  '0级',
          dealType: '无',
          colors: '#1890ff',
          levelThat: '不提示，后台记录；'
        },
          { id: 2, levelType: '系统', status: 0, problemLevel: '1级', dealType: '无', colors: '#d38718', levelThat: '无问题' }]
      },
      pageChangeSize() {

      },
      pageChange() {

      },
      //启用停用
      user() {

      },
      //停用
      ban(data) {
      },
      edits(data) {
        data.msg='old';
        this.$router.push({
          name: 'problemLevelDetail',
          query: data
        })
      },

      cellStyle(row) {
        if (row.column.label === '显示颜色') {
          return 'backgroundColor:' + row.row.colors
        }
      },

      add(){
        this.$router.push({
          name: 'problemLevelDetail',
          query:{msg:'new',length:this.loadData.length+1}
        })
      }
    }
  }
</script>

<style scoped>

</style>