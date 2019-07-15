<template>
    <div>
        <a-row>
            处方：
            <a-radio-group @change="onChange" v-model="reviewValue">
                <a-radio
                    v-for="(dl,index) in orderList"
                    :value="dl.reviewId"
                    :key="index"
                >{{dl.orderNo}}</a-radio>
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
                >{{dl.edition}}</a-radio>
            </a-radio-group>
        </a-row>
        <a-row class="margin-top-10 versionTable">
            <a-card title="当前版本" :extra="currentTime">
                <a-spin tip="加载中..." :spinning="currentSpinning">
                    <el-table
                        :data="dataSource"
                        :cell-style="cellStyle"
                        @row-click="rowClickCurrent"
                        show-overflow-tooltip
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
                                <span v-if="item.value == 'mark'">
                                    <i
                                        v-if="props.row.markNum == '1'"
                                        class="iconfont action action-ziyuanldpi1"
                                    />
                                    <i
                                        v-else-if="props.row.markNum == '2'"
                                        class="iconfont action action-youkuohao"
                                    />
                                    <i
                                        v-else-if="props.row.markNum == '0'"
                                        class="iconfont action action-shuxian1"
                                    />
                                </span>
                                <span v-else>{{props.row[item.value]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </a-spin>
            </a-card>
        </a-row>
    </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
    name: 'versionComparison',
    props: {
        propData: {
            type: Object
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
            currentSpinning: false,
            spinning: false,
            columns: [
                // { title: '编号', value: 'seqNum', width: 50, align: 'right' },
                { title: '', value: 'mark', width: 19, align: 'left' },
                { title: '总量', value: 'amountStr', width: 80 },
                { title: '用量', value: 'frequency', width: 80 },
                { title: '用法', value: 'useType', width: 80 },
                { title: '规格', value: 'spec', width: 80 },
                { title: '药品', value: 'drugName' },
                { title: '规格', value: 'otSpec', width: 80 },
                { title: '用法', value: 'otUseType', width: 80 },
                { title: '用量', value: 'otFrequency', width: 80 },
                { title: '总量', value: 'otAmountStr', width: 80 }
            ],
            dataSource: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        //获取处方号数据
        getData() {
            let params = { visId: this.propData.visId, maxSubmitNo: this.propData.submitNo }
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
                            this.reviewList = this.$dateFormat(this.orderList[0].reviewIssuerecodeVOList, [
                                'submitTime'
                            ])
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

                setTimeout(() => {
                    this.tableContrast()
                }, 100)
            }
        },
        //获取网格信息
        getVersionTableData() {
            this.currentSpinning = true
            let params = {}
            params.prescNum = this.orderValue
            params.subNo = this.currentOrder
            params.visId = this.propData.visId
            //TODO:传入处方序号
            this.$axios({
                url: this.api.tableDataPage,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.currentData = res.rows
                        this.currentSpinning = false
                    } else {
                        this.warn(res.msg)
                        this.currentSpinning = false
                    }
                })
                .catch(err => {
                    this.error(err)
                    this.currentSpinning = false
                })
        },
        //获取其他网格信息
        getOtherData(subNo) {
            this.spinning = true
            let params = {}
            params.prescNum = this.orderValue
            params.subNo = subNo
            params.visId = this.propData.visId
            this.$axios({
                url: this.api.tableDataPage,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.spinning = false
                        this.otherData = res.rows
                    } else {
                        this.spinning = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.spinning = false
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
            setTimeout(() => {
                this.tableContrast()
            }, 100)
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
            setTimeout(() => {
                this.tableContrast()
            }, 100)
        },
        //数据对比级网格数据
        tableContrast() {
            this.dataSource = []
            for (let key in this.currentData) {
                this.dataSource.push({
                    drugName: this.currentData[key].drugName,
                    drugId: this.currentData[key].drugId,
                    frequency: this.currentData[key].frequency,
                    spec: this.currentData[key].spec,
                    amountStr: this.currentData[key].amountStr,
                    useType: this.currentData[key].useType
                })
            }
            let dealData = []
            for (let key in this.otherData) {
                dealData.push({
                    drugName: this.otherData[key].drugName,
                    drugId: this.otherData[key].drugId,
                    frequency: this.otherData[key].frequency,
                    spec: this.otherData[key].spec,
                    amountStr: this.otherData[key].amountStr,
                    useType: this.otherData[key].useType
                })
            }
            for (let key in this.dataSource) {
                let source = this.dataSource[key]
                for (let i in dealData) {
                    if (source.drugId == dealData[i].drugId) {
                        source.otFrequency = dealData[i].frequency
                        source.otSpec = dealData[i].spec
                        source.otAmountStr = dealData[i].amountStr
                        source.otUseType = dealData[i].useType
                        dealData.splice(i, 1)
                    }
                }
            }
            for (let j in dealData) {
                this.dataSource.push({
                    drugName: dealData[j].drugName,
                    drugId: dealData[j].drugId,
                    otFrequency: dealData[j].frequency,
                    otSpec: dealData[j].spec,
                    otAmountStr: dealData[j].amountStr,
                    otUseType: dealData[j].useType
                })
            }
        },
        cellStyle(row, column) {
            if (row.row.amountStr != row.row.otAmountStr && row.row.amountStr && row.row.otAmountStr) {
                if (row.column.property == 'otAmountStr') {
                    return { color: '#f44336' }
                }
            } else if (row.row.useType != row.row.otUseType && row.row.useType && row.row.otUseType) {
                 if (row.column.property == 'otUseType') {
                    return { color: '#f44336' }
                }
            } else if (row.row.spec != row.row.otSpec && row.row.spec && row.row.otSpec) {
                
                 if (row.column.property == 'otSpec') {
                    return { color: '#f44336' }
                }
            } else if (row.row.frequency != row.row.otFrequency && row.row.frequency && row.row.otFrequency) {
                    if (row.column.property == 'otFrequency') {
                    return { color: '#f44336' }
                }
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

.versionTable .ant-badge-count,
.ant-badge-dot,
.ant-badge .ant-scroll-number-custom-component {
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
.versionTable .amountTag {
    float: right;
    overflow: hidden;
}
.maxWidthTwo {
    display: inline-block;
    margin-bottom: 0px;
    max-width: 305px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.floatLeft {
    margin-left: 5px;
    float: left;
}
</style>