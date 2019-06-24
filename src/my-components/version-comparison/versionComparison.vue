<template>
  <div>
    <a-row>
      处方：
      <a-radio-group @change="onChange" v-model="reviewValue">
        <a-radio
          v-for="(dl,index) in orderList"
          :value="dl.reviewId"
          :key="index"

        >{{dl.orderNo}}
        </a-radio>
      </a-radio-group>
    </a-row>
    <a-row class="margin-top-10">
      版本：
      <a-radio-group>
        <a-radio>当前版本</a-radio>
      </a-radio-group>
      <a-radio-group v-model="submitValue" @change="changeEdition">
        <a-radio
          v-for="(dl,index) in reviewList"
          :value="dl.submitNo"
          :key="index"
        >{{dl.edition}}
        </a-radio>
      </a-radio-group>
    </a-row>
    <a-row class="margin-top-10 versionTable">
      <a-col :span="12">
        <a-card title="当前版本"
                :extra="currentTime">
          <a-spin tip="加载中..." :spinning="currentSpinning">
            <el-table
              :data="currentData"
              :row-style="rowStyle"
              @row-click="rowClickCurrent"
            >
              <el-table-column
                :prop="item.value"
                :label="item.title"
                :key="index"
                v-for="(item,index) in columns"
                :width="item.width"
                :align="item.align"
                :formatter="item.formatter"

              >
                <template slot-scope="props">
                <span v-if="item.value == 'drugName'" class="tableLineHeight">
                 <div><p class="font-bold maxWidth">{{props.row.drugName}} <span class="padding5">|</span>{{props.row.spec}}</p>
                   <a-tag class="margin-left-5 amountTag">{{props.row.amountStr}}</a-tag>
                 </div>
                  <div class="textIndentOne">
                    <div class="maxWidthTwo">用法：{{props.row.dosageStr}}<span class="padding5">{{props.row.useType}}</span>{{props.row.frequency}}</div>
                    <div class="floatLeft" v-if="props.row.auditLevelList.length>0"
                          v-for="(op,index) in props.row.auditLevelList">
                      <a-badge :count="op.levelCount > 1? op.levelCount:0">
                        <a-tag :color="op.levelColor" style="cursor: default;" :key="index"> {{op.levelName }}</a-tag>
                      </a-badge>
                    </div>
                  </div>
                </span>
                  <span v-else-if="item.value == 'mark'">
                    <i v-if="props.row.markNum == '1'" class="iconfont action action-ziyuanldpi1"/>
                    <i v-else-if="props.row.markNum == '2'" class="iconfont action action-youkuohao"/>
                    <i v-else-if="props.row.markNum == '0'" class="iconfont action action-shuxian1"/>
                  </span>
                  <span v-else>
                    {{props.row[item.value]}}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </a-spin>
        </a-card>
      </a-col>
      <a-col :span="12" class="padding-left-5">
        <a-card
          :title="submitEdition"
          :extra="otherTime"
        >
          <a-spin tip="加载中..." :spinning="spinning">
            <el-table
              :data="otherData"
              :row-style="rowStyle"
              @row-click="rowClickOther">
              <el-table-column
                :prop="item.value"
                :label="item.title"
                :key="index"
                v-for="(item,index) in columns"
                :width="item.width"
                :align="item.align"
                :formatter="item.formatter"
              >
                <template slot-scope="props">
                <span v-if="item.value == 'drugName'" class="tableLineHeight">
                  <div><p class="font-bold maxWidth">{{props.row.drugName}}<span class="padding5">|</span>{{props.row.spec}}</p>
                    <a-tag class="margin-left-5 amountTag">{{props.row.amountStr}}</a-tag>
                  </div>
                  <div class="textIndentOne">
                    <div class="maxWidthTwo">用法：{{props.row.dosageStr}} <span class="padding5">{{props.row.useType}}</span>{{props.row.frequency}}</div>
                    <div class="floatLeft" v-if="props.row.auditLevelList.length>0"
                          v-for="(op,index) in props.row.auditLevelList">
                      <a-badge :count="op.levelCount > 1? op.levelCount:0">
                        <a-tag :color="op.levelColor" style="cursor: default;" :key="index"> {{op.levelName }}</a-tag>
                      </a-badge>
                    </div>
                  </div>
                </span>
                  <span v-else-if="item.value == 'mark'">
                    <i v-if="props.row.markNum == '1'" class="iconfont action action-ziyuanldpi1"/>
                    <i v-else-if="props.row.markNum == '2'" class="iconfont action action-youkuohao"/>
                    <i v-else-if="props.row.markNum == '0'" class="iconfont action action-shuxian1"/>
                  </span>
                  <span v-else>
                    {{props.row[item.value]}}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'versionComparison',
    props: {
      visId: {
        type: String
      },
      maxSubmitNo:{
        type: String
      }
    },
    data() {
      return {
        api: {
          dataList: 'sys/reviewOrderissue/selectVersionComparisonListWithVisId',
          tableDataPage: 'sys/reviewOrderissue/selectVersinDetailWithPrescNumAndSubNo'
        },
        orderValue: '',
        reviewValue: '',
        submitValue: '',
        submitEdition: '',
        currentOrder: '',
        currentTime: '',
        otherTime: '',
        drugId: '',
        orderList: [],
        reviewList: [],
        currentData: [],
        otherData: [],
        currentSpinning:false,
        spinning:false,
        columns: [{ title: '#', value: 'seqNum', width: 30, align: 'left' },
          { title: '', value: 'mark', width: 19, align: 'left' },
          { title: '药品', value: 'drugName' }
        ]
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      //获取处方号数据
      getData() {
        let params = { visId: this.visId }
        this.$axios({
          url: this.api.dataList,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.orderList = this.$dateFormat(res.rows, ['maxSubmitTime'])
              if (this.orderList.length > 0) {
                this.currentTime = this.orderList[0].maxSubmitTime
                this.orderValue = this.orderList[0].orderNo
                this.currentOrder = this.orderList[0].maxSubmitNo
                this.reviewValue = this.orderList[0].reviewId
                this.reviewList = this.$dateFormat(this.orderList[0].reviewIssuerecodeVOList, ['submitTime'])
              }
              this.getVersionTableData()
              this.dealReviewList()

            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
      //处理处方号数据
      dealReviewList() {
        if (this.reviewList.length > 0) {
          this.submitValue = this.reviewList[0].submitNo
          this.submitEdition = this.reviewList[0].edition
          this.otherTime = this.reviewList[0].submitTime
          this.getOtherData(this.submitValue)
        }
      },
      //获取网格信息
      getVersionTableData() {
        this.currentSpinning = true;
        let params = {}
        params.prescNum = this.orderValue
        params.subNo = this.currentOrder
        //TODO:传入处方序号
        this.$axios({
          url: this.api.tableDataPage,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.currentData = res.rows
              this.currentSpinning = false;
            } else {
              this.warn(res.msg);
              this.currentSpinning = false;
            }
          })
          .catch(err => {
            this.error(err);
            this.currentSpinning = false;
          })
      },
      //获取其他网格信息
      getOtherData(subNo) {
        this.spinning = true;
        let params = {}
        params.prescNum = this.orderValue
        params.subNo = subNo
        this.$axios({
          url: this.api.tableDataPage,
          method: 'put',
          data: params
        })
          .then(res => {
            if (res.code == '200') {
              this.spinning = false;
              this.otherData = res.rows
            } else {
              this.spinning = false;
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.spinning = false;
            this.error(err)
          })
      },
      //处方号点击事件
      onChange(e) {
        for (let key in this.orderList) {
          if (this.orderList[key].reviewId == e.target.value) {
            this.orderValue = this.orderList[key].orderNo
            this.reviewList = this.orderList[key].reviewIssuerecodeVOList
            this.currentOrder = this.orderList[key].maxSubmitNo
            this.currentTime = this.orderList[key].maxSubmitTime
            this.dealReviewList()
            this.getVersionTableData()
          }
        }
      },
      //版本号点击事件
      changeEdition(e) {
        for (let key in this.reviewList) {
          if (this.reviewList[key].submitNo == e.target.value) {
            this.submitValue = this.reviewList[key].submitNo
            this.submitEdition = this.reviewList[key].edition
            this.otherTime = this.reviewList[key].submitTime
            this.getOtherData(this.submitValue)
          }
        }
      },
      rowStyle(row, rowIndex) {
        if (row.row.drugId == this.drugId) {
          return { 'background': 'rgb(236,245,255)' }
        }
      },
      rowClickCurrent(row) {
        this.drugId = row.drugId
      },
      rowClickOther(row) {
        this.drugId = row.drugId
      }
    }
  }
</script>

<style>
  .versionTable .ant-card-body {
    padding: 1px;
  }

  .tableLineHeight {
    line-height: 14px;
  }

  .textIndentOne {
    text-indent: 0em;
    overflow: hidden;
    line-height: 35px;
  }

  .versionTable .ant-badge-count, .ant-badge-dot, .ant-badge .ant-scroll-number-custom-component {
    left: 12px;
    right: 10px;
    top: -6px;
  }

  .textIndentOne .textBadgeTag {
    float: right;
    overflow: hidden;
  }

  .versionTable .maxWidth {
    display: inline-block;
    margin-bottom: 0px;
    line-height: 20px;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .versionTable .amountTag{
    float: right;
    overflow: hidden;
  }
  .maxWidthTwo{
    display: inline-block;
    margin-bottom: 0px;
    max-width: 305px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .floatLeft{
    margin-left: 5px;
    float: left;
  }

</style>