<template>
    <div>
        <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
            <h2 class="font-bold">新增任务</h2>
        </a-card>
        <a-card class="margin-top-5" :body-style="{padding: '24px 32px'}" :bordered="false">
            <div class="add-task-body">
                <a-spin tip="加载中..." :spinning="spinning">
                    <a-form :form="form" id="form">
                        <a-form-item label="任务名称" v-bind="formItemLayout">
                            <a-input
                                placeholder="请输入任务名称..."
                                v-decorator="['name',{rules: [{ required: true, message: '请输入任务名称' },{ max:20 }]}]"
                            />
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="方案范围" :required="true">
                            <a-radio-group
                                v-decorator="['planScope',{initialValue: '1'}]"
                                @change="planScopeChange"
                            >
                                <a-radio
                                    v-for="(ps, index) in this.enum.patientScope"
                                    :value="ps.id"
                                    :key="index"
                                >{{ps.text}}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item
                            v-if="scope == 1"
                            v-bind="formItemLayout"
                            label="处方时间"
                            :required="true"
                        >
                            <a-range-picker v-decorator="['rangePicker']" />
                        </a-form-item>
                        <a-form-item
                            v-else-if="scope == 2"
                            v-bind="formItemLayout"
                            label="出院时间"
                            :required="true"
                        >
                            <a-range-picker v-decorator="['rangePicker']" />
                        </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="选择方案" :required="true">
                            <a-select
                                v-decorator="[ 'reviewPlanIds',  {rules: [{ required: true,message: '请选择方案'  }]}  ]"
                                placeholder="请选择方案"
                                @change="selectPlanIds"
                                mode="multiple"
                            >
                                <a-select-option
                                    :value="op.planId"
                                    v-for="(op,index) in planList"
                                    :key="index"
                                >{{op.planName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="选择药师" v-bind="formItemLayout" :required="true">
                            <a-select
                                v-decorator="[ 'reviewPersonIds', {rules: [{ required: true,message: '请选择药师'  }]}  ]"
                                mode="multiple"
                            >
                                <a-select-option
                                    :value="op.personId"
                                    v-for="(op,index) in doctorList"
                                    :key="index"
                                >{{op.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <h3>抽样规则</h3>
                        <a-divider class="divider" />
                        <a-row>
                            <a-col :span="12">
                                <a-form-item v-bind="formmin" label="选择抽样规则">
                                    <a-radio-group
                                        v-decorator="['rule',{initialValue: '1'},{rules: [{ required: true, message: '请选择抽样规则' }]}]"
                                    >
                                        <a-radio value="1">随机抽取</a-radio>
                                        <a-radio value="2">比例抽取</a-radio>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item v-bind="formmin" label="抽样数">
                                    <a-input
                                        style="width: 190px"
                                        v-decorator="['extractionsNumber',{rules: [{ required: true, message: '请输入抽样数量' }]}]"
                                    ></a-input>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item label="科室抽样数" v-bind="formmin" :required="true">
                                    <a-input
                                        style="width: 190px"
                                        v-decorator="['depteLimit',{rules: [{ required: true, message: '请输入抽样数量' }]}]"
                                    ></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="医生抽样数" v-bind="formmin" :required="true">
                                    <a-input
                                        style="width: 190px"
                                        v-decorator="['doctorLimit',{rules: [{ required: true, message: '请输入抽样数量' }]}]"
                                    ></a-input>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row class="btnStyle">
                            <a-button
                                htmlType="submit"
                                type="primary"
                                @click="handleSubmit"
                                :loading="loading"
                            >保存</a-button>
                            <a-button @click="cancle" class="margin-left-20">取消</a-button>
                        </a-row>
                    </a-form>
                </a-spin>
            </div>
        </a-card>
        <!-- <footer-tool-bar
            :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
        >
            <a-button @click="cancel" class="margin-left-5">取消</a-button>
            <a-button type="primary" class="margin-left-5" @click="submit" :loading="loading">保存</a-button>
        </footer-tool-bar>-->
    </div>
</template>
<script>
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
export default {
    components: {
        FooterToolBar
    },
    mixins: [mixin, mixinDevice],
    data() {
        return {
            api: {
                selectPlanListUrl: 'sys/reviewPlan/selectPlanList',
                selectDocIds: 'sys/reviewPlan/selectPersonListInPlanList',
                doctorListUrl: 'sys/sysPersons/selectDruggistList',
                reviewInfoUpdate: 'sys/reviewInfo/update'
            },
            formItemLayout: {
                labelCol: {
                    lg: { span: 4 },
                    sm: { span: 4 }
                },
                wrapperCol: {
                    lg: { span: 18 },
                    sm: { span: 18 }
                }
            },
            formmin: {
                labelCol: {
                    lg: { span: 8 },
                    sm: { span: 8 }
                },
                wrapperCol: {
                    lg: { span: 16 },
                    sm: { span: 16 }
                }
            },
            spinning: false,
            loading: false,
            form: this.$form.createForm(this),
            //方案列表
            planList: [],
            //药师列表
            doctorList: [],
            //门诊或住院
            scope: '1'
        }
    },
    mounted() {
        //默认选择方案内容
        this.getPlanList({ planScope: '1' })
        //获取药师列表
        this.getDoctorList()
    },
    methods: {
        planScopeChange(e) {
            this.getPlanList({ planScope: e.target.value })
            this.scope = e.target.value
        },
        getPlanList(params = {}) {
            this.$axios({
                url: this.api.selectPlanListUrl,
                method: 'put',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        this.planList = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        selectPlanIds(value) {
            this.$axios({
                url: this.api.selectDocIds,
                method: 'put',
                data: { planIds: value }
            })
                .then(res => {
                    if (res.code == '200') {
                        console.log(res.rows)
                        this.form.setFieldsValue({ reviewPersonIds: res.rows })
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        getDoctorList() {
            this.$axios({
                url: this.api.doctorListUrl,
                method: 'put',
                data: {}
            })
                .then(res => {
                    if (res.code == '200') {
                        this.doctorList = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                })
                .catch(err => {
                    this.error(err)
                })
        },
        cancle() {
            this.$router.push({
                name: 'reviewTaskMgtIndex'
            })
        },
        handleSubmit(e) {
            e.preventDefault()
            // this.loading = true
            this.form.validateFields((err, values) => {
                console.log(values, 'value')

                if (!err) {
                    if (values.rangePicker) {
                        values.filterStartTime = values.rangePicker[0].format('YYYY-MM-DD HH:mm')
                        values.filterEndTime = values.rangePicker[1].format('YYYY-MM-DD HH:mm')
                    }
                    this.$axios({
                        url: this.api.reviewInfoUpdate,
                        method: 'post',
                        data: values
                    })
                        .then(res => {
                            if (res.code == '200') {
                                this.success('保存成功')
                                this.$router.push({
                                    name: 'reviewTaskMgtDetail',
                                    query: { recordId: res.data.recordId }
                                })
                            } else {
                                this.warn(res.msg)
                            }
                        })
                        .catch(err => {
                            this.error(err)
                        })
                }
            })
        }
    }
}
</script>
<style  scoped>
.add-task-body {
    margin: 0 auto;
    width: 760px;
}
.btnStyle {
    text-align: center;
    margin-top: 20px;
}
.add-task-body .divider {
    margin: 7px 0;
    min-width: 60%;
    width: 91%;
}
</style>
