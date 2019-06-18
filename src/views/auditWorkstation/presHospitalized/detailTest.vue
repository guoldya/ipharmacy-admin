<template>
  <a-Row class="testchk">
              <a-Col :span="8">
                <el-table @row-click="checkclick" class :data="testDatas" highlight-current-row>
                  <el-table-column
                    :prop="item.prop"
                    :label="item.title"
                    :key="index"
                    v-for="(item,index) in columnscheck"
                    :width="item.width"
                    :align="item.align"
                    :formatter="item.formatter"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="props">
                      <span v-if="item.prop == 'dateReportStr'">
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{props.row.dateReportStr}}</span>
                          </template>
                          <span>{{timeFormat(props.row.dateReportStr)}}</span>
                        </a-tooltip>
                      </span>

                      <span
                        v-else-if="item.prop == 'resultStatus'"
                      >{{props.row.resultStatus}}</span>
                      <span v-else>{{props.row[item.prop]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div></div>
              </a-Col>

              <a-Col :span="16" class="details">
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
                    <a-col :span="12">
                      标本号：
                      <span class="font-bold">{{testsDeltopdata.specimenNo}}</span>
                    </a-col>
                  </a-row>
                  <a-row class="dealRow">
                    <el-table
                      class="margin-top-10"
                      :data="testsDeldata"
                      highlight-current-row
                    >
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
                            />
                            <a-icon
                              v-else-if="props.row.resultSignEng==1"
                              type="arrow-up"
                              class="jiantou"
                            />
                            <a v-else-if="props.row.resultSignEng==2">（异常)</a>
                          </span>
                          <span v-else>{{props.row[item.prop]}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </a-row>
                </div>
              </a-Col>
            </a-Row>
</template>
<script>
export default {
  data() {
    return {
      api: {
        selectTestVisId: 'sys/reviewOrderissue/selectClinicTestListByVisId',
        selectTestVisIdDel: 'sys/reviewOrderissue/selectClinicTestDetailByTestId',
        loading: false
      },
      columnscheck: [
        { title: '类型', prop: 'testType', width: 60, align: 'left' },
        { title: '报告时间', prop: 'dateReportStr', width: 95, align: 'left' },
        { title: '检查项目', prop: 'itemName' }
      ],
       columnscheckdtl: [
        { title: '代码', prop: 'itemCode', width: 100, align: 'left' },
        { title: '化验项目', prop: 'itemName', width: 130, align: 'left' },
        { title: '结果', prop: 'resultDesc' },
        { title: '单位', prop: 'unit', width: 100, align: 'left' },
        { title: '参考值', prop: 'limitValue', width: 100, align: 'left' }
      ],
      testDatas:[],
      testsDeltopdata:[],
      testsDeldata: [],
    }
  },
  mounted() {
      this.gettestData({ visid: '1' })
  },
  methods: {
    // 点击详情功能
    checkclick(data) {
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
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
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
}
.details {
  padding: 10px;
  display: flex;
  flex-direction: row;
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
</style>


    

