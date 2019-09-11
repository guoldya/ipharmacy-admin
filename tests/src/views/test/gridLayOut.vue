<template>
  <div>
    <grid-layout
      :layout="data"
      :col-num="12"
      :row-height="30"
      :margin="[10, 10]"
      :use-css-transforms="true"
      :is-draggable="isDrag"
      :is-resizable="isRes"
      :is-mirrored='false'
      :verticalCompact = "true"
      :autoSize = 'true'
      @layout-updated="layoutUpdatedEvent"
    >
      <a-switch checkedChildren="开" unCheckedChildren="关" @change='onChange'/>
      <grid-item
        v-for="(item,index) in data"
        :key="index"
        v-bind="item"
        @resize="resizeHandler"
        @move="moveHandler"
        @resized="resizedHandler"
        dragIgnoreFrom=".margin-top-10,a,button,.icon,#myEchart,.fold"
      >
        <el-card class="page_card">
          <a-row class="arow" style="height: 10%">
            <a-col span="4"><h3>网格</h3></a-col>
            <a-col span="20" style="text-align: right">
              <a-icon class="icon" type="question"/>
              <a-icon class="icon" type="question-circle"/>
              <a-icon class="icon" type="plus"/>
              <a-icon class="icon" type="question"/>
              <a-icon class="icon" type="question-circle"/>
              <a-icon class="icon" type="plus"/>
            </a-col>
          </a-row>
          <el-table
            class="margin-top-10"
            ref="singleTable"
            :data="listData"
            border
            size="small"
            style="width: 100%;"
            highlight-current-row
            height="90%"
            v-if="index == 1"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :label="item.title"
              :key="index"
              v-for="(item,index) in columns"
              :width="item.width"
              :align="item.align"
              :formatter="item.formatter"
            >
            </el-table-column>
          </el-table>

          <div v-if="index==2" class="fold">
            <v-chart :force-fit="true" :height="height"  :data="dataFold" :scale="scale">
              <v-tooltip />
              <v-axis />
              <v-legend />
              <v-line position="month*temperature" color="city" />
            </v-chart>
          </div>
          <div id="myEchart" :style="{width:widths, height:heights}" ref="myEchart" v-if="index == 0">
          </div>
        </el-card>
      </grid-item>

    </grid-layout>


  </div>
</template>
<script>

  import DataSet from '@antv/data-set';
  import echarts from 'echarts'

  const sourceData = [
    { month: 'Jan', Tokyo: 7.0, London: 3.9 },
    { month: 'Feb', Tokyo: 6.9, London: 4.2 },
    { month: 'Mar', Tokyo: 9.5, London: 5.7 },
    { month: 'Apr', Tokyo: 14.5, London: 8.5 },
    { month: 'May', Tokyo: 18.4, London: 11.9 },
    { month: 'Jun', Tokyo: 21.5, London: 15.2 },
    { month: 'Jul', Tokyo: 25.2, London: 17.0 },
    { month: 'Aug', Tokyo: 26.5, London: 16.6 },
    { month: 'Sep', Tokyo: 23.3, London: 14.2 },
    { month: 'Oct', Tokyo: 18.3, London: 10.3 },
    { month: 'Nov', Tokyo: 13.9, London: 6.6 },
    { month: 'Dec', Tokyo: 9.6, London: 4.8 },
  ];
  const dv = new DataSet.View().source(sourceData);
  dv.transform({
    type: 'fold',
    fields: ['Tokyo', 'London'],
    key: 'city',
    value: 'temperature',
  });
  const dataFold = dv.rows;

  const scale = [{
    dataKey: 'month',
    min: 0,
    max: 1,
  }];

  export default {
    props: {
      widths: {
        type: String,
        default: '90%'
      },
      heights: {
        type: String,
        default: '90%'
      }
    },
    data() {
      return {
        dataFold,
        scale,
        height:320,
        data: [
          { 'x': 0, 'y': 0, 'w': 4, 'h': 10, 'i': '0', 'j': 10 },
          { 'x': 4, 'y': 0, 'w': 4, 'h': 10, 'i': '1' },
          { 'x': 8, 'y': 0, 'w': 4, 'h': 10, 'i': '2' },
          { 'x': 0, 'y': 10, 'w': 4, 'h': 10, 'i': '3' },
          { 'x': 4, 'y': 10, 'w': 4, 'h': 10, 'i': '4' },
          { 'x': 8, 'y': 10, 'w': 4, 'h': 10, 'i': '4' }
        ],
        listData: [
          { carCode: '001', carType: '东风', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '002', carType: '力帆', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '003', carType: '保时泰', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '004', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '005', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '006', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '007', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '008', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '009', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '010', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '011', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' },
          { carCode: '012', carType: '东风小康', plateNumber: '渝A77777', carStatus: 1, price: '700元', remark: '高价值物品' }
        ],
        columns: [
          {
            title: '编码',
            prop: 'carCode'
          },
          {
            title: '型号',
            prop: 'carType'
          },
          { title: '车牌', prop: 'plateNumber' }
        ],
        chart: null,
        isDrag: false,
        isRes: false,
        //echarts
        option:{
          // title: {
          //   text: '折线图堆叠'
          // },
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
      }
    },
    mounted() {
      let _this = this;
      this.fresh();
      setTimeout(()=>{
        this.initChart();
      },500);
      //浏览器窗口大小改变事件
      window.onresize=function(){
        setTimeout(()=>{
          _this.initChart();
        },500);
      };
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById('myEchart'));
        this.chart.setOption(this.option, true);
        this.chart.resize();
      },
      resizeHandler(i, newH, newW) {
      },
      moveHandler(i, newX, newY) {
      },
      resizedHandler(i, newH, newW, newHPx, newWPx) {
        console.log(i)
        console.log(newH)
        console.log(newH)
        console.log(newHPx,'height');
        if (i == 2){
          this.height=newHPx-50;
        }
        console.log(newWPx);
        this.chart.resize();
        const e = document.createEvent('Event');
        e.initEvent('resize', true, true);
        window.dispatchEvent(e);
      },
      onChange(checked) {
        if (checked) {
          this.isDrag = true
          this.isRes = true
        } else {
          this.isDrag = false
          this.isRes = false
        }
      },
      layoutUpdatedEvent(newLayout) {
      },
      fresh(){
        const e = document.createEvent('Event');
        e.initEvent('resize', true, true);
        window.dispatchEvent(e);
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .vue-grid-item.vue-grid-placeholder {
    background: #f8f8f9;
  }

  /deep/ .el-card__body {
    height: 100%;
    padding: 20px;
  }
  .arow{
    width: 100%;
  }

  .page_card {
    height: 100%;
    width: 100%;
  }

  .page_card :hover {
    .icon {
      display: inline-block;
    }
  }

  .icon {
    display: none;
    font-size: 14px;
    margin-right: 5px;

  }

  .vue-grid-layout {
    background-color: #f8f8f9;
    border-radius: 4px;
    margin: -10px;
    .vue-resizable-handle {
      opacity: .3;
      &:hover {
        opacity: 1;
      }
    }
  }
</style>