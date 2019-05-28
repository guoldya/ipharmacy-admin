<template>
  <div class="detailPres">
    <a-col :span="14">
      <a-card>
        <div class="cardHead">
          <a href="#" @click.prevent="cancle">
            <a-icon type="left"></a-icon>
            返回
          </a>
        </div>
        <a-row class=" margin-top-10">
          <a-col class="titleText" :md="4" :lg="3" :xxl="2">
            {{leftData.patientDeptName}}：
          </a-col>
          <a-col :md="3" :lg="4" :xxl="4">
            {{leftData.patientName}}&nbsp;&nbsp; {{leftData.patientSex | control_type}}&nbsp;&nbsp;{{leftData.agevalue}}岁
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
          <detail-list-item term="临床诊断"><span class="opacity8">{{leftData.diseaseName}}</span></detail-list-item>
          <detail-list-item term="过敏史"><span class="opacity8">无</span></detail-list-item>
          <detail-list-item term="处方医生">
            <span class="opacity8"><a href="">
              {{leftData.attendingDocName}}&nbsp;<a-icon type="message"/>&nbsp;{{leftData.attendingDocPhone}}</a>
          </span></detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="cardHeight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100">
          <a-tab-pane tab="处方信息" key="1">

            <div v-for=" (op,index) in leftData.clinicPrescVOList">
              <a-card class="margin-top-10">
                <a-row>
                  <a-col :span="5">处方号：<span class="font-bold">{{op.prescNum}}</span></a-col>
                  <a-col :span="5">处方科室：<span class="font-bold">{{op.deptName}}</span></a-col>
                  <a-col :span="5">处方医生：<span class="font-bold">{{op.prescDocName}}</span></a-col>
                  <a-col :span="6">处方时间：<span class="font-bold">{{op.prescDate}}</span></a-col>
                </a-row>
                <a-row class="dealRow">
                  <!--<a-col class="dealCol" >{{ds.seqNum}}、-->
                  <!--<span :style="{color:op.colors}">{{ds.drugName}}</span>-->
                  <!--&nbsp;&nbsp;<span>{{ds.spec}}</span>-->
                  <!--&nbsp;&nbsp;<span>{{ds.amountStr}}</span>-->
                  <!--<span>{{ds.dosageStr}}</span>-->
                  <!--用法：<span>{{ds.frequency}}</span>-->
                  <!--&nbsp;&nbsp;<span>{{ds.useType}}</span>-->
                  <!--</a-col>-->
                  <el-table
                    class="margin-top-10 width-100"
                    :data="op.prescVOList"
                    highlight-current-row
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
              <span v-for="ta in rightData " style="float: right">
                <a-tag v-if="ta.status == true" class="checkTag tagStyle" :style="{'background':ta.levelColor, 'color':'#fff'}" @click="checkableChange(ta)" > {{ta.auditName }}</a-tag>
                <a-tag v-else-if="ta.status == false" class="checkTag tagStyle" :style="{'background':'#fff', 'color':ta.levelColor}"   @click="checkableChange(ta)" > {{ta.auditName }}</a-tag>
              </span>
              <span style="float: right">
                <a-tag class="checkTag tagStyle" v-if="checkedAll"style="background: #2eabff;color:#fff" @click="handleChange" > 全部</a-tag>
                <a-tag class="checkTag tagStyle" v-else style="background: #fff;color: #2eabff" @click="handleChange"> 全部</a-tag>
              </span>
              <a-card class="margin-top-10 antCard" v-for="(op,index) in this.rightData " v-if="op.status"  :key="index">
                <a-tag class="tagStyle" :color="op.levelColor" > {{op.auditName }}</a-tag>
                <span :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
                <!--<a-tooltip placement="top" :key="num" v-for="(pd,num) in op.tags">-->
                  <!--<template slot="title" style="width: 100px">{{pd.template}}</template>-->
                  <!--<a-tag-->
                    <!--class="problemTag"-->
                    <!--:id="pd.num"-->
                    <!--v-if="num<3"-->
                    <!--:key="num"-->
                    <!--@click="tagsClick( pd.template,pd.num,pd.status,index,num,)"-->
                  <!--&gt;{{pd.updateText}}-->
                  <!--</a-tag>-->
                <!--</a-tooltip>-->
                <!--<a-dropdown :trigger="['click']">-->
                  <!--<a-menu slot="overlay">-->
                    <!--<a-menu-item v-for="(pd,num) in op.tags" @click="tagsClick(pd.template)" v-if="num>=3" :key="num">-->
                      <!--{{pd.updateText}}-->
                    <!--</a-menu-item>-->
                  <!--</a-menu>-->
                  <!--<a v-if="op.tags.length>3" class="margin-left-5">更多-->
                    <!--<a-icon type="down"/>-->
                  <!--</a>-->
                  <!--<a v-else></a>-->
                <!--</a-dropdown>-->
                <div :rows="3" :maxRows="4" read-only class="textArea opacity8">
                  {{op.auditDescription}}
                </div>
              </a-card>
              <div class="margin-top-10">
                <p class="dealP margin-top-10" style="float: left">审核意见</p>
                <a-button type="primary" class="saveButton" size="small">存为模板</a-button>
                <a-textarea :rows="4" v-model="templateText"></a-textarea>
              </div>
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
                  <p>请医生再次审核 </p>
                </a-timeline-item>
                <a-timeline-item color="red" class="timelineItem">
                  <p>2015-09-01 15:00</p>
                  <p>有接触隔离医嘱 1</p>
                  <p>有隔离措施 2</p>
                  <p>医疗废物处置 3 </p>
                </a-timeline-item>
                <a-timeline-item class="timelineItem">
                  <p>2015-09-01 15:00</p>
                  <p>离开病区检查是否通知相关科室做好防护等 1</p>
                  <p>有隔离措施 2</p>
                  <p>医疗废物处置 3 </p>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
    </a-col>
    <footer-tool-bar
      :extra="false"
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <a-button @click="submit" :loading="loading">上一个</a-button>
      <a-button @click="submit" class="margin-left-5" :loading="loading">下一个</a-button>
      <a-button @click="submit" style="margin-left: 20px" :loading="loading">驳回</a-button>
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
      FooterToolBar
    },
    mixins: [mixin, mixinDevice],
    name: 'detail',
    data() {
      return {
        loading: false,
        tags: [],
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
            tags: [{ template: '避免重复用药', num: 11, updateText: '', status: 1 },
              { template: '避免用药过度', num: 12, updateText: '', status: 1 },
              { template: '药剂量太少', num: 13, updateText: '', status: 1 },
              { template: '药剂量太少', num: 14, updateText: '', status: 1 },
              { template: '药剂量太少', num: 15, updateText: '', status: 1 }],
            text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。头孢丙烯分散片和头孢克洛缓释胶囊为重复用药.头孢丙烯分散片和头孢克洛缓释胶囊为重复用药头孢丙烯分散片和头孢克洛缓释胶囊为重复用药'
          },
          {
            status: 1,
            time: '2018-09-21  08:50:08',
            openName: '张力張',
            deptName: '消化内科',
            prescriptionNum: 1,
            patientName: '张力張',
            patientNum: '201904010001',
            patientSex: '女',
            patientAge: '23岁',
            problem: '4',
            colors: '#FFCC00',
            problemText: '重复给药',
            tags: [{ template: '避免重复用药', num: 21, updateText: '', status: 1 },
              { template: '避免用药过度', num: 22, updateText: '', status: 1 },
              { template: '药剂量太少', num: 23, updateText: '', status: 1 }],
            text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。'
          },
          {
            status: 1,
            time: '2018-09-21  08:50:08',
            openName: '张力張',
            deptName: '消化内科',
            prescriptionNum: 1,
            patientName: '张力張',
            patientNum: '201904010001',
            patientSex: '女',
            patientAge: '23岁',
            problem: '3',
            colors: '#DFE184',
            problemText: '重复给药',
            tags: [{ template: '避免重复用药', num: 31, updateText: '', status: 1 },
              { template: '避免用药过度', num: 32, updateText: '', status: 1 },
              { template: '药剂量太少', num: 33, updateText: '', status: 1 }],
            text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。'
          }],
        templateText: '12333',
        leftData: {},
        rightData:[],
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
        checkedAll:false,
      }
    },
    mounted() {
      this.dealData()
      this.getDetailData()
    },
    methods: {
      getDetailData() {
        let params = this.$route.query
        selectOutDetail(params).then(res => {
          if (res.code == '200') {
            this.leftData = res.data
            this.rightData =this.leftData.reviewOrderissueVOList;
            this.deal(this.rightData);
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      deal(data) {
        for (let key in data) {
          data[key].status = false;
        }
      },
      submit() {

      },
      cancle() {
        this.$router.push({
          name: 'presOutpatientIndex'
        })
      },
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
      tableRowStyle({ row, rowIndex }) {
        if (this.problemId == row.drugId) {
          let colors = '#FF6600'
          return 'background:' + colors
        }
      },
      handleChange(checked){
        let data = this.rightData
        if(this.checkedAll)
        {
          for (let key in data){
            data[key].status = false;
          }
          this.checkedAll=false;
        }else {
          for (let key in data){
            data[key].status = true;
          }
          this.checkedAll=true;
        }
      },
      checkableChange(data){
          for (let key in this.rightData){
            if (this.rightData[key].verdictId == data.verdictId){
              if (this.rightData[key].status){
                this.rightData[key].status = false;
              } else{
                this.rightData[key].status = true;
              }
            }
          }
          this.rightData.push();

        console.log(data)
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
    text-indent: 2em
  }

  .tagStyle {
    font-size: 12px;
    margin-left: 7px;
    margin-bottom: 5px;
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

  .checkTag{
    border: 1px #d9d9d9 solid;
  }

</style>