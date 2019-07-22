<template>
  <div class="detailPres">
    <a-col :span="14">
      <a-card>
        <div class="cardHead">
          <div class="guanzhu" :loading="loading" v-if="carePatient===true">
            <a-icon theme="filled" type="star" class="xingxing" />已关注
          </div>
        </div>
        <a-row class="margin-top-10">
          <a-col class="titleText" :xl="7" :xxl="7">
            <span class="neike">消化内科:</span>
            <span class="renming">{{RecordDelData.patientName}}</span>
          </a-col>
          <a-col :xl="7" :xxl="7" class="ages">
            <span class="bianhao">{{RecordDelData.admitNum}}</span>
            <span class="sex">{{RecordDelData.patientSex}}</span>
            <span class="nianlin">{{RecordDelData.agevalue}}岁</span>
          </a-col>
          <a-col class="titleText" :xl="3" :xxl="3">
            <a-tag class="tagStyle">哺乳期</a-tag>
          </a-col>
          <a-col class="ages" :xl="7" :xxl="7">
            <span>入院日期：&nbsp;{{RecordDelData.admitDate}}</span>
          </a-col>
        </a-row>

        <a-divider type="horizontal" class="detailDivider" />
        <detail-list>
          <detail-list-item term="身高">
            <span class="opacity8">{{RecordDelData.height}}</span>
          </detail-list-item>
          <detail-list-item term="体重">
            <span class="opacity8">{{RecordDelData.weight}}</span>
          </detail-list-item>
          <detail-list-item term="体表面积">
            <span class="opacity8">{{RecordDelData.bSA}}㎡</span>
          </detail-list-item>
          <detail-list-item term="临床诊断">
            <span class="opacity8">{{RecordDelData.diseaseName}}</span>
          </detail-list-item>
          <detail-list-item term="过敏史">
            <span class="opacity8">{{RecordDelData.irritabilityNames}}</span>
          </detail-list-item>
          <detail-list-item term="就诊医生">
            <span class="opacity8">
              <span class="datetime">
                {{RecordDelData.attendingDocName}}&nbsp;
                <a-icon type="message" />
                &nbsp;{{RecordDelData.attendingDocPhone}}
              </span>
            </span>
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="cardHeight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100" @change="changeKey">
          <a-tab-pane tab="医嘱信息" key="1">
            <docAdvices :docDatas="docDatas" :prescOrderIds="prescOrderId"></docAdvices>
          </a-tab-pane>
          <a-tab-pane tab="检查报告" key="2">
            <detailCheck :visidId="visidIdnum"></detailCheck>
          </a-tab-pane>
          <a-tab-pane tab="检验报告" key="3">
            <DetailTest :visidId="visidIdnum"></DetailTest>
          </a-tab-pane>
          <a-tab-pane tab="手术信息" key="4">
            <DetailOperate :visidId="visidIdnum"></DetailOperate>
          </a-tab-pane>
          <a-tab-pane tab="电子病历" key="5"></a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="10" class="padding-left-5">
     <rewviewGrade></rewviewGrade>
    </a-col>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <!-- <template slot="back">
        <a-button v-if="carePatient" @click="attention" class="margin-left-5" :loading="loading">
          <a-icon type="star" theme="filled" />取消关注
        </a-button>
        <a-button v-else @click="attention" class="margin-left-5" :loading="loading">
          <a-icon type="star" />关注患者
        </a-button>
        <a-button
          @click="slePatients(previousData)"
          v-if="routerData.isNew == 1? true:false"
          :disabled="previousData.visId==0? true:false"
          class="margin-left-5"
          :loading="loading"
        >上一患者</a-button>
        <a-button
          @click="slePatients(nextPerson)"
          v-if="routerData.isNew == 1? true:false"
          :disabled="nextPerson.visId==0? true:false"
          class="margin-left-5"
          :loading="loading"
        >下一患者</a-button>
      </template> -->
      <template slot="center">
        <div class="paintFoot">
          <div
            v-for="(item,index) in this.enum.paintState"
            class="jianxie"
            @click="checkableChange(item)"
            :key="item.id"
          >
            <div :class="{active : onactive == item.id}">
              <a-tag :color="item.color" class="tags">{{item.texts}}</a-tag>
              <span
                :style="{'font-weight':item.Size, 'color':item.Color,}"
                class="dengji"
              >{{item.text}}</span>
            </div>
          </div>
        </div>
      </template>
      <div>
        <a-button
          @click="cancle"
          class="margin-left-5"
          :loading="loading"
          v-if="routerData.isNew == 1"
        >返回</a-button>
        <a-button
          @click="refuse"
          style="margin-left: 5px"
          :loading="loading"
          v-if="this.auditStatus"
        >驳回</a-button>
        <a-button
          type="primary"
          class="margin-left-5"
          @click="submit"
          :loading="loading"
          v-if="this.auditStatus"
        >通过</a-button>
      </div>
    </footer-tool-bar>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/FooterToolbar'
