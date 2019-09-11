<template>
  <div class="prescriptionTab">
    <a-row>
      <a-col :span="12">诊断：<span class="opacity8">{{tabsData.diagnose}}</span></a-col>
      <a-col :span="12">患者类型：<span class="opacity8">{{tabsData.costType}}</span></a-col>
    </a-row>
    <a-spin tip="加载中..." :spinning="loading">
    <el-table
      class="margin-top-10"
      style="width: 700px"
      :data="tabsOne"
      highlight-current-row
      :cell-style="cellStyle">
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
    </a-spin>
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
        api:{
          selectClinicPresc:'sys/reviewOrderissue/selectClinicPresc',
        },
        loading:false,
        tabsOne: [],
        columns: [
          { title: '序号', prop: 'seqNum', width: 50, align: 'right' },
          { title: '', prop: 'mark', width: 20, align: 'left' },
          { title: '名称', prop: 'drugName' },
          { title: '规格', prop: 'spec', width: 80 },
          { title: '单量', prop: 'dosageStr', width: 60 },
          { title: '总量', prop: 'amountStr', width: 60 },
          { title: '频次', prop: 'frequency', width: 80, align: 'center' },
          { title: '服药方式', prop: 'useType', width: 80 }
        ]
      }
    },
    mounted() {
      console.log(this.tabsOne)
      this.getData()
    },
    methods: {
      getData() {
        let params = {};
        params.clinicPrescNum = this.tabsData.clinicPrescNum;
        params.maxSubmitNo = this.tabsData.maxSubmitNo;
        params.visId = this.tabsData.visId;
        this.loading = true;
        this.$axios({
          url: this.api.selectClinicPresc,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.tabsOne = res.rows;
              this.loading = false;
            } else {
              this.warn(res.msg);
              this.loading = false;
            }
          })
          .catch(err => {
            this.error(err);
            this.loading = false;
          })
      },

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

  .prescriptionTab .ant-badge-count, .ant-badge-dot, .ant-badge .ant-scroll-number-custom-component {
    left: 12px;
    right: 10px;
    top: -8px;
  }
</style>