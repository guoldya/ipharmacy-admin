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
                deptData:[]
            }
        },
        mounted(){
            this.getOrgData()
        },
        methods:{
            orgChange(val){
                console.log(val)
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
        }
    }
</script>