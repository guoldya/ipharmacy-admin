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
          <a-col class="titleText" :md="4" :lg="3" :xxl="2">消化内科:</a-col>
          <a-col :md="4" :lg="5" :xxl="6">张力&nbsp;&nbsp;201904010001&nbsp;&nbsp;女&nbsp;&nbsp;23岁</a-col>
          <a-col class="titleText" :md="8" :lg="8" :xxl="8">
            <a-tag :color="problemsData[0].colors" class="tagStyle">妊娠</a-tag>
            <a-tag :color="'#40a9ff'" class="tagStyle">哺乳</a-tag>
            <a-tag class="tagStyle">肝肾功能</a-tag>
          </a-col>
          <a-col :md="8" :lg="8" :xxl="8">入院日期：&nbsp;2015.02.09</a-col>
        </a-row>
        <a-divider type="horizontal" class="detailDivider"/>
        <detail-list>
          <detail-list-item term="身高">
            <span class="opacity8">175cm</span>
          </detail-list-item>
          <detail-list-item term="体重">
            <span class="opacity8">60kg</span>
          </detail-list-item>
          <detail-list-item term="体表面积">
            <span class="opacity8">32㎡</span>
          </detail-list-item>
          <detail-list-item term="临床诊断">
            <span class="opacity8">胃炎</span>
          </detail-list-item>
          <detail-list-item term="过敏史">
            <span class="opacity8">无</span>
          </detail-list-item>
          <detail-list-item term="处方医生">
            <span class="opacity8">
              <a href>
                黄磊&nbsp;
                <a-icon type="message"/>&nbsp;18423327418
              </a>
            </span>
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="cardHeight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100" @change="changeKey">
          <a-tab-pane tab="处方信息" key="1">
            <el-table
              class="margin-top-10 width-100"
              :data="adviceData"
              highlight-current-row
              :cell-style="cellStyle"
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
                <template slot-scope="props">
                  <span v-if="item.prop == 'name'">{{props.row.name}}&nbsp;&nbsp;{{props.row.spec}}</span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </a-tab-pane>
          <a-tab-pane tab="检查报告" key="2">
            <a-Row>
              <a-Col :span="8">
                <el-table
                  @row-click="clickrow"
                  class="margin-top-10 width-100"
                  :data="inspectionData"
                  highlight-current-row
                  border
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
                      <span
                        v-if="item.prop == 'resultStatus'"
                      >{{resultStatusformatter(props.row.resultStatus)}}</span>
                      <span v-else>{{props.row[item.prop]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </a-Col>
              <a-Col :span="15" :offset="1" class="detail">
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
              </a-Col>
            </a-Row>
          </a-tab-pane>
          <a-tab-pane tab="检验报告" key="3">
            <a-Row class="testchk">
              <a-Col :span="8">
                <a-card>
                  <el-table
                    @row-click="checkclick"
                    class="margin-top-10 width-100"
                    :data="testDatas"
                    highlight-current-row
                  >
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
                        <span
                          v-if="item.prop == 'resultStatus'"
                        >{{resultStatusformatter(props.row.resultStatus)}}</span>
                        <span v-else>{{props.row[item.prop]}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </a-card>
              </a-Col>

              <a-Col :span="15" class="detail">
                <a-card>
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
                      class="margin-top-10 width-100"
                      :data="testsDeldata"
                      highlight-current-row
                      height="400"
                      :cell-style="cellStyle"
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
                            <p>{{props.row.resultSignEng}}</p>
                          </span>

                          <span v-else>{{props.row[item.prop]}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </a-row>
                </a-card>
              </a-Col>
            </a-Row>
          </a-tab-pane>
          <a-tab-pane tab="手术信息" key="4">
            <el-table
              class="margin-top-10 width-100"
              :data="surgeryData"
              highlight-current-row
              :cell-style="cellStyle"
            >
              <el-table-column
                :prop="item.prop"
                :label="item.title"
                :key="index"
                v-for="(item,index) in surgerycolumn"
                :width="item.width"
                :align="item.align"
                :formatter="item.formatter"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="props">
                  <span v-if="item.prop == 'name'">{{props.row.name}}&nbsp;&nbsp;{{props.row.spec}}</span>
                  <span
                   v-else-if="item.prop == 'status'"
                     v-html="statusFormatter(props.row.status)"
            ></span>
              <span
                   v-else-if="item.prop == 'isInfection'"
                     v-html="isInfectionFormatter(props.row.isInfection)"
            ></span>
                  <span v-else>{{props.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- <Surgery></Surgery> -->
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
              <p class="dealP">问题描述</p>
              <a-card class="margin-top-10 antCard" v-for="(op,index) in problemsData" :key="index">
                <a-tag :color="op.colors" class="tagStyle">{{op.problem }}级</a-tag>
                <span :style="{fontWeight:'bold'}">{{op.problemText}}</span>
                <a-tooltip placement="top" :key="num" v-for="(pd,num) in op.tags">
                  <template slot="title" class="width-100">{{pd.template}}</template>
                  <a-tag
                    class="problemTag"
                    :id="pd.num"
                    v-if="num<3"
                    :key="num"
                    @click="tagsClick( pd.template,pd.num,pd.status,index,num,)"
                  >{{pd.updateText}}</a-tag>
                </a-tooltip>

                <a-dropdown :trigger="['click']">
                  <a-menu slot="overlay">
                    <a-menu-item
                      v-for="(pd,num) in op.tags"
                      @click="tagsClick(pd.template)"
                      v-if="num>=3"
                      :key="num"
                    >{{pd.updateText}}</a-menu-item>
                  </a-menu>
                  <a v-if="op.tags.length>3" class="margin-left-5">
                    更多
                    <a-icon type="down"/>
                  </a>
                  <a v-else></a>
                </a-dropdown>
                <div :rows="3" :maxRows="4" read-only class="textArea opacity8">{{op.text}}</div>
              </a-card>
              <p class="dealP margin-top-10" style="float: left">审核意见</p>
              <a-button type="primary" class="saveButton" size="small">存为模板</a-button>
              <a-textarea :rows="4" v-model="templateText"></a-textarea>
            </a-tab-pane>

            <a-tab-pane tab="干预记录" key="2">
              <a-timeline style="margin-top: 20px">
                <a-timeline-item color="green" class="timelineItem">
                  <p>2015-09-01 15:00</p>
                  <p>有接触隔离医嘱 1</p>
                  <p>有隔离措施 2</p>
                </a-timeline-item>
                <a-timeline-item color="green" class="timelineItem">
                  <p>2015-09-01 15:00</p>
                  <p>请医生再次审核</p>
                </a-timeline-item>
                <a-timeline-item color="red" class="timelineItem">
                  <p>2015-09-01 15:00</p>
                  <p>有接触隔离医嘱 1</p>
                  <p>有隔离措施 2</p>
                  <p>医疗废物处置 3</p>
                </a-timeline-item>
                <a-timeline-item class="timelineItem">
                  <p>2015-09-01 15:00</p>
                  <p>离开病区检查是否通知相关科室做好防护等 1</p>
                  <p>有隔离措施 2</p>
                  <p>医疗废物处置 3</p>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-col>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
      :extra="true"
      :clickOne="versionContrast"
      oneText="版本对比"
      twoText="标记收藏"
      :clickTwo="tagCollection"
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
// import  Surgery  from '@/my-components/sugery'
import { mixin, mixinDevice } from '@/utils/mixin'
const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem,
    FooterToolBar,
    // Surgery
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
        // reviewOrderissue/selectHospitalizationRecordDetail
         selectRecordDel: 'sys/reviewOrderissue/selectHospitalizationRecordDetail',

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
          tags: [
            { template: '避免重复用药', num: 11, updateText: '', status: 1 },
            { template: '避免用药过度', num: 12, updateText: '', status: 1 },
            { template: '药剂量太少', num: 13, updateText: '', status: 1 },
            { template: '药剂量太少', num: 14, updateText: '', status: 1 },
            { template: '药剂量太少', num: 15, updateText: '', status: 1 }
          ],
          text:
            '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。头孢丙烯分散片和头孢克洛缓释胶囊为重复用药.头孢丙烯分散片和头孢克洛缓释胶囊为重复用药头孢丙烯分散片和头孢克洛缓释胶囊为重复用药'
        },
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
        },
        {
          num: 3,
          mark: '┖',
          name: '银参通络胶囊',
          spec: '0.46g*24粒/盒 ',
          total: '20粒',
          single: '0.46g',
          freq: '每天三次',
          way: '口服',
          colors: 'rgb(225,102,102)',
          deptName: '内科',
          doctorName: '张医生',
          time: '2015.05.19 12:00'
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
        { title: '报告时间', prop: 'reportDateStr', width: 130, align: 'left' },
        { title: '检查项目', prop: 'itemName' }
      ],
      surgerycolumn:[
         { title: '手术名称', prop: 'operationName', width: 130, align: 'left' },
          { title: '手术描述', prop: 'processDescribe', align: 'left' },
        { title: '手术日期', prop: 'operationTime',width:120 },
         { title: '手术医生', prop: 'docName', width: 130, align: 'left' },
        { title: '麻醉医师', prop: 'anestheslaName' },
        { title: '手术状态', prop: 'status' },
        { title: '手术性质', prop: 'kind',width:120 },
        { title: '感染手术', prop: 'isInfection',width:120 },
         { title: '紧急程度', prop: 'isEmergency',width:120 },
        { title: '切口', prop: 'incision',width:120 },
        { title: '愈合', prop: 'heal',width:120 },
        { title: '更新时间', prop: 'updateTime',width:120 },
      ],
      columnscheck: [
        { title: '类型', prop: 'testType', width: 60, align: 'left' },
        { title: '报告时间', prop: 'reportDate', width: 130, align: 'left' },
        { title: '检查项目', prop: 'itemName' }
      ],
      columnscheckdtl: [
        { title: '代码', prop: 'itemCode', width: 100, align: 'left' },
        { title: '化验项目', prop: 'itemName', width: 130, align: 'left' },
        { title: '结果', prop: 'resultDesc' },
        { title: '单位', prop: 'unit', width: 100, align: 'left' },
        { title: '参考值', prop: 'limitValue', width: 100, align: 'left' }
      ],
      templateText: '',
      formData: [],
      num: '',
      testsdata: [],
      testDatas: [],
      testsDeldata: [],
      testsDeltopdata: [],
      testid: '',
      // surgeryData:[],
    }
  },
  mounted() {
    // this.dealData()
    // this.getdata({ visid: '1' })
    // this.gettestData({ visid: '1' })
    this.getRecordDelData({ visid: '1' })
  },
  methods: {
    // 获取检查数据
    getdata(params = {}) {
      console.log('xxxx')
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
            console.log(this.inspectionData)
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
    // 获取手术信息
    getsurgeryData(params={}){
     this.loading = true
      this.$axios({
        url: this.api.selectsurgeryDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.surgeryData = res.rows
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
   // 获取住院信息
    getRecordDelData(params={}){
     this.loading = true
      this.$axios({
        url: this.api.selectRecordDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.RecordDelData = res.rows
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
    // 删除数据
    dealData() {
      for (let key in this.problemsData) {
        for (let i in this.problemsData[key].tags) {
          if (this.problemsData[key].tags[i].template.length > 5) {
            let str = this.problemsData[key].tags[i].template.substr(0, 5)
            this.problemsData[key].tags[i].updateText = str + '...'
          } else {
            let str = this.problemsData[key].tags[i].template.substr(0, 5)
            this.problemsData[key].tags[i].updateText = str
          }
        }
      }
    },
    tagsClick(data, index, status, i, num) {
      if (status == 1) {
        $('#' + index).css('color', '#1890ff')
        this.problemsData[i].tags[num].status = 2
        this.templateText = this.templateText + '、' + data
      } else {
        $('#' + index).css('color', 'rgba(0, 0, 0, 0.65)')
        this.problemsData[i].tags[num].status = 1
        this.templateText = this.templateText.replace('、' + data, '')
      }
    },
    cellStyle(row) {
      // console.log(row.row.resultSign)
      // if (row.row.resultSign=='2') {
      //   return 'color: blue; opacity: 0.6;'
      // }
      // else if (row.row.resultSign=='3') {
      //   return 'color: red; opacity: 0.6;'
      // }
      //  else if (row.row.resultSign!=='2'&&row.row.resultSign!=='1') {
      //   return 'color: red; opacity: 0.6;'
      // }
    },
    //版本对比
    versionContrast() {
      //console.log(1)
    },
    //标记收藏
    tagCollection() {
      //console.log(2)
    },
    // 检查功能事件点击
    clickrow(data) {
      //console.log('xxx')
      let params = { examId: data.examId }
      this.$axios({
        url: this.api.selectExamId,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.formData = res.data
            //console.log(this.formData)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    // 检验功能点击事件
    checkclick(data) {
      console.log('ssss')
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
            console.log(this.testsDeldata)
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
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
      }
      else if (key == 3) {   
        this.$axios({
          url: this.api.selectTestVisIdDel,
          method: 'put',
          data: param
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
      }
     else if(key==4){
         this.getsurgeryData({ visid: '1' })
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
    // 枚举状态
    statusFormatter(data){ 
    let levelText
    this.enum.surgerystatus.map(item=>{
      if(item.id=data){
      levelText = item.text
      }
    })
    return levelText
    },
    // 枚举
     isInfectionFormatter(data){ 
    let levelText
    this.enum.surgerystatus.map(item=>{
      if(item.id=data){
      levelText = item.text
      }
    })
    return levelText
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
    // 时间格式处理
  }
}
</script>

<style  lang="less">
.detail {
  margin-left: 10px;
}
.testchk {
  .ant-card-body {
    padding: 2px 2px;
  }
}
.dealRowchild {
  margin-top: 8px;
}
.titleText {
  font-size: 14px;
  font-weight: bold;
}

.detailDivider {
  margin-bottom: 30px;
  margin-top: 20px;
}
.textArea {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3; /*限制在一个块元素显示的文本的行数*/
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 100%;
  margin-top: 5px;
  text-indent: 2em;
}

.tagStyle {
  cursor: default;
  font-size: 12px;
  margin-left: 7px;
  margin-bottom: 5px;
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

.timelineItem p {
  margin-bottom: 5px;
}
.timelineItem p:nth-child(n + 2) {
  opacity: 0.8;
}
.detail {
  //   height: 330px;
  //  overflow-y:auto;
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