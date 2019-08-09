<style>
    @import "../../style/main.css";
</style>
<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" class="margin-top-10" @click="add">按钮</a-button>
            <a-table
                    bordered
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination='pagination'
                    @change="handleTableChange"
                    class="margin-top-10"
                    :loading="loading"
            >
                <template slot="operation" slot-scope="text, record">
                <span>
                    <a-popconfirm
                            v-if="dataSource.length"
                            title="Sure to delete?"
                            @confirm="() => onDelete(record.id)">
                    <a href="javascript:;">删除</a>
                </a-popconfirm>
                </span>
                    <a-divider type="vertical"/>
                    <span>
                    <a @click="() => edit(record.key)">编辑</a>
                </span>
                </template>
            </a-table>
            <Upload :count="count"></Upload>
        </a-card>
        <a-modal
                title="Title"
                :visible="modal.visible"
                @cancel="handleCancel"
        >
            <p>ModalText</p>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" :loading="modal.loading" @click="handleOk">
                    提交
                </a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    import Upload from '@/my-components/upload/upload'
    export default {
        data() {
            return {
                count:3,
                loading:false,
                value: [],
                modal:{
                    visible:false,
                    loading:false
                },
                pagination: {},
                dataSource: [],
                columns: [
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        width: 150,
                        scopedSlots: { customRender: 'operation' },
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '编码',
                        dataIndex: 'roleCode',
                        customRender: this.aaa,
                        sorter: true,
                        width:100
                    },
                    { title: '角色名称', dataIndex: 'roleName' },
                    { title: '创建时间', dataIndex: 'createTime' },
                    { title: '修改时间', dataIndex: 'updateTime' }
                ]
            }
        },
        components:{
            Upload
        },
        computed:{
            list(){
                return [
                    {name:'角色编码',dataField:'roleCode',type:'text'},
                    {
                        name:'角色名称',
                        dataField:'name',
                        type:'select',
                        keyExpr:'id',
                        valueExpr:'roleName',
                        dataSource:this.dataSource
                    },
                    {name:'创建时间',dataField:'createTime',type:'range-picker'},
                    {name:'修改时间',dataField:'updateTime',type:'range-picker'},
                ]
            }
        },
        mounted() {
            this.handleAdd()
        },
        methods: {
            getFields(){
                let values = this.$refs.searchPanel.form.getFieldsValue()
                if(values['createTime']){
                    values['createTime'] = this.getFormat(values['createTime'])
                }
                if(values['updateTime']){
                    values['updateTime'] = this.getFormat(values['updateTime'])
                }
                return values
            },
            search(){
                let values = this.getFields();
                values.pageSize = 10;
                console.log(values)
                // this.handleAdd(values)
            },
            resetForm(){
                this.$refs.searchPanel.form.resetFields();
            },
            handleSearch(){

            },
            aaa(text, record, index) {
                if (text == 'R0405') {
                    return 111
                } else {
                    return text
                }
            },
            handleTableChange(pagination, filters, sorter) {
                let values = this.getFields();
                let params = {
                    offset: (pagination.current - 1) * 10,
                    pageSize: pagination.pageSize,
                    orderBy:sorter.field,
                    sortAsc:sorter.order == 'ascend'?'Y':'N'
                }
                this.handleAdd(Object.assign({}, values, params))
            },
            handleAdd(params = {}) {
                this.loading = true;
                this.$put('/sys/role/page', params).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows
                        this.pagination = {
                            total: res.total
                        }
                        this.loading = false
                    }
                    else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false
                    this.error(err);
                    // console.log(err)
                })
            },
            onDelete(id) {
                const dataSource = [...this.dataSource]
                this.dataSource = dataSource.filter(item => item.id !== id)
            },
            edit(key) {


            },
            selecChange(value, option) {
                //单选
                // this.value = option.data.attrs.data
                // this.value = option.data.attrs.data
                this.value = option.componentOptions.propsData.title
                // this.value = value
                //多选
                // console.log(option[0].componentOptions.propsData.title)
                // console.log(this.value)
                // this.value.push(option[0].componentOptions.propsData.title)
                // console.log(this.value)
            },
            filterOption(input, option){
                return option.componentOptions.propsData.title.indexOf(input)>=0
            },
            add(){
                this.modal.visible = true
            },
            handleOk(){

            },
            handleCancel(){
                this.modal.visible = false
            }
        }
    }
</script>