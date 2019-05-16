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
              <span v-else-if="item.prop == 'rule'" v-html="ruleType(props.row.rule)"></span>
              <span v-else-if="item.prop == 'type'" v-html="typeType(props.row.type)"></span>
              <span v-else-if="item.prop == 'drugName'"><a href="">{{props.row.drugName}}</a></span>
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
    <a-card class="margin-top-10">
      <a-spin tip="加载中..." :spinning="codeLoading">
        <el-table
          ref="table"
          :data="loadData"
          border
          :highlight-current-row="true"
        >
          <el-table-column :show-overflow-tooltip="true" v-for="item in columns2" :key="item.prop"
                           :label="item.title" :prop="item.prop" :width="item.width" :align="item.align">
            <template slot-scope="props">
                 <span v-if="item.prop == 'status'">
                    <a-badge :status="props.row.status == 0? 'default':'processing'"
                             :text="props.row.status==0?'停用':'启用'"/>
                </span>
              <span v-else-if="item.prop == 'rule'" v-html="ruleType(props.row.rule)"></span>
              <span v-else-if="item.prop == 'type'" v-html="typeType(props.row.type)"></span>
              <span v-else-if="item.prop == 'drugName'"><a href="">{{props.row.drugName}}</a></span>
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
        columns: [{ title: '分类编码', prop: 'classCode' },
          { title: '分类名称', prop: 'name' },
          { title: '标准代码', prop: 'standardCode' },
          { title: '分类类型', prop: 'classType',align:'center',width:100  },
          { title: '备注', prop: 'remark' },
          { title: '操作', prop: 'action', align: 'center' }
        ],
        columns2: [{ title: '编码', prop: 'code',width:80 },
          { title: '字典名称', prop: 'name' },
          { title: '编码值', prop: 'codeValues' },
          { title: '拼音码', prop: 'spellCode' },
          { title: '字典类型', prop: 'codeClass',align:'center',width:100 },
          { title: '备注', prop: 'remark' },
          { title: '状态', prop: 'status',align:'center',width:100 },
          { title: '操作', prop: 'action', align: 'center' }
        ],
        total: null,
        curent: 1,
        pageSize: 10,
      }
    },
    mounted() {
    },
    computed: {
      list() {
        return [
          {
            name: '药品名称',
            dataField: 'drugName',
            type: 'text'
          },
          { name: '生产厂商', dataField: 'drugName', type: 'select' }

        ]
      }
    },
    methods: {
      //搜索
      search() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        params.pageSize = 10
        params.offset = 0
        // this.fetchYJSMapData(params)
      },
      //重置
      resetForm() {
        this.$refs.searchPanel.form.resetFields()
        // this.fetchYJSMapData({ pageSize: 10, offset: 0 })
      },

      //页面数change事件
      pageChangeSize() {

      },
      //页面跳转事件
      pageChange() {

      },
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