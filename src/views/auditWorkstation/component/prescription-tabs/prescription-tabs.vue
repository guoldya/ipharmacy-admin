<template>
  <div class="prescriptionTab">
    <a-row>
      <a-col :span="12">诊断：<span class="opacity8">{{tabsOne.diagnose}}</span></a-col>
      <a-col :span="12">患者类型：<span class="opacity8">{{tabsOne.costType}}</span></a-col>
    </a-row>
    <el-table
      class="margin-top-10"
      style="width: 700px"
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
          <span v-if="item.prop == 'drugName'">
            <span>{{props.row.drugName}}</span>
            <span class="margin-left-5" v-for="(op,index) in props.row.auditLevelList">
              <a-badge :count="op.levelCount > 1? op.levelCount:0">
                <a-tag :color="op.levelColor" style="cursor: default;" :key="index"> {{op.levelName }}</a-tag>
              </a-badge>
            </span>
          </span>
          <span v-else>
            {{props.row[item.prop]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
    data() {
      return {
        tabsOne: this.tabsData.tabsOne,
        tabsTwo: this.tabsData.tabsTwo
      }
    },
    methods: {
      cellStyle(row) {
        if (row.row.auditLevelList.length > 0 && row.column.label == '名称') {
          return 'color: rgb(255,102,102);'
        }
      }
    }
  }
</script>

<style>
  .prescriptionTab .el-table .cell {
    line-height: 41px !important;
    height: 32px !important;
  }
  .prescriptionTab .ant-badge-count, .ant-badge-dot, .ant-badge .ant-scroll-number-custom-component{
    left: 12px;
    right: 10px;
    top: -8px;
  }
</style>