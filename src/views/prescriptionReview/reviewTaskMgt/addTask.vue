<template>
    <div>
        <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
            <a-spin tip="加载中..." :spinning="spinning">
                <a-form :form="form" id="form">
                    <a-form-item label="任务名称" v-bind="formItemLayout">
                        <a-input
                            placeholder="请输入任务名称..."
                            v-decorator="['planName',{rules: [{ required: true, message: '请输入任务名称' },{ max:20 }]}]"
                        />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="方案范围" :required="true">
                        <a-radio-group v-decorator="['planScope',{initialValue: '1'}]">
                            <a-radio value="1">门诊</a-radio>
                            <a-radio value="0">住院</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="处方时间" :required="true">
                        <a-range-picker v-decorator="['range-picker']" />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="选择方案" :required="true">
                        <a-select>
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="选择药师" v-bind="formItemLayout" :required="true">
                        <a-select>
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="选择药师" v-bind="formItemLayout" :required="true">
                        <a-select>
                            <a-select-option value="jack">Jack</a-select-option>
                            <a-select-option value="lucy">Lucy</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="选择抽样规则">
                        <a-radio-group v-decorator="['radio-group']">
                            <a-radio value="a">随机抽取</a-radio>
                            <a-radio value="b">比例抽取</a-radio>
                        </a-radio-group>
                         <a-form-item >
                        <a-input style="width: 120px" v-decorator="['number',{rules: [{ required: true, message: '请输入抽样数量' }]}]">
                        </a-input>
                         </a-form-item>
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-card>
        <footer-tool-bar
            :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
        >
            <a-button @click="cancel" class="margin-left-5">取消</a-button>
            <a-button type="primary" class="margin-left-5" @click="submit" :loading="loading">保存</a-button>
        </footer-tool-bar>
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
            formItemLayout: {
                labelCol: {
                    lg: { span: 7 },
                    sm: { span: 7 }
                },
                wrapperCol: {
                    lg: { span: 10 },
                    sm: { span: 10 }
                }
            },
            spinning: false,
            loading: false,
            form: this.$form.createForm(this)
        }
    },
    mounted() {},
    methods: {
        cancel() {},
        submit() {}
    }
}
</script>
<style>
</style>
