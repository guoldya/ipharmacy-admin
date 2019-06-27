<template>
<div>
 <div v-if="testDatas.length>0">
  <a-Row class="testchk">
    <a-Col :span="6">
      <el-table
        @row-click="checkclick"
        class
        :data="testDatas"
        highlight-current-row
        :show-header="false"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.title"
          :key="index"
          v-for="(item,index) in columnscheck"
          :width="item.width"
          :align="item.align"
          :formatter="item.formatter"
        >
          <template slot-scope="props">
            <span v-if="item.prop == 'itemName'" class="tableLineHeight">
              <div class="pageone">
                <span>{{props.row.itemName}}</span>
                <span v-if="props.row.quesNum>0">
                  <a-tag color="red" :key="index">{{props.row.quesNum}}</a-tag>
                </span>
              </div>
              <div class="pagetwo">
                <a-tag style="cursor: default;" :key="index">{{props.row.testType}}</a-tag>
                <span>{{props.row.dateReportStr}}</span>
              </div>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </a-Col>

    <a-Col :span="18" class="details">
      <div class="borders"></div>
      <div class="contents">
        <a-row>
          <a-col :span="12">
            日期：
            <span class="font-bold">{{testsDeltopdata.dateReportStr}}</span>
          </a-col>
          <a-col :span="12">
            条码号：
            <span class="font-bold">{{testsDeltopdata.reportNo}}</span>
          </a-col>
        </a-row>
        <a-row class="dealRowchild">
          <a-col :span="12">
            类型：
            <span class="font-bold">{{testsDeltopdata.sampleType}}</span>
          </a-col>
          <a-col :span="8">
            标本号：
            <span class="font-bold">{{testsDeltopdata.specimenNo}}</span>
          </a-col>
          <a-col :span="4">
            <a-checkbox @change="onChangeNormal" :checked="checkes">显示异常</a-checkbox>
          </a-col>
        </a-row>
        <a-row class="dealRow">
          <div >
            <el-table class="margin-top-10" :data="testsDeldata" highlight-current-row>
              <el-table-column
                :prop="item.prop"
                :label="item.title"
                :key="index"
                v-for="(item,index) in columnscheckdtl"
                :width="item.width"
                :align="item.align"
                :formatter="item.formatter"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="props">
                  <span
                    class="grades"
                    v-if="item.prop == 'resultDesc'&&props.row.resultDesc&&(Number(props.row.resultSign)>=2||Number(props.row.resultSign)==1)"
                  >
                    <a-tag :color="getcolor(props.row.resultSign)">{{props.row.resultDesc}}</a-tag>
                    <!-- <p class="jiantou">{{props.row.resultSignEng}}</p> -->
                    <a-icon
                      v-if="props.row.resultSignEng==0"
                      type="arrow-down"
                      class="jiantou"
                      style="color:#1890ff"
                    />
                    <a-icon
                      v-else-if="props.row.resultSignEng==1"
                      type="arrow-up"
                      class="jiantou"
                      style="color:#f5222d"
                    />
                    <a v-else-if="props.row.resultSignEng==2">（异常)</a>
                  </span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </a-row>
      </div>
    </a-Col>
  </a-Row>
  </div>
<div v-else-if="testDatas.length==0" class="zwsjs">暂无数据</div>
</div>
</template>
<script>
export default {
  props: {
    visidId: {
      type: String
    }
  },
  data() {
    return {
      api: {
        selectTestVisId: 'sys/reviewOrderissue/selectClinicTestListByVisId',
        selectTestVisIdDel: 'sys/reviewOrderissue/selectClinicTestDetailByTestId',
        loading: false
      },
      columnscheck: [
        // { title: '报告时间', prop: 'dateReportStr', width: 95, align: 'left' },
        { title: '检查项目', prop: 'itemName' }
      ],
      columnscheckdtl: [
        { title: '代码', prop: 'itemCode', width: 100, align: 'left' },
        { title: '化验项目', prop: 'itemName', align: 'left' },
        { title: '结果', prop: 'resultDesc', width: 130 },
        { title: '单位', prop: 'unit', width: 100, align: 'left' },
        { title: '参考值', prop: 'limitValue', width: 100, align: 'left' }
      ],
      testDatas: [],
      testsDeltopdata: [],
      testsDeldata: [],
      checkes: false,
      storeArr: []
    }
  },
  mounted() {
    this.gettestData({ visid: this.visidId })
  },
  methods: {
    // 点击详情功能
    checkclick(data) {
      this.checkes = false
      let params = { testId: data.testId }
      this.$axios({
        url: this.api.selectTestVisIdDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.testsDeldata = res.data.clinicTestreportList
            this.testsDeltopdata = res.data
            this.copytestsDeldata = res.data.clinicTestreportList
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 获取初始详情
    getBeginData(data) {
      if (data) {
        let params = { testId: data.testId }
        this.$axios({
          url: this.api.selectTestVisIdDel,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.testsDeldata = res.data.clinicTestreportList
              this.testsDeltopdata = res.data
              this.copytestsDeldata = res.data.clinicTestreportList
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
    },
    // 获取检验数据
    gettestData(params = {}) {
      this.loading = true
      this.$axios({
        url: this.api.selectTestVisId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.testDatas = res.rows
            this.testid = res.rows[0].testId
            this.getBeginData(res.rows[0])
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
          this.loading = false
        })
    },
    // 时间格式处理
    timeFormat(data) {
      let times = data.slice(5, 20)
      return times
    },
    // 判断颜色
    getcolor(data) {
      if (data == '1') {
        return ''
      } else if (data == '2') {
        return 'blue'
      } else if (Number(data) !== 1 && Number(data) !== 2) {
        return 'red'
      }
    },
    // 选择是否是异常状态
    onChangeNormal(e) {
      this.checkes = !this.checkes
      if (e.target.checked) {
        this.testsDeldata = this.testsDeldata.filter(item => {
          return item.resultSign >= 1
        })
      } else {
        this.testsDeldata = this.copytestsDeldata
      }
    }
  }
}
</script>
<style lang='less'>
.testchk {
  .el-table th {
    background-color: white !important;
  }
  .ant-card-body {
    padding: 2px 2px;
  }
  .ant-col-6 {
    margin-top: 10px;
  }
}
.details {
  padding: 10px;
  display: flex;
  flex-direction: row;
  .ant-checkbox-wrapper {
    float: right;
  }
}
.borders {
  width: 0;
  border-right: 1px solid #ebeef5;
}
.contents {
  margin-left: 12px;
  width: 99%;
}
.dealRowchild {
  margin-top: 8px;
}
.dealRow {
  //margin-top: 5px;
  margin-bottom: 20px;
  font-size: 14px;
}

.dealRow .dealCol {
  line-height: 25px;
}

.dealRow .sizeWeight {
  font-size: 16px;
  font-weight: bold;
}
.jiantou {
  margin-bottom: 0em;
  font-weight: bold;
  font-size: 20px;
}
.tableLineHeight {
  line-height: 14px;
  .tag {
    display: inline-block;
  }
  .pageone {
    margin-top: 9px;
    span {
      padding-left: 3px;
      line-height: 20px;
    }
  }
  .pagetwo {
    margin-top: 5px;
    margin-bottom: 8px;
    opacity: 0.8;
  }
  .pageone {
    .ant-badge {
      margin-top: -7px !important;
    }
  }
  .ant-pro-footer-toolbar {
    z-index: 9999;
  }
}
.zwsjs{
 text-align: center;
    margin-top: 25px;
    font-size: 14px;
    color: #909399;
}
</style>


    

