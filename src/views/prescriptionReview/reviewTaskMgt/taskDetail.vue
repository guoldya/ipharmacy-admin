<template>
    <div>
        <a-card>
            <div class="backButton">
                <a href="#" @click.prevent="backTo">
                    <a-icon type="left"></a-icon>返回
                </a>
            </div>
            <h2 class="font-bold">筛选条件</h2>
            <a-row class="taskDetail">
                <a-col span="4">
                    <span class="font-bold">任务名称：</span>
                    <span class="opacity8">{{headData.name}}</span>
                </a-col>
                <a-col span="4">
                    <span class="font-bold">方案范围：</span>
                    <span class="opacity8" v-html="filterPlanScope(headData.planScope)"></span>
                </a-col>
                <a-col span="6">
                    <span class="font-bold" v-if="headData.planScope == 1">处方时间：</span>
                    <span class="font-bold" v-else-if="headData.planScope == 2">出院时间：</span>
                    <span class="opacity8">{{headData.filterStartTime}}~{{headData.filterEndTime}}</span>
                </a-col>
                <a-col span="10">
                    <span class="font-bold">抽取规则:</span>
                    <span class="opacity8">等间隔抽取500份，每个科室80份</span>
                </a-col>
            </a-row>
            <a-row class="taskDetail">
                <a-col>
                    <span class="font-bold">点评方案：</span>
                    <span class="opacity8">{{headData.planNames}}</span>
                </a-col>
            </a-row>
        </a-card>
        <a-card class="margin-top-5">
            <a-button class="margin-top-10" type="primary" @click="add">分配任务</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table class="margin-top-10" :data="dataSource" border style="width: 100%">
                    <el-table-column
                        v-for="item in columns"
                        show-overflow-tooltip
                        :key="item.value"
                        :label="item.title"
                        :prop="item.value"
                        :width="item.width"
                        :align="item.align"
                        :fixed="item.fixed"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.value == 'status'">
                                <a-badge
                                    :status="scope.row.status == 0? 'default':'processing'"
                                    :text="scope.row.status==0?'停用':'启用'"
                                />
                            </span>
                            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                            <span v-else>{{scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        :width="80"
                        align="center"
                        v-if="true"
                    >
                        <template slot-scope="scope">
                            <opcol :items="items" :more="false" :data="scope.row"></opcol>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    hideOnSinglePage
                    :total="total"
                    showSizeChanger
                    v-model="current"
                    class="pnstyle"
                    :defaultPageSize="10"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="sizeChange"
                    @change="pageChange"
                    size="small"
                ></a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
import countReview from './count-review'
import { setTimeout } from 'timers'
export default {
    components: {
        countReview
    },
    data() {
        return {
            api: {
                detailUrl: '/sys/reviewInfo/selectReviewRecordDetail',
                recordIdUrl: 'sys/reviewFilter/selectReviewFilterPageByRecordId'
            },
            spinning: false,
            dataSource: [],
            columns: [],
            columns1: [
                { title: '处方日期', value: 'prescDate', width: 130 },
                { title: '处方号', value: 'prescNum', width: 100, align: 'right' },
                { title: '患者', value: 'patientName', width: 150 },
                { title: '性别', value: 'patientSex', width: 60, align: 'center', format: this.patientSex },
                { title: '年龄', value: 'patientAge', width: 80, align: 'right'  },
                { title: '门诊号', value: 'admitNum', width: 100, align: 'right' },
                { title: '门诊医生', value: 'attendingDoctorName', width: 100 },
                { title: '门诊科室', value: 'admitDeptName', width: 150, },
                { title: '临床诊断', value: 'diseaseNames', width: 300 },
                { title: '药品品种数', value: 'status1', width: 100 },
                { title: '抗菌药', value: 'adasd', width: 100 },
                { title: '特殊抗菌药', value: 'status2', width: 100 },
                { title: '注射剂', value: 'status3', width: 100 },
                { title: '基本药物', value: 'status4', width: 100 },
                { title: '药品金额', value: 'statsadus4', width: 100, align: 'right' },
                { title: '点评人', value: 'status5', width: 150 },
                { title: '点评结果', value: 'status6', width: 150 },
                { title: '点评状态', fixed: 'right', value: 'statdad', align: 'center', width: 100 }
            ],
            columns2: [
                { title: '出院日期', value: 'prescDate', width: 130 },
                { title: '患者', value: 'patientName', width: 150 },
               { title: '性别', value: 'patientSex', width: 60, align: 'center', format: this.patientSex },
                { title: '年龄', value: 'patientAge', width: 80, align: 'right'  },
                { title: '住院号', value: 'admitNum', width: 100, align: 'right' },
                { title: '住院科室', value: 'admitDeptName', width: 150 },
                { title: '住院医师', value: 'attendingDoctorName', width: 100 },
                { title: '出院诊断', value: 'diseaseNames', width: 300 },
                { title: '药品品种数', value: 'status1', width: 100 },
                { title: '抗菌药', value: 'adasd', width: 100 },
                { title: '特殊抗菌药', value: 'status2', width: 100 },
                { title: '注射剂', value: 'status3', width: 100 },
                { title: '基本药物', value: 'status4', width: 100 },
                { title: '药品金额', value: 'statsadus4', width: 100, align: 'right' },
                { title: '点评人', value: 'status5', width: 100 },
                { title: '点评结果', value: 'status6', width: 150 },
                { title: '点评状态', fixed: 'right', value: 'statdad', align: 'center', width: 100 }
            ],
            items: [{ text: '删除', showtip: false, click: this.delete }],
            total: 0,
            current: 0,
            planDetail: {},
            headData: {}
        }
    },
    computed: {
        list() {
            return [
                {
                    name: '方案范围',
                    dataField: 'planScope',
                    type: 'select',
                    keyExpr: 'id',
                    valueExpr: 'text',
                    dataSource: this.enum.patientScope
                },
                {
                    name: '任务名称',
                    dataField: 'name',
                    type: 'text'
                },
                {
                    name: '点评药师',
                    dataField: 'spellCode',
                    type: 'text'
                },
                {
                    name: '状态',
                    dataField: 'status',
                    type: 'select',
                    dataSource: this.enum.statu,
                    keyExpr: 'id',
                    valueExpr: 'text'
                },
                { name: '时间', dataField: 'logDate', type: 'range-picker' }
            ]
        }
    },
    mounted() {
        this.getTitleData()

        setTimeout(() => {
            this.getData()
            if (this.headData.planScope == 1) {
                this.columns = this.columns1
            } else {
                this.columns = this.columns2
            }
        }, 500)
    },
    methods: {
        getTitleData() {
            let params = {}
            params = this.$route.params
            this.$axios({
                url: this.api.detailUrl,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.headData = res.data
                        this.headData.filterStartTime = this.changeTime(res.data.filterStartTime)
                        this.headData.filterEndTime = this.changeTime(res.data.filterEndTime)
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        changeTime(time) {
            if (time) {
                return time.replace(/(:\d{2})$/, '')
            }
        },
        pageChange(page, size) {
            let params = {}
            params.offset = (page - 1) * size
            this.getData(params)
        },
        sizeChange(current, size) {
            this.current = 1
            let params = {}
            params.pageSize = size
            this.getData(params)
        },
        getData(obj = {}) {
            this.spinning = true
            obj.recordId = this.$route.params.recordId
            obj.planScope = this.headData.planScope
            this.$axios({
                url: this.api.recordIdUrl,
                method: 'put',
                data: obj
            })
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows, ['prescDate'])
                        this.spinning = false
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
        //新增
        add() {
            this.$router.push({
                name: 'reviewTaskMgtAdd'
            })
        },
        //返回
        backTo() {
            this.$router.push({
                name: 'reviewTaskMgtIndex'
            })
        },
        //过滤
        taskScope(data) {
            let scopeText
            this.enum.patientScope.forEach(item => {
                if (Number(data.planScope) == item.id) {
                    scopeText = item.text
                    return
                }
            })
            return scopeText
        },
        filterPlanScope(data) {
            let scopeText
            this.enum.patientScope.forEach(item => {
                if (data == item.id) {
                    scopeText = item.text
                    return
                }
            })
            return scopeText
        },
        patientSex(data) {
            let sexText
            this.enum.sex.forEach(item => {
                if (data.patientSex== item.id) {
                    sexText = item.text
                    return
                }
            })
            return sexText
        },
        percents(percent) {
            return '哈哈哈'
        }
    }
}
</script>
<style scoped>
.taskDetail {
    font-size: 14px;
    line-height: 30px;
}
.backButton {
    float: right;
}
</style>
