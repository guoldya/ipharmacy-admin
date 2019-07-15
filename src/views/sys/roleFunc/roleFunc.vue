<template>
    <div>
        <a-row :gutter="24">
            <a-col :span="16">
                <a-card title="角色">
                    <a-spin tip="加载中..." :spinning="spinning">
                        <el-table
                                ref="table"
                                class="margin-top-10"
                                :data="dataSource"
                                border
                                style="width: 100%"
                                highlight-current-row
                                @current-change="currentChange"
                        >
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
                                hideOnSinglePage
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
            </a-col>
            <a-col :span="8">
                <a-card title="模块">
                    <a-spin tip="加载中..." :spinning="funcSpin">
                        <a-button type="primary" @click="submit" :disabled="disabled" :loading="loading">保存</a-button>
                        <a-tree
                                checkable
                                @expand="onExpand"
                                :expandedKeys="expandedKeys"
                                v-model="selectKeys"
                                :treeData="treeData"
                        >
                        </a-tree>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                spinning: false,
                dataSource: [],
                columns: [
                    { title: '角色名', prop: 'title' },
                    { title: '机构', prop: 'orgTitle' },
                    { title: '备注', prop: 'remark' }
                ],
                total: 0,
                current: 1,
                selectRole: {},
                api: {
                    roleUrl: '/sys/sysRole/selectPage',
                    funcUrl: '/sys/sysModules/selectList',
                    roleFuncUrl: '/sys/sysRole/selectModuleAndFuncWithRoleId',
                    roleAddFuncUrl: '/sys/sysRole/addModulesWithRoleId'
                },
                treeData: [],
                selectKeys: [],
                expandedKeys: [],
                disabled: true,
                funcSpin: false,
                loading: false
            }
        },
        mounted() {
            this.getData()
            this.getAList()
        },
        methods: {
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys
            },
            submit() {
                this.loading = true
                let ids = [], modules = [], params = {}
                this.selectKeys.forEach(item => {
                    if (item.length > 2) {
                        if (ids.indexOf(item.slice(0, 2)) < 0) {
                            ids.push(item.slice(0, 2))
                        }
                        ids.push(item)
                    } else {
                        if (ids.indexOf(item) < 0) {
                            ids.push(item)
                        }
                    }
                })
                ids.forEach(item => {
                    this.treeData.forEach(i => {
                        if (item == i.moduleId) {
                            modules.push(i)
                        } else {
                            if (i.children) {
                                i.children.forEach(child => {
                                    if (item == child.moduleId) {
                                        modules.push(child)
                                    }
                                })
                            }
                        }
                    })
                })
                params.modulesList = ids
                params.roleId = this.selectRole.roleId
                this.$axios({
                    url: this.api.roleAddFuncUrl,
                    method: 'post',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!', () => {
                            this.loading = false
                        })
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false
                    this.error(err)
                })
            },
            setCurrent() {
                this.$refs.table.setCurrentRow(this.dataSource[0])
            },
            currentChange(row) {
                if (row) {
                    this.selectRole = row
                    this.disabled = false
                    this.getRoleFunc(row.roleId)
                } else {
                    this.selectKeys = []
                    this.expandedKeys = []
                    this.selectRole = {}
                    this.disabled = true
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
                obj.status = '1'
                this.$axios({
                    url: this.api.roleUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows
                        this.total = res.total
                        this.setCurrent()
                        this.spinning = false
                    } else {
                        this.spinning = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.spinning = false
                    this.error(err)
                })
            },
            getAList(obj = {}) {
                this.$axios({
                    url: this.api.funcUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        let arr = this.checkArr(this.getDataChildren(res.rows, '&'))
                        this.list = res.rows
                        this.treeData = arr
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            getDataChildren(bdata, pid) {
                var items = []
                for (var key in bdata) {
                    var item = bdata[key]
                    if (pid == item.parentId) {
                        item.children = this.getDataChildren(bdata, item.moduleId)
                        items.push(item)
                    }
                }
                return items
            },
            checkArr(data) {
                data.map((item) => {
                    if (item.moduleId) {
                        item.key = item.moduleId
                    }
                    if (item.moduleName) {
                        item.title = item.moduleName
                    }
                    if (item.children) {
                        this.checkArr(item.children)
                    }
                    return item
                })
                return data
            },
            getRoleFunc(val) {
                this.funcSpin = true
                this.selectKeys = []
                this.expandedKeys = []
                this.$axios({
                    url: this.api.roleFuncUrl,
                    method: 'post',
                    data: { roleId: val }
                }).then(res => {
                    if (res.code == '200') {
                        let myPower = this.myPower(res.rows, this.treeData), parantKeys = []
                        res.rows.forEach(item => {
                            if (item.moduleId <= 2) {
                                parantKeys.push(item.moduleId)
                            }
                        })
                        this.selectKeys = myPower
                        this.expandedKeys = parantKeys
                        this.funcSpin = false
                    } else {
                        this.funcSpin = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.funcSpin = false
                    this.error(err)
                })
            },
            myPower(data, list) {
                let myPowerArr = []
                list.forEach(item => {
                    let parent, son = []
                    data.forEach(i => {
                        if (i.moduleId.length > 2) {
                            if (i.moduleId.slice(0, 2) == item.moduleId) {
                                son.push(i.moduleId)
                            }
                        }
                    })
                    if (item.children.length == son.length) {
                        myPowerArr.push(item.moduleId)

                    }
                    myPowerArr = myPowerArr.concat(son)
                })
                return myPowerArr
            }
        }
    }
</script>