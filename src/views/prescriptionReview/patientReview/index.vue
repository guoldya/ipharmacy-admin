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
          <span class>{{database.filterStartTime}}~{{database.filterEndTime}}</span>
        </detail-list-item>
        <detail-list-item term="出院时间" v-else-if="isid==2">
          <span class>{{database.filterStartTime}}~{{database.filterEndTime}}</span>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-card class="margin-top-5">
      <Searchpanel ref="searchPanel" :list="list" :choose="choose">
        <div slot="control">
          <a-button type="primary" @click="search" style="margin-right: 5px">查询</a-button>
          <a-button class @click="resetForm" style="margin-right: 10px">重置</a-button>
        </div>
      </Searchpanel>
    </a-card>
    <a-card class="margin-top-5">
      <a-button type="primary">自动点评</a-button>
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
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="140" align="center">
            <template slot-scope="props">
              <a @click="looks(props.row)">点评</a>
              <a-divider type="vertical" />
               <a>查看</a>
            </template>
          </el-table-column>
        </el-table>
        <a-pagination
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
            selectEason: 'sys/sysPersons/selectSysPersonsByOrgId'
      },
      items: [
        { text: '编辑', showtip: false, click: this.edits },
        { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
        { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.user, status: '0' }
      ],
      columns: [
        { title: '门诊号', prop: 'admitNum', width: 100 },
        { title: '处方日期', prop: 'prescDate', width: 160, format: this.changeTime },
        { title: '患者', prop: 'patientName', width: 120 },
        { title: '性别', prop: 'patientSex', width: 55, format: this.sexCheck },
        { title: '年龄', prop: 'patientAge', width: 55 },
        { title: '处方号', prop: 'prescNum', width: 80 },
        { title: '科室', prop: 'prescDeptName', width: 120 },
        { title: '医生', prop: 'prescDocName', width: 100 },
        { title: '点评结果', prop: 'status', align: 'left', format: this.statusGrade }
      ],
      loading: false,
      total: 2,
      current: 1,
      dataSource: [],
      id: 1,
      database: {},
      isid:1,
      treeDatas:[],
      EasonData:[]
    }
  },
  computed: {
    choose() {
      return { isshow: false, isextend: true }
    },
     list() {
      return[
        {
            name: '点评结果',
            dataField: 'status',
            type: 'select',
            dataSource: this.enum.Statuslist,
            keyExpr: 'id',
            valueExpr: 'text'
          },
        {
          name: '门诊号',
          dataField: 'admitNum',
          type: 'text'
        },
        {
          name: '处方时间',
          dataField: 'prescDate',
          type: 'text'
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
        name: '开嘱科室',
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
  methods: {
    // 表单数据
    getformData(params = { pageSize: 10, offset: 0 }) {
      this.$axios({
        url: this.api.selectform,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {  
            this.dataSource = res.rows
            if(this.dataSource&&this.dataSource.length){
             this.total = res.total
            this.isid=this.dataSource[0].planScope
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
              this.list = [
                {
                  name: '点评结果',
                  dataField: 'status',
                  type: 'select',
                  dataSource: this.enum.Statuslist,
                  keyExpr: 'id',
                  valueExpr: 'text'
                },
                {
                  name: '结论',
                  dataField: 'reviewVerdict',
                  type: 'select',
                  dataSource: this.enum.reviewVerdict,
                  keyExpr: 'id',
                  valueExpr: 'text'
                },
                {
                  name: '住院号',
                  dataField: 'icdName',
                  type: 'text'
                },
                {
                  name: '出院时间',
                  dataField: 'icdName',
                  type: 'text'
                },
                {
                  name: '医生',
                  dataField: 'icdName',
                  type: 'text'
                },
                {
                  name: '科室',
                  dataField: 'icdName',
                  type: 'text'
                },
                {
                  name: '患者',
                  dataField: 'icdName',
                  type: 'text'
                }
              ]
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
    search() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
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
      this.curent=page
      let params = this.$refs.searchPanel.form.getFieldsValue()
      params.offset = (page - 1) * pageSize
      params.pageSize = pageSize
      this.getformData(params)
    },
    pageChangeSize(page, pageSize) {
      this.pageSize=pageSize
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
       console.log(data)
          let objData = { filterId: data.filterId, submitNo: data.submitNo, visId: data.visId,planScope:data.planScope }
         sessionStorage.setItem('patinRew', JSON.stringify(objData))
      this.$router.push({
        name: 'patientReviewDetail',
        params: { visId: 95488, maxSubmitNo: 1, reviewId: 555, isNew: 1 }
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
    getPlan(data) {
      if (data && data.length) {
        return data == 1 ? '门诊' : '住院'
      }
    },
    selcetRule(data) {
      if (data && data.length) {
        return data == 1 ? '随机' : '比例'
      }
    }
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