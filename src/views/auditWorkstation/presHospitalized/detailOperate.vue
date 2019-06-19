<template>
  <div>
    <el-table class="width-100" :data="surgeryData" highlight-current-row>
      <el-table-column
        :prop="item.prop"
        :label="item.title"
        :key="index"
        v-for="(item,index) in surgerycolumn"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="props">
          <span v-if="item.prop == 'name'">{{props.row.name}}&nbsp;&nbsp;{{props.row.spec}}</span>
          <span v-else-if="item.prop == 'status'" v-html="statusFormatter(props.row.status)"></span>
          <span v-else-if="item.prop == 'operationTime'">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{props.row.operationTime}}</span>
              </template>
              <span>{{timeFormat(props.row.operationTime)}}</span>
            </a-tooltip>
          </span>
          <span v-else-if="item.prop == 'updateTime'">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{props.row.updateTime}}</span>
              </template>
              <span>{{timeFormat(props.row.updateTime)}}</span>
            </a-tooltip>
          </span>
          <span
            v-else-if="item.prop == 'isInfection'"
            v-html="isInfectionFormatter(props.row.isInfection)"
          ></span>
          <span v-else>{{props.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      api: {
        selectsurgeryDel: 'sys/reviewOrderissue/selectHospitalOperationListByVisId',
        loading: false
      },
      surgerycolumn: [
        { title: '手术名称', prop: 'operationName', width: 130, align: 'left' },
        { title: '手术描述', prop: 'processDescribe', align: 'left' },
        { title: '手术日期', prop: 'operationTime', width: 120 },
        { title: '手术医生', prop: 'docName', width: 130, align: 'left' },
        { title: '麻醉医师', prop: 'anestheslaName' },
        { title: '手术状态', prop: 'status' },
        { title: '手术性质', prop: 'kind', width: 120 },
        { title: '感染手术', prop: 'isInfection', width: 120 },
        { title: '紧急程度', prop: 'isEmergency', width: 120 },
        { title: '切口', prop: 'incision', width: 120 },
        { title: '愈合', prop: 'heal', width: 120 },
        { title: '更新时间', prop: 'updateTime', width: 120 }
      ],
      surgeryData: []
    }
  },
  mounted() {
    this.getsurgeryData({ visid: '1' })
  },
  methods: {
    getsurgeryData(params = {}) {
      this.loading = true
      this.$axios({
        url: this.api.selectsurgeryDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.surgeryData = res.rows
            this.loading = false
          } else {
            this.loading = false
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
          this.loading = false
        })
    },
    statusFormatter(data) {
      let levelText
      this.enum.surgerystatus.map(item => {
        if ((item.id = data)) {
          levelText = item.text
        }
      })
      return levelText
    },
    // 枚举
    isInfectionFormatter(data) {
      let levelText
      this.enum.surgerystatus.map(item => {
        if ((item.id = data)) {
          levelText = item.text
        }
      })
      return levelText
    },
    timeFormat(data) {
      let times = data.slice(data.indexOf('-') + 1, data.lastIndexOf(':'))
      return times
    }
  }
}
</script>

    

