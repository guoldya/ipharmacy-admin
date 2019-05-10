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
            消化内科:
          </a-col>
          <a-col :md="3" :lg="4" :xxl="4">
            张力&nbsp;&nbsp; 女&nbsp;&nbsp;23岁
          </a-col>
          <a-col class="titleText" :md="12" :lg="12" :xxl="16">
            <a-tag :color="problemsData[0].colors" class="tagStyle"> 妊娠</a-tag>
            <a-tag :color="'#40a9ff'" class="tagStyle"> 哺乳</a-tag>
            <a-tag class="tagStyle"> 肝肾功能</a-tag>
          </a-col>
        </a-row>
        <a-divider type="horizontal" class="detailDivider"/>
        <detail-list>
          <detail-list-item term="身高"><span class="opacity8">175cm</span></detail-list-item>
          <detail-list-item term="体重"><span class="opacity8">60kg</span></detail-list-item>
          <detail-list-item term="体表面积"><span class="opacity8">32㎡</span></detail-list-item>
          <detail-list-item term="临床诊断"><span class="opacity8">胃炎</span></detail-list-item>
          <detail-list-item term="过敏史"><span class="opacity8">无</span></detail-list-item>
          <detail-list-item term="处方医生">
            <span class="opacity8"><a href="">
              黄磊&nbsp;<a-icon type="message"/>&nbsp;18423327418</a>
          </span></detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="cardHeight">
        <a-tabs defaultActiveKey="1" size="small" class="width-100">
          <a-tab-pane tab="处方信息" key="1">
              <a-row>
                <p class="dealP">处方单1：</p>
              </a-row>
              <a-row class="dealRow" v-for="(op,index) in adviceData" :key="index">
                <a-col class="dealCol" >{{op.num}}、
                  <span :style="{color:op.colors}">{{op.name}}</span>
                  &nbsp;&nbsp;<span>{{op.spec}}</span>
                  &nbsp;&nbsp;<span>{{op.total}}</span>
                    用法：<span>{{op.single}}</span>
                    &nbsp;&nbsp;<span>{{op.freq}}</span>
                    &nbsp;&nbsp;<span :style="{color:op.colors}">{{op.way}}</span>
                </a-col>
              </a-row>
              <a-row>
                <p class="dealP">处方单2：</p>
              </a-row>
              <a-row class="dealRow" v-for="(op,index) in adviceData" :key="index+5">
                <a-col class="dealCol" >{{op.num}}、
                  <span :style="{color:op.colors}">{{op.name}}</span>
                  &nbsp;&nbsp;<span>{{op.spec}}</span>
                  &nbsp;&nbsp;<span>{{op.total}}</span>
                    用法：<span>{{op.single}}</span>
                    &nbsp;&nbsp;<span>{{op.freq}}</span>
                    &nbsp;&nbsp;<span :style="{color:op.colors}">{{op.way}}</span>
                </a-col>
              </a-row>
          </a-tab-pane>
          <a-tab-pane tab="电子病历" key="2">

          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="10" class="padding-left-5">
      <a-card class="cardRight">
        <div class="dealRight">
          <a-tabs defaultActiveKey="1" size="small" class="width-100">
            <a-tab-pane tab="预判情况" key="1" >
              <p class="dealP">问题描述</p>
              <a-card class="margin-top-10 antCard" v-for="(op,index) in problemsData" :key="index">
                <a-tag :color="op.colors" class="tagStyle"> {{op.problem }}级</a-tag>
                <span :style="{fontWeight:'bold'}">{{op.problemText}}</span>
                <a-tooltip placement="top" :key="num" v-for="(pd,num) in op.tags" >
                  <template slot="title" style="width: 100px">{{pd.template}}</template>
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
                    <a-menu-item v-for="(pd,num) in op.tags" @click="tagsClick(pd.template)" v-if="num>=3" :key="num">{{pd.updateText}}</a-menu-item>
                  </a-menu>
                  <a v-if="op.tags.length>3" class="margin-left-5">更多<a-icon type="down"/></a>
                  <a v-else></a>
                </a-dropdown>
                <div :rows="3" :maxRows="4" read-only class="textArea opacity8">
                  {{op.text}}
                </div>
                <!--<a-row class="margin-top-10 selectInput ">-->
                <!--<a-col :md="6" :lg="5" :xxl="3">驳回理由:</a-col>-->
                <!--<a-col :md="11" :lg="14" :xxl="18">-->
                <!--<a-input>-->
                <!--<a-select style="width: 100px" :dropdownMatchSelectWidth="false" slot="addonBefore"-->
                <!--defaultValue="+86">-->
                <!--<a-select-option value="+86">库存不足</a-select-option>-->
                <!--<a-select-option value="+87">药房库存不足</a-select-option>-->
                <!--</a-select>-->
                <!--</a-input>-->
                <!--</a-col>-->
                <!--<a-col :md="4" :lg="5" :xxl="3">-->
                <!--<a-button>存为模板</a-button>-->
                <!--</a-col>-->
                <!--</a-row>-->

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
      <a-button  @click="submit"  :loading="loading">上一个</a-button>
      <a-button  @click="submit" class="margin-left-5"  :loading="loading">下一个</a-button>
      <a-button  @click="submit"style="margin-left: 20px"  :loading="loading">驳回</a-button>
      <a-button type="primary" class="margin-left-5" @click="submit"  :loading="loading">通过</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import STable from '@/components/table/'
  import DetailList from '@/components/tools/DetailList'
  import ABadge from 'ant-design-vue/es/badge/Badge'
  import FooterToolBar from '@/components/FooterToolbar'
  import { mixin, mixinDevice } from '@/utils/mixin'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  const DetailListItem = DetailList.Item
  export default {
    components: {
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
        problemsData: [
          {
            status: 1,
            time: '2018-09-21  08:50:08',
            submitDoc: '黄磊',
            deptName: '消化内科',
            prescriptionNum: 1,
            patientName: '张力',
            patientNum: '201904010001',
            patientSex: '女',
            patientAge: '23岁',
            problem: '5',
            colors: '#FF6600',
            problemText: '重复给药',
            tags:[{template:'避免重复用药',num:11,updateText:'',status:1},
              {template:'避免用药过度',num:12,updateText:'',status:1},
              {template:'药剂量太少',num:13,updateText:'',status:1},
              {template:'药剂量太少',num:14,updateText:'',status:1},
              {template:'药剂量太少',num:15,updateText:'',status:1}],
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
            tags:[{template:'避免重复用药',num:21,updateText:'',status:1},
              {template:'避免用药过度',num:22,updateText:'',status:1},
              {template:'药剂量太少',num:23,updateText:'',status:1}],
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
            tags:[{template:'避免重复用药',num:31,updateText:'',status:1},
              {template:'避免用药过度',num:32,updateText:'',status:1},
              {template:'药剂量太少',num:33,updateText:'',status:1}],
            text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。'
          }],
        tags:[],
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
            spec: '2ml:0.2g',
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
            colors: 'rgb(225,102,102)'
          },
          { num: 4, name: '益肾灵胶囊', spec: '0.1GM*100粒/瓶', total: '72粒', single: '0.33g', freq: '每天三次', way: '口服' },
          {
            num: 5,
            name: '银杏叶丸',
            spec: '0.2g*12颗/瓶 ',
            total: '40颗',
            single: '0.33g',
            freq: '每天三次',
            way: '口服',
            colors: 'rgb(225,102,102)'
          }
        ],
        templateText:'12333',
      }
    },
    mounted() {
      this.dealData();
    },
    methods: {
      submit() {

      },
      cancle() {
        this.$router.push({
          name: 'presOutpatientIndex'
        })
      },
      dealData(){
        for (let key in this.problemsData){
          for (let i in this.problemsData[key].tags){
            if (this.problemsData[key].tags[i].template.length>5){
              let str = this.problemsData[key].tags[i].template.substr(0,5);
              this.problemsData[key].tags[i].updateText = str+'...';
            }else {
              let str = this.problemsData[key].tags[i].template.substr(0,5);
              this.problemsData[key].tags[i].updateText = str;
            }
          }
        };
      },
      tagsClick(data,index,status,i,num,){
        if (status == 1){
          $("#"+index).css("color", "#1890ff");
          this.problemsData[i].tags[num].status = 2;
          this.templateText =this.templateText+'、'+data;
        } else {
          $("#"+index).css("color", "rgba(0, 0, 0, 0.65)");
          this.problemsData[i].tags[num].status = 1;
          this.templateText =this.templateText.replace('、'+data,'');
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

  .detailDivider{
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
    cursor: default;
    font-size: 12px;
    margin-left: 7px;
    margin-bottom: 5px;
  }
  .saveButton{
    margin-top: 10px;
    margin-left:10px;
    float: left
  }
  .problemTag{
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

  .timelineItem p{
    margin-bottom: 5px;
  }
  .timelineItem p:nth-child(n+2){
    opacity: 0.8;
  }
</style>