import DetailOperate from './detailOperate.vue'
import DetailTest from '../../auditWorkstation/presHospitalized/detailTest.vue'
import detailCheck from '../../auditWorkstation/presHospitalized/detailCheck'
import docAdvices from './docAdvices.vue'
import rewviewGrade from './rewviewGrade.vue'
import { mixin, mixinDevice } from '@/utils/mixin'
import { selectOutDetail } from '@/api/login'
import { mapActions } from 'vuex'
const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem,
    FooterToolBar,
    DetailOperate,
    DetailTest,
    detailCheck,
    docAdvices,
    rewviewGrade
  },
  mixins: [mixin, mixinDevice],
  name: 'detail',
  data() {
    return {
      api: {
        selectVisId: 'sys/reviewOrderissue/selectClinicExamListWithVisId',
        selectExamId: 'sys/reviewOrderissue/selectClinicExamReportDetailByExamId',
        selectTestVisId: 'sys/reviewOrderissue/selectClinicTestListByVisId',
        selectTestVisIdDel: 'sys/reviewOrderissue/selectClinicTestDetailByTestId',
        selectsurgeryDel: 'sys/reviewOrderissue/selectHospitalOperationListByVisId',
        selectRecordDel: 'sys/reviewOrderissue/selectHospitalizationRecordDetail',
        selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
        concernedRecord: 'sys/concernedPatient/selectCurrentRecord',
        concernedPatientUpdate: 'sys/concernedPatient/update',
        turnpage: 'sys/reviewOrderissue/selectHospitalLeadVisIdAndLagVisId',
        updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus'
        //reviewOrderissue/selectHospitalLeadVisIdAndLagVisId
      },
      loading: false,
      inspectionData: [],
      columns: [
        { title: '序号', prop: 'num', width: 50, align: 'right' },
        { title: '药品', prop: 'name' },
        { title: '用法用量', prop: 'way', width: 80, align: 'center' },
        { title: '', prop: 'single', width: 60 },
        { title: '', prop: 'freq', width: 80, align: 'center' },
        { title: '开嘱科室', prop: 'deptName', width: 80, align: 'left' },
        { title: '开嘱医生', prop: 'doctorName', width: 80 },
        { title: '开嘱时间', prop: 'time', width: 130, align: 'left' }
      ],
      columnsa: [
        { title: '报告时间', prop: 'reportDateStr', width: 95, align: 'left' },
        { title: '检查项目', prop: 'itemName' }
      ],
      templateText: '',
      formData: [],
      num: '',
      testid: '',
      RecordDelData: {},
      tagsData: [],
      rightData: [],
      reviewTemplates: [],
      checkedAll: true,
      recordList: [],
      templateTags: [],
      problemType: '',
      Modal: {
        visible: false
      },
      form: this.$form.createForm(this),
      visidIdnum: this.$route.params.visId,
      visDatas: { visId: this.$route.params.visId, maxSubmitNo: this.$route.params.maxSubmitNo },
      docDatas: [],
      previousData: {
        visId: null,
        submitNo: null
      },
      nextPerson: {
        visId: null,
        submitNo: null
      },
      auditStatus: false,
      carePatient: false,
      patientId: '',
      visId: '',
      submitNos: this.$route.params.maxSubmitNo,
      prescOrderId: {},
      docDatasCopy: [],
      onactive: '',
      routerData: {},
      arrs: []
    }
  },
  mounted() {
    this.routerData = this.$route.params
    this.getRecordDelData({ visid: this.$route.params.visId, submitNo: this.$route.params.maxSubmitNo })
    // if (this.routerData.isNew == 1) {
    //   this.turnpage({ visId: this.$route.params.visId, maxSubmitNo: this.$route.params.maxSubmitNo })
    // }
  },
  methods: {
    ...mapActions('page', ['closeTag']),
    // 点击状态标签
    checkableChange(item) {
      if (item.Color == undefined) {
        item.Color = '#1890ff'
        item.Border = item.border
        this.docDatas = this.docDatasCopy
        this.docDatas.forEach(value => {
          if (value.state == item.id) {
            this.arrs.push(value)
          }
        })
        this.docDatas = this.arrs
      } else {
        item.Color = null
        item.Border = null
        //this.docDatas = this.docDatasCopy

        let newArrs = []
        this.arrs.forEach(value => {
          if (value.state !== item.id) {
            newArrs.push(value)
          }
        })
        this.arrs = newArrs
        this.docDatas = this.arrs
      }
    },
    refuse() {
      let params = {}
      params.auditType = '1'
      params.passType = '1'
      if (this.templateText) {
        params.reviewOpinion = this.templateText
      } else {
        params.reviewOpinion = '驳回'
      }
      params.reviewVerdict = '2'
      params.reviewIds = []
      let listData = this.docDatas
      params.reviewIds.push(listData[0].reviewId)
      this.$axios({
        url: this.api.updateReviewStatus,
        method: 'put',
        data: params
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
    // 获取子组件不同部位传值
    updateData(value) {
      this.templateText = value
    },
    updateDatas(value) {
      this.templateText = value
    },

    // 跟换患者
    // turnpage(params = {}) {
    //   this.$axios({
    //     url: this.api.turnpage,
    //     method: 'put',
    //     data: params
    //   })
    //     .then(res => {
    //       if (res.code == '200') {
    //         if (res.data.leadVisId) {
    //           this.previousData.visId = res.data.leadVisId
    //           this.previousData.submitNo = res.data.leadsubmitno
    //           this.nextPerson.visId = res.data.lagVisId
    //           this.nextPerson.submitNo = res.data.lagsubmitno
    //         }
    //       } else {
    //         this.warn(res.msg)
    //       }
    //     })
    //     .catch(err => {
    //       this.error(err)
    //     })
    // },
    // 更换患者
    slePatients(data) {
      this.$router.push({
        name: 'presHospitalizedDetail',
        params: { visId: data.visId, maxSubmitNo: data.submitNo }
      })
      this.visidIdnum = data.visId

      this.submitNos = data.submitNo
      //this.visDatas = { visId: this.$route.params.visId, submitNo: this.$route.params.maxSubmitNo }
      this.getRecordDelData({ visid: this.$route.params.visId, maxSubmitNo: this.$route.params.maxSubmitNo })
      if (this.routerData.isNew == 1) {
        this.turnpage({ visId: data.visId, maxSubmitNo: data.submitNo, isNew: 1 })
      }
    },

    // 获取患者个人信息
    getRecordDelData(params = {}) {
      this.$axios({
        url: this.api.selectRecordDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.RecordDelData = res.data
            this.docDatas = res.data.clinicOrderList
            this.$store.state.drugList=this.docDatas
            // console.log(this.$store.state.drugList,'vuexxxxxx')
            this.docDatasCopy = this.docDatas
            this.visId = this.$route.params.visId
            this.patientId = res.data.patientId
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //获取关注患者信息
    getAttention() {
      let params = this.$route.params
      this.$axios({
        url: this.api.concernedRecord,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.carePatient = res.data
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //关注患者
    attention() {
      let params = {}
      params.visId = this.visId
      params.patientId = this.patientId

      this.$axios({
        url: this.api.concernedPatientUpdate,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            if (this.carePatient) {
              this.carePatient = false
              this.success('取消关注')
            } else {
              this.carePatient = true
              this.success('关注成功')
            }
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 通过的方法；
    submit() {
      this.problemsData
      let params = {}
      params.auditType = '1'
      params.passType = '1'
      params.reviewOpinion = this.templateText
      params.reviewVerdict = '1'
      params.reviewIds = []
      params.reviewIds[0] = this.$route.params.reviewId
      this.$axios({
        url: this.api.updateReviewStatus,
        method: 'put',
        data: params
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
    cancle() {
      this.closeTag({
        tagName: 'presHospitalizedDetail',
        aimName: 'presHospitalizedIndex',
        vm: this
      })
    },

    changeKey(key) {
      let params = { examId: this.num }
      let param = { testId: this.testid }
      if (key == 2) {
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
      } else if (key == 3) {
      }
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

    // 时间格式处理
    timeFormat(data) {
      let times = data.slice(5, 20)
      return times
    },
    // 左右互动
    listStatul(data) {
      this.prescOrderId = data
    },
    saveStatu(data) {
      this.auditStatus = data
    }
  }
}
</script>

<style  lang="less">
.detailPres {
  .guanzhu {
    background-color: #0c60ee;
    height: 26px;
    width: 80px;
    display: block;
    border-radius: 5px;
    color: white;
    line-height: 26px;
    text-align: center;
    font-weight: bold;
    float: right;
    i {
      font-size: 20px;
      margin-right: 5px;
    }
  }
}
.fanhui {
  float: left;
}
.ant-col-xxl-6 {
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 33%;
}
.titleText {
  font-size: 17px;
  font-weight: bold;
}

.detailDivider {
  margin-bottom: 30px;
  margin-top: 20px;
}

.neike {
  font-size: 20px;
}
.tagStyle {
  cursor: default;
  font-size: 12px;
  margin-left: 7px;
  margin-bottom: 5px;
  margin-top: 7px;
}
.saveButton {
  margin-top: 10px;
  margin-left: 10px;
  float: left;
}
.problemTag {
  font-size: 12px;
  margin-left: 7px;
  margin-bottom: 5px;
}

.cardHeight {
  min-height: 420px;
  margin-top: 5px;
}

.cardRight {
  min-height: 670px;
}

.cardHeight .cardColHeight {
  min-height: 450px;
}

.dealP {
  font-size: 14px;
  font-weight: bold;
}

.timelineItem p {
  margin-bottom: 5px;
}
.timelineItem p:nth-child(n + 2) {
  opacity: 0.8;
}
.text-reprot {
  .el-table th {
    background-color: white !important;
  }
}

.border {
  width: 0;
  border-right: 1px solid #ebeef5;
}
.jiancha {
  padding-left: 10px;
}
.renming {
  font-size: 20px;
  padding-left: 10px;
  font-weight: bold;
}
.bianhao {
  padding-left: 20px;
}
.sex {
  padding-left: 20px;
}
.nianlin {
  padding-left: 10px;
}
.cardHead {
  .ant-ant-col-md-8-xxl-8 {
    margin-top: 5px;
  }
}
// 右边诊断样式
.dealRight {
  .dealP {
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
  }
  .checkTag {
    border: 1px #d9d9d9 solid;
  }
  .tagStyle {
    font-size: 12px;
    /*margin-left: 7px;*/
    margin-bottom: 5px;
  }
  .aTag1 {
    background: #2eabff;
    color: #fff;
  }
  .aTag2 {
    background: #fff;
    color: #2eabff;
  }
  .textArea {
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3; /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
    /*text-indent: 2em*/
  }
}
.timelineItem p {
  margin-bottom: 5px;
}
.timelineItem p:nth-child(n + 2) {
  opacity: 0.8;
}
.ages {
  font-size: 15px;
  padding-top: 5px;
}

.datetime {
  color: #1890ff;
}
.paintFoot {
  .jianxie {
    float: left;
    margin-left: 15px;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    cursor: pointer;
  }
  .ant-tag {
    margin-right: 1px;
  }
  .bagrd {
    background: #2eabff;
  }
  .active {
    background: #79668a;
    border: 1px solid #79668a;
    color: #fff;
    border-radius: 6px;
    padding: 1px 1px;
  }
  .dengji {
    padding: 2px 3px;
    border-radius: 2px;
    border-radius: 7px;
  }
}

</style>