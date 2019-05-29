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
                <div v-if="op.auditingStatus == '1'" class="iconTobe"></div>
                <div v-if="op.auditingStatus == '2'" class="iconRefused"></div>
                <!--<img src="" alt="">-->
                <a-row>
                  <a-col :span="5">处方号：<span class="font-bold">{{op.prescNum}}</span></a-col>
                  <a-col :span="5">处方科室：<span class="font-bold">{{op.deptName}}</span></a-col>
                  <a-col :span="5">处方医生：<span class="font-bold">{{op.prescDocName}}</span></a-col>
                  <a-col :span="6">处方时间：<span class="font-bold">{{op.prescDate}}</span></a-col>
                </a-row>
                <a-row class="dealRow">
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
              <span v-for="ta in tagsData " style="float: right">
                <a-tag v-if="ta.status == true" class="checkTag tagStyle" :style="{'background':ta.levelColor, 'color':'#fff'}" @click="checkableChange(ta)" > {{ta.auditName }}</a-tag>
                <a-tag v-else-if="ta.status == false" class="checkTag tagStyle" :style="{'background':'#fff', 'color':ta.levelColor}"   @click="checkableChange(ta)" > {{ta.auditName }}</a-tag>
              </span>
              <span style="float: right">
                <a-tag class="checkTag tagStyle aTag1" v-if="checkedAll"style="" @click="handleChange" > 全部</a-tag>
                <a-tag class="checkTag tagStyle aTag2" v-else @click="handleChange"> 全部</a-tag>
              </span>
              <a-card class="margin-top-10 antCard" @click="clickTagsCard(op)" v-for="(op,index) in rightData " v-if="op.status" :style="{'borderColor':op.borderColor}" :key="index">
                <a-tag class="tagStyle" :color="op.levelColor" > {{op.auditName }}</a-tag>
                <span :style="{fontWeight:'bold'}">{{op.auditClass}}</span>
                <a-tooltip placement="top" :key="index" v-for="(pd,index) in op.reviewTemplateList">
                  <template slot="title" style="width: 100px">{{pd.titles}}</template>
                  <a-tag
                    class="problemTag"
                    v-if="index<3 && pd.bgColor == '#2eabff'"
                    :key="index"
                    @click="tagsClick(pd)"
                    color="#2eabff"
                  >{{pd.updateTitles}}
                  </a-tag>
                  <a-tag
                    class="problemTag"
                    v-else-if="index<3"
                    :key="index"
                    @click="tagsClick(pd)"
                  >{{pd.updateTitles}}
                  </a-tag>
                </a-tooltip>
                <a-dropdown :trigger="['hover']">
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(gd,index) in op.reviewTemplateList"  @click="tagsClick(gd)" v-if="index>=3" :key="index">
                      {{gd.updateTitles}}
                    </a-menu-item>
                  </a-menu>
                  <a v-if="op.reviewTemplateList.length>3" class="margin-left-5">更多
                    <a-icon type="down"/>
                  </a>
                  <a v-else></a>
                </a-dropdown>
                <div :rows="3" :maxRows="4" read-only class="textArea ">
                  <a-tag>描述</a-tag><span class="opacity8">{{op.auditDescription}}</span>
                </div>
                <div :rows="3" :maxRows="4" read-only >
                  <a-tag>建议</a-tag>{{op.audSuggest}}
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
        templateText: '',
        leftData: {},
        rightData:[],
        tagsData:[],
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
        checkedAll:true,
        orderId:'',
        levelColor:'',
      }
    },
    mounted() {
      this.getDetailData()
    },
    methods: {
      getDetailData() {
        let params = this.$route.query
        selectOutDetail(params).then(res => {
          if (res.code == '200') {
            this.leftData = res.data
            this.rightData =this.leftData.reviewOrderissueVOList;
            this.tagsData = this.leftData.levelTotalsList;
            this.dealTagsData(this.tagsData);
            this.deal(this.rightData);
          } else {
            this.warn(res.msg)
          }
        }).catch(err => {
          this.error(err)
        })
      },
      dealTagsData(data){
        for (let key in data) {
          data[key].status = true;
        }
      },
      deal(data) {
        for (let key in data) {
          data[key].status = true;
          data[key].borderColor = '#d9d9d9';
          let list = data[key].reviewTemplateList;
          for (let i in list){
            list[i].bgColor= '#d9d9d9'
            if (list[i].titles.length>5){
              list[i].updateTitles = list[i].titles.substr(0, 5)+'...'
            }else {
              list[i].updateTitles = list[i].titles
            }
          }
        }
        data.push();
      },
      submit() {

      },
      cancle() {
        this.$router.push({
          name: 'presOutpatientIndex'
        })
      },
      tagsClick(pd) {
        var event = window.event || arguments.callee.caller.arguments[0]
        if (event.stopPropagation) {
          event.stopPropagation();      //阻止事件 冒泡传播
        } else {
          event.cancelBubble = true;   //ie兼容
        }
        let data =  this.rightData;
        for (let key in data) {
          let list = data[key].reviewTemplateList;
          for (let i in list){
            if (list[i].id == pd.id){
              list[i].bgColor= '#2eabff'
            }else{
              list[i].bgColor= '#d9d9d9'
            }
          }
        }
        this.templateText = pd.reviewTemplate;
        this.rightData.push();
      },
      tableRowStyle({ row, rowIndex }) {
        if (this.orderId == row.clinicPrescId) {
          // console.log('rgb('+this.convertHexToRGB(this.levelColor).join(',')+',0.4)');
          return {'background':'rgb('+this.convertHexToRGB(this.levelColor).join(',')+',0.3)'}
        }
      },
      convertHexToRGB(str )
      {
        str = str[0] === '#' ? str.slice(1) : str
        str = str.length === 3 ? str.repeat(2) : str
        if ((str.length !== 6) || !(/^[0-9a-fA-F]{3,6}$/i.test(str))) return 'Invalid data'
        return [parseInt(str[0] + str[1], 16), parseInt(str[2] + str[3], 16), parseInt(str[4] + str[5], 16)]
      },
      handleChange(checked){
        let data = this.rightData
          for (let key in data){
            data[key].status = true;
          }
        for (let key in this.tagsData){
          this.tagsData[key].status = true;
        }
          this.checkedAll=true;
      },
      checkableChange(data){
          for (let key in this.rightData){
            if (this.rightData[key].auditLevel == data.auditLevel){
              this.checkedAll=false;
              this.rightData[key].status = true;
            }else{
              this.rightData[key].status = false;
            }
          }
          for (let key in this.tagsData){
            if (data.auditLevel == this.tagsData[key].auditLevel){
              this.tagsData[key].status = true;
            }else {
              this.tagsData[key].status = false;
            }
          }
          this.rightData.push();
      },

      clickTagsCard(data){
        for (let key in this.rightData){
          if (this.rightData[key].verdictId == data.verdictId){
            this.rightData[key].borderColor = '#1890ff';
          }else {
            this.rightData[key].borderColor = '#d9d9d9'
          }
        }
        this.orderId = data.orderId;
        this.levelColor = data.levelColor;
        this.rightData.push();
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
    margin-bottom: 5px;
    /*text-indent: 2em*/
  }

  .tagStyle {
    font-size: 12px;
    /*margin-left: 7px;*/
    margin-bottom: 5px;
  }
   .aTag1{
     background: #2eabff;
     color:#fff
  }
   .aTag2{
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
    right: 30%;
    top: 15%;
    /*background-repeat:no-repeat;*/
  }
  .cardHeight .iconRefused{
    width: 183px;
    height: 96px;
    z-index: 3;
    background-image: url("~@/assets/refused.png");
    background-repeat: no-repeat;
    /*background-size: 50% 50%;*/
    position: absolute;
    right: 30%;
    top: 15%;
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

  .antCard{
    cursor: pointer;
  }

</style>