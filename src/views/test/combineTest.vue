<template>
  <div>
    <a-row>
      <a-col :span="3">
        <div class="headerTitle"/>
        <div class="bodyText fontText">手术天数</div>
        <div class="bodyText fontText">住院天数</div>
        <div class="bodyText fontText">时刻</div>
        <div class="bodyText fontText">体温|脉搏|血压|呼吸</div>
        <div class="bodyText fontText">汇总次数</div>
        <div class="bodyText fontText">手术天数</div>
        <div>
          <a-col :span="12">
            <div class="bodyText fontBig">护理项目</div>
          </a-col>
          <a-col  :span="12">
            <div class="bodyText fontText">小便量(ml)</div>
            <div class="bodyText fontText">小便次数</div>
            <div class="bodyText fontText">汇总次数</div>
            <div class="bodyText fontText">呼吸(次/分)</div>
            <div class="bodyText fontText">血压(mhg)</div>
            <div class="bodyText fontText">饮入量(ml)</div>
            <div class="bodyText fontText">排出量(ml)</div>
            <div class="bodyText fontText">大便次数</div>
            <div class="bodyText fontText">其他</div>
          </a-col>
        </div>
      </a-col>
      <a-col :span="21">
        <el-table
          :data="tableData6"
          :span-method="arraySpanMethod"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="amount1"
            sortable
            label="数值 1">
          </el-table-column>
          <el-table-column
            prop="amount2"
            sortable
            label="数值 2">
          </el-table-column>
          <el-table-column
            prop="amount3"
            sortable
            label="数值 3">
          </el-table-column>
        </el-table>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData6: [
          {
            id: '手术天数',
            name: '王小虎',
            amount1: '234',
            amount2: '3.2',
            amount3: 10
          }, {
            id: '住院天数',
            name: '王小虎',
            amount1: '165',
            amount2: '4.43',
            amount3: 12
          }, {
            id: '时刻',
            name: '王小虎',
            amount1: '324',
            amount2: '1.9',
            amount3: 9
          }, {
            id: '体温|脉搏|血压|呼吸',
            name: '王小虎',
            amount1: '621',
            amount2: '2.2',
            amount3: 17
          }, {
            id: '汇总次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '呼吸',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '血压',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
          {
            id: '小便次数',
            name: '王小虎',
            amount1: '539',
            amount2: '4.1',
            amount3: 15
          },
        ],
        listData: [
          { text: '小便量' },
          { text: '小便次数' },
          { text: '汇总次数' },
          { text: '呼吸' },
          { text: '血压' },
          { text: '小便次数' }
        ]
      }
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {

      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .headerTitle {
    height: 45px;
    width: 100%;
    border-left: 1px #EBEEF5 solid;
    border-top: 1px #EBEEF5 solid;
    background-color: #fafafa;
  }
  .bodyText{
    width: 100%;
    margin: 0 auto;
    text-align: center;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    border-left: 1px #EBEEF5 solid;
    border-top: 1px #EBEEF5 solid;
    background-color: #fafafa;
  }
  .fontText{
    height:34px;
    line-height: 34px;
  }
  .fontBig{
    height:306px;
    line-height: 306px;
  }
</style>