<template>
  <div>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list" :choose="choose">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
<!--    <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>-->
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
            <a v-if="scope.row.problemResouce == 1" @click="details(scope.row)">处方</a>
            <a v-else-if="scope.row.problemResouce == 2" @click="details(scope.row)">医嘱</a>
            <a-divider type="vertical" />
            <a  @click="ruleSelect(scope.row)">规则</a>
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
  import moment from 'moment'
  export default {
    name: 'index',
    components: {
      moment
    },
    data() {
      return {
        api: {
          selectPage: 'sys/early/selectProblemInfo',
          selectTreeData: 'sys/sysDepts/selectDeptsTreeList',

        },
        loading: false,
        total: null,
        curent: 1,
        pageSize: 10,
        columns: [
          { title: '来源', value: 'problemResouce', width: 60, align: 'center',format: this.reviewResouce  },
          { title: '发生时间', value: 'updatetime',  width: 130,},
          { title: '科室', value: 'deptName', align: 'center', width: 150 },
          { title: '医生', value: 'personName', width: 110, },
          { title: '患者', value: 'pname', width: 110 },
          { title: '住院号/门诊号', value: 'admitNum', width: 150, align: 'right' },
          { title: '药品', value: 'drugName' },
          { title: '问题等级', value: 'levelName', width: 100, align: 'center' },
        ],
        items: [
          { text: '处方', showtip: false, click: this.edits },
          { text: '规则', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user},
        ],
        levelColor: '#ffffff',
        dataSource: [],
        current: 1,
        searchData: {},
        treeDatas:[],
        paramsData:{},
      }
    },
    computed: {
      list() {
        return [
          {
            name: '时间',
            dataField: 'time',
            type: 'range-picker',
          },
          {
            name: '来源',
            dataField: 'problemResouce',
            type: 'select',
            keyExpr: 'id',
            valueExpr: 'text',
            dataSource: this.enum.reviewResouce
          },
          {
            name: '科室',
            dataField: 'deptId',
            type: 'tree-select',
            keyExpr: 'keyword',
            treeData: this.treeDatas
          },
          {
            name: '医生',
            dataField: 'personName',
            type: 'text',
          },

        ]
      },
      choose(){
        return { isshow: false, isextend: true }
      },
    },
    mounted() {
      if (this.$route.params.id || this.$route.params.drugCode){
        this.paramsData = this.$route.params;
        let dateRange = [];
        dateRange[0] = moment(this.$route.params.startDate,'YYYY-MM-DD')
        dateRange[1] = moment(this.$route.params.endDate,'YYYY-MM-DD');
        this.$refs.searchPanel.form.setFieldsValue({ time: dateRange })
      }
      this.getData();
      this.getTreeData()
    },
    methods: {
      getFormData() {
        let params = this.$refs.searchPanel.form.getFieldsValue()
        if (params.time) {
          params.startDate =  params.time[0].format('YYYY-MM-DD')
          params.endDate =  params.time[1].format('YYYY-MM-DD')
        }
        delete params.time;
        return params
      },
      //搜索
      search() {
        let params = this.getFormData()
        this.searchData =  this.getFormData()
        params.pageSize = this.pageSize
        params.offset = 0
        this.getData(params)
      },
      //重置
      resetForm() {
        this.searchData = {};
        this.paramsData = {};
        this.$refs.searchPanel.form.resetFields()
        this.getData({ pageSize: this.pageSize, offset: 0 })
      },
      getData(params = {}) {
        this.loading = true;
        if (this.paramsData.id){
          params.id =  this.paramsData.id;
        }else if (this.paramsData.drugCode) {
          params.drugCode =  this.paramsData.drugCode;
        }
        if (!params.startDate){
          params.startDate =  this.paramsData.startDate;
          params.endDate =  this.paramsData.endDate;
        }
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
      details(data) {
        if (data.problemResouce == '2') {
          this.$router.push({
            name: 'presHospitalizedDetail',
            params: { visId: data.visId, maxSubmitNo: data.submitNo, reviewId: data.reviewId, isNew: 0 }
          })
        } else if(data.problemResouce == '1'){
          let objData = {}
          objData = { visId: data.visId, submitNo: data.submitNo, isNew: 0 }
          window.localStorage.setItem('outpatientData', JSON.stringify(objData))
          this.$router.push({
            name: 'presOutpatientDetail',
          })
        }
      },
      ruleSelect(data){
        this.$router.push({
          name: 'ruleMgtCopyIndex',
          params: { id: data.id,startDate:this.startDate,endDate:this.endDate }
        })
      },

      getTreeData(){
        this.$axios({
          url: this.api.selectTreeData,
          method: 'put',
          data: {}
        })
          .then(res => {
            if (res.code == '200') {
              this.treeDatas = this.getDataChildren(res.rows, undefined)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      // 递归处理数据
      getDataChildren(bdata, pid) {
        var items = []
        for (var key in bdata) {
          var item = bdata[key]
          if (pid == item.parentId) {
            items.push({
              title: item.title,
              value: item.deptId,
              key: item.deptId,
              children: this.getDataChildren(bdata, item.deptId)
            })
          }
        }
        return items
      },

      //处方来源枚举
      reviewResouce(data) {
        let levelText
        this.enum.reviewResouce.forEach(item => {
          if (data.problemResouce == item.id) {
            levelText = item.text
            return
          }
        })
        return levelText
      },
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