<template>
  <a-Row class="text-reprot">
              <a-Col :span="8">
                <el-table @row-click="clickrow" class="width-100" :data="inspectionData">
                  <el-table-column
                    :prop="item.prop"
                    :label="item.title"
                    :key="index"
                    v-for="(item,index) in columnsa"
                    :width="item.width"
                    :align="item.align"
                    :formatter="item.formatter"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="props">
                      <span
                        v-if="item.prop == 'resultStatus'"
                      >{{resultStatusformatter(props.row.resultStatus)}}</span>
                      <span v-else-if="item.prop == 'reportDateStr'">
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{props.row.reportDateStr}}</span>
                          </template>
                          <span>{{timeFormat(props.row.reportDateStr)}}</span>
                        </a-tooltip>
                      </span>
                      <span v-else>{{props.row[item.prop]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </a-Col>
              <a-Col :span="15" class="detail">
                <div class="border"></div>
                <div class="jiancha">
                  <div class="boxone">
                    <p>
                      <span>检查号：</span>
                      {{formData.reportNo}}
                    </p>
                    <p>
                      <span>检查科室：</span>
                      {{formData.deptName}}
                    </p>
                  </div>
                  <a-divider/>
                  <div class="boxtwo">
                    <h3>检查所见：</h3>
                    <p class="checks">{{formData.objectiveSeen}}</p>
                    <h3>建议：</h3>
                    <p>{{formData.subjectivePrompt}}</p>
                  </div>
                  <a-divider/>
                  <div class="boxthree">
                    <p>
                      <span>报告人姓名：</span>
                      {{formData.docName}}
                    </p>
                    <p>
                      <span>报告日期：</span>
                      {{formData.checkDate}}
                    </p>
                  </div>
                  <a-divider/>
                </div>
              </a-Col>
            </a-Row>
</template>
<script>
export default {
  data() {
    return {
      api: {
         selectVisId: 'sys/reviewOrderissue/selectClinicExamListWithVisId',
        selectExamId: 'sys/reviewOrderissue/selectClinicExamReportDetailByExamId',
        loading: false
      },
     columnsa: [
        { title: '报告时间', prop: 'reportDateStr', width: 95, align: 'left' },
        { title: '检查项目', prop: 'itemName' }
      ],
      
     inspectionData: [],
     formData: [],
     num:'',
    }
  },
  mounted() {
      this.getdata({ visid: '1' })
  },
  methods: {
    // 点击详情功能
    clickrow(data) {
      let params = { examId: data.examId }
      this.$axios({
        url: this.api.selectExamId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.formData = res.data
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 初始选中一个
    selectdata(data) {
      let params = { examId: data.examId }
      this.$axios({
        url: this.api.selectExamId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.formData = res.data
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
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
     // 获取检查数据
    getdata(params = {}) {
      this.loading = true
      this.$axios({
        url: this.api.selectVisId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.inspectionData = res.rows
            this.num = res.rows[0].examId
            this.selectdata(res.rows[0])
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
     // 枚举
    resultStatusformatter(data) {
      let levelText
      this.enum.resultStatus.forEach(item => {
        if (Number(data) == item.id) {
          levelText = item.text
        }
      })
      return levelText
    },
  }
}
</script>
<style lang="less">
.text-reprot {
  .el-table th {
    background-color: white !important;
  }
}
.detail {
  display: flex;
  flex-direction: row;
  padding: 10px;
  box-shadow: 10px 10px 5px #ffff;
  h3 {
    font-weight: 800;
  }
  .boxone {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    span {
      font-weight: 800;
    }
  }
  .boxthree {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    span {
      font-weight: 800;
    }
    p:nth-child(1) {
      margin-right: 90px;
    }
  }
  .checks {
    text-indent: 2em;
  }
  .grades {
    display: flex;
    flex-direction: row;
  }
  
}
</style>

    

