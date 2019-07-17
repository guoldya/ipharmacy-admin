<template>
    <div>
        <a-card>
            <h2 class="font-bold">筛选条件</h2>
            <a-row class="taskDetail">
                <a-col span="4">
                    <span class="font-bold">任务名称：</span>
                    <span class="opacity8">点评方案2333</span>
                </a-col>
                <a-col span="4">
                    <span class="font-bold">方案范围：</span>
                    <span class="opacity8" v-html="filterPlanScope(planDetail.planScope)"></span>
                </a-col>
                <a-col span="6">
                    <span class="font-bold" v-if="planDetail.planScope == 1">处方时间：</span>
                    <span class="font-bold" v-else-if="planDetail.planScope == 2">出院时间：</span>
                    <span class="opacity8">2019:08:07-2019:12:17</span>
                </a-col>
                <a-col span="10">
                    <span class="font-bold">抽取规则:</span>
                    <span class="opacity8">等间隔抽取500份，每个科室80份</span>
                </a-col>
            </a-row>
            <a-row class="taskDetail">
                <a-col>
                    <span class="font-bold">点评方案：</span>
                    <span class="opacity8">点评方案2333、点评方案2333、点评方案2333、点评方案2333</span>
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
                        :width="100"
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
export default {
    components: {
        countReview
    },
    data() {
        return {
            api: {
                logUrl: '/sys/sysUser/selectPage'
            },
            spinning: false,
            dataSource: [],
            columns: [],
            columns1: [
                { title: '处方日期', value: 'successTime', width: 100 },
                 { title: '处方号', value: 'creatTime', width: 100, align: 'right' },
                { title: '患者', value: 'termial', width: 100 },
                { title: '性别', value: 'progress', width: 80, align: 'center' },
                { title: '年龄', value: 'controller', width: 80 },
                { title: '门诊号', value: 'logHost', width: 100, align: 'right'  },
                { title: '医生', value: 'callMethod', width: 100 },
                { title: '科室', value: 'planScope', width: 150, format: this.taskScope },
                { title: '临床诊断', value: 'sadasd', width: 300 },
                { title: '药品品种数', value: 'status1', width: 100 },
                { title: '抗菌药', value: 'adasd', width: 100 },
                { title: '特殊抗菌药', value: 'status2', width: 100 },
                { title: '注射剂', value: 'status3', width: 100 },
                { title: '基本药物', value: 'status4', width: 100 },
                { title: '药品金额', value: 'statsadus4', width: 100, align: 'right'  },
                { title: '点评人', value: 'status5', width: 150 },
                { title: '点评结果', value: 'status6', width: 150 },
                { title: '点评状态', fixed: 'right', value: 'statdad', align: 'center', width: 100 }
            ],
            columns2: [
                { title: '出院日期', value: 'successTime', width: 100 },
                { title: '患者', value: 'termial', width: 150 },
                { title: '性别', value: 'progress', width: 80, align: 'center' },
                { title: '年龄', value: 'controller', width: 80 },
                { title: '住院号', value: 'creatTime', width: 100, align: 'right' },
                { title: '住院科室', value: 'planScope', width: 150, format: this.taskScope },
                { title: '住院医师', value: 'callMethod', width: 100 },
                { title: '出院诊断', value: 'sadasd', width: 300 },
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
            planDetail: {}
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
        this.getData()
        console.log(this.$route.query, '111')
        this.planDetail = this.$route.query
        if (this.planDetail.planScope == 1) {
            this.columns = this.columns1
        } else {
            this.columns = this.columns2
        }
    },
    methods: {
        getFormData() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            if (params.logDate) {
                params.logDate = [params.logDate[0].format('YYYY-MM-DD'), params.logDate[1].format('YYYY-MM-DD')]
            }
            return params
        },
        search() {
            let params = this.getFormData()
            this.getData(params)
        },
        //重置
        resetForm() {
            this.$refs.searchPanel.form.resetFields()
            this.getData()
        },
        pageChange(page, size) {
            let params = this.getFormData()
            params.offset = (page - 1) * size
            this.getData(params)
        },
        sizeChange(current, size) {
            this.current = 1
            let params = this.getFormData()
            params.pageSize = size
            this.getData(params)
        },
        getData(obj = {}) {
            this.spinning = true
            this.$axios({
                url: this.api.logUrl,
                method: 'put',
                data: obj
            })
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows, ['logDate'])
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
</style>
