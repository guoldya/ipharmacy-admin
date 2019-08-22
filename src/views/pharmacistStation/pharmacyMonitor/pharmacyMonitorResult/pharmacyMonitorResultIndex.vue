<template>
    <div class="pharmacyMonitorResultIndex">
        <detailHeader :userName="userName" :tagList="tagList" :userInfo="userInfo"></detailHeader>

      <a-card class="margin-top-5 ">
        <div class="disFlex">
          <span class="font-bold fontSize16">药学监护结果</span>
          <span>
            <a-button  type="primary" @click="()=>$router.push({name:'pharmacyMonitorPlanIndex'})">调整监测计划</a-button>
            <a-button type="primary" class="margin-left-5" @click="()=>$router.push({name:'effectMonitorReportAdd'})">不良事件</a-button>
            <a-button type="primary" class="margin-left-5" @click="()=>$router.push({name:'medicalEducationAdd'})">用药教育</a-button>
          </span>
        </div>

        <a-form  class="ant-advanced-search-form" :form="form">
            <a-tabs :defaultActiveKey="1" @change="callback">
                <a-tab-pane v-for="(list,i) in content" :key="i+1" :tab="list.tab">
                    <div>
                      <div class="disFlex borderCard">
                         <span>
                            <span class="font-bold fontSize16">{{list.title}}</span>
                            <span class="margin-left-10">当前监护<a-tag color="#108ee9" class="margin-left-5">6</a-tag>个指标，</span>
                            <span>其中<a-tag color="#C49F47" class="margin-left-5">2</a-tag>个异常，</span>
                            <span>其他异常<a-tag color="#f5222d" class="margin-left-5">4</a-tag>个</span>
                         </span>
                         <span>
                          <a-button type="primary" @click="()=>$router.push({name:'monitorRecordsEdit'})">添加监护记录</a-button>
                          <a-button type="primary" class="margin-left-5">配置监护指标</a-button>
                        </span>
                      </div>
                      

                      <a-row class="margin-top-5">
                        <a-col>
                           <a-form-item>
                             <div id="monitorResult" :style="{width:widths, height:heights}" ref="myEchart" />
                            </a-form-item>
                        </a-col>
                      </a-row>
                  </div>
                </a-tab-pane>
            </a-tabs>
            

             <a-tabs :defaultActiveKey="1" >
                <a-tab-pane v-for="(list,i) in contentTwo" :key="i+1" :tab="list.tab">
                    <div>
                      <a-spin v-if="list.columns" class="margin-top-5" :spinning="loading" tip="加载中...">
                          <el-table
                                class="margin-top-10"
                                :data="list.dataSource"
                                border
                                :highlight-current-row="true"
                                style="width: 100%"
                              >
                                <el-table-column
                                  v-for="item in list.columns"
                                  :show-overflow-tooltip="true"
                                  :key="item.value"
                                  :label="item.title"
                                  :prop="item.value"
                                  :width="item.width"
                                  :align="item.align"
                                >
                                  <template  slot-scope="scope">
                                    <span class="updateBtn inHospitalNo" v-if="item.value==='no'">123</span>
                                    <span v-else>{{scope.row[item.value]}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column label="操作" :width="150" align="center" v-if="true">
                                  <template slot-scope="scope">
                                      <opcol :items="items" :more="false" :data="scope.row"></opcol>
                                  </template>
                                </el-table-column>
                          </el-table>
                      </a-spin>
                  </div>
                </a-tab-pane>
            </a-tabs>
        </a-form>
      </a-card>
    </div>
</template>

<script>
import echarts from 'echarts'
  export default {
    name: 'pharmacyMonitorResultIndex',
    data(){
      return{
          option : {
            title: {
            text: '指标趋势图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'直接访问',
                    type:'line',
                    stack: '总量',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量',
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        },
        title:'1',
        form: this.$form.createForm(this),
        content:[
          {tab:'疗效监测',title:'监护指标',dataField:'curativeEffect',value:'1',
            columns: [
                { title: '类别', value: 'name', align: 'left' , width: 200},
                { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                { title: '干预', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝'}],
          },
          {tab:'安全性监测',title:'监护指标',dataField:'safety',value:'2',
            columns: [
                { title: '类别123', value: 'name', align: 'left' , width: 200},
                { title: '指标名称', value: 'name1', align: 'left', width: 120 },
                { title: '条件值', value: 'testItemName', align: 'left', width: 200 },
                { title: '干预', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝123'}],
          },
          {tab:'依从性监测',title:'监护指标',dataField:'rely',value:'3',
            formItem:[
                {label:'监护频率',type:'select',val:'time',dataField:'time'},
                {label:'开始日期',type:'date',val:'date',dataField:'date'}
            ],
            checkItem:[
                {label:'监护指标',type:'checked',val:'time',dataField:'target',
                  options:[
                    {label:'适应症',value:'1',dataField:'disease'},
                    {label:'用法用量',value:'2',dataField:'usage'}
                  ]
                },
                {label:'干预方案',type:'checked',val:'date',dataField:'plan',
                options:[
                  {label:'用药教育',value:'1',dataField:'medicalEdu'},
                  {label:'其他',value:'2',dataField:'other'}
                ]},
            ],
          },
        ],

        contentTwo:[
          {tab:'用药总结',dataField:'cu1rativeEffect',value:'1',
            columns: [
                { title: '药品名称', value: 'name', align: 'left' , width: 200},
                { title: '08-10', value: 'name1', align: 'left', width: 120 },
                { title: '08-11', value: 'testItemName', align: 'left', width: 200 },
                { title: '08-12', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝'}],
          },
          {tab:'查房视图',dataField:'sa3fety',value:'2',
            columns: [
                { title: '药品名称123', value: 'name', align: 'left' , width: 200},
                { title: '08-13', value: 'name1', align: 'left', width: 120 },
                { title: '08-14', value: 'testItemName', align: 'left', width: 200 },
                { title: '08-15', value: 'englishName', align: 'left' },
            ],
            dataSource: [{name:'纳屈肝123'}],
          },
        ],
        
        loading:false,
        userName:'梁汉文',
            tagList:[
                {tag:'91084654',color:'#40a9ff'},
                {tag:'肝',color:'#40a9ff'},
                {tag:'肾',color:'#58C7CF'},
                {tag:'心',color:'#B497EE'},

            ],
            userInfo:{
                sex:'男',
                age:'35岁'  ,
                dept:'皮肤科',
                stage:' 5病区/2床',
                docNurse:'胡清/黄晶锐',
                date:'2019-08-05'
            },
        items:[],
      }
    },
    props: {
            widths: {
                type: String,
                default: '100%'
            },
            heights: {
                type: String,
                default: '300px'
            }
    },
    components:{
    },
    mounted(){
        let _this=this;
      setTimeout(()=>{
        this.initChart();
      },500);
      window.onresize = function() {
        setTimeout(() => {
          _this.chart.resize()
        }, 500)
      }
    },
    methods:{
      initChart() {
        this.chart = echarts.init(document.getElementById('monitorResult'));
        this.chart.setOption(this.option, true);
      },
      //tabs
      callback (val) {
        console.log(val)
      },
    }
  }
</script>

<style scoped lang="less">
  .pharmacyMonitorResultIndex{
    .margin-left-10{
        margin-left: 10px;
    }
    .borderCard{
        border-bottom:1px solid #e8e8e8;
        padding: 24px 32px;
    }
  }
</style>