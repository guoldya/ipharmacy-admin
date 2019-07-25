<template>
    <a-card>
        <div class="cardHead">
            <a href="#" @click.prevent="backTo">
                <a-icon type="left"></a-icon>返回
            </a>
        </div>
        <a-form :form="form" @submit="handleSubmit">
            <a-row>
                <a-form-item label="编码" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-input read-only v-decorator="['orgId']" placeholder="<系统自动生成>" />
                </a-form-item>
                <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-input
                        v-decorator="['title', {rules: [{ required: true, message: '请输入名称' },{max: 100,message:'输入名称过长'}]}]"
                    />
                </a-form-item>
                <a-form-item label="上级机构" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-select allowClear v-decorator="[ 'parentId',]">
                        <a-select-option
                            v-for="(op,index) in listData"
                            :value="op.orgId"
                            :key="index"
                        >{{op.title}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="机构代码" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-input
                        v-decorator="['orgCode', {rules: [{ required: true, message: '请输入机构代码' },{max: 20,message:'输入机构代码过长'}]}]"
                    />
                </a-form-item>
                <a-form-item label="机构类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-select
                        v-decorator="[ 'orgType',{rules: [{ required: true, message: '请选择机构类型' }]}]"
                    >
                        <a-select-option
                            v-for="(op,index) in this.enum.orgType"
                            :value="op.id"
                            :key="index"
                        >{{op.text}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="医院分类" :label-col="{span: 8}" :wrapper-col="{span: 8}">
                    <a-select
                        style="margin-left: 1px"
                        v-decorator="[ 'orgClass',{rules: [{ required: true, message: '请选择医院分类' }]}]"
                    >
                        <a-select-option
                            v-for="(op,index) in enumList['33']"
                            :value="op.id"
                            :key="index"
                        >{{op.name}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="等级" :label-col="{span: 8}" :wrapper-col="{span: 8}">
                    <a-select
                        v-decorator="[ 'orgGrade',{rules: [{ required: true, message: '请选择医院分类' }]}]"
                    >
                        <a-select-option
                            v-for="(op,index) in enumList['34']"
                            :value="op.id"
                            :key="index"
                        >{{op.name}}</a-select-option>
                    </a-select>
                </a-form-item>
              <a-form-item label="法人" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input
                  v-decorator="['legalPsn',]"
                ></a-input>
              </a-form-item>
                <a-form-item label="联系电话" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-input
                        v-decorator="['phone',{rules: [{ required: true,message: '请输入手机号' },{ message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ },]}]"
                        placeholder="11 位手机号"
                    ></a-input>
                </a-form-item>
                <a-form-item label="地址" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-input v-decorator="[ 'adress',{rule:[{max: 100,message:'输入地址过长'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-input v-decorator="[ 'remarks',{rule:[{max: 500,message:'输入备注过长'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-radio-group v-decorator="['status',{initialValue: '1'}]">
                        <a-radio value="1">启用</a-radio>
                        <a-radio value="0">停用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 20, offset: 10 }">
                    <a-button class="margin-left-20" type="primary" @click="handleSubmit">保存</a-button>
                    <a-button class="margin-left-20" @click="backTo">取消</a-button>
                </a-form-item>
            </a-row>
        </a-form>
    </a-card>
</template>
<script>
import { reviewAuditlevelUpdate } from '@/api/login'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { setTimeout } from 'timers'

export default {
    components: { ATextarea },
    data() {
        return {
            api: {
                selectClassListWithMoreParam: '/sys/dicBase/selectClassListWithMoreParam',
                selectOrgList: 'sys/sysOrgs/selectList',
                selectOrgUpdate: 'sys/sysOrgs/update',
                // sysOrgs/selectListWithOutCurrentOrgId
                getoriData: 'sys/sysOrgs/selectListWithOutCurrentOrgId',
                selectOneDetail: 'sys/sysOrgs/selectOneDetail'
            },
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 8 }
            },
            form: this.$form.createForm(this),
            roleCode: '',
            loadData: [],
            listData: [],
            readOnly: false,
            enumList: []
        }
    },
    computed: {},
    mounted() {
        if (this.$route.params.orgId != 0) {
            this.getOrgData()
        }
      this.getOrgLists()
         this.getEnumList()
    },
    methods: {
        //验证手机号
        // handlePhoneCheck(rule, value, callback){
        //   checkMobile({account:this.userData.account,phone:value}).then(res=>{
        //     if (res.code == '200') {
        //       if (res.data == false){
        //         callback();
        //       }else if (res.data == true) {
        //         callback(new Error('手机号已被注册'));
        //       }
        //     }else {
        //       this.warn(res.msg);
        //     }
        //   }).catch(err => {
        //     this.error(err)
        //   })
        // },

        getOrgData() {
            //orgTyoe
            let parameter = {
                orgId: this.$route.params.orgId
            }
            this.$axios({
                url: this.api.selectOneDetail,
                method: 'put',
                data: parameter
            })
                .then(res => {
                    if (res.code == '200') {
                        let orgData = res.data;
                         delete orgData.deptsList;
                        delete orgData.updateDate;
                        delete orgData.createDate;
                        setTimeout(() => {
                            this.form.setFieldsValue(orgData)
                        }, 100)
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
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
                })
                .catch(err => {
                    this.loading = false
                    this.error(err)
                })
        },
        getOrgList() {
            this.$axios({
                url: this.api.selectOrgList,
                method: 'put',
                data: {}
            })
                .then(res => {
                    if (res.code == '200') {
                        //this.listData = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        // 上级机构数据
        getOrgLists() {
            let params = { orgId: this.$route.params.orgId }
            this.$axios({
                url: this.api.getoriData,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.listData = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        // 提交数据
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$axios({
                        url: this.api.selectOrgUpdate,
                        method: 'post',
                        data: values
                    })
                        .then(res => {
                            if (res.code == '200') {
                                this.success('保存成功')
                                setTimeout(() => {
                                    this.$router.push({
                                        name: 'sys_org'
                                    })
                                }, 500)
                            } else {
                                this.warn(res.msg)
                            }
                        })
                        .catch(err => {
                            this.loading = false
                            this.error(err)
                        })
                }
            })
        },
        backTo() {
            this.$router.push({
                name: 'sys_org'
            })
        }
    },
    beforeDestroy() {
        window.localStorage.removeItem('routerData')
    }
}
</script>
<style>
.btn {
    margin: 0 5px;
}

.spanBtn {
    color: #1694fb;
}

.m-colorPicker .colorBtn[data-v-11842410] {
    width: 38px;
    height: 38px;
    border-radius: 10%;
}

.colorPick {
    margin-left: 15px;
    z-index: 3;
}
</style>