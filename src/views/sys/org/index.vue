<template>
    <a-card>
        <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button class="margin-left-5" @click="resetForm">重置</a-button>
            </div>
        </Searchpanel>
        <a-button class="margin-top-10" type="primary" @click="adds">新增</a-button>
        <a-spin :spinning="loading" tip="加载中...">
            <a-treeTable
                class="margin-top-10"
                :columns="columns"
                :data="dataSource"
                :items="items"
                :opColWidth="110"
                :moreOp="false"
                :isoperate="'false'"
            ></a-treeTable>
        </a-spin>
    </a-card>
</template>

<script>
import { selectSysOrgs } from '@/api/login'
import treeTable from '@/components/tree-table/treeTable.vue'

export default {
    name: 'index',
    components: {
        'a-treeTable': treeTable
    },
    data() {
        return {
            api: {
                selectClassListWithMoreParam: '/sys/dicBase/selectClassListWithMoreParam',
                selectOrgUpdate: 'sys/sysOrgs/updateStatus'
            },
            loading: false,
            total: 10,
            current: 1,
            pageSize: 100000,
            visible: false,
            confirmLoading: false,
            enumList: {},
            //穿梭狂数据
            targetKeys: [],
            mockData: [],
            columns: [
                { text: '编码', value: 'orgId', width: 150 },
                { text: '名称', value: 'title', width: 250 },
                { text: '机构代码', value: 'orgCode', width: 120 },
                { text: '机构类型', value: 'orgType', width: 80, format: this.orgTyoefFormat },
                { text: '医院分类', value: 'orgClass', align: 'center', width: 80, format: this.orgClassFormat },
                { text: '医院等级', value: 'orgGrade', align: 'center', width: 80, format: this.orgGradeFormat },
                { text: '联系电话', value: 'phone', width: 110 },
                { text: '法人', value: 'legalPsn', width: 80 },
                { text: '地址', value: 'adress' },
                { text: '备注', value: 'remarks' },
                { text: '状态', value: 'status', align: 'center', width: 80 },
                { text: '更新时间', value: 'updateDate', width: 140, format: this.timeFormat }
            ],
            items: [
                { text: '编辑', showtip: false, click: this.edits },
                {
                    text: '启用',
                    color: '#2D8cF0',
                    showtip: true,
                    tip: '确认启用吗？',
                    click: this.changeStatus,
                    status: '1'
                },
                {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '确认停用吗？',
                    click: this.changeStatus,
                    status: '0'
                }
            ],
            colors: '#ffffff',
            dataSource: [],
            parentId: ''
        }
    },
    computed: {
        list() {
            return [
                {
                    name: '医院名称',
                    dataField: 'title',
                    type: 'text'
                },
                {
                    name: '机构代码',
                    dataField: 'orgCode',
                    type: 'text'
                },
                {
                    name: '机构类型',
                    dataField: 'orgType',
                    type: 'select',
                    keyExpr: 'id',
                    valueExpr: 'text',
                    dataSource: this.enum.orgType
                },
                {
                    name: '医院分类',
                    dataField: 'orgClass',
                    type: 'select',
                    keyExpr: 'id',
                    valueExpr: 'name',
                    dataSource: this.enumList['33']
                },
                {
                    name: '医院等级',
                    dataField: 'orgGrade',
                    type: 'select',
                    keyExpr: 'id',
                    valueExpr: 'name',
                    dataSource: this.enumList['34']
                }
            ]
        }
    },
    mounted() {
        this.getEnumList()
    },
    methods: {
        //搜索
        search() {
            //TODO:枚举值回来以后在调用分页查询
            let params = this.$refs.searchPanel.form.getFieldsValue()
            params.pageSize = 100000
            params.offset = 0
            this.getData(params)
        },
        //重置
        resetForm() {
            this.$refs.searchPanel.form.resetFields()
            this.getData({ pageSize: 100000, offset: 0 })
        },
        getData(params = { pageSize: 100000, offset: 0 }) {
            this.loading = true
            // params.orderId = 1
            selectSysOrgs(params)
                .then(res => {
                    if (res.code == '200') {
                        this.dataSource = this.getDataChildren(res.rows, undefined)
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
        getEnumList() {
            this.loading = true
            //orgTyoe
            let parameter = {
                codeClass: ['34', '33']
            }
            this.$axios({
                url: this.api.selectClassListWithMoreParam,
                method: 'put',
                data: parameter
            })
                .then(res => {
                    if (res.code == '200') {
                        this.enumList = res.data

                        this.loading = false
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                    this.getData()
                })
                .catch(err => {
                    this.getData()
                    this.loading = false
                    this.error(err)
                })
        },
        getDataChildren(bdata, pid) {
            var items = []
            for (var key in bdata) {
                var item = bdata[key]
                if (pid == item.parentId) {
                    item.items = this.getDataChildren(bdata, item.orgId)
                    items.push(item)
                }
            }
            return items
        },
        //新增
        adds() {
            this.$router.push({
                name: 'sys_org_detail',
                params:{orgId:0},
            })
        },
        edits(data) {
            let routerData = {};
            this.$router.push({
                name: 'sys_org_detail',
                params:{orgId:data.orgId}
            })
        },
        //启用停用
        changeStatus(data) {
            let params = {}
            params.orgId = data.orgId
            if (data.status == '1') {
                params.status = '0'
            } else {
                params.status = '1'
            }
            this.$axios({
                url: this.api.selectOrgUpdate,
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        if (data.status == '1') {
                            this.success('停用成功');

                        } else {
                            this.success('启用成功')
                        }
                        this.getData()
                    } else {
                        if (data.status == '1') {
                            this.warn('停用失败')
                        } else {
                            this.warn('启用失败')
                        }
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.error(err)
                })
        },
        orgTyoefFormat(data) {
            let levelText
            this.enum.orgType.forEach(item => {
                if (data.orgType == item.id) {
                    levelText = item.text
                    return
                }
            })
            return levelText
        },
        // 	33		医院分类
        orgClassFormat(data) {
            let levelText
            if (this.enumList['33'] != null) {
                this.enumList['33'].forEach(item => {
                    if (data.orgClass == item.id) {
                        levelText = item.name
                        return
                    }
                })
            }
            return levelText
        },
        //    34		医院等级
        orgGradeFormat(data) {
            let levelText
            if (this.enumList['34'] != null) {
                this.enumList['34'].forEach(item => {
                    if (data.orgGrade == item.id) {
                        levelText = item.name
                        return
                    }
                })
            }
            return levelText
        },
        timeFormat(data) {
            if (data.updateDate != null) {
                var crtTime = new Date(data.updateDate)
                return this.dateFtt('yyyy-MM-dd hh:mm', crtTime) //直接调用公共JS里面的时间类处理的办法
            }
            return ''
        },
        dateFtt(fmt, date) {
            //author: meizz
            var o = {
                'M+': date.getMonth() + 1, //月份
                'd+': date.getDate(), //日
                'h+': date.getHours(), //小时
                'm+': date.getMinutes(), //分
                's+': date.getSeconds(), //秒
                'q+': Math.floor((date.getMonth() + 3) / 3), //季度
                S: date.getMilliseconds() //毫秒
            }
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                    )
            return fmt
        }
    }
}
</script>

<style scoped>
.userModel-p {
    text-align: center;
}
</style>