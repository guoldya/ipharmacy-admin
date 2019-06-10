<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button class="margin-left-5" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" class="margin-top-10" @click="addParam">新增</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                        ref="table"
                        class="margin-top-10"
                        :data="dataSource"
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical"/>
                            <a-popconfirm title="确认删除吗?" @confirm="delRow(scope.row)">
                                <a class="delColor">删除</a>
                            </a-popconfirm>
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
                            :formatter="item.formatter"
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
        <a-modal
                :title="isNew?'新建参数':'编辑参数'"
                v-model="visible"
                okText="提交"
                @ok="submit"
                :confirmLoading="loading"
                @cancel="cancel"
                width=""
                centered
                :maskClosable="false"
        >
            <div style="width: 500px;">
                <a-form :form="form">
                    <a-form-item
                            label="客户"
                            v-bind="formItemLayout"
                    >
                        <a-select
                                placeholder="请选择"
                                v-decorator="[
                                'clientId',
                                {rules: [{ required: true, message: '请选择客户' }],initialValue: formData.clientId}
                                ]"
                        >
                            <a-select-option :value="item.clientId" v-for="(item,index) in clientData"
                                             :key="index">
                                {{item.clientName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="参数"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'paramName',
                                {rules: [{ required: true, message: '请输入参数' },{ max:20,message:'最多20个字' }],initialValue: formData.paramName}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="参数数据类型"
                            v-bind="formItemLayout"
                    >
                        <a-select
                                placeholder="请选择"
                                v-decorator="[
                                'paramDataType',
                                {rules: [{ required: true, message: '请选择参数数据类型' }],initialValue: formData.paramDataType}
                                ]"
                        >
                            <a-select-option :value="item.id" v-for="(item,index) in typeData"
                                             :key="index">
                                {{item.text}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="参数类型"
                            v-bind="formItemLayout"
                    >
                        <a-select
                                placeholder="请选择"
                                v-decorator="[
                                'paramClass',
                                {rules: [{ required: true, message: '请选择参数类型' }],initialValue: formData.paramClass}
                                ]"
                        >
                            <a-select-option :value="item.id" v-for="(item,index) in classData"
                                             :key="index">
                                {{item.text}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="参数单位"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'paramUnit',
                                {rules: [{ required: true, message: '请输入参数单位' },{ max:10,message:'最多10个字' }],initialValue: formData.paramUnit}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="参数数据源"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'paramDatasource',
                                {rules: [{ required: true, message: '请输入参数数据源' },{ max:50,message:'最多50个字' }],initialValue: formData.paramDatasource}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="参数值"
                            v-bind="formItemLayout"
                    >
                        <a-textarea
                                placeholder="请输入..."
                                :autosize="{ minRows: 4 }"
                                v-decorator="[ 'paramValue',{rules: [{ required: true, message: '请输入参数值' },{ max:100,message:'最多100个字' }],initialValue: formData.paramValue}]"/>
                    </a-form-item>
                    <a-form-item
                            label="备注"
                            v-bind="formItemLayout"
                    >
                        <a-textarea
                                placeholder="请输入..."
                                :autosize="{ minRows: 4 }"
                                v-decorator="[ 'remark',{rules: [{ max:255 }],initialValue: formData.remark}]"/>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                spinning:false,
                dataSource:[],
                columns:[
                    { title:'参数名称', prop:'paramName'},
                    { title:'数据类型', prop:'paramDataType', align:'center', width:150,formatter:this.setType },
                    { title:'参数值', prop:'paramValue'},
                    { title:'参数类型', prop:'paramClass', align:'center', width:100,formatter:this.setClass },
                    { title:'参数单位', prop:'paramUnit', width:100 },
                    { title:'参数数据源', prop:'paramDatasource', width:150 },
                    { title:'客户', prop:'clientId', width:100 },
                    { title:'参数说明', prop:'remark' },
                ],
                total:0,
                current:1,
                api:{
                    paramUrl:'/sys/sysParams/selectPage',
                    clientUrl:'',
                    updateUrl:'',
                    delUrl:''
                },
                formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 13 },
                },
                isNew:false,
                visible:false,
                loading:false,
                form: this.$form.createForm(this),
                formData:{},
                clientData:[]
            }
        },
        computed: {
            list() {
                return [
                    { name: '角色', dataField: 'title', type: 'text' },
                    { name: '机构', dataField: 'orgTitle', type: 'text' }
                ]
            },
            typeData(){
                return this.enum.paramDataType
            },
            classData(){
                return this.enum.paramClass
            }
        },
        mounted(){
            this.getData();
            this.getClientData();
        },
        methods:{
            search() {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                this.getData(params)
            },
            resetForm() {
                this.$refs.searchPanel.form.resetFields();
                this.getData()
            },
            setType(row){
                let text = '';
                this.enum.paramDataType.forEach( item => {
                    if(item.id == row.paramDataType){
                        text = item.text
                    }
                })
                return text;
            },
            setClass(row){
                let text = '';
                this.enum.paramClass.forEach( item => {
                    if( item.id == row.paramClass ){
                        text = item.text
                    }
                })
                return text;
            },
            addParam(){
                this.isNew = true;
                this.form.resetFields();
                this.formData = {};
                this.visible = true
            },
            edit(row){
                this.isNew = false;
                this.formData = row;
                this.visible = true
            },
            delRow(row){
                this.$axios({
                    url: this.api.delUrl,
                    method: 'delete',
                    data: { paramId:row.paramId }
                }).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!',()=>{
                            this.getData();
                        })
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            cancel(){
                this.visible = false
            },
            submit(){
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if(!err){
                        let params = values;
                        if(!this.isNew){
                            params.paramId = this.formData.paramId
                        }
                        this.$axios({
                            url: this.api.updateUrl,
                            method: 'post',
                            data: params
                        }).then(res => {
                            if (res.code == '200') {
                                this.success('保存成功!',()=>{
                                    this.getData();
                                    this.visible = false;
                                    this.loading = false;
                                })
                            } else {
                                this.loading = false;
                                this.warn(res.msg);
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.error(err);
                        })
                    }else {
                        this.loading = false;
                    }
                })
            },
            pageChange(page, size) {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.offset = (page - 1) * size;
                this.getData(params)
            },
            sizeChange(current, size) {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = size;
                this.getData(params)
            },
            getData( obj = {}){
                this.spinning = true;
                let params = {};
                params.pageSize = obj.pageSize || 10;
                params.offset = obj.offset || 0;
                this.$axios({
                    url: this.api.paramUrl,
                    method: 'put',
                    data: params
                }).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
                        this.total = res.total;
                        if(!params.offset){
                            this.current = 1
                        }
                        this.spinning = false;
                    } else {
                        this.spinning = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.spinning = false;
                    this.error(err);
                })
            },
            getClientData(){
                this.$axios({
                    url: this.api.clientUrl,
                    method: 'put',
                    data: {}
                }).then(res => {
                    if (res.code == '200') {
                        this.clientData = res.rows;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            }
        }
    }
</script>