<template>
  <a-tabs defaultActiveKey="1" size="small" style="width: 650px">
    <a-tab-pane :tab="tabsOne.tabName" key="1">
      <a-row>
        <a-col :span="12">诊断：<span class="opacity8">{{tabsOne.diagnose}}</span></a-col>
        <a-col :span="12">费别：<span class="opacity8">{{tabsOne.costType}}</span></a-col>
      </a-row>
      <el-table
        class="margin-top-10"
        style="width: 100%"
        :data="tabsOne.adviceData"
        highlight-current-row
        :cell-style="cellStyle">
        <el-table-column
          :prop="item.prop"
          :label="item.title"
          :key="index"
          v-for="(item,index) in tabsOne.columns"
          :width="item.width"
          :align="item.align"
          :formatter="item.formatter"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="props">
                                  <span>
                                    {{props.row[item.prop]}}
                                  </span>
          </template>
        </el-table-column>
      </el-table>
    </a-tab-pane>
    <!--<a-tab-pane :tab="tabsTwo.tabName" key="2">-->
      <!--<a-row>-->
        <!--<a-col :span="12">诊断：<span class="opacity8">{{tabsTwo.diagnose}}</span></a-col>-->
        <!--<a-col :span="12">费别：<span class="opacity8">{{tabsTwo.costType}}</span></a-col>-->
      <!--</a-row>-->
      <!--<el-table-->
        <!--class="margin-top-10"-->
        <!--style="width: 100%"-->
        <!--:data="tabsTwo.adviceData"-->
        <!--:cell-style="cellStyle"-->
        <!--highlight-current-row>-->
        <!--<el-table-column-->
          <!--:prop="item.prop"-->
          <!--:label="item.title"-->
          <!--:key="index"-->
          <!--v-for="(item,index) in tabsTwo.columns"-->
          <!--:width="item.width"-->
          <!--:align="item.align"-->
          <!--:formatter="item.formatter"-->
          <!--:show-overflow-tooltip="true"-->
        <!--&gt;-->
          <!--<template slot-scope="props">-->
                                  <!--<span>-->
                                    <!--{{props.row[item.prop]}}-->
                                  <!--</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    <!--</a-tab-pane>-->
  </a-tabs>
</template>

<script>
  export default {
    name: 'prescription-tabs',
    props: {
      tabsData: {
        type: Object,
        required: true
      }
    },
    data(){
      return{
        tabsOne:this.tabsData.tabsOne,
        tabsTwo:this.tabsData.tabsTwo
      }
    },
    methods:{
      cellStyle(row) {
        if (row.rowIndex == 0 && row.columnIndex == 2) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 0 && row.columnIndex == 4) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 4 && row.columnIndex == 2) {
          return 'color: red; opacity: 0.6;'
        } else if (row.rowIndex == 4 && row.columnIndex == 5) {
          return 'color: red; opacity: 0.6;'
        }
      },
    }
  }
</script>

<style scoped>

</style>