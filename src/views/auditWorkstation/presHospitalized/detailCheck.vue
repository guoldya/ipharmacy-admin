<template>
  <div>
    <div v-if="inspectionData.length>0">
      <a-Row class="text-reprot">
        <a-Col :span="6">
          <el-table
            @row-click="clickrow"
            class="width-100"
            :data="inspectionData"
            :show-header="false"
          >
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
                <span v-if="item.prop == 'itemName'" class="tableLineHeights">
                  <p class="pageone">{{props.row.itemName}}</p>
                  <p class="pagetwo">{{props.row.reportDateStr}}</p>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </a-Col>
        <a-Col :span="18" class="detail">
          <!-- <div v-if="obj>0"> -->
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
            <a-divider />
            <div class="boxtwo">
              <h3>检查所见：</h3>
              <p class="checks">{{formData.objectiveSeen}}</p>
              <h3>建议：</h3>
              <p>{{formData.subjectivePrompt}}</p>
            </div>
            <a-divider />
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
            <a-divider />
          </div>
          <!-- </div> -->
        </a-Col>
      </a-Row>
    </div>
    <div v-else-if="inspectionData.length==0" class="zwsj">暂无数据</div>
  </div>
</template>
<script>
export default {
  props: {
    visId: {
      type: String
    }
  },
  data() {
    return {
      api: {
        selectVisId: 'sys/reviewOrderissue/selectClinicExamListWithVisId',
        selectExamId: 'sys/reviewOrderissue/selectClinicExamReportDetailByExamId',
        loading: false
      },
      columnsa: [{ title: '', prop: 'itemName', align: 'left' }],
      exid: null,
      inspectionData: [],
      formData: {},
      num: '',
      obj: 0
    }
  },
  watch: {
    visId: function() {
      console.log(this.visId)
      this.getdata({ visid: this.visId })
    }
  },
  mounted() {
    this.getdata({ visid: this.visId })
  },
  methods: {
    //点击详情功能
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
            this.obj = Object.keys(this.formData).length
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //初始选中一个
    selectdata(data) {
      if (data) {
        let params = { examId: data.examId }
        this.$axios({
          url: this.api.selectExamId,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.formData = res.data
              this.obj = Object.keys(this.formData).length
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      }
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
    }
  }
}
</script>
<style lang="less">
.text-reprot {
  .el-table th {
    background-color: white !important;
  }
  .ant-col-5 {
    margin-top: 10px;
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
    height: 20px;
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
.tableLineHeights {
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
    margin-top: -7px;
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
  .border {
    width: 0;
    border-right: 1px solid #ebeef5;
  }
}
.zwsj {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #909399;
}
</style>

    

