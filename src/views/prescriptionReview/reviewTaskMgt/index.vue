<template>
    <div>
        <a-card></a-card>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                    class="margin-top-10"
                    :data="dataSource"
                    border
                    style="width: 100%"
                    @row-click="rowClick"
                >
                    <el-table-column
                        fixed="right"
                        label="操作"
                        :width="100"
                        align="center"
                        v-if="true"
                    >
                        <template slot-scope="scope">
                            <opcol
                                :items="items"
                                :more="false"
                                :data="scope.row"
                                :filterItem="['status']"
                            ></opcol>
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
                            <span v-if="item.value == 'status'">
                                <a-badge
                                    :status="scope.row.status == 0? 'default':'processing'"
                                    :text="scope.row.status==0?'停用':'启用'"
                                />
                            </span>
                            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                            <span v-else-if="item.value == 'progress'">
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="15"
                                    :percentage="70"
                                />
                            </span>
                            <span v-else>{{scope.row[item.value]}}</span>
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
        <a-card class="margin-top-5">
            <a-spin tip="加载中..." :spinning="bmSpinning">
                <el-table class="margin-top-10" :data=" bmDataSource" border style="width: 100%">
                    <el-table-column
                        v-for="item in bmColumns"
                        :show-overflow-tooltip="true"
                        :key="item.value"
                        :label="item.title"
                        :prop="item.value"
                        :width="item.width"
                        :align="item.align"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.format !=null" v-html="item.format(scope.row)"></span>
                            <span v-else>{{scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    hideOnSinglePage
                    :total="bmTotal"
                    showSizeChanger
                    v-model="bmCurrent"
                    class="pnstyle"
                    :defaultPageSize="10"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="bmSizeChange"
                    @change="bmPageChange"
                    size="small"
                ></a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            api: {
                logUrl: '/sys/sysUser/selectPage'
            },
            spinning: false,
            bmSpinning: false,
            dataSource: [],
            bmDataSource: [],
            columns: [
                { title: '创建时间', value: 'creatTime', width: 100 },
                { title: '完成时间', value: 'successTime', width: 100 },
                { title: '开始时间', value: 'callMethod', width: 100 },
                { title: '方案范围', value: 'planScope', width: 80, format: this.taskScope },
                { title: '任务名称', value: 'logHost' },
                { title: '抽取数量', value: 'termial', width: 150 },
                { title: '点评进度', value: 'progress', width: 200 },
                { title: '合格率', value: 'controller', width: 100 },
                { title: '状态', value: 'status', width: 150 }
            ],
            bmColumns: [
                { title: '工号', value: 'creatTime' },
                { title: '点评药师', value: 'successTime' },
                { title: '电话', value: 'callMethod', width: 130 },
                { title: '分配数量', value: 'planScope', width: 80 },
                { title: '已点评数量', value: 'logHost' },
                { title: '合理处方', value: 'termial', width: 150 },
                { title: '不合理处方', value: 'progress', width: 200 },
                { title: '完成率', value: 'controller', width: 100 }
            ],
            items: [
                { text: '编辑', showtip: false, click: this.edits },
                { text: '启用', color: '#2D8cF0', showtip: true, tip: '确认启用吗？', click: this.user, status: '1' },
                { text: '停用', color: '#ff9900', showtip: true, tip: '确认停用吗？', click: this.user, status: '0' }
            ],
            total: 0,
            bmTotal: 1,
            current: 0,
            bmCurrent: 1
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
                name: 'reviewTaskMgtAdd',
            })
        },
        //table点击事件
        rowClick(row) {
            console.log(1)
            this.getbmData()
        },
        getbmData(obj = {}) {
            this.bmSpinning = true
            this.$axios({
                url: this.api.logUrl,
                method: 'put',
                data: obj
            })
                .then(res => {
                    if (res.code == '200') {
                        this.bmDataSource = this.$dateFormat(res.rows, ['logDate'])
                        this.bmSpinning = false
                    } else {
                        this.bmSpinning = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.bmSpinning = false
                    this.error(err)
                })
        },

        bmSizeChange(current, size) {
            this.bmCurrent = 1
            let params = this.getFormData()
            params.pageSize = size
            this.getData(params)
        },
        bmPageChange(page, size) {
            let params = this.getFormData()
            params.offset = (page - 1) * size
            this.getData(params)
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
        percents(percent) {
            return '哈哈哈'
        }
    }
}
</script>
<style>
</style>
