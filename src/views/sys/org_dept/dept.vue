<template>
    <div>
        <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
            <a-spin tip="加载中..." :spinning="spinning">
                <a-form :form="form" id="form" @submit="handleSubmit">
                    <a-form-item
                            label="机构"
                            v-bind="formItemLayout"
                    >
                        <!--<a-select-->
                                <!--:disabled="true"-->
                                <!--placeholder="请选择..."-->
                                <!--v-decorator="[-->
                                <!--'orgId',-->
                                <!--{rules: [{ required: true, message: '请输选择机构' }]}-->
                                <!--]"-->
                        <!--&gt;-->
                            <!--<a-select-option-->
                                    <!--v-for="(item,index) in orgData"-->
                                    <!--:value="item.orgId"-->
                                    <!--:key="index"-->
                            <!--&gt;-->
                                <!--{{item.title}}-->
                            <!--</a-select-option>-->
                        <!--</a-select>-->
                        <a-tree-select
                                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                :treeData="orgData"
                                placeholder='请选择'
                                treeDefaultExpandAll
                                v-decorator="[
                                'orgId',
                                {rules: [{ required: true, message: '请输选择机构' }]}
                                ]"
                        >
                        </a-tree-select>
                    </a-form-item>
                    <a-form-item
                            label="父级部门"
                            v-bind="formItemLayout"
                    >
                        <a-select placeholder="请选择..." v-decorator="[
                                'parentId'
                                ]"
                        >
                            <a-select-option
                                    v-for="(item,index) in parentData"
                                    :value="item.deptId"
                                    :key="index"
                            >
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="部门编码"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'code',
                                {rules: [{ required: true, message: '请输入部门编码' },{ max:15 }]}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="部门名称"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'title',
                                {rules: [{ required: true, message: '请输入部门名称' },{ max:70 }]}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="部门类型"
                            v-bind="formItemLayout"
                    >
                        <a-select placeholder="请选择..." v-decorator="[
                                'type',
                                {rules: [{ required: true, message: '请输选择部门类型' }]}
                                ]"
                        >
                            <a-select-option value="1">业务类型</a-select-option>
                            <a-select-option value="2">系统类型</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="状态"
                            :required="true"
                    >
                        <a-radio-group v-decorator="['status',{initialValue: '1'}]">
                            <a-radio value="1">启用</a-radio>
                            <a-radio value="0">停用</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item
                            label="部门说明"
                            v-bind="formItemLayout"
                    >
                        <a-textarea placeholder="请输入..." :autosize="{ minRows: 4 }" v-decorator="[ 'note',{rules: [{ max:1000 }]}]"/>
                    </a-form-item>
                    <a-form-item
                            :wrapperCol="{ span: 24 }"
                            style="text-align: center"
                    >
                        <a-button @click="cancel">取消</a-button>
                        <a-button htmlType="submit" type="primary" style="margin-left: 8px" :loading="loading">保存</a-button>
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                formItemLayout: {
                    labelCol: {
                        lg: { span: 7 },
                        sm: { span: 7 },
                    },
                    wrapperCol: {
                        lg: { span: 10 },
                        sm: { span: 17 },
                    },
                },
                api: {
                    orgUrl: '/sys/sysOrgs/selectList',
                    deptUrl:'/sys/sysOrgs/selectDeptsByOrgId',
                    updateUrl:'/sys/sysDepts/update',
                    detail:'/sys/sysDepts/selectOne'
                },
                loading:false,
                form:this.$form.createForm(this),
                isNew:true,
                spinning:false,
                orgData:[],
                parentData:[]
            }
        },
        mounted(){
            this.getOrgData();
            this.getDeptData();
            this.init();
        },
        methods:{
            init(){
                this.spinning = true;
                let id = this.$route.params.deptId;
                if(id == 0){
                    this.isNew = true;
                    this.form.setFieldsValue({ orgId: this.$route.params.orgId });
                    this.spinning = false;
                }else{
                    this.isNew = false;
                    this.$axios({
                        url: this.api.detail,
                        method: 'put',
                        data: {deptId:id}
                    }).then(res => {
                        if (res.code == '200') {
                            let {code,orgId,parentId,status,title,type,note} = res.data
                                ,formData = {code,orgId,parentId,status,title,type,note};
                            this.form.setFieldsValue(formData);
                            this.spinning = false;
                        } else {
                            this.spinning = false;
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        this.spinning = false;
                        this.error(err);
                    })
                }
            },
            cancel(){
                this.$router.push({
                    name: 'org_dept'
                })
            },
            handleSubmit(e){
                e.preventDefault();
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = values;
                        if(!this.isNew){
                            params.deptId = this.$route.params.deptId;
                        }
                        this.$axios({
                            url: this.api.updateUrl,
                            method: 'post',
                            data: params
                        }).then(res => {
                            if (res.code == '200') {
                                this.success('保存成功!',()=>{
                                    this.cancel();
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
                });
            },
            getOrgData(obj = {}) {
                this.$axios({
                    url: this.api.orgUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.orgData = this.getTreeData(res.rows, undefined)
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                        this.error(err);
                    })
            },
            getTreeData(data, pid) {
                let tree = []
                data.forEach(item => {
                    let row = item;
                    row.key = item.orgId;
                    row.value = item.orgId;
                    if (pid == item.parentId) {
                        row.children = this.getTreeData(data, item.orgId)
                        tree.push(row)
                    }
                })
                return tree
            },
            getDeptData(val) {
                this.$axios({
                    url: this.api.deptUrl,
                    method: 'put',
                    data: { orgId:this.$route.params.orgId }
                }).then(res => {
                    if (res.code == '200') {
                        this.parentData = res.rows;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
        }
    }
</script>