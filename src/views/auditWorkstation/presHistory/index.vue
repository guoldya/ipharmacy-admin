<template>
  <a-card>
    <Searchpanel ref="searchPanel" :list="list">
      <div slot="control">
        <a-button type="primary" @click="search">查询</a-button>
        <a-button class="margin-left-5" @click="resetForm">重置</a-button>
      </div>
    </Searchpanel>
    <a-spin :spinning="loading" tip="加载中...">
      <el-table class="margin-top-10" :data="dataSource" border :highlight-current-row="true">
        <el-table-column
          v-for="item in columns"
          :show-overflow-tooltip="true"
          :key="item.dataIndex"
          :label="item.title"
          :prop="item.dataIndex"
          :width="item.width"
          :align="item.align"
        >
          <template slot-scope="props">
            <span v-if="item.dataIndex == 'auditLevel'">
              <span
                v-for="(op,index) in props.row.problemScheduleVOList"
                class="problemRow"
                :key="index"
                style="white-space: nowrap"
              >
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    <span>{{op.verdictTypeTitle }}</span>
                  </template>
                  <a-tag
                    :color="op.levelColor"
                    style="cursor: default; white-space:nowrap; "
                  >{{op.levelName}}</a-tag>
                </a-tooltip>
              </span>
            </span>
            <span v-else-if="item.dataIndex == 'action'">
              <a @click="checkReviewResouce(props.row)">查看</a>
            </span>
            <span v-else-if="item.dataIndex == 'subTime'" v-html="timeFormat(props.row.subTime)"></span>
            <span
              v-else-if="item.dataIndex == 'reviewTime'"
              v-html="timeFormat(props.row.reviewTime)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'patientSex'"
              v-html="patientSexFormatter(props.row.patientSex)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'auditType'"
              v-html="auditTypeFormatter(props.row.auditType)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'reviewResouce'"
              v-html="reviewResouce(props.row.reviewResouce)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'reviewVerdict'"
              v-html="reviewVerdictFormatter(props.row.reviewVerdict)"
            ></span>
            <span
              v-else-if="item.dataIndex == 'passType'"
              v-html="passTypeFormatter(props.row.passType)"
            ></span>
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
      ></a-pagination>
    </a-spin>
  </a-card>
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
        selectRevisionHistory: 'sys/reviewOrderissue/selectRevisionHistory',
        selectTribunalRecordDetail: 'sys/reviewOrderissue/selectTribunalRecordDetail'
      },
      tabsData: {},
      loading: false,
      total: 10,
      curent: 1,
      pageSize: 20,
      visible: false,
      confirmLoading: false,
      //穿梭狂数据
      targetKeys: [],
      mockData: [],
      columns: [
        { title: '来源', dataIndex: 'reviewResouce', align: 'center', width: 90 },
        { title: '科室', dataIndex: 'adminDeptTitle' },
        { title: '住院/门诊号', dataIndex: 'adminNum', align: 'right', width: 130 },
        { title: '患者', dataIndex: 'patientName', width: 90 },
        { title: '性别', dataIndex: 'patientSex', align: 'center', width: 100 },
        { title: '年龄', dataIndex: 'patientAge', width: 90 },
        { title: '医生', dataIndex: 'subDocName', width: 90 },
        { title: '提交时间', dataIndex: 'subTime', width: 150 },
        { title: '问题等级', dataIndex: 'auditLevel', width: 150 },
        { title: '结论', dataIndex: 'reviewVerdict', align: 'center', width: 100 },
        { title: '通过类型', dataIndex: 'passType', align: 'center' },
        { title: '审核人', dataIndex: 'reviewDocName', width: 100 },
        { title: '审核时间', dataIndex: 'reviewTime', width: 150 },
        { title: '操作', dataIndex: 'action', width: 90, align: 'center' }
      ],
      levelColor: '#ffffff',
      dataSource: [],
      dateFormat: 'YYYY-MM-DD HH:mm',
      dateList: [],
      checkReSorce: [],
      visIdList: '',
      subNoList: '',
      searchDate: []
    }
  },
  computed: {
    list() {
      return [
        {
          name: '审核时间',
          dataField: 'searchDate',
          type: 'range-picker-detail'
        },
        {
          name: '来源',
          dataField: 'reviewResouce',
          type: 'select',
          dataSource: this.enum.reviewResouce,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '通过类型',
          dataField: 'passType',
          type: 'select',
          dataSource: this.enum.passType,
          keyExpr: 'id',
          valueExpr: 'text'
        },
        {
          name: '问题等级',
          dataField: 'auditLevel',
          type: 'select',
          dataSource: this.enum.patientProblem,
          keyExpr: 'value',
          valueExpr: 'text'
        },
        {
          name: '结论',
          dataField: 'reviewVerdict',
          type: 'select',
          dataSource: this.enum.reviewVerdict,
          keyExpr: 'id',
          valueExpr: 'text'
        }
      ]
    }
  },
  mounted() {
    this.$refs.searchPanel.form.setFieldsValue({ searchDate: this.SetDayDate() })
    this.getData({   pageSize: this.pageSize,searchDate: this.dateList })
    //this.checkLeve()
  },
  methods: {
    //得到本月一号为开始时间，得到当前时间为结束时间
    SetDayDate() {
      //当前时间
      var dataValue = new Date(new Date().getTime() + 1000 * 60 * 60)
      //（1000*60*60*24）是1千毫秒（是1秒）乘60（是1分）乘60（是1小时）*24（是一天）加减一天把前边的-+换一下就行。
      var year = dataValue.getFullYear()
      var month = dataValue.getMonth() + 1
      var day = dataValue.getDate()
      var hours = dataValue.getHours() - 1 //小时
      var mines = dataValue.getMinutes() //分
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        if (day < 1) {
          day = '01'
        } else {
          day = '0' + day
        }
      }
      this.dateList = [
        year + '-' + month + '-' + '01' + ' ' + hours + ':' + mines,
        year + '-' + month + '-' + day + ' ' + hours + ':' + mines
      ]
      var stime = moment(year + '-' + month + '-' + '01' + ' ' + hours + ':' + mines, this.dateFormat) //开始时间
      var etime = moment(year + '-' + month + '-' + day + ' ' + hours + ':' + mines, this.dateFormat) //结束时间
      var pars = [stime, etime]
      return pars
    },
    //搜索获取
    getFormData() {
      let params = this.$refs.searchPanel.form.getFieldsValue()
      console.log(params)
      if (params.searchDate) {
        params.searchDate = [
          params.searchDate[0].format('YYYY-MM-DD HH:mm'),
          params.searchDate[1].format('YYYY-MM-DD HH:mm')
        ]
      }
      return params
    },
    // 重置的搜索获取
    //搜索
    search() {
      let params = this.getFormData()
      this.dateList = params.searchDate
      this.getData(params)
    },
    //重置
    resetForm() {
      this.$refs.searchPanel.form.resetFields(['reviewResouce', 'passType', 'auditLevel', 'reviewVerdict', []])
      let params = this.getFormData()
      this.dateList = params.searchDate
      this.getData(params)
    },
    getData(params = { pageSize: 10, offset: 0 }) {
      this.loading = true
      this.$axios({
        url: this.api.selectRevisionHistory,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.dataSource = res.rows
            let arr = this.dataSource
            let newArr = arr.forEach(item => {
              item.problemScheduleVOList = this.checkSort(item.problemScheduleVOList)    
            })
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
       let params = this.$refs.searchPanel.form.getFieldsValue(['searchDate',[]])
      if (params.searchDate) {
        params.searchDate = [
          params.searchDate[0].format('YYYY-MM-DD HH:mm'),
          params.searchDate[1].format('YYYY-MM-DD HH:mm')
        ]
      }
      
      this.getData({ offset: (page - 1) * pageSize/2, pageSize: this.pageSize, searchDate:  params.searchDate })
    },
    pageChangeSize(page, pageSize) {
      this.pageSize=pageSize
       let params = this.$refs.searchPanel.form.getFieldsValue(['searchDate',[]])
      if (params.searchDate) {
        params.searchDate = [
          params.searchDate[0].format('YYYY-MM-DD HH:mm'),
          params.searchDate[1].format('YYYY-MM-DD HH:mm')
        ]
      }
      this.getData({ offset: (page - 1) * pageSize/2, pageSize: pageSize, searchDate:  params.searchDate })
    },
    timeFormat(data) {
      if (data != null) {
        var crtTime = new Date(data)
        return this.dateFtt('yyyy-MM-dd hh:mm', crtTime) //直接调用公共JS里面的时间类处理的办法
      }
      return ''
    },
    dateFtt(fmt, date) {
      //author: meizz
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    },
    //枚举审方类型
    auditTypeFormatter(data) {
      let levelText
      this.enum.auditType.forEach(item => {
        if (data == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    //枚举审方结论
    reviewVerdictFormatter(data) {
      let levelText
      this.enum.reviewVerdict.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    //枚举通过类型
    passTypeFormatter(data) {
      let levelText
      this.enum.passType.forEach(item => {
        if (data == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    reviewVerdictFormatter(data) {
      let levelText
      this.enum.reviewVerdict.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    //性别枚举
    patientSexFormatter(data) {
      let levelText
      this.enum.sex.forEach(item => {
        if (data == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    //处方来源枚举
    reviewResouce(data) {
      let levelText
      this.enum.reviewResouce.forEach(item => {
        if (data == item.id) {
          levelText = item.text
          return
        }
      })
      return levelText
    },
    checkReviewResouce(data) {
    
       if (data.reviewResouce == '2') {
       this.$router.push({
        name: 'presHospitalizedDetail',
        query: { visId: data.visId, maxSubmitNo: data.subNo }
      })
      }
      
       this.$router.push({
          name: 'presOutpatientDetail',
          params: { visId: data.visId, submitNo: data.subNo}
        })
      console.log(data)
    },
    // 判断等级高低
    checkSort(arr) {
      if (arr) {
        arr.sort((b, a) => {
          return a.auditLevel - b.auditLevel
        })
        return arr
      }
    }
  }
}
</script>

<style scoped>
</style>