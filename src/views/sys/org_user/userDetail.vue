<template>
    <div>
        <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
            <a-spin tip="加载中..." :spinning="spinning">
                <a-form :form="form" id="form" @submit="handleSubmit">
                    <a-form-item
                            label="部门"
                            v-bind="formItemLayout"
                    >
                        <a-select placeholder="请选择..." v-decorator="[
                                'orgId',
                                {rules: [{ required: true, message: '请输选择机构' }]}
                                ]"
                        >
                            <a-select-option
                                    v-for="(item,index) in orgData"
                                    :value="item.deptId"
                                    :key="index"
                            >
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="人员编号"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'code',
                                {rules: [{ required: true, message: '请输入人员编号' },{ max:20 }]}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="姓名"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'name',
                                {rules: [{ required: true, message: '请输入姓名' },{ max:50, message: '太长了' }]}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="职称"
                            v-bind="formItemLayout"
                    >
                        <a-select placeholder="请选择..." v-decorator="[
                                'title',
                                {rules: [{ required: true, message: '请输选择职称' }]}
                                ]"
                        >
                            <a-select-option
                                    v-for="(item,index) in titleData"
                                    :value="item.deptId"
                                    :key="index"
                            >
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            label="出生日期"
                            v-bind="formItemLayout"
                    >
                        <a-date-picker
                                format="YYYY-MM-DD"
                                v-decorator="[
                                'birthday'
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="身份证"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'idCard',
                                {rules: [{ required: true, message: '请输入身份证' },{ max:18, message: '太长了' }]}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="性别"
                            :required="true"
                    >
                        <a-radio-group v-decorator="['status',{initialValue: '1'}]">
                            <a-radio value="1">男</a-radio>
                            <a-radio value="0">女</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item
                            label="电子邮箱"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'email',
                                {rules: [{ max:50, message: '太长了' }]}
                                ]"
                        />
                    </a-form-item>
                    <a-form-item
                            label="电话"
                            v-bind="formItemLayout"
                    >
                        <a-input
                                placeholder="请输入..."
                                v-decorator="[
                                'phone',
                                {rules: [{ max:15, message: '太长了' }]}
                                ]"
                        />
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
                loading:false,
                form:this.$form.createForm(this),
                isNew:true,
                spinning:false,
                orgData:[],
                titleData:[]
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){

            },
            cancel(){
                this.$router.push({
                    name: 'org_user'
                })
            },
            handleSubmit(e){
                e.preventDefault();
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if (!err) {

                    }else {

                    }
                });
            }
        }
    }
</script>