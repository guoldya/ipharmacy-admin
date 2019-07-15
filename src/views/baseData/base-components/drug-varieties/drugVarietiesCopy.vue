<template>
    <div>
        <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
                <a-button type="primary" @click="varietiesSearch">查询</a-button>
                <a-button style="margin-left: 5px" @click="varietiesResetForm">重置</a-button>
            </div>
        </Searchpanel>
        <div class="margin-top-10">
            <a-input-group compact>
                <a-select
                    style="width:400px"
                    showSearch
                    allowClear
                    mode="single"
                    optionLabelProp="title"
                    autoClearSearchValue
                    :defaultActiveFirstOption="false"
                    :showArrow="false"
                    :filterOption="false"
                    @search="handleSearch"
                    @change="handleChange"
                    :disabled="disable"
                >
                    <a-select-option
                        v-for="(item,index) in this.drugAllList"
                        :value="item.varietyCode"
                        :key="index"
                        :engname="item.engName"
                        :drugkinds="item.drugIndicator"
                        :title="item.varietyName"
                    >
                        <div class="ypmingcheng">
                            <span>{{item.varietyName}}</span>
                        </div>
                        <div class="hechengayao">
                            {{item.engName}}
                            <a-tag v-if="item.iscompound==1">合成药</a-tag>
                            <a-tag>{{item.drugIndicator|drugIndicator_filter}}</a-tag>
                        </div>
                    </a-select-option>
                </a-select>
                <a-button type="primary" :disabled="disable" @click="addVary">添加关联</a-button>
            </a-input-group>
        </div>
        <div>
            <a-spin tip="加载中..." :spinning="loading">
                <el-table
                    ref="table"
                    :data="variety.drugVarietyData"
                    border
                    class="margin-top-10"
                    :highlight-current-row="true"
                    @row-click="clickRow"
                >
                    <el-table-column
                        :show-overflow-tooltip="true"
                        v-for="item in columns"
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
                            <div v-else-if="item.value == 'linkType'">
                                <span v-if="scope.row.linkType==2 ">
                                    <a-popconfirm
                                        title="确认删除吗?"
                                        @confirm="delRows(scope.row)"
                                        placement="topRight"
                                    >
                                        <a href="#">移除关联</a>
                                    </a-popconfirm>
                                </span>
                            </div>
                            <span v-else-if="item.format !=null" v-html="item.format(scope.row)"></span>
                            <span v-else>{{scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                    showSizeChanger
                    showQuickJumper
                    hideOnSinglePage
                    :total="variety.total"
                    class="pnstyle"
                    :defaultPageSize="pageSize"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="pageChangeSize"
                    @change="pageChange"
                    size="small"
                    v-model="currents"
                ></a-pagination>
            </a-spin>
        </div>
        <a-modal
            :title="Modal.title"
            :visible="Modal.visible"
            @ok="handleOk"
            :confirmLoading="Modal.confirmLoading"
            @cancel="handleCancel"
            class="ruleModal"
            width="680px"
            :maskClosable="false"
        ></a-modal>
    </div>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
    name: 'drugVarieties',
    props: {
        disable: {
            Boolean
        },
        variety: {
            Object
        },
        clickRow: {
            Function
        }
    },
    data() {
        this.handleSearch = debounce(this.handleSearch, 800)
        return {
            api: {
                drugVarietyPageId: 'sys/dicDrugcategory/selectDrugVarietyPageByCategoryId',
                dicBaseSelectList: 'sys/dicBase/selectClassList',
                drugVarietyIdUpdate: 'sys/dicDrugvariety/update',
                getDrugList: 'sys/dicDrugvariety/selectListBykeyword',
                addvarylist: 'sys/linkCategoryVariety/insert',
                drugVarietyPageId: 'sys/dicDrugcategory/selectDrugVarietyPageByCategoryId',
                deteleConnect: 'sys/linkCategoryVariety/deleteByDicIdAndVarietyCode'
            },
            loading: false,
            pageSize: 10,
            currents: 1,
            items: [{ text: '移除关联', showtip: true, tip: '确认启用吗？', click: this.edits }],
            columns: [
                { title: '品种编码', value: 'varietyCode', align: 'right', width: 80 },
                { title: '品种名称', value: 'varietyName' },
                { title: '英文名称', value: 'engName' },
                { title: '拼音码', value: 'spellCode' },
                {
                    title: '合成药标志',
                    value: 'iscompound',
                    align: 'center',
                    width: 100,
                    format: this.iscompoundFormat
                },
                {
                    title: '药品类型',
                    value: 'drugIndicator',
                    align: 'center',
                    width: 100,
                    format: this.drugIndicatorFormat
                },
                { title: '毒理分类', value: 'toxicology', align: 'center', width: 120, format: this.toxicologyFormat },
                { title: '操作', value: 'linkType', align: 'center', width: 120 }
            ],
            toxicologyData: [],
            editData: {},
            Modal: {
                title: '',
                visible: false,
                confirmLoading: false
            },
            drugAllList: [{ varietyName: 'ddd' }],
            userForm: this.$form.createForm(this),
            selectDrugData: '',
            visible: false,
            condition: true,
            pageChangeFilter: {}
        }
    },
    filters: {
        drugIndicator_filter(value) {
            if (value == 1) {
                return '西药'
            }
            if (value == 2) {
                return '中成药'
            }
            if (value == 3) {
                return '中药'
            }
        },
        fil_iscompound(value) {
            if (value == 1) {
                return '是'
            }
            if (value == 0) {
                return '否'
            }
        }
    },
    computed: {
        list() {
            return [
                {
                    name: '品种名称',
                    dataField: 'drugvarietyCode',
                    type: 'text'
                },
                {
                    name: '合成药',
                    dataField: 'iscompound',
                    type: 'select',
                    dataSource: this.enum.yesNo,
                    keyExpr: 'id',
                    valueExpr: 'text'
                },
                {
                    name: '毒理分类',
                    dataField: 'toxicology',
                    type: 'select',
                    dataSource: this.toxicologyData,
                    keyExpr: 'id',
                    valueExpr: 'name'
                }
            ]
        }
    },
    mounted() {
        this.getDicBase()
        this.addVarieties()
    },
    // computed: {
    //   filteredOptions() {
    //     return OPTIONS.filter(o => !this.selectedItems.includes(o))
    //   }
    // },
    methods: {
        //搜索
        varietiesSearch() {
            let params = this.$refs.searchPanel.form.getFieldsValue()
            this.pageChangeFilter = this.$refs.searchPanel.form.getFieldsValue()
            params.pageSize = 10
            params.offset = 0
            params.categoryId = this.variety.categoryId
            this.getVarietiesData(params)
        },
        //重置
        varietiesResetForm() {
            this.currents = 1
            this.$refs.searchPanel.form.resetFields()
            this.pageChangeFilter = {}
            this.getVarietiesData({ categoryId: this.variety.categoryId })
        },
        // 刷新界面
        getVarietiesData(params = {}) {
            if (params.offset == 0) {
                this.currents = 1
            }
            this.$axios({
                url: this.api.drugVarietyPageId,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.variety.drugVarietyData = res.rows
                        this.variety.total = res.total
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //页码跳转
        pageChangeSize(page, pageSize) {
            this.currents = 1
            let params = this.pageChangeFilter
            params.offset = (page - 1) * pageSize
            params.pageSize = pageSize
            params.categoryId = this.variety.categoryId
            this.getVarietiesData(params)
        },
        pageChange(page, pageSize) {
            let params = this.pageChangeFilter
            ;(params.offset = (page - 1) * pageSize), (params.pageSize = pageSize)
            params.categoryId = this.variety.categoryId
            this.getVarietiesData(params)
        },
        // 移除关联
        delRows(data) {
            // console.log(data)
            let params = Object.assign(
                {},
                {
                    dicId: this.variety.categoryId,
                    varietyCode: data.varietyCode,
                    linkType: data.linkType
                }
            )
            this.$axios({
                url: this.api.deteleConnect,
                method: 'delete',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.loading = false
                        this.$message.info('成功移除关联!')
                        this.getVarietiesData({ categoryId: this.variety.categoryId })
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                    this.loading = false
                })
        },
        // 添加品种
        addVary(params = {}) {
            params.dicId = this.variety.categoryId
            params.varietyCodeList = [this.selectDrugData]
            this.loading = true
            this.$axios({
                url: this.api.addvarylist,
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.loading = false
                        this.$message.info('保存成功!')
                        this.getVarietiesData({ categoryId: this.variety.categoryId })
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                    this.loading = false
                })
        },
        // 选择框数据
        handleChange(selectedItems) {
            this.selectedItems = selectedItems
        },
        //获取树形表数据
        // getVarietiesData(params = {}) {
        //   params.categoryId = this.variety.categoryId
        //   this.loading = true
        //   this.$axios({
        //     url: this.api.drugVarietyPageId,
        //     method: 'put',
        //     data: params
        //   })
        //     .then(res => {
        //       if (res.code == '200') {
        //         this.loading = false
        //         this.variety.drugVarietyData = res.rows
        //         console.log('eeee')
        //         this.variety.total = res.total
        //       } else {
        //         this.loading = false
        //         this.warn(res.msg)
        //       }
        //     })
        //     .catch(err => {
        //       this.error(err)
        //       this.loading = false
        //     })
        // },
        //添加品种
        addVarieties(params = {}) {
            // this.Modal.visible = true
            // this.Modal.title = '新增品种'
            params = { keyword: '' }
            this.$axios({
                url: this.api.getDrugList,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.drugAllList = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        //编辑品种
        edits(data) {
            this.editData = data
        },
        getDicBase() {
            let params = {}
            params.codeClass = 39
            this.$axios({
                url: this.api.dicBaseSelectList,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.toxicologyData = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },

        drugIndicatorFormat(data) {
            let codeText
            this.enum.drugType.forEach(item => {
                if (data.drugIndicator == item.ID) {
                    codeText = item.TITLE
                    return
                }
            })
            return codeText
        },
        iscompoundFormat(data) {
            let dataText
            if (data.iscompound == '1') {
                dataText = '是'
            } else if (data.iscompound == '0') {
                dataText = '否'
            } else {
                dataText = '未知'
            }
            return dataText
        },
        toxicologyFormat(data) {
            let codeText
            this.toxicologyData.forEach(item => {
                if (data.toxicology == item.id) {
                    codeText = item.name
                    return
                }
            })
            return codeText
        },
        //提交添加品种
        handleOk(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    values.dicId = this.variety.categoryId
                    if (this.Modal.title == '编辑品种') {
                        values.varietyCode = this.editData.varietyCode
                    }
                    this.$axios({
                        url: this.api.drugVarietyIdUpdate,
                        method: 'post',
                        data: values
                    })
                        .then(res => {
                            if (res.code == '200') {
                                this.getVarietiesData()
                                this.success(res.msg)
                                this.Modal.visible = false
                            } else {
                                this.warn(res.msg)
                            }
                        })
                        .catch(err => {
                            this.error(err)
                        })
                }
            })
            
        },
        //取消添加品种
        handleCancel() {
            this.Modal.visible = false
        },
        // 提交输入框内容
        handleSearch(value) {
            console.log(value)
            let params = { keyword: value }
            this.$axios({
                url: this.api.getDrugList,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.drugAllList = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        // 里面值改变
        handleChange(value, option) {
            console.log(value)
            this.selectDrugData = value
        },
        // 控制气泡框
        changeCondition(e) {
            this.condition = e.target.checked
        },
        confirm() {
            this.visible = false
        },
        cancel() {
            this.visible = false
        },
        handleVisibleChange(visible) {
            if (!visible) {
                this.visible = false
                return
            }
            // Determining condition before show the popconfirm.
            console.log(this.condition)
            if (this.condition) {
                this.confirm() // next step
            } else {
                this.visible = true
            }
        }
    }
}
</script>

<style scoped>
.hechengayao {
    height: 40px;
    padding-top: 10px;
    border-bottom: 1px solid #dfe6f5;
}
.hechengyao {
    float: left;
    margin-left: 5px;
}
</style>