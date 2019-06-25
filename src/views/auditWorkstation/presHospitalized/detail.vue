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
          <a-col class="titleText"   :xl="7" :xxl="7">
            <span class="neike">消化内科:</span>
            <span class="renming">{{RecordDelData.patientName}}</span>
          </a-col>
          <a-col  :xl="7" :xxl="7" class="ages">
            <span class="bianhao">{{RecordDelData.admitNum}}</span>
            <span class="sex">{{RecordDelData.patientSex}}</span>
            <span class="nianlin">{{RecordDelData.agevalue}}岁</span>
          </a-col>
          <a-col class="titleText"   :xl="3" :xxl="3">
             <a-tag class="tagStyle">哺乳期</a-tag>
          </a-col>
          <a-col class="ages"   :xl="7" :xxl="7">
            <span >入院日期：&nbsp;{{RecordDelData.admitDate}}</span>
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
            <span class="opacity8 ">
              <span class='datetime'>
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
            <detailCheck :visidId='visidIdnum'></detailCheck>
          </a-tab-pane>
          <a-tab-pane tab="检验报告" key="3">
            <DetailTest></DetailTest>
          </a-tab-pane>
          <a-tab-pane tab="手术信息" key="4">
            <DetailOperate></DetailOperate>
          </a-tab-pane>
          <a-tab-pane tab="电子病历" key="5"></a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="10" class="padding-left-5">
      <a-card class="cardRight">
        <div class="dealRight">
          <a-tabs defaultActiveKey="1" size="small" class="width-100">
            <a-tab-pane tab="预判情况" key="1">
              <span class="dealP">问题描述</span>
              <span v-for="ta in tagsData " style="float: right">
                <a-tag
                  v-if="ta.status == true"
                  class="checkTag tagStyle"
                  :style="{'background':ta.levelColor, 'color':'#fff'}"
                  @click="checkableChange(ta)"
                >{{ta.auditName }}</a-tag>
                <a-tag
                  v-else-if="ta.status == false"
                  class="checkTag tagStyle"
                  :style="{'background':'#fff', 'color':ta.levelColor}"
                  @click="checkableChange(ta)"
                >{{ta.auditName }}</a-tag>
              </span>
              <span style="float: right">
                <a-tag
                  class="checkTag tagStyle aTag1"
                  v-if="checkedAll"
                  style
                  @click="handleChange"
                >全部</a-tag>
                <a-tag class="checkTag tagStyle aTag2" v-else @click="handleChange">全部</a-tag>
              </span>
              <a-card
                class="margin-top-10 antCard"
                @click="clickTagsCard(op)"
                v-for="(op,index) in rightData "
                v-if="op.status"
                :style="{'borderColor':op.borderColor}"
                :key="index"
              >
                <a-tag class="tagStyle" :color="op.levelColor">{{op.auditName }}</a-tag>
                <span :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
                <span class="marLeft10">
                  <i class="iconfont action action-yaopin1" style="color: #2eabff"/>
                  {{op.drugName}}
                </span>
                <div :rows="3" :maxRows="4" read-only class="textArea">
                  <a-tag>问题</a-tag>
                  <span class="opacity8">{{op.auditDescription}}</span>
                </div>
                <div :rows="3" :maxRows="4" read-only>
                  <a-tag>建议</a-tag>
                  {{op.audSuggest}}
                </div>
              </a-card>

              <div class="margin-top-10">
                <p class="dealP margin-top-10" style="float: left">审核意见：</p>
                <a-button
                  type="primary"
                  class="saveButton"
                  size="small"
                  @click="saveTemplate()"
                >存为模板</a-button>
                <a-select
                  class="saveButton"
                  size="small"
                  style="width: 150px"
                  @change="selectTemp"
                  v-model="problemType"
                >
                  <a-select-option
                    :value="op.tabooId"
                    v-for="(op,index) in reviewTemplates"
                    :key="index"
                  >{{op.tabooTitle}}</a-select-option>
                </a-select>
                <a-tooltip placement="top" :key="index" v-for="(tt,index) in templateTags">
                  <template slot="title" style="width: 100px">{{tt.titles}}</template>
                  <a-tag
                    class="problemTag saveButton"
                    v-if="index<7 && tt.bgColor == '#2eabff'"
                    :key="index"
                    @click="tagsClick(tt)"
                    color="#2eabff"
                  >{{tt.updateTitles}}</a-tag>
                  <a-tag
                    class="problemTag saveButton"
                    v-else-if="index<7"
                    :key="index"
                    @click="tagsClick(tt)"
                  >{{tt.updateTitles}}</a-tag>
                </a-tooltip>
                <a-dropdown :trigger="['hover']">
                  <a-menu slot="overlay">
                    <a-menu-item
                      v-for="(gd,index) in templateTags"
                      @click="tagsClick(gd)"
                      v-if="index>=7"
                      :key="index"
                    >{{gd.updateTitles}}</a-menu-item>
                  </a-menu>
                  <a v-if="templateTags.length>7" class="margin-left-5 saveButton">
                    更多
                    <a-icon type="down"/>
                  </a>
                  <a v-else></a>
                </a-dropdown>
                <a-textarea :rows="4" v-model="templateText"></a-textarea>
              </div>
            </a-tab-pane>
            <a-tab-pane tab="干预记录" key="2">
              <a-timeline style="margin-top: 20px;margin-left: 10px">
                <a-timeline-item v-for="(rd,index) in recordList" class="timelineItem" :key="index">
                  <a-icon
                    v-if="index+1 == recordList.length"
                    slot="dot"
                    type="clock-circle-o"
                    style="font-size: 16px;"
                  />
                  <p>
                    <a-tag>{{rd.eventPerson}}</a-tag>
                    {{rd.eventTime}}
                  </p>
                  <p>
                    <span class="font-bold">{{rd.event}}:</span>
                    <span>{{rd.eventText}}</span>
                  </p>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
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

    <a-modal
      title="另存为模板"
      :visible="Modal.visible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form :form="form">
        <a-form-item label="分类" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'tabooClass',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
            placeholder="请选择分类"
          >
            <a-select-option
              :value="op.tabooId"
              v-for="(op,index) in reviewTemplates"
              :key="index"
            >{{op.tabooTitle}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-select
            v-decorator="[ 'templetType',  {rules: [{ required: true,message: '请选择类型'  }]}  ]"
            placeholder="请选择类型"
          >
            <a-select-option
              :value="op.id"
              v-for="(op,index) in this.enum.templateType"
              :key="index"
            >{{op.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="[ 'titles',  {rules: [{ required: true,message: '请输入标题'  }]}  ]"></a-input>
        </a-form-item>
        <a-form-item label="内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
          <a-textarea
            v-decorator="[ 'reviewTemplate',  {rules: [{ required: true,message: '请输入内容'  }]}  ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/FooterToolbar'
import DetailOperate from './detailOperate.vue'
import DetailTest from './detailTest.vue'
import detailCheck from './detailCheck.vue'
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
    detailCheck
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
        selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
        selectRecordDel: 'sys/reviewOrderissue/selectHospitalizationRecordDetail',
        selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
        selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
        reviewTemplateUpdate: 'sys/reviewTemplate/update'
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
      testsdata: [],
      testDatas: [],
      testsDeldata: [],
      testsDeltopdata: [],
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
      visidIdnum:'1'
    }
  },
  mounted() {
    this.getRecordDelData({ visid:this.$route.query.visId,maxSubmitNo:this.$route.query.maxSubmitNo })
    this.getDetailData()
    this.getRecord()
    this.getTemplate()
  },
  methods: {
    //右边预判情况基础数据
    getDetailData() {
      let params = { visid:this.$route.query.visId,submitNo:this.$route.query.maxSubmitNo,clinicPrescNum:''}
      selectOutDetail(params)
        .then(res => {
          if (res.code == '200') {
            this.leftData = res.data
            this.rightData = this.leftData.reviewOrderissueVOList
            this.tagsData = this.leftData.levelTotalsList
            this.dealTagsData(this.tagsData)
            this.deal(this.rightData)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 配置状态状态控制显示
    dealTagsData(data) {
      for (let key in data) {
        data[key].status = true
      }
    },
    // 数据处理
    deal(data) {
      for (let key in data) {
        data[key].status = true
        data[key].borderColor = '#d9d9d9'
        let list = data[key].reviewTemplateList
        for (let i in list) {
          list[i].bgColor = '#d9d9d9'
          if (list[i].titles.length > 5) {
            list[i].updateTitles = list[i].titles.substr(0, 5) + '...'
          } else {
            list[i].updateTitles = list[i].titles
          }
        }
      }
      data.push()
    },
    // 右边预判情况树形结构数据
    getTemplate() {
      let params = { visId: '3' }
      this.$axios({
        url: this.api.selectWithReviewId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.reviewTemplates = res.rows
            if (this.reviewTemplates.length > 0) {
              this.problemType = this.reviewTemplates[0].tabooId
              this.getTemplateDetail()
            }
            this.reviewTemplates.push({ tabooId: '-1', tabooTitle: '----通用----' })
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 选择树形结构再次获取具体数据；
    getTemplateDetail() {
      let params = {}
      params.tabooClass = this.problemType
      this.$axios({
        url: this.api.selectReviewTemplateDetail,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.templateTags = res.rows
            this.dealTemplateTags(this.templateTags)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    //选择结构的事件过程
    selectTemp(data) {
      this.problemType = data
      this.getTemplateDetail()
    },
    // 数据的拼接
    dealTemplateTags(data) {
      for (let i in data) {
        data[i].bgColor = '#d9d9d9'
        if (data[i].titles.length > 5) {
          data[i].updateTitles = data[i].titles.substr(0, 5) + '...'
        } else {
          data[i].updateTitles = data[i].titles
        }
      }
    },
    //button点击事件模板的存储；
    saveTemplate() {
      if ($.trim(this.templateText).length > 0) {
        setTimeout(() => {
          this.form.setFieldsValue({ titles: this.templateTitle, reviewTemplate: this.templateText, templetType: '1' })
        }, 100)
        this.Modal.visible = true
      } else {
        this.warn('请输入审核意见')
      }
    },
    //  点击
    tagsClick(pd) {
      let list = this.templateTags
      for (let i in list) {
        if (list[i].id == pd.id) {
          list[i].bgColor = '#2eabff'
        } else {
          list[i].bgColor = '#d9d9d9'
        }
      }
      this.templateText = pd.reviewTemplate
      this.templateTitle = pd.titles
      this.rightData.push()
    },
    //模板的提交
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios({
            url: this.api.reviewTemplateUpdate,
            method: 'post',
            data: values
          })
            .then(res => {
              if (res.code == '200') {
                this.success(res.msg)
                this.getTemplateDetail()
                this.Modal.visible = false
              } else {
                this.warn(res.msg)
              }
            })
            .catch(err => {
              this.error(err)
            })
        }
      })
    },
    // 模板取消编辑
    handleCancel() {
      this.Modal.visible = false
    },
    // 筛选等级，匹配下面的数据；
    checkableChange(data) {
      for (let key in this.rightData) {
        if (this.rightData[key].auditLevel == data.auditLevel) {
          this.checkedAll = false
          this.rightData[key].status = true
        } else {
          this.rightData[key].status = false
        }
      }
      for (let key in this.tagsData) {
        if (data.auditLevel == this.tagsData[key].auditLevel) {
          this.tagsData[key].status = true
        } else {
          this.tagsData[key].status = false
        }
      }
      this.rightData.push()
    },
    // 刷新筛选等级
    handleChange(checked) {
      let data = this.rightData
      for (let key in data) {
        data[key].status = true
      }
      for (let key in this.tagsData) {
        this.tagsData[key].status = true
      }
      this.checkedAll = true
    },
    // 右边干预记录
    getRecord() {
      let params = { visid: '1' }
      this.$axios({
        url: this.api.selectWithVisId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.recordList = res.rows
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
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
.ages{
  font-size: 15px;
  padding-top: 5px;
}

  .datetime{
    color:blue;
}
</style>