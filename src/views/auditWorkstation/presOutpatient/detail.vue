<template>
  <div>
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
      <a-divider type="horizontal"/>
      <detail-list class="margin-top-10">
        <detail-list-item term="身高"><span class="opacity8">175cm</span></detail-list-item>
        <detail-list-item term="体重"><span class="opacity8">60kg</span></detail-list-item>
        <detail-list-item term="体表面积"><span class="opacity8">32㎡</span></detail-list-item>
        <detail-list-item term="临床诊断"><span class="opacity8">胃炎</span></detail-list-item>
        <detail-list-item term="过敏史"><span class="opacity8">无</span></detail-list-item>
        <detail-list-item term="处方医生"><span class="opacity8"><a href="">黄磊&nbsp;<a-icon type="message"/>&nbsp;18423327418</a>
          </span></detail-list-item>
      </detail-list>
    </a-card>
    <a-row class="margin-top-5 ">
      <a-col :span="14">
        <a-card class="cardHeight">
          <a-tabs defaultActiveKey="1" size="small" class="width-100">
            <a-tab-pane tab="处方信息" key="1" class="tabPaneLeft">
              <a-col class="cardColHeight" :span="11">
                <a-row>
                  <p class="dealP">处方单1：</p>
                </a-row>
                <a-row class="dealRow" v-for="op in adviceData">
                  <a-col :offset="2"> {{op.num}}、
                    <span :style="{color:op.colors}">{{op.name}}</span>&nbsp;&nbsp;{{op.spec}}&nbsp;&nbsp;{{op.total}}
                    <br>
                    用法： {{op.single}}&nbsp;&nbsp;{{op.freq}}&nbsp;&nbsp;<span :style="{color:op.colors}">{{op.way}}</span>
                  </a-col>
                </a-row>
              </a-col>
              <a-col class="cardColHeight" :span="1">
                <a-divider type="vertical" class="height-100"/>
              </a-col>
              <a-col :span="11">
                <a-row>
                  <p class="dealP">处方单2：</p>
                </a-row>
                <a-row class="dealRow" v-for="op in adviceData">
                  <a-col :offset="2"> {{op.num}}、
                    {{op.name}}&nbsp;&nbsp;{{op.spec}}&nbsp;&nbsp;{{op.total}} <br>
                    用法： {{op.single}}&nbsp;&nbsp;{{op.freq}}&nbsp;&nbsp;{{op.way}}
                  </a-col>
                </a-row>
              </a-col>
            </a-tab-pane>
            <a-tab-pane tab="电子病历" key="2">

            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col :span="10" class="padding-left-5">
        <a-card class="cardHeight">
          <div class="dealRight">
            <a-tabs defaultActiveKey="1" size="small" class="width-100">
              <a-tab-pane tab="预判情况" key="1" class="tabPaneLeft">
                <a-card class="margin-top-10 antCard" v-for="(op,index) in problemsData" :key="index">
                  <a-tag :color="op.colors" class="tagStyle"> {{op.problem }}级</a-tag>
                  <span :style="{fontWeight:'bold'}">{{op.problemText}}</span>
                  <div class="lineText opacity8">
                    {{op.text}}
                  </div>
                  <a-row class="margin-top-10 selectInput ">
                    <a-col :md="6" :lg="5" :xxl="3">驳回理由:</a-col>
                    <a-col :md="11" :lg="14" :xxl="18">
                      <a-input>
                        <a-select style="width: 100px" slot="addonBefore" defaultValue="+86">
                          <a-select-option value="+86">库存不足</a-select-option>
                          <a-select-option value="+87">药房库存不足</a-select-option>
                        </a-select>
                      </a-input>
                    </a-col>
                    <a-col :md="4" :lg="5" :xxl="3">
                      <a-button>存为模板</a-button>
                    </a-col>
                  </a-row>

                </a-card>
              </a-tab-pane>
              <a-tab-pane tab="干预记录" key="2">
                <a-timeline>
                  <a-timeline-item color="green">系统预判不通过 2015-09-01</a-timeline-item>
                  <a-timeline-item color="green">请医生再次审核 2015-09-01</a-timeline-item>
                  <a-timeline-item color="red">
                    <p>有接触隔离医嘱 1</p>
                    <p>有隔离措施 2</p>
                    <p>医疗废物处置 3 2015-09-01</p>
                  </a-timeline-item>
                  <a-timeline-item>
                    <p>离开病区检查是否通知相关科室做好防护等 1</p>
                    <p>有隔离措施 2</p>
                    <p>医疗废物处置 3 2015-09-01</p>
                  </a-timeline-item>
                </a-timeline>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import STable from '@/components/table/'
  import DetailList from '@/components/tools/DetailList'
  import ABadge from 'ant-design-vue/es/badge/Badge'

  const DetailListItem = DetailList.Item
  export default {
    components: {
      PageLayout,
      ABadge,
      DetailList,
      DetailListItem,
      STable
    },
    name: 'detail',
    data() {
      return {
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
            text: '头孢丙烯分散片和头孢克洛缓释胶囊为重复用药。避免重复用药。'
          }],
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
          { num: 5, name: '银杏叶丸', spec: '0.2g*12颗/瓶 ', total: '40颗', single: '0.33g', freq: '每天三次', way: '口服',colors: 'rgb(225,102,102)' }
        ]
      }
    },
    mounted() {
    },
    methods: {
      cancle() {
        this.$router.push({
          name: 'presOutpatient'
        })
      }
    }
  }
</script>

<style scoped>
  .titleText {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .lineText {
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3; /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 100%;
    text-indent: 2em;
  }

  .tagStyle {
    cursor: default;
    font-size: 12px
  }

  .cardHeight {
    height: 500px;
  }

  .cardHeight .cardColHeight {
    height: 400px;
  }

  .cardHeight .dealP {
    font-size: 16px;
    font-weight: bold
  }

  .dealRow {
    margin-top: 10px;
    font-size: 14px;
    line-height: 25px;
  }

  .dealRow .sizeWeight {
    font-size: 16px;
    font-weight: bold
  }

  .dealRight .selectInput {
    line-height: 30px;
  }

  .dealRight .antCard {
    height: 160px;
  }

</style>