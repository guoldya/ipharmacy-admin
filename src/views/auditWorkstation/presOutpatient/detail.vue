<template>
  <div class="detailPres">
    <a-col :span="14">
      <a-card>
        <a-row class=" margin-top-10">
          <a-col class="titleText" :md="4" :lg="3" :xxl="3">
            {{leftData.patientDeptName}}：
          </a-col>
          <a-col :md="3" :lg="4" :xxl="4">
            <span class="font-bold fontSize14">{{leftData.patientName}}</span>&nbsp;&nbsp; {{leftData.patientSex |
            control_type}}&nbsp;&nbsp;{{leftData.agevalue}}岁
          </a-col>
          <a-col class="titleText" :md="12" :lg="12" :xxl="16">
            <a-tag class="tagStyle"> 妊娠</a-tag>
            <a-tag :color="'#40a9ff'" class="tagStyle"> 哺乳</a-tag>
            <a-tag class="tagStyle"> 肝肾功能</a-tag>
          </a-col>
        </a-row>
        <a-divider type="horizontal" class="detailDivider"/>
        <detail-list>
          <detail-list-item term="身高"><span class="opacity8">{{leftData.height}}cm</span></detail-list-item>
          <detail-list-item term="体重"><span class="opacity8">{{leftData.weight}}Kg</span></detail-list-item>
          <detail-list-item term="体表面积"><span class="opacity8">{{leftData.bSA}}㎡</span></detail-list-item>
          <detail-list-item term="过敏史">
            <a-tooltip>
              <template slot="title">
                <span>{{leftData.irritabilityNames}}</span>
              </template>
              <div class="hiddenOpacity opacity8">{{leftData.irritabilityNames}}</div>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item term="处方医生">
          <span class="opacity8"><a href="">
          {{leftData.attendingDocName}}&nbsp;<a-icon type="message"/>&nbsp;{{leftData.attendingDocPhone}}</a>
          </span></detail-list-item>
          <detail-list-item term="临床诊断"><span class="opacity8">{{leftData.diseaseName}}</span></detail-list-item>

        </detail-list>
      </a-card>
      <a-card class="cardHeight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100">
          <a-tab-pane tab="处方信息" key="1">
            <div v-for=" (op,index) in leftData.clinicPrescVOList">
              <a-card class="margin-top-10">
                <div v-if="op.auditingStatus == '1'" class="iconTobe"></div>
                <div v-if="op.auditingStatus == '2'" class="iconRefused"></div>
                <!--<img src="" alt="">-->
                <a-row>
                  <a-col :span="7">处方号：<span class="font-bold">{{op.prescNum}}</span></a-col>
                  <a-col :span="7">科室：<span class="font-bold">{{op.deptName}}</span></a-col>
                  <a-col :span="4">医生：<span class="font-bold">{{op.prescDocName}}</span></a-col>
                  <a-col :span="6">时间：<span class="font-bold">{{op.prescDate}}</span></a-col>
                </a-row>
                <a-row v-if="op.auditingStatus != 0">
                  <a-col :span="7">审核状态：<span class="font-bold">{{op.auditingStatus==1? '通过':'未通过'}}</span></a-col>
                  <a-col :span="7">审核人：<span class="font-bold">{{op.reviewDocName}}</span></a-col>
                  <a-col :span="6">审核时间：<span class="font-bold">{{op.reviewTime}}</span></a-col>
                </a-row>
                <a-row class="dealRow">
                  <el-table
                    class="margin-top-10 width-100"
                    :data="op.prescVOList"
                    ref="table"
                    :row-style="tableRowStyle">
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
                  <span v-if="item.prop == 'name'">
                    {{props.row.name}}&nbsp;&nbsp;{{props.row.spec}}
                  </span>
                        <span v-else>
                    {{props.row[item.prop]}}
                  </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </a-row>
              </a-card>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="检查报告" key="2">

          </a-tab-pane>
          <a-tab-pane tab="检验报告" key="3">

          </a-tab-pane>
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
                <a-tag v-if="ta.status == true" class="checkTag tagStyle"
                       :style="{'background':ta.levelColor, 'color':'#fff'}" @click="checkableChange(ta)"> {{ta.auditName }}</a-tag>
                <a-tag v-else-if="ta.status == false" class="checkTag tagStyle"
                       :style="{'background':'#fff', 'color':ta.levelColor}" @click="checkableChange(ta)"> {{ta.auditName }}</a-tag>
              </span>
              <span style="float: right">
                <a-tag class="checkTag tagStyle aTag1" v-if="checkedAll" style="" @click="handleChange"> 全部</a-tag>
                <a-tag class="checkTag tagStyle aTag2" v-else @click="handleChange"> 全部</a-tag>
              </span>
              <a-card class="margin-top-10 antCard" @click="clickTagsCard(op)" v-for="(op,index) in rightData "
                      v-if="op.status" :style="{'borderColor':op.borderColor}" :key="index">
                <a-tag class="tagStyle" :color="op.levelColor"> {{op.auditName }}</a-tag>
                <span :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
                <span class="marLeft10"><i class="iconfont action action-yaopin1" style="color: #2eabff"/>{{op.drugName}}</span>
                <div :rows="3" :maxRows="4" read-only class="textArea ">
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
                <a-button type="primary" class="saveButton" size="small" @click="saveTemplate()">存为模板</a-button>
                <a-select class="saveButton" size="small" style="width: 150px" @change="selectTemp"
                          v-model="problemType">
                  <a-select-option :value='op.tabooId' v-for="(op,index) in reviewTemplates" :key="index">
                    {{op.tabooTitle}}
                  </a-select-option>
                </a-select>
                <a-tooltip placement="top" :key="index" v-for="(tt,index) in templateTags">
                  <template slot="title" style="width: 100px">{{tt.titles}}</template>
                  <a-tag
                    class="problemTag saveButton"
                    v-if="index<7 && tt.bgColor == '#2eabff'"
                    :key="index"
                    @click="tagsClick(tt)"
                    color="#2eabff"
                  >{{tt.updateTitles}}
                  </a-tag>
                  <a-tag
                    class="problemTag saveButton"
                    v-else-if="index<7"
                    :key="index"
                    @click="tagsClick(tt)"
                  >{{tt.updateTitles}}
                  </a-tag>
                </a-tooltip>
                <a-dropdown :trigger="['hover']">
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(gd,index) in templateTags" @click="tagsClick(gd)" v-if="index>=7"
                                 :key="index">
                      {{gd.updateTitles}}
                    </a-menu-item>
                  </a-menu>
                  <a v-if="templateTags.length>7" class="margin-left-5 saveButton">更多
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
                  <a-icon v-if="index+1 == recordList.length" slot="dot" type="clock-circle-o"
                          style="font-size: 16px;"/>
                  <p>
                    <a-tag>{{rd.eventPerson}}</a-tag>
                    {{rd.eventTime}}
                  </p>
                  <p><span class="font-bold">{{rd.event}}:</span><span>{{rd.eventText}}</span></p>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-col>

    <a-modal
      title="另存为模板"
      :visible="Modal.visible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form :form="form">
        <a-form-item label="分类"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 17 }">
          <a-select v-decorator="[ 'tabooClass',  {rules: [{ required: true,message: '请选择分类'  }]}  ]"
                    placeholder="请选择分类">
            <a-select-option :value='op.tabooId' v-for="(op,index) in reviewTemplates" :key="index">
              {{op.tabooTitle}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 17 }">
          <a-select v-decorator="[ 'templetType',  {rules: [{ required: true,message: '请选择类型'  }]}  ]"
                    placeholder="请选择类型">
            <a-select-option :value='op.id' v-for="(op,index) in this.enum.templateType" :key="index">
              {{op.text}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 17 }">
          <a-input v-decorator="[ 'titles',  {rules: [{ required: true,message: '请输入标题'  }]}  ]"></a-input>
        </a-form-item>
        <a-form-item label="内容"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 17 }">
          <a-textarea
            v-decorator="[ 'reviewTemplate',  {rules: [{ required: true,message: '请输入内容'  }]}  ]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="版本对比"
      :visible="versionModal.visible"
      :footer="null"
      @cancel="versionCancel"
      width="900px"
    >
      <versionComp
        :visId="visId"
      ></versionComp>
    </a-modal>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <!--<a-button @click="submit" :loading="loading">上一个</a-button>-->
      <!--<a-button @click="submit" class="margin-left-5" :loading="loading">下一个</a-button>-->
      <template slot="back">
        <a-button v-if="carePatient" @click="attention" class="margin-left-5" :loading="loading">
          <a-icon type="star" theme="filled"/>
          关注患者
        </a-button>
        <a-button v-else @click="attention" class="margin-left-5" :loading="loading">
          <a-icon type="star"/>
          关注患者
        </a-button>
        <a-button @click="versionComp" :disabled="leftData.subNo>1? false:true" class="margin-left-5"
                  :loading="loading">
          <i type="star" class="iconfont action action-tubiaozhizuomoban-"/><span class="margin-left-5">版本对比</span>
        </a-button>

      </template>
      <a-button @click="cancle" class="margin-left-5" :loading="loading">返回</a-button>
      <a-button @click="refuse" style="margin-left: 5px" :loading="loading">驳回</a-button>
      <a-button type="primary" class="margin-left-5" @click="submit" :loading="loading">通过</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
  import { selectTribunalRecord, selectOutDetail } from '@/api/login'
  import PageLayout from '@/components/page/PageLayout'
  import STable from '@/components/table/'
  import DetailList from '@/components/tools/DetailList'
  import ABadge from 'ant-design-vue/es/badge/Badge'
  import FooterToolBar from '@/components/FooterToolbar'
  import { mixin, mixinDevice } from '@/utils/mixin'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import ACol from 'ant-design-vue/es/grid/Col'
  import versionComp from '@/my-components/version-comparison'

  const DetailListItem = DetailList.Item
  export default {
    components: {
      ACol,
      ATextarea,
      PageLayout,
      ABadge,
      DetailList,
      DetailListItem,
      STable,
      FooterToolBar,
      versionComp
    },
    mixins: [mixin, mixinDevice],
    name: 'detail',
    data() {
      return {
        api: {
          updateReviewStatus: '/sys/reviewOrderissue/updateReviewOrderissueAndIssuerecodeStatus',
          selectWithReviewId: '/sys/reviewTemplate/selectReviewTemplateWithReviewId',
          selectVisId: '/sys/reviewOrderissue/selectInterventionRecordWithVisId',
          selectReviewTemplateDetail: 'sys/reviewTemplate/selectReviewTemplateDetail',
          selectWithVisId: 'sys/reviewOrderissue/selectInterventionRecordWithVisId',
          reviewTemplateUpdate: 'sys/reviewTemplate/update',
          concernedRecord: 'sys/concernedPatient/selectCurrentRecord',
          concernedPatientUpdate: 'sys/concernedPatient/update'
        },
        Modal: {
          visible: false
        },
        versionModal: {
          visible: false
        },
        form: this.$form.createForm(this),
        loading: false,
        tags: [],
        templateTitle: '',
        templateText: '',
        problemType: '',
        leftData: {},
        rightData: [],
        tagsData: [],
        reviewTemplates: [],
        templateTags: [],
        recordList: [],
        carePatient: false,
        columns: [{ title: '序号', prop: 'seqNum', width: 50, align: 'right' },
          { title: '', prop: 'mark', width: 20, align: 'left' },
          { title: '药品', prop: 'drugName' },
          { title: '规格', prop: 'spec', width: 100 },
          { title: '单量', prop: 'dosageStr', width: 100 },
          { title: '总量', prop: 'amountStr', width: 100 },
          { title: '频次', prop: 'frequency', align: 'center' },
          { title: '用法', prop: 'useType' }
        ],
        problemId: '122',
        checkedAll: true,
        prescOrderId: '',
        levelColor: '',
        visId: null
      }
    },
    mounted() {
      this.getDetailData()
      this.getTemplate()
      this.getRecord()
      this.getAttention()
    },
    methods: {
      getDetailData() {
        this.visId = this.$route.query.visId
        let params = this.$route.query
        selectOutDetail(params).then(res => {
          if (res.code == '200') {
            this.leftData = res.data
            this.rightData = this.leftData.reviewOrderissueVOList
            this.tagsData = this.leftData.levelTotalsList
            this.dealTagsData(this.tagsData)
            this.deal(this.rightData)
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      dealTagsData(data) {
        for (let key in data) {
          data[key].status = true
        }
      },
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
      submit() {
        let params = {}
        params.auditType = '1'
        params.passType = '1'
        if (this.templateText) {
          params.reviewOpinion = this.templateText
        } else {
          params.reviewOpinion = '通过'
        }
        params.reviewVerdict = '1'
        params.reviewIds = []
        let listData = this.leftData.clinicPrescVOList
        for (let key in listData) {
          if (listData[key].auditingStatus == '0') {
            params.reviewIds.push(listData[key].reviewId)
          }
        }
        this.$axios({
          url: this.api.updateReviewStatus,
          method: 'put',
          data: params
        }).then(res => {
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
      refuse() {
        let params = {}
        params.auditType = '1'
        // params.passType = "1";
        if (this.templateText) {
          params.reviewOpinion = this.templateText
        } else {
          params.reviewOpinion = '驳回'
        }
        params.reviewVerdict = '2'
        params.reviewIds = []
        let listData = this.leftData.clinicPrescVOList
        for (let key in listData) {
          if (listData[key].auditingStatus == '0') {
            params.reviewIds.push(listData[key].auditingStatus)
          }
        }
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
        this.$router.push({
          name: 'presOutpatientIndex'
        })
      },
      tagsClick(pd) {
        // var event = window.event || arguments.callee.caller.arguments[0]
        // if (event.stopPropagation) {
        //   event.stopPropagation()      //阻止事件 冒泡传播
        // } else {
        //   event.cancelBubble = true   //ie兼容
        // }
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
      tableRowStyle({ row, rowIndex }) {
        if (this.prescOrderId == row.clinicPrescId) {
          return { 'background': 'rgb(' + this.convertHexToRGB(this.levelColor).join(',') + ',0.3)' }
        }
      },
      convertHexToRGB(str) {
        str = str[0] === '#' ? str.slice(1) : str
        str = str.length === 3 ? str.repeat(2) : str
        if ((str.length !== 6) || !(/^[0-9a-fA-F]{3,6}$/i.test(str))) return 'Invalid data'
        return [parseInt(str[0] + str[1], 16), parseInt(str[2] + str[3], 16), parseInt(str[4] + str[5], 16)]
      },
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
      clickTagsCard(data) {
        for (let key in this.rightData) {
          if (this.rightData[key].prescOrderId == data.prescOrderId) {
            this.rightData[key].borderColor = '#1890ff'
          } else {
            this.rightData[key].borderColor = '#d9d9d9'
          }
        }
        this.prescOrderId = data.prescOrderId
        this.levelColor = data.levelColor
        this.rightData.push()
      },
      getTemplate() {
        let params = this.$route.query
        this.$axios({
          url: this.api.selectWithReviewId,
          method: 'put',
          data: params
        }).then(res => {
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
      getTemplateDetail() {
        let params = {}
        params.tabooClass = this.problemType
        this.$axios({
          url: this.api.selectReviewTemplateDetail,
          method: 'put',
          data: params
        }).then(res => {
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
      selectTemp(data) {
        this.problemType = data
        this.getTemplateDetail()
      },
      dealTemplateTags(data) {
        for (let i in  data) {
          data[i].bgColor = '#d9d9d9'
          if (data[i].titles.length > 5) {
            data[i].updateTitles = data[i].titles.substr(0, 5) + '...'
          } else {
            data[i].updateTitles = data[i].titles
          }
        }
      },
      //存为模板
      saveTemplate() {
        if ($.trim(this.templateText).length > 0) {
          setTimeout(() => {
            this.form.setFieldsValue({
              titles: this.templateTitle,
              reviewTemplate: this.templateText,
              templetType: '1'
            })
          }, 100)
          this.Modal.visible = true
        } else {
          this.warn('请输入审核意见')
        }
      },
      handleOk() {
        this.form.validateFields((err, values) => {
            if (!err) {
              this.$axios({
                url: this.api.reviewTemplateUpdate,
                method: 'post',
                data: values
              }).then(res => {
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
          }
        )
      },
      handleCancel() {
        this.Modal.visible = false
      },

      //获取记录
      getRecord() {
        let params = this.$route.query
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
      //开始对比
      versionComp() {
        this.versionModal.visible = true
      },
      //版本对比确认
      versionCancel() {
        this.versionModal.visible = false
      },
      //获取关注患者信息
      getAttention() {
        let params = this.$route.query
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
        params.visId = this.leftData.visId
        params.patientId = this.leftData.patientId
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
      }
    },
    filters: {
      control_type(value) {

        if (value == '1') {
          return '女'
        } else if (value == '0') {
          return '男'
        } else {
          return '未知'
        }
      }
    }
  }
</script>

<style scoped>
  .detailPres .ant-card-body {
    padding: 14px 32px;
  }

  .fontSize14 {
    font-size: 18px;
    line-height: 18px;
  }

  .titleText {
    font-size: 18px;
    font-weight: bold;
    line-height: 18px;
  }

  .detailDivider {
    margin-bottom: 30px;
    margin-top: 20px;
  }

  .hiddenOpacity {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  .tagStyle {
    font-size: 12px;
    /*margin-left: 7px;*/
    margin-bottom: 5px;
  }

  .aTag1 {
    background: #2eabff;
    color: #fff
  }

  .aTag2 {
    background: #fff;
    color: #2eabff
  }

  .saveButton {
    margin-top: 10px;
    margin-left: 10px;
    float: left
  }

  .problemTag {
    font-size: 12px;
    margin-left: 7px;
    margin-bottom: 5px;
  }

  .cardHeight {
    min-height: 450px;
    margin-top: 5px;
  }

  .cardHeight .iconTobe {
    width: 183px;
    height: 96px;
    z-index: 3;
    background-image: url("~@/assets/pass.png");
    background-repeat: no-repeat;
    /*background-size: 50% 50%;*/
    position: absolute;
    right: 16%;
    top: 15%;
    opacity: 0.8;
    /*background-repeat:no-repeat;*/
  }

  .cardHeight .iconRefused {
    width: 183px;
    height: 96px;
    z-index: 3;
    background-image: url("~@/assets/refused.png");
    background-repeat: no-repeat;
    /*background-size: 50% 50%;*/
    position: absolute;
    right: 16%;
    top: 15%;
    opacity: 0.8;
  }

  .cardRight {
    min-height: 700px;
  }

  .cardHeight .cardColHeight {
    min-height: 450px;
  }

  .dealP {
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
  }

  .dealRow {
    font-size: 14px;
  }

  .dealRow .dealCol {
    line-height: 25px;
    margin-left: 20px;
  }

  .dealRow .sizeWeight {
    font-size: 16px;
    font-weight: bold
  }

  /*.dealRight .selectInput {*/
  /*line-height: 30px;*/
  /*}*/

  .timelineItem p {
    margin-bottom: 5px;
  }

  .timelineItem p:nth-child(n+2) {
    opacity: 0.8;
  }

  .checkTag {
    border: 1px #d9d9d9 solid;
  }

  .antCard {
    cursor: pointer;
  }

</style>