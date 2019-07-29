<template>
    <div>
        <a-card>
            <countReview :countList="countText"></countReview>
        </a-card>
        <a-card class="margin-top-5">
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button class="margin-top-10" type="primary" @click="add">新增</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                    highlight-current-row
                    class="margin-top-10"
                    :data="dataSource"
                    border
                    style="width: 100%"
                    @row-click="rowClick"
                >
                    <el-table-column
                        fixed="right"
                        label="操作"
                        :width="180"
                        align="center"
                        v-if="true"
                    >
                        <template slot-scope="scope">
                            <a v-if="scope.row.status == 1" @click="startScreen(scope.row)">开始筛选</a>
                            <a v-else-if="scope.row.status == 3" @click="assigned(scope.row)">开始分配</a>
                            <a v-else-if="scope.row.status == 4" @click="startView(scope.row)">开始点评</a>
                            <!-- <a v-else-if="scope.row.status == 6" @click="looks(scope.row)">点评完成</a> -->
                            <a-divider type="vertical" v-if="scope.row.status == 1 || scope.row.status == 3 || scope.row.status == 4 " />
                            <a @click="looks(scope.row)">查看</a>
                            <a-divider type="vertical" v-if="scope.row.status == 1"/>
                            <a-popconfirm
                                title="确定删除?"
                                @confirm="del(scope.row)"
                                okText="删除"
                                cancelText="取消"
                                v-if="scope.row.status == 1"
                            >
                                <a href="javascript:;">删除</a>
                            </a-popconfirm>
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
                                <a-badge v-if="scope.row.status == '1'" status="default" text="创建" />
                                <a-badge
                                    v-else-if="scope.row.status == '2'"
                                    status="warning"
                                    text="筛选中"
                                />
                                <a-badge
                                    v-else-if="scope.row.status== '3'"
                                    status="processing"
                                    text="筛选完成"
                                />
                                <a-badge
                                    v-else-if="scope.row.status == '4'"
                                    status="processing"
                                    text="分配完成"
                                />
                                <a-badge
                                    v-else-if="scope.row.status == '5'"
                                    status="warning"
                                    text="点评中"
                                />
                                <a-badge
                                    v-else-if="scope.row.status == '6'"
                                    status="success"
                                    text="点评完成"
                                />
                            </span>
                            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                            <span v-else-if="item.value == 'percentageComplete'">
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="15"
                                    :percentage="scope.row.percentageComplete"
                                />
                            </span>
                          <span v-else-if="item.value == 'rationalPercentage' && scope.row.percentageComplete" >
                            {{scope.row.percentageComplete}}%
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
<!--        </a-card>-->
<!--        <a-card class="margin-top-5">-->
          <a-divider>点评分配</a-divider>
            <a-spin tip="加载中..." :spinning="bmSpinning">
                <el-table
                    highlight-current-row
                    class="margin-top-10"
                    :data=" bmDataSource"
                    border
                    style="width: 100%"
                >
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
                          <span v-else-if="item.value =='percentage' && scope.row.percentage">
                            {{scope.row.percentage}}%
                          </span>
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
import countReview from './count-review'
export default {
    components: {
        countReview
    },
    data() {
        return {
            api: {
                logUrl: '/sys/reviewInfo/selectPage',
                RecordUrl: 'sys/reviewInfo/selectPersonPageInReviewRecord',
                delUrl: 'sys/reviewInfo/delete',
                startScreenUrl: 'sys/reviewFilter/startScreen',
                recordNumUrl:'sys/reviewInfo/selectCurrentOpenReviewRecordNum',
                startDistributionUrl:'sys/reviewFilter/startDistribution',
                startViewUrl:'sys/reviewFilter/startView',
            },
            spinning: false,
            bmSpinning: false,
            dataSource: [],
            bmDataSource: [],
            columns: [


                { title: '范围', value: 'planScope', width: 60, format: this.taskScope, align: 'center' },
                { title: '任务名称', value: 'name' },
                { title: '抽取数量', value: 'extractionsNumber', width: 100, align: 'right' },
                { title: '点评进度', value: 'percentageComplete', width: 180 },
                { title: '合格率', value: 'rationalPercentage', width: 100, align: 'right' },
                //状态 1创建 2筛选中 3筛选完成 4分配完成 5点评中 6点评完成
              { title: '开始时间', value: 'filterStartTime', width: 130 },
              { title: '完成时间', value: 'filterEndTime', width: 130 },
              { title: '创建时间', value: 'updateTime', width: 130 },
                { title: '状态', value: 'status', width: 100, align: 'center' }
                // { title: '修改时间', value: 'updateTime', width: 130 },
                // { title: '修改人', value: 'updateUser', width: 100 }
            ],
            bmColumns: [
                { title: '工号', value: 'personId' },
                { title: '点评药师', value: 'name' },
                { title: '电话', value: 'phone', align: 'right' },
                { title: '分配数量', value: 'reviewTotal', align: 'right'  },
                { title: '已点评数量', value: 'reviewedCount' , align: 'right' },
                { title: '合理处方', value: 'reasonableCount' , align: 'right'},
                { title: '不合理处方', value: 'unReasonableCount', align: 'right'},
                { title: '完成率', value: 'percentage' , align: 'right'}
            ],
            total: 0,
            bmTotal: 1,
            current: 0,
            bmCurrent: 1,
            countText: [
                { itemCount: 0, item: '抽取点评', itemColors: '#4586ff' },
                { itemCount: 0, item: '已点评', itemColors: '#2dc89f' },
                { itemCount: 0, item: '问题点评', itemColors: '#ff6781' }
            ]
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
                // {
                //     name: '点评药师',
                //     dataField: 'spellCode',
                //     type: 'text'
                // },
                {
                    name: '状态',
                    dataField: 'status',
                    type: 'select',
                    dataSource: this.planStatus(),
                    keyExpr: 'id',
                    valueExpr: 'text'
                },
                { name: '创建时间', dataField: 'updateTime', type: 'range-picker' }
            ]
        }
    },
    mounted() {
        this.getData();
        this.getRecordData();
    },
    methods: {
      getRecordData(){
        this.$axios({
          url: this.api.recordNumUrl,
          method: 'put',
          data:{}
        })
          .then(res => {
            if (res.code == '200') {
              this.countText = res.rows;
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
        getFormData() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            if (params.updateTime) {
                params.updateTime = [
                    params.updateTime[0].format('YYYY-MM-DD'),
                    params.updateTime[1].format('YYYY-MM-DD')
                ]
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
                        this.dataSource = this.$dateFormat(res.rows, ['updateTime', 'filterEndTime', 'filterStartTime'])
                        this.total = res.total
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
        //查看
        looks(data) {
            this.$router.push({
                name: 'reviewTaskMgtDetail',
                params: { recordId: data.recordId }
            })
        },
        //开始筛选
        startScreen(data) {
            this.$axios({
                url: this.api.startScreenUrl,
                method: 'post',
                data: { recordId: data.recordId,planScope:data.planScope }
            })
                .then(res => {
                    if (res.code == '200') {
                        this.getData()
                        this.success(res.msg)
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
      //开始分配
      assigned(data){
        this.$router.push({
          name: 'reviewTaskMgtDetail',
          params: { recordId: data.recordId }
        })
      },
      //开始评价
      startView(data){
        this.$axios({
          url: this.api.startViewUrl,
          method: 'post',
          data: { recordId: data.recordId}
        })
          .then(res => {
            if (res.code == '200') {
              this.getData()
              this.success(res.msg)
            } else {
              this.warn(res.msg)
            }
          })
          .catch(err => {
            this.error(err)
          })
      },
        //删除
        del(data) {
            this.$axios({
                url: this.api.delUrl,
                method: 'delete',
                data: { recordId: data.recordId }
            })
                .then(res => {
                    if (res.code == '200') {
                        this.getData()
                        this.success('删除成功')
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //table点击事件
        rowClick(row) {
            this.getbmData({ recordId: row.recordId })
        },
        getbmData(obj = {}) {
            this.bmSpinning = true
            this.$axios({
                url: this.api.RecordUrl,
                method: 'put',
                data: obj
            })
                .then(res => {
                    if (res.code == '200') {
                        this.bmDataSource = this.$dateFormat(res.rows, ['logDate'])
                        this.bmTotal = res.total
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
        },
        planStatus() {
            let status = [
                { id: '1', text: '创建' },
                { id: '2', text: '筛选中' },
                { id: '3', text: '筛选完成' },
                { id: '4', text: '分配完成' },
                { id: '5', text: '点评中' },
                { id: '6', text: '点评完成' }
            ]
            return status
        }
    }
}
</script>
<style>
</style>
