<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" @click="addUser" class="margin-top-10">新增人员</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table class="margin-top-10" :data="dataSource" border style="width: 100%">
                    <el-table-column fixed="right" label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical" />
                            <a-popconfirm title="确认删除吗?" @confirm="delRow(scope.row)">
                                <a class="delColor">删除</a>
                            </a-popconfirm>
                            <a-divider type="vertical" />
                            <a-popconfirm
                                title="确认启用吗?"
                                @confirm="changeStatus(scope.row,true)"
                                v-if="scope.row.status == '0'"
                            >
                                <a>启用</a>
                            </a-popconfirm>
                            <a-popconfirm
                                title="确认停用吗?"
                                @confirm="changeStatus(scope.row,false)"
                                v-else
                            >
                                <a class="delColor">停用</a>
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <detail-list :col="4">
                                <detail-list-item term="身份证">{{ props.row.idCard }}</detail-list-item>
                                <detail-list-item term="资格证书号">{{ props.row.certificateNo }}</detail-list-item>
                                <detail-list-item term="电子邮箱">{{ props.row.email }}</detail-list-item>
                                <detail-list-item term="出生日期">{{ props.row.birthday }}</detail-list-item>
                                <detail-list-item
                                    term="处方权"
                                >{{ props.row.prescRight?'有处方权':'无处方权' }}</detail-list-item>
                                <detail-list-item
                                    term="门诊抗菌药物权限"
                                >{{ setAnt(props.row.outpAntibacterial) }}</detail-list-item>
                                <detail-list-item
                                    term="住院抗菌药物权限"
                                >{{ setAnt(props.row.hospAntibacterial) }}</detail-list-item>
                            </detail-list>
                            <detail-list :col="1">
                                <detail-list-item term="个人简介">{{ props.row.personalProfile }}</detail-list-item>
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
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'status'">
                                <a-badge
                                    :status="scope.row.status == 0? 'default':'processing'"
                                    :text="scope.row.status ==0?'停用':'启用'"
                                />
                            </span>
                            <span v-else-if="item.prop == 'sex'">{{setSex(scope.row.sex)}}</span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    :total="total"
                    showSizeChanger
                    hideOnSinglePage
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
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
    data() {
        return {
            api: {
                userUrl: '/sys/sysPersons/selectPage',
                updateUrl: '/sys/sysPersons/updateStatus',
                delUrl: '/sys/sysPersons/delete'
            },
            spinning: false,
            dataSource: [],
            columns: [
                { title: '人员编号', prop: 'code', width: 100 },
                { title: '机构', prop: 'orgTitle' },
                { title: '姓名', prop: 'name' },
                { title: '性别', prop: 'sex', align: 'center', width: 80 },
                { title: '职称', prop: 'titlesName', width: 100 },
                { title: '管理职务', prop: 'mentPositionName', width: 100 },
                { title: '电话', prop: 'phone', width: 120 },
                { title: '创建时间', prop: 'createDate', width: 150 },
                { title: '更新时间', prop: 'updateDate', width: 150 },
                { title: '状态', prop: 'status', align: 'center', width: 80 }
            ],
            pageChangeFilter:{},
            total: 0,
            current: 1
        }
    },
    components: {
        DetailList,
        DetailListItem
    },
    computed: {
        list() {
            return [
                { name: '人员编号', dataField: 'code', type: 'text' },
                { name: '姓名', dataField: 'name', type: 'text' },
                {
                    name: '状态',
                    dataField: 'status',
                    type: 'select',
                    keyExpr: 'id',
                    valueExpr: 'text',
                    dataSource: this.enum.status
                }
            ]
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        search() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            this.pageChangeFilter = this.$refs.searchPanel.form.getFieldsValue()
            this.getData(params)
        },
        //重置
        resetForm() {
            this.current = 1
            this.pageChangeFilter = {}
            this.$refs.searchPanel.form.resetFields()
            this.getData()
        },
        setSex(val) {
            let sex = ['未知', '男', '女']
            return sex[Number(val)]
        },
        addUser() {
            this.$router.push({
                name: 'userDetail',
                params: { id: 0 }
            })
        },
        edit(row) {
            this.$router.push({
                name: 'userDetail',
                params: { id: row.personId }
            })
        },
        delRow(row) {
            if (row.status == '1') {
                this.warn('请先停用该用户，再删除!')
                return
            }
            this.$axios({
                url: this.api.delUrl,
                method: 'delete',
                data: { personId: row.personId }
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.getData()
                        })
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        changeStatus(row, flag) {
            let params = {}
            if (flag) {
                params.status = 1
            } else {
                params.status = 0
            }
            params.personId = row.personId
            this.$axios({
                url: this.api.updateUrl,
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.getData()
                        })
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        setAnt(val) {
            let arr = ['非限制使用级', '限制使用级', '特殊使用级']
            return arr[val - 1]
        },
        pageChange(page, size) {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            params.offset = (page - 1) * size
            this.getData(params)
        },
        sizeChange(current, size) {
            this.current = 1
            let params = this.$refs.searchPanel.form.getFieldsValue()
            params.pageSize = size
            this.getData(params)
        },
        getData(obj = {}) {
            this.spinning = true
            let params = {}
            params.pageSize = obj.pageSize || 10
            params.offset = obj.offset || 0
            this.$axios({
                url: this.api.userUrl,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.$dateFormat(res.rows, ['createDate', 'updateDate', 'birthday'])
                        this.total = res.total
                        if (!params.offset) {
                            this.current = 1
                        }
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
        }
    }
}
</script>