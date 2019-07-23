<template>
  <div>
  <a-card>
    <ul class="ulList">
      <li>
        最少次数：
        <a-input-number></a-input-number>
      </li>
      <li class="dataPicker">
        <a-range-picker @change="onChange"/>
      </li>
      <li v-for="(item,index) in dateList" :class="item.code" tabindex="0" v-on:click="item.id(item.code)" :key="index">
        {{item.text}}
      </li>
    </ul>
  </a-card>
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
            <span v-else-if="item.value == 'levelName'">
                            <a-tag
                              :color="scope.row.levelColor"
                              style="cursor: default;"
                            >{{scope.row.levelName}}</a-tag>
                        </span>
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
  </a-card>
  </div>
</template>

<script>
  export default {
    name: 'index',
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
          { title: '来源', value: 'auditLevel', width: 60, align: 'right' },
          { title: '发生时间', value: 'levelType', align: 'center', width: 100, format: this.levelFormatter },
          { title: '科室', value: 'auddfdfitLevel', align: 'center', width: 100 },
          { title: '医生', value: 'handleType', align: 'center', width: 110, format: this.handleFormatter },
          { title: '患者', value: 'levelDescription' },
          { title: '住院号/门诊号', value: 'sdsd', width: 150, align: 'center' },
          { title: '药品', value: 'sdasad' },
          { title: '问题等级', value: 'levelName', width: 100, align: 'center' },
        ],
        items: [
          { text: '处方', showtip: false, click: this.edits },
          { text: '规则', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user},
        ],
        dateList: [
          { id: this.getDatePicker, code: 'oneMonth', text: '一月内' },
          { id: this.getDatePicker, code: 'oneWeek', text: '一周内' },
          { id: this.getDatePicker, code: 'threeDay', text: '三天内' },
          { id: this.getDatePicker, code: 'twoDay', text: '二天内' },
          { id: this.getDatePicker, code: 'oneDay', text: '一天内' }
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
            name: '等级类型',
            dataField: 'levelType',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.levelType
          },
          {
            name: '处理类型',
            dataField: 'handleType',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.handleType
          },
          {
            name: '状态',
            dataField: 'status',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.status
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


      getDatePicker(data){
        const end = new Date()
        const start = new Date()
        const dataRange = []
        if (data == 'oneMonth '){
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        }else if(data == "oneWeek"){
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        }else if(data == "threeDay"){
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
        }else if(data == "twoDay"){
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
        }else if(data == "oneDay"){
          start.setTime(start.getTime() - 3600 * 1000 * 24 )
        }
        dataRange[0] = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
        dataRange[1] = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
        console.log(dataRange)
      },
      onChange(date) {
        let dataRange = []
        dataRange[0] = date[0].format('YYYY-MM-DD')
        dataRange[1] = date[1].format('YYYY-MM-DD')
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
  .ulList {
    overflow: auto;
    zoom: 1;
    float: right;
    margin: 0 auto;
  }

  .ulList li {
    list-style-type: none;
    float: right;
    padding-right: 20px;
    padding-left: 20px;
    line-height: 32px;
  }

  .ulList li:hover {
    color: #2c8df1;
    cursor: pointer
  }

  .ulList .oneMonth {
    outline: 0
  }

  .ulList .oneWeek {
    outline: 0
  }

  .ulList .threeDay {
    outline: 0
  }

  .ulList .twoDay {
    outline: 0;

  }

  .ulList .oneDay {
    outline: 0;
    color: #2c8df1;
    border-bottom: 1px solid #2c8df1;
  }

  .ulList .dataPicker {
    width: 230px;
  }
</style>