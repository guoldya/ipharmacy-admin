<template>
    <a-card>
        <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button class="margin-left-5" @click="resetForm">重置</a-button>
            </div>
        </Searchpanel>
        <a-spin :spinning="loading" tip="加载中...">
            <el-table class="margin-top-10" :data="dataSource" border :highlight-current-row="true">
                <el-table-column fixed="right" label="操作" :width="100" align="center" v-if="true">
                    <template slot-scope="scope">
                        <opcol :items="items" :more="false" :data="scope.row"></opcol>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="item in columns"
                    :show-overflow-tooltip="true"
                    :key="item.value"
                    :label="item.title"
                    :prop="item.value"
                    :width="item.width"
                    :align="item.align"
                >
                    <template slot-scope="scope">
                        <span v-if="item.value == 'auditLevel'">
                            <span
                                v-for="(op,index) in scope.row.problemScheduleVOList"
                                class="problemRow"
                                :key="index"
                                style="white-space: nowrap"
                            >
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>{{op.verdictTypeTitle }}</span>
                                    </template>
                                    <a-tag
                                        :color="op.levelColor"
                                        style="cursor: default; white-space:nowrap; "
                                    >{{op.levelName}}</a-tag>
                                </a-tooltip>
                            </span>
                        </span>
                        <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                        <span v-else>{{scope.row[item.value]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <a-pagination
                showSizeChanger
                showQuickJumper
                :total="total"
                class="pnstyle"
                :defaultPageSize="pageSize"
                :pageSizeOptions="['10', '20','50']"
                @showSizeChange="pageChangeSize"
                @change="pageChange"
                size="small"
            ></a-pagination>
        </a-spin>
    </a-card>
</template>

<script>
import moment from 'moment'
import { connect } from 'net'
import { constants } from 'fs'

export default {
    name: 'index',
    components: {
        moment
    },
    data() {
        return {
            api: {
                selectRevisionHistory: 'sys/reviewOrderissue/selectRevisionHistory',
                selectTribunalRecordDetail: 'sys/reviewOrderissue/selectTribunalRecordDetail'
            },
            loading: false,
            total: 10,
            current: 1,
            pageSize: 20,
            columns: [
                { title: '来源', value: 'reviewResouce', align: 'center', width: 90, format: this.reviewResouce },
                { title: '科室', value: 'adminDeptTitle' },
                { title: '住院/门诊号', value: 'adminNum', align: 'right', width: 130 },
                { title: '患者', value: 'patientName', width: 90 },
                { title: '性别', value: 'patientSex', align: 'center', width: 100, format: this.patientSexFormatter },
                { title: '年龄', value: 'patientAge', width: 90 },
                { title: '医生', value: 'subDocName', width: 90 },
                { title: '提交时间', value: 'subTime', width: 150 },
                { title: '问题等级', value: 'auditLevel', width: 150 },
                {
                    title: '结论',
                    value: 'reviewVerdict',
                    align: 'center',
                    width: 100,
                    format: this.reviewVerdictFormatter
                },
                { title: '通过类型', value: 'passType', align: 'center', format: this.passTypeFormatter },
                { title: '审核人', value: 'reviewDocName', width: 100 },
                { title: '审核时间', value: 'reviewTime', width: 150 }
            ],
            items: [{ text: '查看', showtip: false, click: this.checkReviewResouce }],
            levelColor: '#ffffff',
            dataSource: [],
            dateFormat: 'YYYY-MM-DD HH:mm',
            dateList: [],
            searchDate: [],
            pageChangeFilter: { searchDate: this.dateList }
        }
    },
    computed: {
        list() {
            return [
                {
                    name: '审核时间',
                    dataField: 'searchDate',
                    type: 'range-picker-detail'
                },
                {
                    name: '来源',
                    dataField: 'reviewResouce',
                    type: 'select',
                    dataSource: this.enum.reviewResouce,
                    keyExpr: 'id',
                    valueExpr: 'text'
                },
                {
                    name: '通过类型',
                    dataField: 'passType',
                    type: 'select',
                    dataSource: this.enum.passType,
                    keyExpr: 'id',
                    valueExpr: 'text'
                },
                {
                    name: '问题等级',
                    dataField: 'auditLevel',
                    type: 'select',
                    dataSource: this.enum.patientProblem,
                    keyExpr: 'value',
                    valueExpr: 'text'
                },
                {
                    name: '结论',
                    dataField: 'reviewVerdict',
                    type: 'select',
                    dataSource: this.enum.reviewVerdict,
                    keyExpr: 'id',
                    valueExpr: 'text'
                }
            ]
        }
    },
    mounted() {
        this.$refs.searchPanel.form.setFieldsValue({ searchDate: this.SetDayDate() })
        this.getData({ pageSize: this.pageSize, searchDate: this.dateList })
    },
    methods: {
        //得到本月一号为开始时间，得到当前时间为结束时间
        SetDayDate() {
            //当前时间
            var dataValue = new Date(new Date().getTime() + 1000 * 60 * 60)
            //（1000*60*60*24）是1千毫秒（是1秒）乘60（是1分）乘60（是1小时）*24（是一天）加减一天把前边的-+换一下就行。
            var year = dataValue.getFullYear()
            var month = dataValue.getMonth() + 1
            var day = dataValue.getDate()
            var hours = dataValue.getHours() - 1 //小时
            var mines = dataValue.getMinutes() //分
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                if (day < 1) {
                    day = '01'
                } else {
                    day = '0' + day
                }
            }
            this.dateList = [
                year + '-' + month + '-' + '01' + ' ' + hours + ':' + mines,
                year + '-' + month + '-' + day + ' ' + hours + ':' + mines
            ]
            var stime = moment(year + '-' + month + '-' + '01' + ' ' + hours + ':' + mines, this.dateFormat) //开始时间
            var etime = moment(year + '-' + month + '-' + day + ' ' + hours + ':' + mines, this.dateFormat) //结束时间
            var pars = [stime, etime]
            return pars
        },
        //搜索获取
        getFormData() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            if (params.searchDate) {
                params.searchDate = [
                    params.searchDate[0].format('YYYY-MM-DD HH:mm'),
                    params.searchDate[1].format('YYYY-MM-DD HH:mm')
                ]
            }
            return params
        },
        // 重置的搜索获取
        //搜索
        search() {
            let params = this.getFormData()
            this.pageChangeFilter = this.getFormData()
            params.pageSize = this.pageSize
            this.dateList = params.searchDate
            this.getData(params)
        },
        //重置
        resetForm() {
            this.$refs.searchPanel.form.resetFields(['reviewResouce', 'passType', 'auditLevel', 'reviewVerdict', []])
            this.pageChangeFilter = { searchDate: this.dateList }
            let params = this.getFormData()
            params.pageSize = '20'
            this.pageSize = 20
            this.dateList = params.searchDate
            this.getData(params)
        },
        getData(params = { pageSize: 20, offset: 0 }) {
            this.loading = true
            this.$axios({
                url: this.api.selectRevisionHistory,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows, ['subTime', 'reviewTime'])
                        let arr = this.dataSource
                        arr.forEach(item => {
                            this.checkSort(item.problemScheduleVOList)
                        })
                        this.total = res.total
                        this.loading = false
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.error(err)
                })
        },
        pageChange(page, pageSize) {
            let params = this.$refs.searchPanel.form.getFieldsValue(['searchDate', []])
            params.pageSize = this.pageSize
            params.offset = (page - 1) * this.pageSize
            if (params.searchDate) {
                params.searchDate = [
                    params.searchDate[0].format('YYYY-MM-DD HH:mm'),
                    params.searchDate[1].format('YYYY-MM-DD HH:mm')
                ]
            }

            this.getData(params)
        },
        pageChangeSize(page, pageSize) {
            this.pageSize = pageSize
            let params = this.$refs.searchPanel.form.getFieldsValue(['searchDate', []])
            if (params.searchDate) {
                params.searchDate = [
                    params.searchDate[0].format('YYYY-MM-DD HH:mm'),
                    params.searchDate[1].format('YYYY-MM-DD HH:mm')
                ]
            }
            params.offset = (page - 1) * pageSize
            params.pageSize = pageSize
            this.getData(params)
        },
        //枚举审方结论
        reviewVerdictFormatter(data) {
            let levelText
            this.enum.reviewVerdict.forEach(item => {
                if (data.reviewVerdict == item.id) {
                    levelText = item.text
                    return
                }
            })
            return levelText
        },
        //枚举通过类型
        passTypeFormatter(data) {
            let levelText
            this.enum.passType.forEach(item => {
                if (data.passType == item.id) {
                    levelText = item.text
                    return
                }
            })
            return levelText
        },
        //性别枚举
        patientSexFormatter(data) {
            if (data.patientSex == 1) {
                return '男'
            } else if (data.patientSex == 2) {
                return '女'
            } else {
                return '未知'
            }
        },
        //处方来源枚举
        reviewResouce(data) {
            let levelText
            this.enum.reviewResouce.forEach(item => {
                if (data.reviewResouce == item.id) {
                    levelText = item.text
                    return
                }
            })
            return levelText
        },
        //查看
        checkReviewResouce(data) {
            if (data.reviewResouce == '2') {
                this.$router.push({
                    name: 'presHospitalizedDetail',
                    params: { visId: data.visId, maxSubmitNo: data.subNo, reviewId: data.reviewId, isNew: 0 }
                })
            } else {
                let objData = {}
                objData = { visId: data.visId, submitNo: data.subNo, isNew: 0 }
                window.localStorage.setItem('outpatientData', JSON.stringify(objData))
                this.$router.push({
                    name: 'presOutpatientDetail',
                })
            }
        },
        // 判断等级高低
        checkSort(arr) {
            if (arr) {
                arr.sort((b, a) => {
                    return a.auditLevel - b.auditLevel
                })
                return arr
            }
        }
    }
}
</script>

<style scoped>
</style>