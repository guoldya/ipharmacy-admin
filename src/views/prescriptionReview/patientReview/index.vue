<template>
  <div class="allContent">
    <a-card>
      <detail-list>
        <detail-list-item term="任务名称">
          <span class="renwu">{{database.name}}</span>
        </detail-list-item>
        <detail-list-item term="任务范围">
          <span class>{{getPlan(database.planScope)}}</span>
        </detail-list-item>
        <detail-list-item term="点评方案">
          <span class>{{database.planNames}}</span>
        </detail-list-item>
        <detail-list-item term="抽取规则">
          <span class>{{selcetRule(database.rule)}}</span>
        </detail-list-item>
        <detail-list-item term="处方时间" v-if="isid==1">
          <span
            class
          >{{changeTimes(database.filterStartTime)}}~{{changeTimes(database.filterEndTime)}}</span>
        </detail-list-item>
        <detail-list-item term="出院时间" v-else-if="isid==2">
          <span
            class
          >{{changeTimes(database.filterStartTime)}}~{{changeTimes(database.filterEndTime)}}</span>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-card class="margin-top-5">
      <Searchpanel ref="searchPanel" :list="list" :choose="choose">
        <div slot="control">
          <a-button type="primary" @click="search" style="margin-right: 5px" :disabled="show">查询</a-button>
          <a-button class @click="resetForm" style="margin-right: 10px" :disabled="show">重置</a-button>
        </div>
      </Searchpanel>
    </a-card>
    <a-card class="margin-top-5">
      <a-popconfirm
        v-if="buttonType == 'danger'"
        title="确定停止点评?"
        @confirm="magicRew"
        okText="确定"
        cancelText="取消"
      >
        <a-button class="margin-left-5" :type="buttonType">{{rewButoon}}</a-button>
      </a-popconfirm>
      <a-button v-else class="margin-left-5" @click="magicRew" :type="buttonType">{{rewButoon}}</a-button>
      <!-- <a-button :type="buttonType" @click="magicRew">{{rewButoon}}</a-button> -->
      <a-spin tip="加载中..." :spinning="loading" class="tables">
        <el-table
          ref="multipleTable"
          class="multipleEl"
          :data="dataSource"
          border
          style="width: 100%"
          highlight-current-row
        >
          <el-table-column
            :prop="item.prop"
            :label="item.title"
            :key="index"
            v-for="(item,index) in columns"
            :width="item.width"
            :align="item.align"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="item.prop == 'admitNum'">{{scope.row.admitNum}}</span>
              <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
              <!-- <span v-else-if="item.prop == 'action'">
                <a @click="looks(props.row)">点评</a>
                <a-divider type="vertical" />
                <a>查看</a>
              </span>-->
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="140" align="center" v-if="!show">
            <template slot-scope="props">
              <div>
                <a @click="looks(props.row)" v-if="props.row.status==1">点评</a>
                <a-divider type="vertical" v-if="props.row.status==1" />
                <a @click="looks(props.row)">查看</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
          hideOnSinglePage
          showSizeChanger
          showQuickJumper
          :total="total"
          class="pnstyle"
          v-model="current"
          :defaultPageSize="10"
          @showSizeChange="pageChangeSize"
          @change="pageChange"
          size="small"
        ></a-pagination>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem
  },
  name: 'index',
  data() {
    return {
      api: {
        getbase: 'sys/reviewInfo/selectReviewRecordDetail',
        selectform: 'sys/reviewFilter/selectReviewFilterPageByPersonId',
        selectTreeData: 'sys/sysDepts/selectDeptsTreeList',
        selectEason: 'sys/sysPersons/selectSysPersonsByOrgId',
        filter: 'sys/reviewProblem/automatedComments'
      },
      items: [{ text: '编辑', showtip: false, click: this.edits }],
      columns: [
        { title: '门诊号', prop: 'admitNum', width: 100 },
        { title: '处方日期', prop: 'prescDate', width: 160, format: this.changeTime },
        { title: '患者', prop: 'patientName', width: 120 },
        { title: '性别', prop: 'patientSex', width: 55, format: this.sexCheck },
        { title: '年龄', prop: 'patientAge', width: 55 },
        { title: '处方号', prop: 'prescNum', width: 100 },
        { title: '科室', prop: 'prescDeptName' },
        { title: '医生', prop: 'prescDocName', width: 100 },
        { title: '点评结果', prop: 'status', align: 'center', format: this.statusGrade, width: 120 }
        // { title: '操作', prop: 'action', align: 'left' }
      ],
      loading: false,
      total: 2,
      current: 1,
      dataSource: [],
      id: 1,
      database: {},
      isid: 1,
      show: false,
      treeDatas: [],
      EasonData: [],
      paintlist: {
        admit: '门诊号',
        time: '处方时间'
      },
      rewButoon: '自动点评',
      // buttonType:'danger'
      buttonType: 'primary',
      timeInitialize: null,
      buttonText: '自动点评',
      alldatasouce: []
    }
  },
  computed: {
    choose() {
      return { isshow: false, isextend: true }
    },
    list() {
      return [
        {
          name: '点评结果',
          dataField: 'status',
          type: 'select',
          dataSource: this.enum.Statuslist,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: this.paintlist.admit,
          dataField: 'admitNum',
          type: 'text'
        },
        {
          name: this.paintlist.time,
          dataField: 'prescDate',
          type: 'range-picker'
        },
        {
          name: '医生',
          dataField: 'prescDocId',
          type: 'select',
          keyExpr: 'personId',
          valueExpr: 'name',
          dataSource: this.EasonData
        },
        {
          name: '科室',
          dataField: 'prescDeptId',
          type: 'tree-select',
          keyExpr: 'keyword',
          treeData: this.treeDatas
        },
        {
          name: '患者',
          dataField: 'patientName',
          type: 'text'
        }
      ]
    }
  },

  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      if (this.id == 2) {
      }
    }
  },

  mounted() {
    this.getformData()
    this.getTreeseldata()
    this.selectEasonData()
  },
  destroyed() {
    clearInterval(this.timeInitialize)
    this.timeInitialize = null
  },
  methods: {
    // 定时器
    setTimeRval(data) {
      let num = 0
      this.timeInitialize = setInterval(() => {
        ++num
        this.getformData({status: 1,pageSize: this.pageChangeSize, offset: 0})
        this.rewRange(num)
      }, data)
    },
    // 点评频率
    rewRange(val) {
      let params = { offset: val * 10, pageChangeSize: this.pageChangeSize }
      this.$axios({
        url: this.api.selectform,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.alldatasouce = res.rows
            let arr = []
            this.alldatasouce.filter(item => {
              if (item.status == 1) {
                arr.push(item.filterId)
              }
            })
            this.$axios({
              url: this.api.filter,
              method: 'post',
              data: arr
            })
              .then(res => {
                if (res.code == '200') {
                } else {
                  this.warn(res.msg)
                }
              })
              .catch(err => {
                this.error(err)
              })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 自动点评
    magicRew() {
      if (this.rewButoon == '自动点评') {
        // this.rewButoon = '停止点评'
        // this.buttonType = 'danger'
        // this.show = true
        // console.log('444')
        this.setTimeRval(10000)
        let arr = []
        this.dataSource.filter(item => {
          if (item.status == 1) {
            arr.push(item.filterId)
          }
        })
        this.$axios({
          url: this.api.filter,
          method: 'post',
          data: arr
        })
          .then(res => {
            if (res.code == '200') {
              this.rewButoon = '停止点评'
              this.buttonType = 'danger'
              this.show = true
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
      if (this.rewButoon == '停止点评') {
        this.buttonType = 'primary'
        this.show = false
        this.rewButoon = '自动点评'
        clearInterval(this.timeInitialize)
        this.timeInitialize = null
      }
    },
    // 表单数据
    getformData(params = { pageSize: 10, offset: 0 }) {
      this.loading = true
      this.$axios({
        url: this.api.selectform,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.loading = false
            this.dataSource = res.rows
            if (this.dataSource && this.dataSource.length) {
              this.total = res.total
              let param = { pageSize: this.total, offset: 0 }
              this.isid = this.dataSource[0].planScope
              if (this.dataSource[0].planScope == 2) {
                this.columns = [
                  { title: '住院号', prop: 'admitNum', width: 100 },
                  { title: '出院日期', prop: 'prescDate', width: 160, format: this.changeTime },
                  { title: '患者', prop: 'patientName', width: 120 },
                  { title: '性别', prop: 'patientSex', width: 55, format: this.sexCheck },
                  { title: '年龄', prop: 'patientAge', width: 55 },
                  { title: '开嘱科室', prop: 'prescDeptName', width: 80 },
                  { title: '开嘱医师', prop: 'prescDocName', width: 100 },
                  { title: '点评结果', prop: 'status', align: 'left', format: this.statusGrade }
                ]
                this.paintlist.admit = '住院号'
                this.paintlist.time = '出院日期'
              }

              if (this.dataSource && this.dataSource.length) {
                let params = { recordId: this.dataSource[0].recordId }
                this.$axios({
                  url: this.api.getbase,
                  method: 'put',
                  data: params
                })
                  .then(res => {
                    if (res.code == '200') {
                      this.database = res.data
                    } else {
                      this.warn(res.msg)
                    }
                  })
                  .catch(err => {
                    this.error(err)
                  })
              }
            }
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 搜索数据
    // search() {
    //   let params = this.$refs.searchPanel.form.getFieldsValue()
    //   params.pageSize = 10
    //   params.offset = 0
    //   this.getformData(params)
    // },
    getFormData() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
      if (params.prescDate) {
        params.prescDate = [params.prescDate[0].format('YYYY-MM-DD'), params.prescDate[1].format('YYYY-MM-DD')]
      }
      return params
    },
    search() {
      this.current = 1
      let params = this.getFormData()
      params.pageSize = 10
      params.offset = 0
      this.getformData(params)
    },
    // 重置数据
    resetForm() {
      this.$refs.searchPanel.form.resetFields()
      this.getformData({ pageSize: 10, offset: 0 })
    },
    // 改变页码
    pageChange(page, pageSize) {
      this.curent = page
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getformData(params)
    },
    pageChangeSize(page, pageSize) {
      this.pageSize = pageSize
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getformData(params)
    },
    // 处理时间
    dealtime() {},
    // 处理性别
    dealsex() {},
    //详情
    looks(data) {
      let objData = {
        filterId: data.filterId,
        submitNo: data.submitNo,
        visId: data.visId,
        planScope: data.planScope,
        status: data.status,
        prescDate: data.prescDate,
        prescDocName: data.prescDocName
      }
      sessionStorage.setItem('patinRew', JSON.stringify(objData))
      let obj = { visId: data.visId, maxSubmitNo: !!data.submitNo ? data.submitNo : '2' }
      console.log(obj)
      this.$router.push({
        name: 'patientReviewDetail',
        params: obj
      })
    },
    // 获取医生
    selectEasonData(params = {}) {
      this.$axios({
        url: this.api.selectEason,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.EasonData = res.rows
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
    // 科室树形结构
    getTreeseldata(params = {}) {
      this.$axios({
        url: this.api.selectTreeData,
        method: 'put',
        data: params
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
    //过滤时间
    changeTime(time) {
      if (time) {
        return time.prescDate.replace(/(:\d{2})$/, '')
      }
    },
    // 过滤性别
    sexCheck(data) {
      let num = +data.patientSex
      return this.enum.sexLIST[num]
    },
    // 过滤状态
    statusGrade(data) {
      let num = Number(data.status) - 1
      return this.enum.completeStatus[num]
    },
    // 过滤时间
    changeTimes(time) {
      if (time) {
        return time.replace(/(\d{2}:\d{2}:\d{2})$/, '')
      }
    },
    getPlan(data) {
      if (data && data.length) {
        return data == 1 ? '门诊' : '住院'
      }
    },
    selcetRule(data) {
      if (data && data.length) {
        return data == 1 ? '随机' : '比例'
      }
    },
    checkSeclec() {}
  }
}
</script>

<style  lang='less'>
.userModel-p {
  text-align: center;
}
.allContent {
  .ant-card-bordered {
    border: 0px;
  }
  .ant-card-body {
    padding: 8px 32px;
  }
  .tables {
    margin-top: 15px;
  }
  .ant-col-xxl-6 {
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 33%;
    height: 35px;
  }
  .renwu {
    font-size: 18px;
    font-weight: bold;
    height: 20px;
    color: black;
  }
  //   .el-table__body-wrapper::-webkit-scrollbar {
  //     width: 10px; // 横向滚动条
  //     height: 15px; // 纵向滚动条 必写
  //   }
  // .el-table__body-wrapper::-webkit-scrollbar-thumb {
  //     background-color: #cccc;
  //    border-radius: 3px;
  //   }
}
</style>