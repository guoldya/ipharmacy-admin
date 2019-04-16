<template>
    <div class="search-form">
        <a-card>
            <a-col :span="21">
                <a-form :form="form">
                    <a-row :gutter="21">
                        <a-col v-for="(item,index) in list" :span="6" :key="index"
                               :style="{display:index<count ?'block':'none'}">
                            <a-form-item :label="item.name" v-if="!item.type || item.type=='text'">
                                <a-input v-decorator="[item.dataField]"></a-input>
                            </a-form-item>
                            <a-form-item :label="item.name" v-if="item.type=='range-picker'">
                                <a-range-picker v-decorator="[item.dataField]"/>
                            </a-form-item>
                            <a-form-item :label="item.name" v-if="item.type=='select'">
                                <a-select v-decorator="[item.dataField]">
                                    <a-select-option :value='op[item.keyExpr]' v-for="(op,index) in item.dataSource">
                                        {{op[item.valueExpr]}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style="text-align: center" v-if="this.list.length>4">
                        <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
                            <a-icon :type="expand ? 'up' : 'down'"/>
                        </a>
                    </a-row>
                </a-form>
            </a-col>
            <a-col :span="3" style="text-align: right">
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
                form: this.$form.createForm(this)
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
        padding: 15px;
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
</style>