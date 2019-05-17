<template>
  <a-card>
    <a-card>
      <Searchpanel ref="searchPanel" :list="list">
        <div slot="control">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
        </div>
      </Searchpanel>
      <a-button class="margin-top-10" type="primary"  @click="classCode">添加分类</a-button>
      <a-spin tip="加载中..." :spinning="loading">
        <el-table
          ref="table"
          :data="loadData"
          border
          class="margin-top-10"
          :highlight-current-row="true"
          @row-click="clickRow"
        >
          <el-table-column :show-overflow-tooltip="true" v-for="item in columns" :key="item.prop"
                           :label="item.title" :prop="item.prop" :width="item.width" :align="item.align">
            <template slot-scope="props">
                 <span v-if="item.prop == 'status'">
                    <a-badge :status="props.row.status == 0? 'default':'processing'"
                             :text="props.row.status==0?'停用':'启用'"/>
                </span>
              <span v-else-if="item.dataIndex == 'num'">
                      <a-badge @click="numberShow(props.row)" :count="props.row.num"
                               :numberStyle="{backgroundColor: '#1694fb', color: '#fff',cursor:'pointer'}"/>
                  </span>
              <span v-else-if="item.prop == 'action'">
              <a @click="edits(props.row)">编辑</a>
              <a-divider type="vertical"/>
              <a @click="user(props.row)">{{props.row.status==0?'启用':'停用' }}</a>
            </span>
              <span v-else>{{props.row[item.prop]}}</span>
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
  </a-card>
</template>

<script>

  export default {
    name: 'ruleMgt',
    data() {
      return {
        loading: false,
        codeLoading:false,
        loadData: [],
        codeData:[],
        columns: [{ title: '编码', prop: 'id',width:80,align:'right' },
          { title: '名称', prop: 'specName' },
          { title: '药品数', prop: 'drugNum',width:100 ,align:'center'},
          { title: '备注', prop: 'remark' },
          { title: '更新人', prop: 'updateBy',width:100 },
          { title: '更新时间', prop: 'updateTime',width:100 },
          { title: '状态', prop: 'status',width:100,align:'center' },
          { title: '操作', prop: 'action',width:120,align:'center' },
        ],
        total: null,
        pageSize: 10,
      }
    },
    mounted() {
    },
    computed: {
      list() {
        return [
          {
            name: '名称',
            dataField: 'specName',
            type: 'text'
          },
          { name: '状态',
            dataField: 'status',
            type: 'select',
            dataSource:this.enum.status,
            keyExpr:'id',
            valueExpr:'text',
          }
        ]
      }
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
      //获取网格数据
      getData(params) {
        // accountRolePage(params).then(res => {
        //   if (res.code == '200') {
        //     this.loadData = res.rows
        //     this.total = res.total
        //     this.pageSize = res.size
        //     this.loading = false
        //   } else {
        //     this.warn(res.msg)
        //     this.loading = false
        //   }
        // }).catch(err => {
        //   this.loading = false
        //   this.error(err)
        // })
      },
      //页码数change事件
      pageChangeSize(page, pageSize){
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //页码跳转事件
      pageChange(page, pageSize) {
        this.getData({ offset: (page - 1) * pageSize, pageSize: pageSize })
      },
      //编辑按钮事件
      edits(data) {
        this.$router.push({
          name: 'drugSpecDetail'
        })
      },
      //添加分类
      classCode(){

      },
      //点击第一个table列事件
      clickRow(row){
        console.log(row);
      },
      //
      numberShow(){

      },

      //filter
      ruleType(value) {
        if (value == '1') {
          return '系统'
        } else if (value == '2') {
          return '自定义'
        }
      },
      typeType(value) {
        if (value == '1') {
          return '药品规则'
        } else if (value == '2') {
          return '分类规则'
        } else if (value == '3') {
          return '分组规则'
        } else if (value == '4') {
          return '通用规则'
        }
      }
    }
  }
</script>

<style>

</style>