<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                        class="margin-top-10"
                        :data="dataSource"
                        border
                        style="width: 100%"
                >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <detail-list :col="1">
                                <detail-list-item term="日志级别">{{ props.row.logLevel }}</detail-list-item>
                            </detail-list>
                            <detail-list :col="1">
                                <detail-list-item term="日志记录器">{{ props.row.logLogger }}</detail-list-item>
                            </detail-list>
                            <detail-list :col="1">
                                <detail-list-item term="消息">{{ props.row.logMessage }}</detail-list-item>
                            </detail-list>
                            <detail-list :col="1">
                                <detail-list-item term="异常">{{ props.row.logException?props.row.logException:'无' }}</detail-list-item>
                            </detail-list>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in columns"
                            :width="item.width"
                            :align="item.align"
                    >
                    </el-table-column>
                </el-table>
                <a-pagination
                        :total="total"
                        showSizeChanger
                        v-model="current"
                        class="pnstyle"
                        :defaultPageSize="10"
                        :pageSizeOptions="['10', '20','50']"
                        @showSizeChange="sizeChange"
                        @change="pageChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    import DetailList from '@/components/tools/DetailList';
    const DetailListItem = DetailList.Item;
    export default {
        data(){
            return{
                spinning:false,
                dataSource:[],
                columns: [
                    { title: '当前用户', prop: 'loginName',width:100 },
                    { title: '动作', prop: 'action' },
                    { title: '请求方式', prop: 'callMethod',width:100 },
                    { title: 'URL', prop: 'url' },
                    { title: '服务器地址', prop: 'logHost' },
                    { title: '客户端IP', prop: 'termial',width:150 },
                    { title: '日志类型', prop: 'callType',width:100 },
                    { title: '控制器', prop: 'controller',width:100 },
                    { title: '时间', prop: 'logDate',width:150 },
                ],
                total:0,
                current:1,
                api:{
                    logUrl:'/sys/sysLog/selectPage'
                }
            }
        },
        components:{
            DetailList,
            DetailListItem
        },
        computed: {
            list() {
                return [
                    { name: '当前用户', dataField: 'loginName', type: 'text' },
                    { name: '时间', dataField: 'logDate', type: 'range-picker' }
                ]
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getFormData(){
                let params = this.$refs.searchPanel.form.getFieldsValue();
                if(params.logDate){
                    params.logDate = [params.logDate[0].format('YYYY-MM-DD'),params.logDate[1].format('YYYY-MM-DD')]
                }
                return params
            },
            search() {
                let params = this.getFormData();
                this.getData(params)
            },
            //重置
            resetForm() {
                this.$refs.searchPanel.form.resetFields()
                this.getData()
            },
            pageChange(page, size) {
                let params = this.getFormData();
                params.offset = (page - 1) * size;
                this.getData(params);
            },
            sizeChange(current, size) {
                this.current = 1;
                let params = this.getFormData();
                params.pageSize = size;
                this.getData(params);
            },
            getData(obj = {}) {
                this.spinning = true
                this.$axios({
                    url: this.api.logUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows,['logDate']);
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
        }
    }
</script>