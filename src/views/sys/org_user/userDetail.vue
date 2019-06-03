<template>
    <div>
        <a-card>
            <a-form :form="form">
                <a-row :gutter="24">
                    <a-col :span="col">
                        <a-form-item
                                label="所属机构"
                        >
                            <a-select
                                    @change="orgChange"
                                    placeholder="请选择..."
                                    v-decorator="[
                                'orgId',
                                {rules: [{ required: true, message: '请输选择机构' }]}
                                ]"
                            >
                                <a-select-option
                                        v-for="(item,index) in orgData"
                                        :value="item.orgId"
                                        :key="index"
                                >
                                    {{item.title}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="所属部门"
                        >
                            <a-select placeholder="请选择..." v-decorator="[
                                'deptId',
                                {rules: [{ required: true, message: '请输选择所属部门' }]}
                                ]"
                            >
                                <a-select-option
                                        v-for="(item,index) in deptData"
                                        :value="item.deptId"
                                        :key="index"
                                >
                                    {{item.title}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="人员编码"
                        >
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                'code',
                                {rules: [{ required: true, message: '请输入人员编码' },{ max:20,message:'最多20个字' }]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="姓名"
                        >
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                'name',
                                {rules: [{ required: true, message: '请输入姓名' },{ max:50,message:'最多50个字' }]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="性别"
                                :required="true"
                        >
                            <a-radio-group v-decorator="['status',{initialValue: '1'}]">
                                <a-radio value="1">女</a-radio>
                                <a-radio value="0">男</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="电话"
                        >
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                'phone',
                                {rules: [{ required: true, message: '请输入联系电话' },
                                {validator:validPhone,}]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="电子邮箱"
                        >
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                'email',
                                {rules: [{ required: true, message: '请输入电子邮箱' },{ max:50,message:'最多50个字' }]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="状态"
                                :required="true"
                        >
                            <a-radio-group v-decorator="['status',{initialValue: '1'}]">
                                <a-radio value="1">启用</a-radio>
                                <a-radio value="0">停用</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="出生日期"
                        >
                            <a-date-picker
                                    placeholder="请选择..."
                                    v-decorator="[
                                'birthday',
                                {rules: [{ required: true, message: '请选择出生日期' }]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="身份证号"
                        >
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                'idCard',
                                {rules: [{ required: true, message: '请输入身份证号' },{ max:18,message:'最多18个字' }]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="职称"
                        >
                            <a-select placeholder="请选择..." v-decorator="[
                                'titles',
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
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="专业技术职务"
                        >
                            <a-select placeholder="请选择..." v-decorator="[
                                'profePosition',
                                {rules: [{ required: true, message: '请输选择专业技术职务' }]}
                                ]"
                            >
                                <a-select-option
                                        v-for="(item,index) in posData"
                                        :value="item.deptId"
                                        :key="index"
                                >
                                    {{item.title}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="管理职务"
                        >
                            <a-select placeholder="请选择..." v-decorator="[
                                'mentPosition',
                                {rules: [{ required: true, message: '请输选择管理职务' }]}
                                ]"
                            >
                                <a-select-option
                                        v-for="(item,index) in mentData"
                                        :value="item.deptId"
                                        :key="index"
                                >
                                    {{item.title}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="资格证书号"
                        >
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                'certificateNo',
                                {rules: [{ required: true, message: '请输入资格证书号' },{ max:50,message:'最多50个字' }]}
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="col">
                        <a-form-item
                                label="处方权"
                                :required="true"
                        >
                            <a-radio-group v-decorator="['prescRight',{initialValue: 1}]">
                                <a-radio :value="1">有处方权</a-radio>
                                <a-radio :value="0">无处方权</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                api: {
                    orgUrl: '/sys/sysOrgs/selectList',
                    deptUrl:'/sys/sysOrgs/selectDeptsByOrgId'
                },
                form:this.$form.createForm(this),
                col:6,
                orgData:[],
                deptData:[],
                titleData:[],
                posData:[],
                mentData:[]
            }
        },
        mounted(){
            this.getOrgData()
        },
        methods:{
            validPhone(rule, value, callback){
                if(value){
                    if (!(/^1[3584679]\d{9}$/.test(value))) {
                        callback('请输入正确的联系电话')
                    }else{
                        callback()
                    }
                }else{
                    callback()
                }
            },
            orgChange(val){
                this.getDeptData(val)
            },
            getOrgData(obj = {}) {
                this.$axios({
                    url: this.api.orgUrl,
                    method: 'put',
                    data: obj
                }).then(res => {
                    if (res.code == '200') {
                        this.orgData = res.rows;
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            getDeptData(val) {
                this.$axios({
                    url: this.api.deptUrl,
                    method: 'put',
                    data: { orgId:val }
                }).then(res => {
                    if (res.code == '200') {
                        this.deptData = res.rows;
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