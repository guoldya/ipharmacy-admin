<template>
    <div class="search-form">
        <a-card>
            <a-col :lg="20" :sm="18">
                <a-form :form="form">
                    <a-row :gutter="21">
                        <a-col v-for="(item,index) in list" :span="6" :key="index"
                               :style="{display:index<count ?'block':'none'}">
                            <a-form-item :label="item.name" v-if="!item.type || item.type=='text'" v-bind="formItemLayout">
                                <a-input v-decorator="[item.dataField]" placeholder="请输入..."></a-input>
                            </a-form-item>
                            <a-form-item :label="item.name" v-if="item.type=='range-picker'" v-bind="formItemLayout">
                                <a-range-picker v-decorator="[item.dataField]"/>
                            </a-form-item>
                            <a-form-item :label="item.name" v-if="item.type=='select'" v-bind="formItemLayout">
                                <a-select v-decorator="[item.dataField]" placeholder="请选择...">
                                    <a-select-option :value='op[item.keyExpr]' v-for="(op,index) in item.dataSource" :key="index">
                                        {{op[item.valueExpr]}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                          <a-form-item v-if="!item.type || item.type=='checkbox'" v-bind="formItemLayout">
                            <a-checkbox v-decorator="[item.dataField]">
                             {{item.name}}
                            </a-checkbox>
                          </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style="text-align: center" v-if="this.list.length>4">
                        <a class="expendBtn" :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
                            <a-icon :type="expand ? 'up' : 'down'"/>
                        </a>
                    </a-row>
                </a-form>
            </a-col>
            <a-col :lg="4" :sm="6" style="text-align: right;padding-top: 3px">
                <slot name="control"></slot>
            </a-col>
        </a-card>
    </div>
</template>
<script>
    /**
     * { name:'', dateField:'', type:'', keyExpr:'', valueExpr:'', dataSource:dataSource }
     *
     * name 表单显示的名称
     *
     * dateField 输入框对应字段
     *
     * type 输入框类型 ( text, range-picker, select)
     *
     * 当 type 为 select 时才存在 keyExpr valueExpr dataSource
     *
     * keyExpr 选择框对应字段
     *
     * valueExpr 选择框显示的内容
     *
     * dataSource 选择框的数据
     */
    export default {
        props: {
            list: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                value: '',
                expand: false,
                form: this.$form.createForm(this),
                formItemLayout: {
                    labelCol: {
                        lg: { span: 8 },
                        sm: { span: 7 },
                    },
                    wrapperCol: {
                        lg: { span: 16 },
                        sm: { span: 17 },
                    },
                },
            }
        },
        computed: {
            count() {
                return this.expand ? this.list.length : 4
            }
        },
        mounted() {

        },
        methods: {
            toggle() {
                this.expand = !this.expand
            }
        }
    }
</script>
<style>
    .search-form {
        /*padding: 10px;*/
        /*background: #fbfbfb;*/
        /*border: 1px solid #d9d9d9;*/
        /*border-radius: 6px;*/
    }

    .search-form .ant-card-body {
        padding: 15px 15px 0 15px;
    }

    .search-form .ant-form-item {
        display: flex;
    }

    .search-form .ant-form-item-control-wrapper {
        flex: 1;
    }

    .search-form .ant-form {
        max-width: none;
    }

    .search-form .search-result-list {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 80px;
    }
    .expendBtn{
        cursor: pointer;
        border: 1px solid #e9e9e9;
        color: #96A1A7;
        border-radius: 2px;
        width: 48px;
        text-align: center;
        line-height: 14px;
        position: absolute;
        left: 50%;
        bottom: -16px;
        margin-left: -1px;
    }
    .search-form .ant-form-item
    {
      margin-bottom: 0px;
    }
</style>