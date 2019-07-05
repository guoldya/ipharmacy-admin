<template>
  <div class="yizhu">
    <el-table
      class="margin-top-10"
      :data="docDatas"
      :row-style="tableRowStyle"
      default-expand-all
    >
      <el-table-column type="expand"  width="1px">
        <template slot-scope="props">
          <div class="shenhe" v-if="props.row.reviewVerdict==1">
            <p>审核意见：{{ props.row.reviewOpinion}}</p>
          </div>
          <a-divider/>
        </template>
      </el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.title"
        :key="index"
        v-for="(item,index) in docAdvices"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="props">
          <span
            v-if="item.prop == 'reviewVerdict'"
            class="tableLineHeight"
          >{{props.row.passType|reviewVerdict}}</span>
          <span v-else-if="item.prop == 'orderClass'" class="tableLineHeight">
            <a-tag :color="getcolor(props.row.state)">{{states(props.row.state)}}</a-tag>
            {{props.row.orderClass|orderclass}}
          </span>
          <span v-else-if="item.prop == 'creatDocName'">
            <!-- <a href>{{props.row.creatDocName}}</a> -->
             <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{props.row.creatDocPhone}}</span>
                  </template>
                  <a href>
                    {{props.row.creatDocName}}&nbsp;
                    
                  </a>
                </a-tooltip>
          </span>
          <span v-else-if="item.prop == 'state'">
            <a-tag :color="getcolor(props.row.state)">{{states(props.row.state)}}</a-tag>
          </span>
          
          <span
            v-else-if="item.prop == 'dosageUnit'"
          >{{props.row.routeName}}；{{props.row.frequency}}；{{props.row.spec}}</span>
          <span v-else>{{props.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="paintFoot">
      <div v-for="(item,index) in this.enum.paintState" class="jianxie">
        <a-tag :color="item.color">{{item.texts}}</a-tag>
        <span>{{item.text}}</span>
      </div>
    </div>-->
  </div>
</template>
<script>
export default {
  props: {
    docDatas: {
      type: Array
    },
    prescOrderIds:{
       type: Object
    }
  },
  data() {
    return {
      api: {
        selectRecordDel: 'sys/reviewOrderissue/selectHospitalizationRecordDetail'
      },
      docAdvicesData: [],
      docAdvices: [
        // { title: '', prop: 'state', align: 'left', width: 55 },
        { title: '', prop: 'orderClass', align: 'left', width: 100 },
        { title: '', prop: 'mark', width: 20, align: 'left' },
        { title: '药品名称', prop: 'drugName', align: 'left', width: 140 },
        { title: '用法用量', prop: 'dosageUnit', align: 'left' },
        { title: '科室', prop: 'creatDeptName', width: 130 },
        { title: '医生', prop: 'creatDocName', width: 100, align: 'left' },
        { title: '状态', prop: 'reviewVerdict', align: 'center', width: 120 }
      ],
      xxx: 'ddd'
    }
  },
  mounted() {
    // console.log(this.docDatas)
  },
//   watch:{
//  prescOrderIds: function(){
//    console.log(this.prescOrderIds)
//  }
//   },
  filters: {
    reviewVerdict(value) {
      if (value == '1') {
        return '通过'
      }
      if (value == '2') {
        return '未通过'
      }
      if (value == '3') {
        return '双签通过'
      }
    },
    orderclass(value) {
      if (value == '1') {
        return '临时'
      }
      if (value == '2') {
        return '长期'
      }
    }
  },
  methods: {
    // 颜色
     tableRowStyle({ row, rowIndex }) {
      //  console.log(this.prescOrderIds,'prescOrderIds')
      //  console.log( row.medicalId,'medicalId')
      if (this.prescOrderIds.prescOrderId == row.medicalId) {
        // console.log('chengle')
        return { background: 'rgb(' + this.convertHexToRGB(this.prescOrderIds.levelColor).join(',') + ',0.3)' }
      }
    },
    //颜色处理
    convertHexToRGB(str) {
      str = str[0] === '#' ? str.slice(1) : str
      str = str.length === 3 ? str.repeat(2) : str
      if (str.length !== 6 || !/^[0-9a-fA-F]{3,6}$/i.test(str)) return 'Invalid data'
      return [parseInt(str[0] + str[1], 16), parseInt(str[2] + str[3], 16), parseInt(str[4] + str[5], 16)]
    },

    getRecordDelData(params = {}) {
      this.$axios({
        url: this.api.selectRecordDel,
        method: 'put',
        data: params
      })
        .then(res => {
          if (res.code == '200') {
            this.RecordDelData = res.data
            this.docDatas = res.data.clinicOrderList
            this.visId = this.$route.query.visId
            this.patientId = res.data.patientId
          } else {
            this.warn(res.msg)
          }
        })
        .catch(err => {
          this.error(err)
        })
    },
    states(value) {
      let text
      this.enum.paintState.forEach(item => {
        if (value == item.id) {
          text = item.texts
          return
        }
      })
      return text
    },
    getcolor(value) {
      let text
      this.enum.paintState.forEach(item => {
        if (value == item.id) {
          text = item.color
          return
        }
      })
      return text
    }
  }
}
</script>
<style lang='less'>
.paintFoot {
  .jianxie {
    float: left;
    margin-left: 5px;
  }
}
.yizhu {
  .el-table__expanded-cell[class*='cell'] {
    padding: 5px 16px;
  }
  .el-icon {
    display: none;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 0 solid #909499;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 0 solid #909499;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 0 solid #909499;
  }
  .ant-divider-horizontal {
    margin: 0px 0px;
  }
  .shenhe {
    margin-left: 20px;
  }
  .el-table__row > td {
    border: none;
  }

  .el-table::before {
    height: 0px;
  }
}
</style>


    

