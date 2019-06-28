<template>
  <div class="detailPres">
    <a-col :span="14">
      <a-card>
        <div class="cardHead">
          <a href="#" @click.prevent="cancle">
            <a-icon type="left"></a-icon>返回
          </a>
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

        <a-divider type="horizontal" class="detailDivider"/>
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
          <detail-list-item term="处方医生">
            <span class="opacity8">
              <span class="datetime">
                {{RecordDelData.attendingDocName}}&nbsp;
                <a-icon type="message"/>
                &nbsp;{{RecordDelData.attendingDocPhone}}
              </span>
            </span>
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="cardHeight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100" @change="changeKey">
          <a-tab-pane tab="医嘱信息" key="1">
            <el-table class="margin-top-10 width-100" :data="adviceData" highlight-current-row>
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
                <template slot-scope="props">
                  <span v-if="item.prop == 'name'">{{props.row.name}}&nbsp;&nbsp;{{props.row.spec}}</span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </a-tab-pane>
          <a-tab-pane tab="检查报告" key="2">
            <detailCheck :visidId="visidIdnum"></detailCheck>
          </a-tab-pane>
          <a-tab-pane tab="检验报告" key="3">
            <DetailTest :visidId="visidIdnum"></DetailTest>
          </a-tab-pane>
          <a-tab-pane tab="手术信息" key="4">
            <DetailOperate></DetailOperate>
          </a-tab-pane>
          <a-tab-pane tab="电子病历" key="5"></a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="10" class="padding-left-5">
      <jodgeStation :visData='visDatas'></jodgeStation>
    </a-col>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
      oneText="版本对比"
      twoText="标记收藏"
    >
      <a-button @click="submit" :loading="loading">上一个</a-button>
      <a-button @click="submit" class="margin-left-5" :loading="loading">下一个</a-button>
      <a-button @click="submit" style="margin-left: 20px" :loading="loading">驳回</a-button>
      <a-button type="primary" class="margin-left-5" @click="submit" :loading="loading">通过</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/FooterToolbar'
import DetailOperate from './detailOperate.vue'
import DetailTest from './detailTest.vue'
import detailCheck from './detailCheck.vue'
import jodgeStation from './jodgeStation.vue'
import { mixin, mixinDevice } from '@/utils/mixin'
import { selectOutDetail } from '@/api/login'
const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem,
    FooterToolBar,
    DetailOperate,
    DetailTest,
    detailCheck,
    jodgeStation
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
      },
      loading: false,
      problemsData: [
        {
          status: 1,
          time: '2018-09-21  08:50:08',
          openName: '黄磊',
          deptName: '消化内科',
          prescriptionNum: 1,
          patientName: '张力',
          patientNum: '201904010001',
          patientSex: '女',
          patientAge: '23岁',
          problem: '5',
          colors: '#FF6600',
          problemText: '重复给药',
          text:
            '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。头孢丙烯分散片和头孢克洛缓释胶囊为重复用药.头孢丙烯分散片和头孢克洛缓释胶囊为重复用药头孢丙烯分散片和头孢克洛缓释胶囊为重复用药'
        }
      ],
      adviceData: [
        {
          num: 1,
          mark: '┎',
          name: '5%葡萄糖氯化钠注射液',
          spec: '500ml/袋',
          total: '1袋',
          single: '500ml',
          freq: '每天一次',
          way: '静滴',
          colors: 'rgb(225,102,102)'
        },
        {
          num: 2,
          mark: '┃',
          name: '西咪替丁注射液',
          spec: '2ml*0.2g',
          total: '2支',
          single: '0.4g',
          freq: '每天一次',
          way: '静滴'
        }
      ],
      checkdata: [
        {
          num: 1,
          reportDate: 'xxxx',
          itemsName: 'ddddddd'
        },
        {
          num: 2,
          reportDate: 'jjjjjj',
          itemsName: 'zzzzz'
        }
      ],
      inspectionData: [],
      columns: [
        { title: '序号', prop: 'num', width: 50, align: 'right' },
        { title: '', prop: 'mark', width: 20, align: 'left' },
        { title: '药品', prop: 'name' },
        { title: '用法用量', prop: 'way', width: 80, align: 'center' },
        { title: '', prop: 'single', width: 60 },
        { title: '', prop: 'freq', width: 80, align: 'center' },
        { title: '科室', prop: 'deptName', width: 80, align: 'left' },
        { title: '医生', prop: 'doctorName', width: 80 },
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
      visidIdnum: this.$route.query.visId,
      visDatas:{visId:this.$route.query.visId,submitNo:this.$route.query.maxSubmitNo}
    }
  },
  mounted() {
    this.getRecordDelData({ visid: this.$route.query.visId, maxSubmitNo: this.$route.query.maxSubmitNo })
    
  },
  methods: {
    
    // 获取患者个人信息
    getRecordDelData(params = {}) {
      this.loading = true
      this.$axios({
        url: this.api.selectRecordDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.RecordDelData = res.data
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
    submit() {},
    cancle() {
      this.$router.push({
        name: 'presHospitalizedIndex'
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
    }
  }
}
</script>

<style  lang="less">
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
</style>