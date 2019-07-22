<template>
  <div>
    <a-card>
      <ul class="ulList">
        <li>
          次数：<a-input-number></a-input-number>
        </li>
        <li>
          <a-range-picker class="dataPicker" @change="onChange"/>
        </li>
        <li class="year"  tabindex="0" v-on:click="thisYear">全年</li>
        <li class="season"  tabindex="0" v-on:click="season">本季度</li>
        <li class="month"   tabindex="0" v-on:click="month">本月</li>
        <li class="today"   tabindex="0" v-on:click="today">今日</li>
      </ul>
    </a-card>
    <a-row class="margin-top-5">
      <a-col :span="16">
        <a-card :bodyStyle="{width:'100%', height:'400px'}" >
          <div id="myEchart"  ref="myEchart"></div>
        </a-card>
      </a-col>
      <a-col :span="8" class="padding-left-5">
        <a-card  :bodyStyle="{width:'100%', height:'400px'}" >
          <h3 class="font-bold">规则预警排名：</h3>
            <div v-for="(item,i) in listData"  class="rankWarn" :key="i">
              <a-row>
                <a-col span="6" v-if="i<3" class="badgeCol"><a-badge :count="item.carCode":numberStyle= "{backgroundColor: '#000'} " /></a-col>
                <a-col span="6" v-else class="badgeCol"><a-badge :count="item.carCode" :numberStyle="{backgroundColor: '#eee', color: '#000'}"  /></a-col>
                <a-col span="10"  class="fontText">
                  <a style="color: #666666;" >{{item.carType}}</a>
                </a-col>
                <a-col  span="6" class="fontText">
                  <a style="color: #666666;">{{item.num}}次</a>
                </a-col>
              </a-row>
            </div>
        </a-card>
      </a-col>
    </a-row>
    <a-card  class="margin-top-5">
      <a-tabs defaultActiveKey="1" size="small" class="width-100 ">
        <a-tab-pane tab="预警规则" key="1">
          <ruleTable></ruleTable>
      </a-tab-pane>
        <a-tab-pane tab="预警药品" key="2">
          <drugTable></drugTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import ruleTable from './ruleTable'
  import  drugTable from './drugTable'
  export default {
    components:{
      ruleTable,
      drugTable
    },
    name: 'index',
    data() {
      return {
        listData: [
          { carCode: '1', carType: '注射剂配伍禁忌',num:12},
          { carCode: '2', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '3', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '4', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '5', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '6', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '7', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '8', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '9', carType: '注射剂配伍禁忌',num:12 },
          { carCode: '10', carType: '注射剂配伍禁忌' ,num:12},
        ],
        columns: [
          {
            title: '规则预警排名',
            prop: 'carCode',
            width:130,
          },
          {
            prop: 'carType'
          },{
            prop: 'num',
            width:130,
          }
        ],
        dataPercent: [
          { name: '直接访问', percent: '21%',num:100 },
          { name: '邮件营销', percent: '21%',num:100  },
          { name: '联盟广告',percent: '21%',num:100  },
          { name: '视频广告', percent: '21%',num:100  },
          { name: '搜索引擎', percent: '21%',num:100  }],
        option: {
          title: {
            text: '预警情况'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            top: 20,
            right: 30,
            textStyle:{
              fontSize :14,
            },
            formatter: this.percentMatter,
            data: [{ name: '直接访问'}, { name: '邮件营销' }, { name: '联盟广告', }, { name: '视频广告'}, { name: '搜索引擎' }],

          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '85%',
              center: ['40%', '50%'],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
              ]
            }
          ],
          color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d']
        }
      }
    },
    mounted() {

      this.month_focus();
      this.headUlList();
      let _this = this;
      setTimeout(()=>{
        this.initChart();
      },100);
      //浏览器窗口大小改变事件
      window.onresize=function(){
        setTimeout(()=>{
          _this.chart.resize();
        },500);
      };
    },
    methods: {
      month_focus(){$(".month").css({"color":"#2c8df1","border-bottom":"2px solid #2c8df1"});},
      headUlList:function(){
        $(".ulList li").click(function () {
          $(".ulList li").css({"color":"#666666","border-bottom":"none"});
          $(this).css({"color":"#2c8df1","border-bottom":"2px solid #2c8df1"});
          $($(".ulList li").eq(0)).css({"color":"#666666","border-bottom":"none"});
        });
      },
      initChart() {
        this.chart = echarts.init(document.getElementById('myEchart'))
        this.chart.setOption(this.option, true)

      },
      percentMatter(name){
          for (let key in this.dataPercent) {
            if ( this.dataPercent[key].name == name) {
              return this.dataPercent[key].name +'  次数：' +  this.dataPercent[key].num+'    ' +this.dataPercent[key].percent
            }
          }
        },
      thisYear(){

      },
      season(){

      },
      month(){

      },
      today(){

      },
      onChange(){

      },
    }
  }
</script>

<style scoped>
  .ulList {
    overflow: auto;
    zoom: 1;
    float: right;
  }

  .ulList li {
    list-style-type: none;
    float: right;
    padding-right: 20px;
    padding-left: 20px;
    line-height: 32px;
  }

  .ulList li:hover {
    color: #2c8df1;
    cursor: pointer
  }

  .ulList .year {
    outline: 0
  }

  .ulList .season {
    outline: 0
  }

  .ulList .month {
    outline: 0;
    color: #2c8df1;
    border-bottom: 1px solid #2c8df1;
  }

  .ulList .today {
    outline: 0
  }
  .ulList .dataPicker {
    width: 200px;
  }

 #myEchart{
   height: 100%;
   width: 100%;
 }

  .rankWarn {
    line-height: 33px;
    list-style-type: none;

  }
</style>